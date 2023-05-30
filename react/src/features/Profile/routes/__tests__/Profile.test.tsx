import {renderWithRoute, renderWithRouteAuthenticated} from "../../../../test/utils";
import { screen } from "@testing-library/react";
import { customer } from "../../../../test/server/db/credential";

describe("Profile", () => {
  it("should show the correct info", async () => {
    renderWithRouteAuthenticated("/profile/");

    expect(await screen.findByText(customer.first_name));
    expect(await screen.getByText(customer.last_name));
    expect(await screen.getByText(customer.email));
    expect(await screen.getByText(customer.phone));
    expect(await screen.getByText(customer.address));
  });
});
