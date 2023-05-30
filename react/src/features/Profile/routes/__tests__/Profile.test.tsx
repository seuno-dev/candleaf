import {
  renderWithRoute,
  renderWithRouteAuthenticated,
} from "../../../../test/utils";
import { fireEvent, screen } from "@testing-library/react";
import { customer } from "../../../../test/server/db/credential";
import userEvent from "@testing-library/user-event";

const updateProfile = async (link: HTMLElement, newValue: string) => {
  await userEvent.click(link);
  await screen.findByTestId("profile-dialog-update");
  const updateField = screen.getByRole("textbox");
  await userEvent.clear(updateField);
  await userEvent.type(updateField, newValue);
  fireEvent.click(screen.getByRole("button", { name: "Update" }));
};

describe("Profile", () => {
  it("should show the correct info", async () => {
    renderWithRouteAuthenticated("/profile/");

    expect(await screen.findByText(customer.first_name)).toBeDefined();
    expect(await screen.getByText(customer.last_name)).toBeDefined();
    expect(await screen.getByText(customer.email)).toBeDefined();
    expect(await screen.getByText(customer.phone)).toBeDefined();
    expect(await screen.getByText(customer.address)).toBeDefined();
  });

  it("should update profile info", async () => {
    renderWithRouteAuthenticated("/profile/");

    await screen.findByText(customer.first_name);

    const updateLinks = screen.getAllByRole("link", { name: "Update" });

    // Test updating first name
    const newFirstName = "a";
    await updateProfile(updateLinks[0], newFirstName);
    expect(await screen.findByText(newFirstName)).toBeDefined();

    // Test updating last name
    const newLastName = "b";
    await updateProfile(updateLinks[1], newLastName);
    expect(await screen.findByText(newLastName)).toBeDefined();

    // Test updating email
    const newEmail = "c";
    await updateProfile(updateLinks[2], newEmail);
    expect(await screen.findByText(newEmail)).toBeDefined();

    // Test updating phone
    const newPhone = "d";
    await updateProfile(updateLinks[3], newPhone);
    expect(await screen.findByText(newPhone)).toBeDefined();

    // Test updating address
    const newAddress = "e";
    await updateProfile(updateLinks[4], newAddress);
    expect(await screen.findByText(newAddress)).toBeDefined();
  });

  it("should navigate to login page if authenticated", async () => {
    renderWithRoute("/profile/");

    expect(await screen.findByText("Login")).toBeDefined();
  });
});
