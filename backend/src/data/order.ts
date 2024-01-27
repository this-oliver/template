import Mongoose from "mongoose";
import * as ProductData from "./product";
import type { Order, Product } from "../types/logic";
import type { ObjectId } from "mongoose";

const OrderModel = Mongoose.model("order", new Mongoose.Schema<Order>(
	{
		status: { type: String, required: true },
		customer: { email: { type: String, required: true } },
		payment: { id: { type: String }, url: { type: String } },
		currency: { type: String, required: true },
		items: [{
			quantity: { type: Number, required: true },
			product: { type: ProductData.ProductModel.schema, required: true }
		}]
	},
	{ timestamps: true }
));

/**
 * Synchronizes the stock of the products in the order with the database.
 * 
 * @param type - Whether to remove or restore the stock
 * @param order - The order to synchronize
 */
async function syncStocks(type: "remove" | "restore", order: Order): Promise<void> {
  
	for(const item of order.items){
		const id: string = (item.product as Product)._id;
		const product = await ProductData.getProductById(id);

		if(!product){
			throw new Error(`Failed to get and update stock for product with id ${id}`);
		}

		const updatedQuantity: number = type === "remove" 
			? product.quantity - item.quantity 
			: product.quantity + item.quantity;

		await ProductData.updateProduct(id, { quantity: updatedQuantity });
	}
}

async function createOrder(order: Omit<Order, keyof Mongoose.Document>, id?: string | ObjectId): Promise<Order> {
	
	// check if the ordered items are in stock
	for(const item of order.items){
		const id: string = (item.product as Product)._id;
    
		// use product in the database to cross-reference the stock
		const product = await ProductData.getProductById(id);

		if(!product){
			throw new Error(`Product with id ${id} not found`);
		}

		if(product.quantity < item.quantity){
			throw new Error(`Product with id ${id} does not have enough stock`);
		}
	}
  
	// if an id is provided, check if it is valid and not already in use
	const isValidObjectId: boolean = Mongoose.isValidObjectId(id) && (await OrderModel.findById(id).exec() === null);
  
	const newOrder = isValidObjectId
		? await OrderModel.create(new OrderModel({ ...order, _id: id }))
		: await OrderModel.create(new OrderModel(order));

	// update the stock of the products
	await syncStocks("remove", newOrder);

	return newOrder;
}

async function getOrderById(id: string): Promise<Order | null> {
	return await OrderModel.findById(id).exec();
}

async function getOrderByPaymentId(id: string): Promise<Order | null> {
	return await OrderModel.findOne({ "payment.id": id }).exec();
}

async function indexOrders(): Promise<Order[]> {
	return await OrderModel.find()
		.exec();
}

async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
	const order = await getOrderById(id);

	if(!order){
		throw new Error(`Order with id ${id} not found`);
	}

	order.status = patch.status || order.status;

	const updatedOrder = await order.save();

	// update the stock of the products if the order is cancelled
	if(updatedOrder.status === "cancelled"){
		await syncStocks("restore", updatedOrder);
	}

	return updatedOrder;
}

async function deleteOrder(id: string): Promise<Order | null> {
	throw new Error(`Orders cannot be deleted. Ref: ${id}`);
}

export {
	OrderModel,
	createOrder,
	getOrderById,
	getOrderByPaymentId,
	indexOrders,
	updateOrder,
	deleteOrder
};