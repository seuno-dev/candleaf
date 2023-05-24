import { fireEvent, screen } from "@testing-library/react";
import { renderWithRoute } from "../../../test/utils";
import userEvent from "@testing-library/user-event";
import { password, username } from "../../../test/server/db/auth";

const renderLogin = () => renderWithRoute("/auth/login");

describe("Login", () => {
  it("should allow login and navigate to homepage", async () => {
    renderLogin();

    await userEvent.type(screen.getByTestId("username-input"), username);
    await userEvent.type(screen.getByTestId("password-input"), password);
    fireEvent.click(screen.getByText("Login"));

    // Brand on navbar indicates we are on Homepage
    expect(await screen.findByTestId("navbar-brand")).toBeDefined();
  });

  it("should show error message for an invalid credential", async () => {
    renderLogin();

    await userEvent.type(screen.getByTestId("username-input"), username + "i");
    await userEvent.type(screen.getByTestId("password-input"), password + "i");
    fireEvent.click(screen.getByText("Login"));

    expect(
      await screen.findByText("Invalid username or password")
    ).toBeDefined();
  });
});
