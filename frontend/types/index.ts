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

export type OrderStatus = "pending" | "shipped" | "completed" | "cancelled";

export interface OrderItem {
  product: Product;
  quantity: number
};

export interface Order extends Document {
  customer: { email: string; };
  status: OrderStatus;
  currency: string;
  items: OrderItem[];
}
