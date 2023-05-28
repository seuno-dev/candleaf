import { faker } from "@faker-js/faker";
import slugify from "slugify";

const createCategories = (num: number) => {
  const categories = [];
  for (let id = 1; id <= num; id++) {
    const title = faker.company.buzzNoun() + faker.number.int({min: 10000, max: 99999});
    const slug = slugify(title);
    categories.push({
      id,
      title,
      slug,
    });
  }
  return categories;
};

export const categories = createCategories(5);
