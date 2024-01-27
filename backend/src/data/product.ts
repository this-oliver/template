import Mongoose from "mongoose";
import { Schema } from "mongoose";
import { createSlug } from "../utils/slug";
import type { Product } from "../types/logic";

const ProductModel = Mongoose.model("product", new Mongoose.Schema<Product>(
	{
		shop: { type: Schema.Types.ObjectId, ref: "shop" },
		name: { type: String, required: true },
		description: { type: String, default: "" },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true },
		slug: { type: String, default: "" },
		stripe: { type: String },
		images: [{
			src: { type: String, required: true },
			alt: { type: String, required: true }
		}]
	},
	{ timestamps: true })
	.pre("save", function(next) {
		this.slug = createSlug(this.name);
		next();
	})
);

async function createProduct(product: Omit<Product, keyof Mongoose.Document>): Promise<Product> {
	return await ProductModel.create(new ProductModel(product));
}

async function getProductById(id: string): Promise<Product | null> {
	// could be either an id or a slug
	const isObjectId = Mongoose.isValidObjectId(id);
  
	return isObjectId
		? await ProductModel.findById(id).exec()
		: await ProductModel.findOne({ slug: id }).exec();
}

async function indexProducts(): Promise<Product[]> {
	return await ProductModel.find().exec();
}

async function indexProductsByShop(shopId: string): Promise<Product[]> {
	return await ProductModel.find({ shop: shopId }).exec();
}

async function updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
	const product = await getProductById(id);

	if(!product){
		throw new Error(`Product with id ${id} not found`);
	}
  
	product.name = patch.name || product.name;
	product.description = patch.description || product.description;
	product.images = patch.images || product.images;
	product.stripe = patch.stripe || product.stripe;
  
	// if the price is not defined in the patch, do not update it
	if(patch.price !== undefined){
		product.price = patch.price;
	}

	// if the quantity is not defined in the patch, do not update it
	if(patch.quantity !== undefined){
		product.quantity = patch.quantity;
	}

	return await product.save();
}

async function deleteProduct(id: string): Promise<Product | null> {
	const product = await getProductById(id);

	if(!product){
		throw new Error(`Product with id ${id} not found`);
	}

	return await ProductModel.findByIdAndDelete(id).exec();
}

export {
	ProductModel,
	createProduct,
	getProductById,
	indexProducts,
	indexProductsByShop,
	updateProduct,
	deleteProduct
};