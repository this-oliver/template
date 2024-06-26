import * as ProductData from '../data/product';
import { NODE_ENV, BUCKET_NAME, BUCKET_ID, BUCKET_KEY_PATH, BUCKET_KEY, BUCKET_SECRET, BUCKET_REGION, BUCKET_URL } from '../config/env';
import { verifyShopOwner, verifyProductOwner } from './helpers/authorization';
import { AwsBucket, GcpBucket } from '../utils/storage';
import type { Product, Image } from '../types/logic';
import type { AuthenticatedRequest } from '../types/infrastructure';
import type { Request, Response } from 'express';

type MulterFile = Express.Multer.File;

/**
 * returns an array of objects containing the file and alt text
 */
async function extractImages(req: Request): Promise<Image[]> {
	const files = req.files as MulterFile[];
	const images = [];
	
	if(!files || !files.length){
		return [];
	}

	if (files.length > 5) {
		throw new Error('You can only upload up to 5 images.');
	}

	const bucket = NODE_ENV === "prod"
		? new GcpBucket({ bucketName: BUCKET_NAME, projectName: BUCKET_ID, keyPath: BUCKET_KEY_PATH })
		: new AwsBucket({ bucketName: BUCKET_NAME, secretAccessKey: BUCKET_SECRET, accessKeyId: BUCKET_KEY, bucketRegion: BUCKET_REGION, bucketEndpoint: BUCKET_URL });
  
	for(let i = 0; i < files.length; i++){
		const meta = req.body[`files-meta-${i}`];
		const { alt } = JSON.parse(meta as string);
		
		const file = files[i] as MulterFile;
		const src = await bucket.uploadFile(file);
    
		images.push({ src, alt });
	}

	return images;
}

async function postProduct(req: Request, res: Response) {
	const authReq = req as AuthenticatedRequest;
	const body = req.body as Product;

	if(!await verifyShopOwner(authReq.user._id, body.shop)){
		return res.status(401).send({ message: 'You are not allowed to create a product for another user\'s shop.' });
	}
  
	try {
		// upload images if any
		body.images = await extractImages(req);
    
		const product = await ProductData.createProduct(body);
		return res.status(201).send(product);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function getProductById(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const product = await ProductData.getProductById(id);
		return res.status(200).send(product);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function indexProducts(req: Request, res: Response) {
	try {
		const products = await ProductData.indexProducts();
		return res.status(200).send(products);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function indexProductsByShop(req: Request, res: Response) {
	const { id } = req.params;

	try {
		const products = await ProductData.indexProductsByShop(id);
		return res.status(200).send(products);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function patchProduct(req: Request, res: Response) {
	const authReq = req as AuthenticatedRequest;
	const { id } = authReq.params;
	const body = req.body as Product;

	if(!await verifyProductOwner(authReq.user.id, id)){
		return res.status(401).send({ message: 'You are not allowed to update a product that you do not own.' });
	}

	try {
		// upload images if any
		const images = body.images || [];
		images.push(...await extractImages(req));

		const product = await ProductData.updateProduct(id, { ...body, images });
		return res.status(200).send(product);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

async function deleteProduct(req: Request, res: Response) {
	const authReq = req as AuthenticatedRequest;
	const { id } = authReq.params;

	if(!await verifyProductOwner(authReq.user.id, id)){
		return res.status(401).send({ message: 'You are not allowed to delete a product that you do not own.' });
	}

	try {
		const product = await ProductData.deleteProduct(id);
		return res.status(200).send(product);
	} catch (error) {
		return res.status(400).send({ message: (error as Error).message });
	}
}

export {
	postProduct,
	getProductById,
	indexProducts,
	indexProductsByShop,
	patchProduct,
	deleteProduct
};