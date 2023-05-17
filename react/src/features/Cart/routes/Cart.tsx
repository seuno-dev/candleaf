import React, { useEffect, useState } from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";
import { submitOrder } from "../../Order/api";
import useCartItems from "../hooks/useCartItems";

function Cart() {
  const { data } = useCartItems();
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const createOrder = async () => {
    return await submitOrder();
  };

  useEffect(() => {
    setTotalPrice(
      data?.reduce(
        (previousItem, currentItem) => previousItem + currentItem.totalPrice,
        0
      ) || 0
    );
  }, [data]);

  const handleCreateOrderClick = async () => {
    const orderId = await createOrder();
    navigate("/payment/", { state: { orderId: orderId } });
  };

  return (
    <div className="container mx-auto mt-5 flex flex-row justify-center">
      <div className="w-[680px]">
        <Typography variant="h4">Cart</Typography>
        <div className="mt-10 flex flex-col">
          {data?.map((item) => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <Card className="w-[300px] h-[200px] ml-10 flex flex-col justify-between p-5">
        <Typography variant="h4">Summary</Typography>
        <Typography className="mt-5" variant="h5">
          Total: ${totalPrice.toFixed(2)}
        </Typography>
        <Button
          className="mt-5 bg-light-green-500 text-white rounded-lg h-12"
          onClick={handleCreateOrderClick}
        >
          Create Order
        </Button>
      </Card>
    </div>
  );
}

export default Cart;
