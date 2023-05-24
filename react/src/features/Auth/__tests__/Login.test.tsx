import { act, fireEvent, screen } from "@testing-library/react";
import { renderWithRoute } from "../../../test/utils";
import userEvent from "@testing-library/user-event";
import { password, username } from "../../../test/server/db/auth";

describe("Login", () => {
  it("should allow login and navigate to homepage", async () => {
    renderWithRoute("/auth/login");

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");
    const loginButton = screen.getByText("Login");

    await act(async () => {
      await userEvent.type(usernameInput, username);
      await userEvent.type(passwordInput, password);
      fireEvent.click(loginButton);
    });

    // Brand on navbar indicates we are on Homepage
    expect(await screen.findByTestId("navbar-brand")).toBeDefined();
  });
});
