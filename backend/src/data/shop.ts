import Mongoose from "mongoose";
import { Schema } from "mongoose";
import { indexOrders } from "./order";
import { indexProductsByShop } from "./product";
import type { Shop } from "../types/logic";

const ShopModel = Mongoose.model("shop", new Mongoose.Schema<Shop>(
	{
		owner: { type: Schema.Types.ObjectId, ref: "user" },
		name: { type: String, required: true },
		description: { type: String, default: "" },
		products: [{ type: Schema.Types.ObjectId, ref: "product" }]
	},
	{ timestamps: true }
));

async function createShop(shop: Omit<Shop, keyof Mongoose.Document>): Promise<Shop> {
	return await ShopModel.create(new ShopModel(shop));
}

async function getShopById(id: string): Promise<Shop | null> {
	return await ShopModel.findById(id).exec();
}

async function indexShops(): Promise<Shop[]> {
	return await ShopModel.find().exec();
}

async function indexShopsByOwner(owner: string): Promise<Shop[]> {
	return await ShopModel.find({ owner: { $eq: owner } }).exec();
}

async function updateShop(id: string, patch: Partial<Shop>): Promise<Shop | null> {
	const shop = await getShopById(id);

	if(!shop){
		throw new Error(`Shop with id ${id} not found`);
	}

	shop.name = patch.name || shop.name;
	shop.description = patch.description || shop.description;

	return await shop.save();
}

async function deleteShop(id: string): Promise<Shop | null> {
	const shop = await getShopById(id);

	if(!shop){
		throw new Error(`Shop with id ${id} not found`);
	}

	// dont delete shop if it has incomplete orders or products
	const orders = await indexOrders();
	const incompleteOrders = orders.filter(order => order.status !== "completed" && order.status !== "cancelled");

	if(incompleteOrders.length > 0){
		throw new Error(`Shop with id ${id} cannot be deleted because it has incomplete orders`);
	}
  
	// dont delete shop if it has products
	const products = await indexProductsByShop(id);

	if(products.length > 0){
		throw new Error(`Shop with id ${id} cannot be deleted because it has products`);
	}

	return await ShopModel.findByIdAndDelete(id).exec();
}

export {
	ShopModel,
	createShop,
	getShopById,
	indexShops,
	indexShopsByOwner,
	updateShop,
	deleteShop
};