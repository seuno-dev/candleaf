import { rest } from "msw";
import baseUrl from "../url";
import { errorResponse } from "../utils";
import {products, SimpleProductMock} from "../db/products";

interface CartItemMock {
  id: number;
  product: SimpleProductMock;
  quantity: number;
  total_price: number;
}

interface WriteCartItem {
  id: number;
  product_id: number;
  quantity: number;
}

const cartItemListUrl = baseUrl("/store/cart-items/");
const cartItemDetailUrl = baseUrl("/store/cart-items/:id/");

let id = 1;
let writeCartItems: WriteCartItem[] = [];

export const cartHandlers = [
  rest.post(cartItemListUrl, async (req, res, context) => {
    const reqItem: WriteCartItem = await req.json();

    let exist = false;
    writeCartItems = writeCartItems.map((dbItem) => {
      if (dbItem.product_id === reqItem.product_id) {
        exist = true;
        dbItem.quantity++;
      }
      return dbItem;
    });

    if (!exist) {
      writeCartItems.push({ ...reqItem, id: id++ });
    }

    return res(context.status(201));
  }),

  rest.get(cartItemListUrl, (req, res, context) => {
    try {
      const cartItems: CartItemMock[] = writeCartItems.map((writeCartItem) => {
        const product = products.find(
          (_product) => _product.id === writeCartItem.product_id
        );

        if (!product)
          return {
            id: writeCartItem.id,
            product: {
              id: products[0].id,
              title: products[0].title,
              unit_price: products[0].unit_price,
              inventory: products[0].inventory,
              image: products[0].images[0],
            },
            quantity: writeCartItem.quantity,
            total_price: writeCartItem.quantity * products[0].unit_price,
          };

        return {
          id: writeCartItem.id,
          product: {
            id: product.id,
            title: product.title,
            unit_price: product.unit_price,
            inventory: product.inventory,
            image: product.images[0],
          },
          quantity: writeCartItem.quantity,
          total_price: writeCartItem.quantity * product.unit_price,
        };
      });

      return res(context.status(200), context.json(cartItems));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),

  rest.patch(cartItemDetailUrl, async (req, res, context) => {
    try {
      const _id = parseInt(req.params.id as string);
      const _item = await req.json<WriteCartItem>();

      writeCartItems = writeCartItems.map((writeCartItem) => {
        if (writeCartItem.id === _id) {
          return { ...writeCartItem, ..._item };
        }

        return writeCartItem;
      });

      return res(context.status(200), context.json({ ..._item, _id }));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),

  rest.delete(cartItemDetailUrl, (req, res, context) => {
    try {
      const _id = parseInt(req.params.id as string);

      writeCartItems = writeCartItems.filter((writeCartItem) => {
        return writeCartItem.id !== _id;
      });

      return res(context.status(204));
    } catch (e) {
      return errorResponse(e, res, context);
    }
  }),
];
