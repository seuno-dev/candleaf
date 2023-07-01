import {
  authenticate,
  createRouterWrapper,
  renderWithRouteAuthenticated,
} from "../../../test/utils";
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";
import userEvent from "@testing-library/user-event";
import { customer } from "../../../test/server/db/credential";
import React from "react";

describe("Customer dropdown", () => {
  it("should show customer's full name", async () => {
    authenticate();
    render(<Navbar />, { wrapper: createRouterWrapper() });

    expect(
      await screen.findByText(`${customer.first_name} ${customer.last_name}`)
    ).toBeDefined();

    expect(screen.queryByText("Login")).toBeNull();
  });

  it("should show login button if not authenticated", async () => {
    render(<Navbar />, { wrapper: createRouterWrapper() });

    expect(await screen.findByText("Login")).toBeDefined();
  });

  it("should navigate to login page after logging out", async () => {
    renderWithRouteAuthenticated();

    await userEvent.click(
      await screen.findByText(`${customer.first_name} ${customer.last_name}`)
    );
    await userEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("username-input")).toBeDefined();
  });
});
