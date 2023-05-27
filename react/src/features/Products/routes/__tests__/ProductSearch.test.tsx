import { renderWithRoute } from "../../../../test/utils";
import { fireEvent, screen } from "@testing-library/react";
import { products } from "../../../../test/server/db/products";
import { PAGE_SIZE } from "../../../../test/server/handlers/products";
import { categories } from "../../../../test/server/db/categories";
import userEvent from "@testing-library/user-event";

describe("ProductSearch", () => {
  it("should show all pages of products", async () => {
    renderWithRoute("/products");

    await screen.findByText(products[0].title);

    const totalPages = Math.ceil(products.length / PAGE_SIZE);
    for (let page = 1; page <= totalPages; page++) {
      let productPage = products.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      );

      await screen.findByText(productPage[0].title);

      for (const product of productPage) {
        expect(screen.getByText(product.title)).toBeDefined();
      }

      fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    }
  });

  it("should only show based on a category", async () => {
    renderWithRoute("/products");

    const category = categories[0];

    await screen.findByText(category.title);

    await userEvent.click(
      await screen.getByRole("button", { name: category.title })
    );

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
