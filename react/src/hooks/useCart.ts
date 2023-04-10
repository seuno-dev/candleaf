import { createCartItem } from "../api/api";

const useCart = () => {
  const addToCart = async (productId: number) => {
    return await createCartItem(productId);
  };

  return { addToCart };
};

export default useCart;
