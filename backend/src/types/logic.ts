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
}

export interface Shop {
  owner: string | ObjectId; // user id
  name: string;
  description: string;
  products: string | Product[]; // ids or products
}

type OrderStatus = "pending" | "shipped" | "completed" | "cancelled";

interface OrderItem {
  product: Product;
  quantity: number
}

// TODO: add shipping address, tracking number, etc.
export interface Order {
  customer: { email: string; };
  status: OrderStatus;
  items: OrderItem[];
  currency: string;
}
