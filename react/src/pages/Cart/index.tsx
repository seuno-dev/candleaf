import React from "react";
import { Typography } from "@material-tailwind/react";
import { useCart } from "./hooks";
import MinusIcon from "../../assets/images/minus-circle.svg";
import PlusIcon from "../../assets/images/plus-circle.svg";
import MinusDisabledIcon from "../../assets/images/minus-circle-disabled.svg";
import PlusDisabledIcon from "../../assets/images/plus-circle-disabled.svg";

function Cart() {
  const { setCartItemList, cartItemList, updateItemQuantity } = useCart();
  return (
    <div>
      <div className="mt-5 flex flex-row justify-center">
        <div className="w-[680px]">
          <Typography variant="h4">Cart</Typography>
          <div className="mt-10 flex flex-col">
            {cartItemList.map((item) => (
              <div key={item.id} className="flex flex-col mb-5">
                <Typography
                  className="w-[600px] line-clamp-1 break-words"
                  variant="h6"
                >
                  {item.product.title}
                </Typography>
                <div className="flex flex-row w-full justify-between">
                  <Typography variant="paragraph">
                    ${item.product.unit_price}
                  </Typography>
                  <div className="w-20 flex flex-row justify-between">
                    {item.quantity > 1 ? (
                      <img
                        src={MinusIcon}
                        className="cursor-pointer"
                        alt="Button to decrease quantity"
                        onClick={() => {
                          updateItemQuantity(item.id, item.quantity - 1);
                          setCartItemList(cartItemList.map(mapItem => {
                            if (mapItem.id == item.id) {
                              mapItem.quantity -= 1;
                            }
                            return mapItem;
                          }));
                        }}
                      />
                    ) : (
                      <img
                        src={MinusDisabledIcon}
                        className="cursor-pointer"
                        alt="Disabled button to decrease quantity"
                      />
                    )}
                    <Typography variant="paragraph">{item.quantity}</Typography>
                    {item.quantity == item.product.inventory ? (
                      <img
                        src={PlusDisabledIcon}
                        className="cursor-pointer"
                        alt="Disabled button to increase quantity"
                      />
                    ) : (
                      <img
                        src={PlusIcon}
                        className="cursor-pointer"
                        alt="Button to increase quantity"
                        onClick={() => {
                          updateItemQuantity(item.id, item.quantity + 1);
                          setCartItemList(cartItemList.map(mapItem => {
                            if (mapItem.id == item.id) {
                              mapItem.quantity += 1;
                            }
                            return mapItem;
                          }));
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[350px]"></div>
      </div>
    </div>
  );
}

export default Cart;
