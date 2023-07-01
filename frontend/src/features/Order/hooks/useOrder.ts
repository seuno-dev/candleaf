import { useQuery } from "@tanstack/react-query";
import { retrieveOrder } from "../api";

const useOrder = (id: number) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => retrieveOrder(id),
  });

export default useOrder;
