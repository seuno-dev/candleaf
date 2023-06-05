import { renderWithRouteAuthenticated } from "../../../../test/utils";
import { screen } from "@testing-library/react";
import { carts } from "../../../../test/server/db/cart";
import { customer } from "../../../../test/server/db/credential";
import { formatCurrency } from "../../../../utils/currency";

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
          `\\` +
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
});
