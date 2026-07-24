import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import Provider from "@/app/provider";
import VehicleCard from "./vehicle-card";
import { VehicleDTO } from "@/app/vehicles/types";

function renderWithProvider(ui: ReactNode) {
  return render(ui, { wrapper: Provider });
}

const vehicle: VehicleDTO = {
  id: 1,
  year: 2020,
  make: "Honda",
  model: "Civic",
  trim: "EX",
  mileage: 45000,
  lastUpdatedDate: new Date(),
};

describe("VehicleCard", () => {
  it("is reachable by keyboard and activates onClick via Enter/Space", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<VehicleCard vehicle={vehicle} onClick={onClick} />);

    const card = screen.getByRole("button");
    await user.tab();
    expect(card).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("is not focusable or a button when there is no onClick", () => {
    renderWithProvider(<VehicleCard vehicle={vehicle} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
