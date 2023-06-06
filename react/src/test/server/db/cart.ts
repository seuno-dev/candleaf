import { ProductMock, products, SimpleProductMock } from "./products";
import { faker } from "@faker-js/faker";

export interface CartItemMock {
  id: number;
  product: SimpleProductMock;
  quantity: number;
  total_price: number;
}

let cartItemId = 1;
const createCartItem = (
  cartId: number,
  product: ProductMock,
  quantity: number
): CartItemMock => {
  return {
    id: cartItemId++,
    product: {
      id: product.id,
      title: product.title,
      unit_price: product.unit_price,
      inventory: product.inventory,
      image: product.images[0],
    },
    quantity,
    total_price: product.unit_price * quantity,
  };
};

export const carts = [
  {
    customer: 1,
    items: [
      createCartItem(
        1,
        products[0],
        faker.number.int({ min: 2, max: products[0].inventory - 1 })
      ),
      createCartItem(
        1,
        products[1],
        faker.number.int({ min: 2, max: products[1].inventory - 1 })
      ),
    ],
  },
  {
    customer: 2,
    items: [
      createCartItem(
        2,
        products[2],
        faker.number.int({ min: 2, max: products[2].inventory - 1 })
      ),
      createCartItem(
        2,
        products[3],
        faker.number.int({ min: 2, max: products[3].inventory - 1 })
      ),
    ],
  },
];
