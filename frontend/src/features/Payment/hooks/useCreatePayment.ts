import { useQuery } from "@tanstack/react-query";
import { createPayment } from "../api";

const useCreatePayment = (orderId: string) =>
  useQuery({
    queryKey: ["stripe_payment", orderId],
    queryFn: () => createPayment(orderId),
  });

export default useCreatePayment;
