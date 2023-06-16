import { faker } from "@faker-js/faker";
import slugify from "slugify";
import { categories } from "./categories";

// Featured Product Image
import SpicedMint from "../assets/images/Spiced Mint.png";
import SweetStraweberry from "../assets/images/Sweet Straweberry.png";
import CoolBlueberries from "../assets/images/Cool Blueberries.png";
import JuicyLemon from "../assets/images/Juicy Lemon.png";
import FreshOrange from "../assets/images/Fresh Orange.png";
import FragrantCinnamon from "../assets/images/Fragrant Cinnamon.png";
import SummerCherries from "../assets/images/Summer Cherries.png";
import CleanLavander from "../assets/images/Clean Lavander.png";

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
      inventory: faker.number.int({ min: 10, max: 100 }),
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

let featuredProductId = 201;
const createFeaturedProduct = (title: string, image: string): ProductMock => ({
  id: featuredProductId++,
  title,
  slug: slugify(title),
  unit_price: 9.99,
  description:
    "All hand-made with natural soy wax, Candleaf is made for your pleasure moments.",
  inventory: 10,
  category: categories[0],
  images: [{ id, image }],
  average_rating: 5,
  review_count: 0,
  reviews: [],
});
export const featuredProducts: ProductMock[] = [
  createFeaturedProduct("Spiced Mint", SpicedMint),
  createFeaturedProduct("Sweet Straweberry", SweetStraweberry),
  createFeaturedProduct("Cool Blueberries", CoolBlueberries),
  createFeaturedProduct("Juicy Lemon", JuicyLemon),
  createFeaturedProduct("Fresh Orange", FreshOrange),
  createFeaturedProduct("Fragrant Cinnamon", FragrantCinnamon),
  createFeaturedProduct("Summer Cherries", SummerCherries),
  createFeaturedProduct("Clean Lavander", CleanLavander),
];
