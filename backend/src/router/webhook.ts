import { raw } from "express";
import { Webhook } from "../utils/payment";
import { STRIPE_SECRET, STRIPE_ENDPOINT_SECRET } from "../config/env";
import type { Route } from "../types/infrastructure";
import type { Request, Response } from "express";

if(!STRIPE_SECRET){
	throw new Error("Stripe secret is not defined. Set STRIPE_SECRET environment variable.");
}

if(!STRIPE_ENDPOINT_SECRET){
	throw new Error("Stripe endpoint secret is not defined. Set STRIPE_ENDPOINT_SECRET environment variable.");
}

const webhook: Webhook = new Webhook(STRIPE_SECRET, STRIPE_ENDPOINT_SECRET);  

async function handleWebhook (req: Request, res: Response): Promise<void> {  
	try {
		const signature = req.headers['stripe-signature'] as string;
		const payload = req.body as string | Buffer;

		await webhook.handleWebhook({ payload, signature });
		res.status(200).send({ received: true });
	} catch (error) {
		res.status(400).send(`Webhook Error: ${(error as Error).message}`);
	}
}

const routes: Route[] = [
	{
		path: '/webhook',
		method: "post",
		json: false,
		handler: [raw({ type: 'application/json' }), handleWebhook]
	}
];

export { routes };
