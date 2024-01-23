import Mongoose from "mongoose";
import { ProductDocument, ProductModel, getProductById } from "./product";
import type { Order as IOrder } from "../types/logic";

type OrderDocument = IOrder & Mongoose.Document;

const OrderModel = Mongoose.model("order", new Mongoose.Schema<OrderDocument>(
	{
		status: { type: String, required: true },
		customer: { email: { type: String, required: true } },
		currency: { type: String, required: true },
		items: [{
			quantity: { type: Number, required: true },
			product: { type: ProductModel.schema, required: true }
		}]
	},
	{ timestamps: true }
));

async function createOrder(order: IOrder): Promise<OrderDocument> {
	
	// check if the ordered items are in stock
	for(const item of order.items){
		const id: string = (item.product as ProductDocument)._id;
    
		// use the product in the database to check if it exists and has enough stock
		// instead of the product in the order (which may be outdated, non-existent or manipulated)
		const product = await getProductById(id);

		if(!product){
			throw new Error(`Product with id ${id} not found`);
		}

		if(product.quantity < item.quantity){
			throw new Error(`Product with id ${id} does not have enough stock`);
		}
	}
  
	const newOrder = await OrderModel.create(new OrderModel(order));

	// update the stock of the products
	for(const item of newOrder.items){
		const id: string = (item.product as ProductDocument)._id;
		const product = await getProductById(id);

		if(!product){
			throw new Error(`Failed to get and update stock for product with id ${id}`);
		}

		product.quantity -= item.quantity;
		await product.save();
	}

	return newOrder;
}

async function getOrderById(id: string): Promise<OrderDocument | null> {
	return await OrderModel.findById(id).exec();
}

async function indexOrders(): Promise<OrderDocument[]> {
	return await OrderModel.find()
		.exec();
}

async function updateOrder(id: string, patch: Partial<IOrder>): Promise<OrderDocument | null> {
	const order = await getOrderById(id);

	if(!order){
		throw new Error(`Order with id ${id} not found`);
	}

	order.status = patch.status || order.status;

	return await order.save();
}

async function deleteOrder(id: string): Promise<OrderDocument | null> {
	throw new Error(`Orders cannot be deleted. Ref: ${id}`);
}

export {
	OrderDocument,
	OrderModel,
	createOrder,
	getOrderById,
	indexOrders,
	updateOrder,
	deleteOrder
};