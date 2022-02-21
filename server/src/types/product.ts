export interface Category {
  id?: number;
  name: string;
}

export interface Value {
  id?: number;
  name: string;
}

export interface Attribute {
  id?: number;
  name: string;
  values: Value[];
}

export interface Specification {
  id?: number;
  name: string;
  value: string;
}

export interface Variation {
  id?: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  discountMultiplier: string;
  attributes: Attribute[];
}

export interface Size {
  id?: number;
  name: string;
  width: number;
  url: string;
}

export interface Img {
  id?: number;
  name: string;
  placeholderUrl: string;
  url: string;
  sizes: Size[];
}

export interface Product {
  id?: number;
  sku: string;
  name: string;
  isOnSale: boolean;
  stock: string | null;
  discountMultiplier: string;
  description: string;
  minPrice: string;
  maxPrice: string;
  categories: Category[];
  attributes: Attribute[];
  variations: Variation[];
  specifications: Specification[];
  images: Img[];
}
