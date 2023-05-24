import { createRouterWrapper } from "../../../test/utils";
import { act, render, screen } from "@testing-library/react";
import Navbar from "../Navbar";
import userEvent from "@testing-library/user-event";
import { categories } from "../../../test/server/db/categories";

describe("Categories", () => {
  it("should show the correct categories", async () => {
    render(<Navbar />, { wrapper: createRouterWrapper() });

    await act(async () => {
      await userEvent.click(screen.getByTestId("navbar-category"));
    });

    await screen.getByText(categories[0].title);

    categories.forEach((category) => {
      expect(screen.getByText(category.title)).toBeDefined();
    });
  });
});

// describe("Customer dropdown", () => {
//   it("should show customer's full name", async () => {
//     authenticate();
//     render(<Navbar />, { wrapper: createWrapper() });
//
//     expect(
//       await screen.findByText(`${customer.first_name} ${customer.last_name}`)
//     ).toBeDefined();
//
//     screen.debug();
//   });
// });
