import { renderWithRoute } from "../../../../test/utils";
import { ProductMock, products } from "../../../../test/server/db/products";
import { fireEvent, screen } from "@testing-library/react";
import { formatCurrency } from "../../../../utils/currency";
import userEvent from "@testing-library/user-event";
import { server } from "../../../../test/server";
import baseUrl from "../../../../test/server/url";
import { rest } from "msw";

const renderAndLoadProductPage = async (product: ProductMock) => {
  renderWithRoute(`/products/${product.slug}/`);
  await screen.findByText(product.title);
};
describe("ProductDetail", () => {
  it("should show the correct product info", async () => {
    const product = products[0];
    await renderAndLoadProductPage(product);

    expect(await screen.getByText(product.title)).toBeDefined();
    expect(
      await screen.getByText(formatCurrency(product.unit_price))
    ).toBeDefined();
    expect(
      await screen.getByText(
        `${product.average_rating.toPrecision(2)} (${
          product.review_count
        } ratings)`
      )
    ).toBeDefined();
    expect(screen.getByText(product.category.title)).toBeDefined();
    expect(screen.getByText(product.reviews[0].comment)).toBeDefined();
    expect(
      screen.getAllByRole("img", { name: `Image of product ${product.title}` })
    ).toBeDefined();
  });

  it("should navigate to product search after click on category link", async () => {
    const product = products[0];
    await renderAndLoadProductPage(product);

    const category = product.category;
    await userEvent.click(screen.getByRole("link", { name: category.title }));

    const correctProducts = products.filter((product) => {
      return product.category === category;
    });
    const wrongProducts = products.filter((product) => {
      return product.category !== category;
    });

    await screen.findByText(correctProducts[correctProducts.length - 1].title);

    for (const product of correctProducts) {
      expect(screen.getByText(product.title)).toBeDefined();
    }

    for (const product of wrongProducts) {
      expect(screen.queryByText(product.title)).toBeNull();
    }
  });

  it("should show success dialog when adding to cart", async () => {
    const product = products[0];
    await renderAndLoadProductPage(product);

    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(
      await screen.findByText("Added to cart successfully.")
    ).toBeDefined();
  });

  it("should show error dialog when failed adding to cart ", async () => {
    const product = products[0];

    server.use(
      rest.post(baseUrl("/store/cart-items/"), (req, res, context) => {
        return res(context.status(500));
      })
    );

    await renderAndLoadProductPage(product);

    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));

    expect(await screen.findByText("Failed adding to cart.")).toBeDefined();
  });

  it("should show out of stock if the inventory is 0", async () => {
    const product = products[0];

    server.use(
      rest.get(baseUrl("/store/products/:slug/"), (req, res, context) => {
        return res(
          context.status(200),
          context.json({ ...product, inventory: 0 })
        );
      })
    );

    await renderAndLoadProductPage(product);

    expect(await screen.getByText("Out of stock")).toBeDefined();
  });
});
