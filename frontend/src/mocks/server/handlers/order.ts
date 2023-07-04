import { rest } from "msw";
import baseUrl from "../url";
import { products, SimpleProductMock, SimpleReviewMock } from "../db/products";
import { writeCartItems } from "./cart";

let id = 1;
let itemId = 1;

interface OrderItemMock {
  id: number;
  order_id: number;
  product: SimpleProductMock;
  unit_price: number;
  quantity: number;
  total_price: number;
  review?: SimpleReviewMock;
}

interface OrderMock {
  id: number;
  items: OrderItemMock[];
  order_time: string;
  total_price: number;
  status: string;
}

const orders: OrderMock[] = [];

export const orderHandler = [
  rest.post(baseUrl("/store/orders/"), (req, res, context) => {
    if (writeCartItems.length === 0) {
      return res(context.status(400));
    }

    const orderId = id++;

    const orderItems: OrderItemMock[] = writeCartItems.map((cartItem) => {
      const product = products.find(
        (_product) => _product.id === cartItem.product_id
      );

      let simpleProduct: SimpleProductMock;
      if (!product) {
        simpleProduct = {
          id: products[0].id,
          title: products[0].title,
          unit_price: products[0].unit_price,
          inventory: products[0].inventory,
          image: products[0].images[0],
        };
      } else {
        simpleProduct = {
          id: product.id,
          title: product.title,
          unit_price: product.unit_price,
          inventory: product.inventory,
          image: product.images[0],
        };
      }

      return {
        id: itemId++,
        order_id: orderId,
        product: simpleProduct,
        unit_price: simpleProduct.unit_price,
        quantity: cartItem.quantity,
        total_price: cartItem.quantity * simpleProduct.unit_price,
      };
    });

    const order: OrderMock = {
      id: orderId,
      items: orderItems,
      order_time: "now",
      total_price: orderItems.reduce(
        (prev, item) => prev + item.total_price,
        0
      ),
      status: "a",
    };

    orders.push(order);

    return res(context.status(201), context.json({ order_id: orderId }));
  }),

  rest.get(baseUrl("/store/orders/"), (req, res, context) => {
    return res(
      context.status(200),
      context.json({ results: orders, total_pages: 1 })
    );
  }),

  rest.get(baseUrl("/store/orders/:id/"), (req, res, context) => {
    const _id = parseInt(req.params.id as string);
    const order = orders.find((order) => {
      return order.id === _id;
    });
    if (order) {
      return res(context.status(200), context.json(order));
    }

    return res(context.status(404));
  }),

  rest.get(baseUrl("/store/orders/create_payment/"), (req, res, context) => {
    return res(context.status(200), context.json({ client_secret: "a" }));
  }),
];
