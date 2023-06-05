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

export interface ProductMock {
  id: number;
  title: string;
  slug: string;
  description: string;
  unit_price: number;
  inventory: number;
  category: CategoryMock;
  images: ProductImageMock[];
  average_rating: number;
  review_count: number;
  reviews: SimpleReviewMock[];
}

export interface SimpleProductMock {
  id: number;
  title: string;
  unit_price: number;
  inventory: number;
  image: ProductImageMock;
}

let id = 1;

const createProducts = (
  numOfCategories: number,
  numEachCategory: number,
  minPrice: number,
  maxPrice: number
) => {
  const numProducts = numOfCategories * numEachCategory;
  const products: ProductMock[] = [];

  for (let i = 1; i <= numProducts; i++) {
    const title = faker.commerce.product() + faker.number.int({ max: 10000 });
    const slug = slugify(title);

    products.push({
      id,
      title,
      slug,
      unit_price: parseFloat(
        faker.finance.amount({ min: minPrice, max: maxPrice })
      ),
      description: faker.commerce.productDescription(),
      inventory: faker.number.int({ min: 1, max: 100 }),
      category: categories[i % numOfCategories],
      images: [{ id, image: `${slug}.png` }],
      average_rating: faker.number.float({ min: 1, max: 5, precision: 2 }),
      review_count: faker.number.int({ min: 10, max: 100 }),
      reviews: [
        {
          id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.hacker.phrase(),
        },
      ],
    });
    id++;
  }
  return products;
};

export const products = [
  ...createProducts(categories.length, 2, 11.0, 19.0),
  ...createProducts(categories.length, 2, 21.0, 29.0),
  ...createProducts(categories.length, 2, 31.0, 39.0),
];
