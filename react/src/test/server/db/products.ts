import { faker } from "@faker-js/faker";
import slugify from "slugify";
import { categories } from "./categories";

const createProducts = (numOfCategories: number, numEachCategory: number) => {
  const numProducts = numOfCategories * numEachCategory;
  const products = [];

  let idImage = 1;
  for (let id = 1; id <= numProducts; id++) {
    const title = faker.commerce.product();
    const slug = slugify(title);
    products.push({
      id,
      title,
      slug,
      description: faker.commerce.productDescription(),
      unit_price: faker.finance.amount(),
      inventory: faker.number.int({ min: 1, max: 100 }),
      category: id % numOfCategories,
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

export const products = createProducts(categories.length, 5);
