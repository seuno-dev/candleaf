import { useEffect, useState } from "react";
import { Category } from "../types";
import { retrieveCategoryList } from "../api/api";

export const useCategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    retrieveCategoryList().then((_categories) => {
      setCategories(_categories);
    });
  }, []);

  return { categories };
};
