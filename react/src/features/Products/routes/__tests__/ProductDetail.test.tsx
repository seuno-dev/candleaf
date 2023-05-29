import { renderWithRoute } from "../../../../test/utils";
import { ProductMock, products } from "../../../../test/server/db/products";
import { screen } from "@testing-library/react";
import { formatCurrency } from "../../../../utils/currency";
import userEvent from "@testing-library/user-event";

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
});
