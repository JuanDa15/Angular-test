import { Category } from "./category.interface";

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  taxes?: number;
}

export interface ProductDto extends Omit<Product, 'id' | 'category'> {
  categoryId: number;
}
