import mongoose from 'mongoose';
import * as OrderData from '../data/order';
import { STRIPE_SECRET } from '../config/env';
import { verifyOrderOwner } from './helpers/authorization';
import { Payment } from '../utils/payment';
import type { Order } from '../types/logic';
import type { AuthenticatedRequest } from '../types/infrastructure';
import type { Request, Response } from 'express';

if(!STRIPE_SECRET){
	throw new Error("Stripe secret is not defined. Set STRIPE_SECRET environment variable.");
}

const payment = new Payment(STRIPE_SECRET);

async function postOrder(req: Request, res: Response) {
	const orderRequest = req.body.order as Order;
	let returnUrl = req.body.returnUrl as string;

	if(orderRequest.items.length === 0){
		return res.status(400).send({ message: 'You cannot create an order with no items.' });
	}

	if(!returnUrl){
		return res.status(400).send({ message: 'You must provide a success url for the order.' });
	}

	// create an id for the order which will be used to identify the order in the checkout session
	const orderId: string = new mongoose.Types.ObjectId().toString();

	// append order id to success url
	returnUrl += `?order=${orderId}`;

	// create a checkout session for the order
	try {
		const { sessionId, sessionUrl } = await payment.createPaymentSession({
			items: orderRequest.items,
			currency: orderRequest.currency,
			email: orderRequest.customer.email,
			returnUrl
		});
    
		orderRequest.payment = { id: sessionId, url: sessionUrl };
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}

	// create order
	try {
		const order = await OrderData.createOrder(orderRequest, orderId);
		return res.status(201).send(order);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function getOrderById(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const order = await OrderData.getOrderById(id);
		return res.status(200).send(order);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function indexOrders(req: Request, res: Response) {
	try {
		const orders = await OrderData.indexOrders();
		return res.status(200).send(orders);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function patchOrder(req: Request, res: Response) {
	const authReq = req as AuthenticatedRequest;
	const { id } = authReq.params;

	if(!await verifyOrderOwner(authReq.user._id, id)){
		return res.status(401).send('You are not allowed to update an order that you do not own.');
	}

	try {
		const order = await OrderData.updateOrder(id, req.body);
		return res.status(200).send(order);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

export {
	postOrder,
	getOrderById,
	indexOrders,
	patchOrder
};