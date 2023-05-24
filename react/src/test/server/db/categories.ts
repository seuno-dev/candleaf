import { faker } from "@faker-js/faker";
import slugify from "slugify";

const createCategories = (num: number) => {
  const categories = [];
  for (let id = 1; id <= num; id++) {
    const title = faker.company.buzzNoun();
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
