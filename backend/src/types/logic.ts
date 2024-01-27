/**
 * Types and interfaces for application logic (i.e. users, posts, etc.)
 */

import type { ObjectId } from "mongoose";

export interface User {
  username: string;
  password: string;
}

export interface Image {
  src: string;
  alt: string;
}

export interface Product {
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
 * Currency Code (see https://en.wikipedia.org/wiki/ISO_4217)
 * 
 * Limited to the following currencies:
 * 
 * - EUR - Euro (default)
 * - SEK - Swedish Krona
 * - USD - US Dollar
 * - GBP - British Pound
 */
export type Currency = "EUR" | "SEK" | "USD" | "GBP";

export interface Shop {
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

export interface Order {
  items: OrderItem[];
  status: OrderStatus;
  currency: Currency;
  customer: { email: string; };
  payment?: { id: string; url: string; };
}
