import Mongoose from "mongoose";
import * as ProductData from "./product";
import type { Order as IOrder } from "../types/logic";

type OrderDocument = IOrder & Mongoose.Document;

const OrderModel = Mongoose.model("order", new Mongoose.Schema<OrderDocument>(
	{
		status: { type: String, required: true },
		customer: { email: { type: String, required: true } },
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
async function syncStocks(type: "remove" | "restore", order: OrderDocument): Promise<void> {
  
	for(const item of order.items){
		const id: string = (item.product as ProductData.ProductDocument)._id;
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

async function createOrder(order: IOrder): Promise<OrderDocument> {
	
	// check if the ordered items are in stock
	for(const item of order.items){
		const id: string = (item.product as ProductData.ProductDocument)._id;
    
		// use product in the database to cross-reference the stock
		const product = await ProductData.getProductById(id);

		if(!product){
			throw new Error(`Product with id ${id} not found`);
		}

		if(product.quantity < item.quantity){
			throw new Error(`Product with id ${id} does not have enough stock`);
		}
	}
  
	const newOrder = await OrderModel.create(new OrderModel(order));

	// update the stock of the products
	await syncStocks("remove", newOrder);

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

	const updatedOrder = await order.save();

	// update the stock of the products if the order is cancelled
	if(updatedOrder.status === "cancelled"){
		await syncStocks("restore", updatedOrder);
	}

	return updatedOrder;
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