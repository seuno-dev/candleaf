import { renderWithRouteAuthenticated } from "../../../../test/utils";
import { screen } from "@testing-library/react";
import { carts } from "../../../../test/server/db/cart";
import { customer } from "../../../../test/server/db/credential";
import { formatCurrency } from "../../../../utils/currency";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/utils";

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

    for (const item of cart.items) {
      await userEvent.click(
        screen.getByAltText(
          "Button to decrease quantity for " + item.product.title
        )
      );
      await wait(100);
      expect(screen.getByTestId("qty-" + item.id).textContent).toEqual(
        (item.quantity - 1).toString()
      );
    }
  });

  it("should update when clicking increase qty button", async () => {
    await renderWithRouteAuthenticated("/cart/");

    const cart = carts.filter((cart) => cart.customer === customer.id)[0];

    await screen.findByText(cart.items[0].product.title);

    for (const item of cart.items) {
      await userEvent.click(
        screen.getByAltText(
          "Button to increase quantity for " + item.product.title
        )
      );
      await wait(100);
      expect(screen.getByTestId("qty-" + item.id).textContent).toEqual(
        (item.quantity + 1).toString()
      );
    }
  });

});
