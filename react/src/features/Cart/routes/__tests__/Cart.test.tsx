import { renderWithRouteAuthenticated } from "../../../../test/utils";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { CartItemMock, carts } from "../../../../test/server/db/cart";
import { customer } from "../../../../test/server/db/credential";
import { formatCurrency } from "../../../../utils/currency";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/utils";

const getUpdatedItemsQuantity = (
  itemList: CartItemMock[],
  item: CartItemMock,
  newQuantity: number
) => {
  return itemList.map((_item) => {
    const updatedItem = { ..._item };
    if (updatedItem.id === item.id) {
      updatedItem.quantity = newQuantity;
    }
    return updatedItem;
  });
};

const getTotalPriceFromItems = (itemsList: CartItemMock[]) => {
  return itemsList.reduce((previousValue, item) => {
    return previousValue + item.product.unit_price * item.quantity;
  }, 0);
};

const expectNewQuantityIsReflected = async (
  item: CartItemMock,
  newQuantity: number,
  newTotalPrice: number
) => {
  expect(screen.getByTestId("qty-" + item.id).textContent).toEqual(
    newQuantity.toString()
  );
  await screen.findAllByText(
    new RegExp("\\" + formatCurrency(newQuantity * item.product.unit_price))
  );
  await screen.findAllByText(new RegExp("\\" + formatCurrency(newTotalPrice)));
};

describe("Cart", () => {
  it("should show the correct cart items", async () => {
    await renderWithRouteAuthenticated("/cart/");

    const correctCart = carts.filter(
      (cart) => cart.customer === customer.id
    )[0];
    const wrongCart = carts.filter((cart) => cart.customer !== customer.id)[0];

    expect(
      await screen.findByText(correctCart.items[0].product.title)
    ).toBeDefined();

    expect(
      screen.getByText(
        new RegExp(
          "\\" +
            formatCurrency(
              correctCart.items.reduce((prev, item) => {
                return prev + item.total_price;
              }, 0)
            )
        )
      )
    ).toBeDefined();

    for (const item of correctCart.items) {
      expect(screen.getByText(item.product.title)).toBeDefined();
      expect(screen.getByText(formatCurrency(item.total_price))).toBeDefined();
    }

    for (const item of wrongCart.items) {
      expect(screen.queryByText(item.product.title)).toBeNull();
    }
  });

  it("should update when clicking decrease qty button", async () => {
    await renderWithRouteAuthenticated("/cart/");
    const cart = carts.filter((cart) => cart.customer === customer.id)[0];
    await screen.findByText(cart.items[0].product.title);

    let currentItems = cart.items;
    for (const item of cart.items) {
      const newQuantity = item.quantity - 1;

      await userEvent.click(
        screen.getByAltText(
          "Button to decrease quantity for " + item.product.title
        )
      );

      await wait(100);

      currentItems = getUpdatedItemsQuantity(currentItems, item, newQuantity);
      await expectNewQuantityIsReflected(
        item,
        newQuantity,
        getTotalPriceFromItems(currentItems)
      );
    }
  });

  it("should update when clicking increase qty button", async () => {
    await renderWithRouteAuthenticated("/cart/");
    const cart = carts.filter((cart) => cart.customer === customer.id)[0];
    await screen.findByText(cart.items[0].product.title);

    let currentItems = cart.items;
    for (const item of cart.items) {
      const newQuantity = item.quantity + 1;

      await userEvent.click(
        screen.getByAltText(
          "Button to increase quantity for " + item.product.title
        )
      );

      await wait(100);

      currentItems = getUpdatedItemsQuantity(currentItems, item, newQuantity);
      await expectNewQuantityIsReflected(
        item,
        newQuantity,
        getTotalPriceFromItems(currentItems)
      );
    }
  });

  it("should delete cart item", async () => {
    await renderWithRouteAuthenticated("/cart/");
    const cart = carts.filter((cart) => cart.customer === customer.id)[0];
    await screen.findByText(cart.items[0].product.title);

    let currentItems = [...cart.items];
    for (const item of cart.items) {
      await userEvent.click(
        screen.getByAltText("Button to delete item " + item.product.title)
      );

      await waitForElementToBeRemoved(screen.queryByText(item.product.title));

      currentItems = currentItems.filter((_item) => _item !== item);
      const currentTotalPrice = currentItems.reduce((previousValue, item) => {
        return previousValue + item.total_price;
      }, 0);

      await screen.findAllByText(
        new RegExp("\\" + formatCurrency(currentTotalPrice))
      );
    }
  });
});
