import { faker } from "@faker-js/faker";
import slugify from "slugify";
import { categories } from "./categories";

export type CategoryMock = {
  id: number;
  title: string;
  slug: string;
};

export interface SimpleReviewMock {
  id: number;
  rating: number;
  comment: string;
}

export type ProductImageMock = {
  id: number;
  image: string;
};

interface ProductMock {
  id: number;
  title: string;
  slug: string;
  description: string;
  unit_price: string;
  inventory: number;
  category: CategoryMock;
  images: ProductImageMock[];
  average_rating: number;
  review_count: number;
  reviews: SimpleReviewMock[];
}

const createProducts = (numOfCategories: number, numEachCategory: number) => {
  const numProducts = numOfCategories * numEachCategory;
  const products: ProductMock[] = [];

  let idImage = 1;
  for (let id = 1; id <= numProducts; id++) {
    const title = faker.commerce.product() + faker.number.int({ max: 10000 });
    const slug = slugify(title);
    products.push({
      id,
      title,
      slug,
      description: faker.commerce.productDescription(),
      unit_price: faker.finance.amount(),
      inventory: faker.number.int({ min: 1, max: 100 }),
      category: categories[id % numOfCategories],
      images: [{ id: idImage, image: `${slug}.png` }],
      average_rating: faker.number.float({ min: 1, max: 5, precision: 2 }),
      review_count: faker.number.int({ min: 10, max: 100 }),
      reviews: [
        {
          id: 1,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.hacker.phrase(),
        },
      ],
    });
    idImage++;
  }
  return products;
};

export const numEachCategory = 6;
export const products = createProducts(categories.length, numEachCategory);
