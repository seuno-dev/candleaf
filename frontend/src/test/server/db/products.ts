import { faker } from "@faker-js/faker";
import slugify from "slugify";

// Featured Product Image
import SpicedMint from "../assets/images/Spiced Mint.png";
import SweetStrawberry from "../assets/images/Sweet Strawberry.png";
import CoolBlueberries from "../assets/images/Cool Blueberries.png";
import JuicyLemon from "../assets/images/Juicy Lemon.png";
import FreshOrange from "../assets/images/Fresh Orange.png";
import FragrantCinnamon from "../assets/images/Fragrant Cinnamon.png";
import SummerCherries from "../assets/images/Summer Cherries.png";
import CleanLavender from "../assets/images/Clean Lavender.png";

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
  images: ProductImageMock[];
  average_rating: number;
  review_count: number;
  reviews: SimpleReviewMock[];
  wax: string;
  fragrance: string;
  burning_time: number;
  dimension: string;
  weight: number;
}

interface FeaturedProductMock {
  id: number;
  product: ProductMock;
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
  numProducts: number,
  minBurningTime: number,
  maxBurningTime: number,
  minPrice: number,
  maxPrice: number
) => {
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
      wax: "Top grade Soy wax that delivers a smoke less,  consistent burn",
      fragrance: "Premium quality ingredients with natural essential oils",
      burning_time: faker.number.int({
        min: minBurningTime,
        max: maxBurningTime,
      }),
      dimension: "10cm x 5cm",
      weight: 400,
    });
    id++;
  }
  return products;
};

export const products = [
  ...createProducts(10, 21, 29, 11.0, 19.0),
  ...createProducts(10, 41, 49, 21.0, 29.0),
  ...createProducts(10, 81, 89, 31.0, 39.0),
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
  images: [{ id, image }],
  average_rating: 5,
  review_count: 0,
  reviews: [],
  wax: "Top grade Soy wax that delivers a smoke less,  consistent burn",
  fragrance: "Premium quality ingredients with natural essential oils",
  burning_time: 70,
  dimension: "10cm x 5cm",
  weight: 400,
});

export const featuredProducts: FeaturedProductMock[] = [
  { id: 1, product: createFeaturedProduct("Spiced Mint", SpicedMint) },
  {
    id: 2,
    product: createFeaturedProduct("Sweet Strawberry", SweetStrawberry),
  },
  {
    id: 3,
    product: createFeaturedProduct("Cool Blueberries", CoolBlueberries),
  },
  { id: 4, product: createFeaturedProduct("Juicy Lemon", JuicyLemon) },
  { id: 5, product: createFeaturedProduct("Fresh Orange", FreshOrange) },
  {
    id: 6,
    product: createFeaturedProduct("Fragrant Cinnamon", FragrantCinnamon),
  },
  { id: 7, product: createFeaturedProduct("Summer Cherries", SummerCherries) },
  { id: 8, product: createFeaturedProduct("Clean Lavender", CleanLavender) },
];
