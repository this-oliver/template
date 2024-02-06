import dotenv from "dotenv";

// load base .env file
dotenv.config();

// load environment specific .env files
if (process.env.NODE_ENV === "test") {
	dotenv.config({ path: ".env.test" });
} else if (process.env.NODE_ENV === "dev") {
	dotenv.config({ path: ".env.dev" });
}

// General config
const NODE_ENV = process.env.NODE_ENV || "prod";
const PORT = process.env.PORT || "3000";
const DATABASE_URL: string = process.env.DATABASE_URL as string;

// Security config
const JWT_SECRET: string = process.env.JWT_SECRET as string;
const ALLOWED_ORIGINS: string = process.env.ALLOWED_ORIGINS as string || "*";

// Storage config (aws & gcp)
const BUCKET_ID: string = process.env.BUCKET_ID as string; // gcp
const BUCKET_KEY: string = process.env.BUCKET_KEY as string; // aws
const BUCKET_KEY_PATH: string = process.env.BUCKET_KEY_PATH as string; // gcp
const BUCKET_NAME: string = process.env.BUCKET_NAME as string; // aws & gcp
const BUCKET_REGION: string = process.env.BUCKET_REGION as string; // gcp
const BUCKET_SECRET: string = process.env.BUCKET_SECRET as string; // aws
const BUCKET_URL: string = process.env.BUCKET_URI as string; // aws

// Payment
const STRIPE_SECRET: string = process.env.STRIPE_SECRET as string;
const STRIPE_ENDPOINT_SECRET: string = process.env.STRIPE_ENDPOINT_SECRET as string;

export {
	NODE_ENV,
	PORT,
	DATABASE_URL,
	JWT_SECRET,
	ALLOWED_ORIGINS,
	BUCKET_ID,
	BUCKET_KEY,
	BUCKET_KEY_PATH,
	BUCKET_NAME,
	BUCKET_REGION,
	BUCKET_SECRET,
	BUCKET_URL,
	STRIPE_SECRET,
	STRIPE_ENDPOINT_SECRET
};
