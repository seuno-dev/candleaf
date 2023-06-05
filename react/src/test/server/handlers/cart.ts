import { rest } from "msw";
import baseUrl from "../url";
import { errorResponse, getCustomer } from "../utils";
import { CartItemMock, carts } from "../db/cart";

export const cartHandlers = [
  rest.post(baseUrl("/store/cart-items/"), (req, res, context) => {
    return res(context.status(201));
  }),

  rest.get(baseUrl("/store/cart-items/"), (req, res, context) => {
    try {
      const customer = getCustomer(req);
      const filteredCart = carts.filter(
        (cart) => cart.customer === customer.id
      );

      let cartItems: CartItemMock[] = [];
      if (filteredCart.length !== 0) {
        cartItems = carts[0].items;
      }

      return res(context.status(200), context.json(cartItems));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
];
