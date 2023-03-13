import React from "react";
import { Typography } from "@material-tailwind/react";
import { useCart } from "./hooks";
import CartItem from "./CartItem";

function Cart() {
  const {
    setCartItemList,
    cartItemList,
    updateItemQuantity,
    deleteItem,
    totalPrice,
  } = useCart();

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
        <div className="w-[350px] ml-20 mt-20">
          <Typography variant="h5">Total: ${totalPrice}</Typography>
        </div>
      </div>
    </div>
  );
}

export default Cart;
