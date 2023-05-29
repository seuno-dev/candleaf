import { renderWithRoute } from "../../../../test/utils";
import { fireEvent, screen } from "@testing-library/react";
import { products } from "../../../../test/server/db/products";
import { PAGE_SIZE } from "../../../../test/server/handlers/products";
import { categories } from "../../../../test/server/db/categories";
import userEvent from "@testing-library/user-event";
import { formatCurrency } from "../../../../utils/currency";

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

  it("should filter by minimum and maximum price", async () => {
    renderWithRoute("/products");

    // Expect products with price between $20 and $30.
    const correctProducts = products.filter((product) => {
      const price = product.unit_price;
      return price >= 20 && price <= 30;
    });
    const wrongProducts = products.filter((product) => {
      const price = product.unit_price;
      return !(price >= 20 && price <= 30);
    });

    fireEvent.change(screen.getByPlaceholderText("Minimum price"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByPlaceholderText("Maximum price"), {
      target: { value: "30" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    await screen.findByText(correctProducts[correctProducts.length - 1].title);

    for (const product of correctProducts) {
      expect(screen.getByText(product.title)).toBeDefined();
    }

    for (const product of wrongProducts) {
      expect(screen.queryByText(product.title)).toBeNull();
    }
  });

  it("should navigate to product detail on click", async () => {
    renderWithRoute("/products");

    const product = products[0];

    await userEvent.click(
      await screen.findByRole("link", { name: new RegExp(product.title) })
    );

    await screen.findByText(product.description);

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
    expect(
      screen.getByText(product.category.title)
    ).toBeDefined();
    expect(screen.getByText(product.reviews[0].comment)).toBeDefined();
  });
});
