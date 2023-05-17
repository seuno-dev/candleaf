import { retrieveCategoryList } from "../../../api";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../../../types";

const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: retrieveCategoryList,
  });

export default useCategories;