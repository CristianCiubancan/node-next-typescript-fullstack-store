import { Attribute } from "./product";

export interface CartItem {
  variationSku: string;
  productSku: string;
  variationName: string;
  productName: string;
  quantity: number;
  price: string;
  stock: number;
  attributes: Attribute[];
  image: string;
  placeholderUrl: string;
}

export interface CheckOrderRequestObject {
  paymentMethod: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  zipcode: string;
  city: string;
  items: CartItem[];
}

export interface OrderProductImage {
  id: number;
  url: string;
  name: string;
  placeholderUrl: string;
}

export interface OrderItem {
  price: number;
  images: OrderProductImage[];
  quantity: number;
  productSku: string;
  productName: string;
  variationSku: string;
  variationName: string;
  discountMultiplier: number;
}

export interface Order {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  zipcode: string;
  city: string;
  paymentMethod: string;
  status: string;
  orderItems: OrderItem[];
}
