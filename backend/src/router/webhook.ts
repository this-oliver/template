import { raw } from "express";
import { Webhook } from "../utils/payment";
import { STRIPE_SECRET, STRIPE_ENDPOINT_SECRET } from "../config/env";
import type { Route } from "../types/infrastructure";
import type { Request, Response } from "express";

const webhook = new Webhook(STRIPE_SECRET, STRIPE_ENDPOINT_SECRET);

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
