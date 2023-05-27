import { renderWithRoute } from "../../../../test/utils";
import { fireEvent, screen } from "@testing-library/react";
import { products } from "../../../../test/server/db/products";
import { PAGE_SIZE } from "../../../../test/server/handlers/products";

describe("ProductSearch", () => {
  it("Show all pages of products", async () => {
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
});
