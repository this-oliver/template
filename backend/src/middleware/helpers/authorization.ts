import * as ShopData from "../../data/shop";
import * as ProductData from "../../data/product";
import * as OrderData from "../../data/order";
import type { ObjectId } from "mongoose";

type Identification = string | ObjectId;

/**
 * Returns true if the user is the owner of the shop.
 */
async function verifyShopOwner(userId: Identification, shopId: Identification): Promise<boolean> {
	if(!userId || !shopId){
		return false;
	}
  
	if(typeof userId !== "string"){
		userId = userId.toString();
	}

	if(typeof shopId !== "string"){
		shopId = shopId.toString();
	}
  
	const shop = await ShopData.getShopById(shopId);
  
	return shop?.owner.toString() === userId;
}

/**
 * Returns true if the user is the owner of the product.
 */
async function verifyProductOwner(userId: Identification, productId: Identification): Promise<boolean> {
	if(!userId || !productId){
		return false;
	}
  
	if(typeof userId !== "string"){
		userId = userId.toString();
	}

	if(typeof productId !== "string"){
		productId = productId.toString();
	}
  
	const product = await ProductData.getProductById(productId);

	if(!product){
		return false;
	}
  
	return verifyShopOwner(userId, product?.shop);
}

/**
 * Returns true if the user is the creator of the order.
 */
async function verifyOrderOwner(userId: Identification, orderId: Identification): Promise<boolean> {
	if(!userId || !orderId){
		return false;
	}
  
	if(typeof userId !== "string"){
		userId = userId.toString();
	}

	if(typeof orderId !== "string"){
		orderId = orderId.toString();
	}
  
	const order = await OrderData.getOrderById(orderId);
  
	return order?.customer.toString() === userId;
}

export { verifyShopOwner, verifyProductOwner, verifyOrderOwner };