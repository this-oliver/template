/**
 * Types and interfaces for application logic (i.e. users, posts, etc.)
 */

import type { Document, ObjectId } from "mongoose";

export interface User extends Document {
  username: string;
  password: string;
}

export interface Image {
  src: string;
  alt: string;
}

export interface Product extends Document {
  shop: string | ObjectId; // shop id
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[];
  slug: string;
  stripe?: string; // stripe id
}

/**
 * Currency Code (see https://en.wikipedia.org/wiki/ISO_4217).
 * 
 * Note: currently limited to the following currencies: EUR, SEK, USD, GBP
 */
export type Currency = "EUR" | "SEK" | "USD" | "GBP";

export interface Shop extends Document {
  owner: string | ObjectId; // user id
  name: string;
  description: string;
  products: string | Product[]; // ids or products
  //currency: Currency;
}

export interface OrderItem {
  product: Product;
  quantity: number
}

export type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled" | "failed";

export interface Order extends Document {
  items: OrderItem[];
  status: OrderStatus;
  currency: Currency;
  customer: { email: string; };
  payment?: { id: string; url: string; };
}
