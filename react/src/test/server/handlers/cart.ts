import { rest } from "msw";
import baseUrl from "../url";
import { errorResponse, getCustomer } from "../utils";
import { CartItemMock, carts } from "../db/cart";

interface WriteCartItem {
  id: number;
  product_id: number;
  quantity: number;
}

const cartItemUrl = baseUrl("/store/cart-items/");

export const cartHandlers = [
  rest.post(cartItemUrl, (req, res, context) => {
    return res(context.status(201));
  }),

  rest.get(cartItemUrl, (req, res, context) => {
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

  rest.patch(cartItemUrl + ":id/", async (req, res, context) => {
    try {
      const customer = getCustomer(req);
      const id = parseInt(req.params.id as string);

      const newItem = await req.json<WriteCartItem>();

      const filteredCarts = carts.filter((cart) => {
        if (cart.customer !== customer.id) return false;

        const items = cart.items.filter((item) => item.id === id);
        return items.length !== 0;
      });

      if (filteredCarts.length === 0) {
        throw new NotFoundError();
      }

      return res(context.status(200), context.json({ ...newItem, id }));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
];
