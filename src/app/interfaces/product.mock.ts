import { faker } from "@faker-js/faker";
import { Product } from "./product.interface";

export const generateProduct = (): Product => {
  return {
    id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price()),
    description: faker.commerce.productDescription(),
    images: [faker.image.imageUrl()],
    category: {
      id: faker.datatype.number(),
      name: faker.commerce.department()
    }
  }
}


export const generateProducts = (ArrSize: number = 10): Product[] => {
  const products: Product[] = [];
  for (let i = 0; i < ArrSize; i++) {
    products.push(generateProduct());
  }
  return [...products];
}
