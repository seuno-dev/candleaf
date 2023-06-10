import { rest } from "msw";
import baseUrl from "../url";
import { errorResponse, getCustomer } from "../utils";
import { CartItemMock, carts } from "../db/cart";
import { CustomerMock } from "../db/credential";

interface WriteCartItem {
  id: number;
  product_id: number;
  quantity: number;
}

const cartItemListUrl = baseUrl("/store/cart-items/");
const cartItemDetailUrl = baseUrl("/store/cart-items/:id/");

const getCartItemFromCustomer = (
  customer: CustomerMock,
  id: number
): CartItemMock => {
  const customerCarts = carts.filter((cart) => {
    return cart.customer === customer.id;
  });

  let selectedItem: CartItemMock | undefined;
  for (const cart of customerCarts) {
    const _item = cart.items.find((item) => item.id === id);
    if (_item) {
      selectedItem = _item;
      break;
    }
  }

  if (selectedItem) {
    return selectedItem;
  } else {
    throw new NotFoundError();
  }
};

export const cartHandlers = [
  rest.post(cartItemListUrl, (req, res, context) => {
    return res(context.status(201));
  }),

  rest.get(cartItemListUrl, (req, res, context) => {
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

  rest.patch(cartItemDetailUrl, async (req, res, context) => {
    try {
      const customer = getCustomer(req);
      const id = parseInt(req.params.id as string);
      getCartItemFromCustomer(customer, id);

      const newItem = await req.json<WriteCartItem>();

      return res(context.status(200), context.json({ ...newItem, id }));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),

  rest.delete(cartItemDetailUrl, (req, res, context) => {
    try {
      const customer = getCustomer(req);
      const id = parseInt(req.params.id as string);
      getCartItemFromCustomer(customer, id);

      return res(context.status(204));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
];
