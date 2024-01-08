interface Document {
  _id: string;
}

export interface User extends Document {
  username: string;
  password?: string;
}

export interface Image {
  src: string;
  alt: string;
}

export type NewImage = Image & { file: File };

export interface Product extends Document {
  shop: string; // shop id
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: Image[];
  slug: string;
}

export interface Shop extends Document {
  owner: string; // user id
  name: string;
  description: string;
  products: string | Product[]; // ids or products
}

type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order extends Document {
  status: OrderStatus;
  shop: string; // shop id
  customer: string; // user id
  items: { product: Product; quantity: number }[];
}
