import { fireEvent, screen } from "@testing-library/react";
import { renderWithRoute } from "../../../test/utils";
import userEvent from "@testing-library/user-event";
import { password, username } from "../../../test/server/db/auth";

describe("Login", () => {
  it("should allow login and navigate to homepage", async () => {
    renderWithRoute("/auth/login");

    await userEvent.type(screen.getByTestId("username-input"), username);
    await userEvent.type(screen.getByTestId("password-input"), password);
    fireEvent.click(screen.getByText("Login"));

    // Brand on navbar indicates we are on Homepage
    expect(await screen.findByTestId("navbar-brand")).toBeDefined();
  });
});
