import { renderWithRoute } from "../../../test/utils";
import { screen } from "@testing-library/react";
import { categories } from "../../../test/server/db/categories";

describe("Categories", () => {
  it("should show the correct categories", async () => {
    renderWithRoute("/");

    expect(await screen.findByText(categories[0].title)).toBeDefined();

    categories.forEach((category) => {
      expect(screen.getByText(category.title)).toBeDefined();
    });
  });
});
