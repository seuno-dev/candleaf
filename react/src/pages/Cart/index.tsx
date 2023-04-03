import React from "react";
import { Button, Card, Typography } from "@material-tailwind/react";
import { useCart } from "./hooks";
import CartItem from "./CartItem";

function Cart() {
  const {
    setCartItemList,
    cartItemList,
    updateItemQuantity,
    deleteItem,
    totalPrice,
    createOrder,
  } = useCart();

  const handleCreateOrderClick = async () => {
    window.location.href = await createOrder();
  };

  return (
    <div>
      <div className="mt-5 flex flex-row justify-center">
        <div className="w-[680px]">
          <Typography variant="h4">Cart</Typography>
          <div className="mt-10 flex flex-col">
            {cartItemList.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                updateItemQuantity={updateItemQuantity}
                setCartItemList={setCartItemList}
                cartItemList={cartItemList}
                deleteItem={deleteItem}
              />
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
    </div>
  );
}

export default Cart;
