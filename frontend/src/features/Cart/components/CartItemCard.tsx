import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import MinusIcon from "../../../assets/images/minus-circle.svg";
import MinusDisabledIcon from "../../../assets/images/minus-circle-disabled.svg";
import PlusDisabledIcon from "../../../assets/images/plus-circle-disabled.svg";
import PlusIcon from "../../../assets/images/plus-circle.svg";
import DeleteIcon from "../../../assets/images/delete.svg";
import { formatCurrency } from "../../../utils/currency";
import { CartItem } from "../types";
import useUpdateCartItem from "../hooks/useUpdateCartItem";
import useDeleteCartItem from "../hooks/useDeleteCartItem";

type CartItemProps = {
  item: CartItem;
};

function CartItemCard({ item }: CartItemProps) {
  const { mutate: update } = useUpdateCartItem();
  const { mutate: remove } = useDeleteCartItem();

  return (
    <Card className="flex flex-row mb-5 p-5">
      <img
        src={
          item.product.image.image == ""
            ? "logo512.png"
            : item.product.image.image
        }
        className="w-28 rounded-lg"
        alt={`Image of ${item.product.title}`}
      />
      <div className="flex flex-col w-full ml-5 justify-between">
        <Typography className="w-[400px] line-clamp-1 break-words" variant="h6">
          {item.product.title}
        </Typography>
        <Typography variant="paragraph">
          {formatCurrency(item.quantity * item.product.unitPrice)}
        </Typography>
        <div className="w-full flex flex-row justify-end">
          <div className="w-32 flex flex-row justify-between">
            {item.quantity > 1 ? (
              <img
                src={MinusIcon}
                className="cursor-pointer"
                alt={"Button to decrease quantity for " + item.product.title}
                onClick={() => update({ ...item, quantity: item.quantity - 1 })}
              />
            ) : (
              <img
                src={MinusDisabledIcon}
                className="cursor-pointer"
                alt={
                  "Disabled button to decrease quantity for " +
                  item.product.title
                }
              />
            )}
            <Typography variant="paragraph" data-testid={"qty-" + item.id}>
              {item.quantity}
            </Typography>
            {item.quantity == item.product.inventory ? (
              <img
                src={PlusDisabledIcon}
                className="cursor-pointer"
                alt={
                  "Disabled button to increase quantity for " +
                  item.product.title
                }
              />
            ) : (
              <img
                src={PlusIcon}
                className="cursor-pointer"
                alt={"Button to increase quantity for " + item.product.title}
                onClick={() => update({ ...item, quantity: item.quantity + 1 })}
              />
            )}
            <img
              src={DeleteIcon}
              className="cursor-pointer"
              alt={"Button to delete item " + item.product.title}
              onClick={() => remove(item)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartItemCard;
