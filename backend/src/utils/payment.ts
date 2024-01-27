/**
 * The purpose of this file is to handle all payment related logic. The file is
 * split into two main classes: Payment and Subscription (not implemented yet).
 * 
 * It is a very complex file because it tries to abstract away all the complexity
 * of the Stripe API so that I don't have to think about things like creating a product
 * in Stripe, creating a price for the product, creating a checkout session, etc.
 * 
 * I just pass my products into the classes and they create or update products in Stripe
 * and create a checkout session for the order.
 */

import Stripe from 'stripe';
import * as OrderData from '../data/order';
import * as ProductData from '../data/product';
import type { Currency, Product, OrderItem, OrderStatus } from '../types/logic';
import type { Document } from 'mongoose';

type ProductDoc = Product & Document;

class Payment {
	stripe: Stripe;
  
	constructor(secret: string) {
		this.stripe = new Stripe(secret);
	}

	private async createStripeProduct(request: { product: Product, currency: Currency}): Promise<{product: Stripe.Product, price: Stripe.Price}> {
		// if product already exists, return its id
		const existingProduct = await this.stripe.products.list({ limit: 1, ids: [(request.product as ProductDoc)._id] });
		if(existingProduct.data.length > 0){
			const price = await this.stripe.prices.list({ product: existingProduct.data[0].id, limit: 1 });
			return { product: existingProduct.data[0], price: price.data[0] };
		}
    
		// create product
		const product = await this.stripe.products.create({
			id: (request.product as ProductDoc)._id,
			name: request.product.name,
			images: request.product.images.map(image => image.src)
		});

		// create a fixed pricing
		const price = await this.stripe.prices.create({
			currency: request.currency,
			unit_amount: request.product.price * 100, // convert to cents/öre
			product: product.id
		});

		return { product, price };
	}

	private async updateStripeProduct(request: { product: Product}): Promise<Stripe.Product> {
		if(!request.product.stripe){
			throw new Error(`Missing strip id required to update details for product with id ${(request.product as ProductDoc)._id}`);
		}
    
		return await this.stripe.products.update(
			request.product.stripe,
			{ 
				name: request.product.name,
				images: request.product.images.map(image => image.src) 
			}
		);
	}
  
	async createPaymentSession(request: {items: OrderItem[], currency: Currency, returnUrl: string, description?: string, email?: string}): Promise<{sessionId: string, sessionUrl: string;}> {
		/**
		 * This function creates `line_items` for a Stripe Checkout Session.
		 * Required session parameters are `currency`, `customer_email`, and `success_url`,
		 * which are derived from the input parameters. The function then maps each item in
		 * the order to a Stripe `line_item` by following these steps:
		 *
		 * 1. For each product in the order:
		 *    - If the product lacks a Stripe ID, it creates a Stripe Product and Price,
		 *      and saves the new Stripe ID to the product.
		 *    - If the product has a Stripe ID, it ensures that the product details are
		 *      synchronized with Stripe.
		 * 2. It updates Stripe product details if they are out of sync.
		 * 3. For pricing, it either finds a matching Stripe Price or creates a new one
		 *    if the product's price or currency has changed.
		 *
		 * The function throws an error if it fails to create or update products, prices,
		 * or if it cannot retrieve the necessary Stripe Price ID.
		 */
		const lineItems: { price: string; quantity: number }[] = await Promise.all(
			request.items.map(async (item) => {
				let productStripePriceId: string;

				//create product if it does not exist
				if (!item.product.stripe) {
					try {
						// create product in Stripe
						const { product, price } = await this.createStripeProduct({
							product: item.product,
							currency: request.currency,
						});

						productStripePriceId = price.id;

						// save stripe product id to product
						item.product = (await ProductData.updateProduct(
							(item.product as Document & Product)._id,
							{ stripe: product.id }
						)) as Product;
					} catch (error) {
						throw new Error(
							`Failed to create a Stripe Product for product with id ${
								(item.product as Document & Product)._id
							}: ${(error as Error).message}`
						);
					}
				}

				// if product has a stripe id, check that product details are synced between with Stripe
				else {
					try {
						const product = await ProductData.getProductById(
							(item.product as Document & Product)._id
						);
						const stripeProduct: Stripe.Product =
							await this.stripe.products.retrieve(item.product.stripe);

						if (!product) {
							throw new Error(
								`Failed to get product with id ${
									(item.product as Document & Product)._id
								} for Stripe Payment`
							);
						}

						if (!stripeProduct) {
							throw new Error(
								`Failed to get corresponding Stripe Product for product with id ${
									(item.product as Document & Product)._id
								}`
							);
						}

						// update product details if they are not synced
						if (
							stripeProduct.name !== product.name ||
							stripeProduct.images.join(",") !==
								product.images.map((image) => image.src).join(",")
						) {
							await this.updateStripeProduct({ product: item.product });
						}

						// find the Stripe Price that matches the product's current price and currency
						const stripeProductPriceList = await this.stripe.prices.list({ product: stripeProduct.id, });
						const stripeProductPrice: Stripe.Price | undefined =
							stripeProductPriceList.data.find(
								(price) =>
									price.currency === request.currency &&
									price.unit_amount === item.product.price * 100
							);

						// create a new price if the product's price or currency has changed
						if (stripeProductPrice === undefined) {
							const price = await this.stripe.prices.create({
								currency: request.currency,
								unit_amount: item.product.price * 100, // convert to cents/öre
								product: stripeProduct.id,
							});

							productStripePriceId = price.id;
						}

						// set productStripePriceId to the id of the existing price if the product's price and currency has not changed
						else {
							productStripePriceId = stripeProductPrice.id;
						}
					} catch (error) {
						throw new Error(
							`Failed to update a Stripe Product for product with id ${
								(item.product as Document & Product)._id
							}: ${(error as Error).message}`
						);
					}
				}

				if (!productStripePriceId) {
					throw new Error(
						`Failed to get Stripe Price id for product with id ${
							(item.product as Document & Product)._id
						}`
					);
				}

				return { price: productStripePriceId, quantity: item.quantity };
			})
		);

		const session = await this.stripe.checkout.sessions.create({
			mode: "payment",
			line_items: lineItems,
			currency: request.currency,
			customer_email: request.email,
			success_url: request.returnUrl + '&success=true',
			cancel_url: request.returnUrl + '&success=false',
		});

		if (!session.url) {
			throw new Error(
				`Failed to create a url for Stripe payment session with id ${session.id}.`
			);
		}

		return { sessionId: session.id, sessionUrl: session.url };
	}
}

class Webhook {
	stripe: Stripe;
	webhookSecret: string;

	constructor(secret: string, webhookSecret: string) {
		this.stripe = new Stripe(secret);
		this.webhookSecret = webhookSecret;
	}

	private async updateOrderBySessionId(update: {sessionId: string, status: OrderStatus}): Promise<void> {
		const order = await OrderData.getOrderByPaymentId(update.sessionId);

		if(!order){
			throw new Error(`Order with corresponding session id ${update.sessionId} not found`);
		}
      
		await OrderData.updateOrder(order._id, { status: update.status });
	}

	async handleWebhook(webhook: {payload: string | Buffer, signature: string}): Promise<void> {
		let event: Stripe.Event;

		try {
			event = this.stripe.webhooks.constructEvent(webhook.payload, webhook.signature, this.webhookSecret);
		} catch (error) {
			throw new Error(`Webhook Error: ${(error as Error).message}`);
		}

		if(event.type === "checkout.session.completed"){
			const session = event.data.object as Stripe.Checkout.Session;
			await this.updateOrderBySessionId({ sessionId: session.id, status: "paid" });
		}

		if(event.type === "checkout.session.expired"){
			const session = event.data.object as Stripe.Checkout.Session;
			await this.updateOrderBySessionId({ sessionId: session.id, status: "failed" });
		}
	}
}

export { Payment, Webhook };
