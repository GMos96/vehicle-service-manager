import { describe, it, expect } from "vitest";
import {
  getVehicleDisplayName,
  calculateNextRecommendedServiceMileage,
} from "./util";
import type { VehicleDTO } from "./types";

function makeVehicle(overrides: Partial<VehicleDTO> = {}): VehicleDTO {
  return {
    id: 1,
    year: 2020,
    make: "Toyota",
    model: "Camry",
    trim: "XSE",
    mileage: 50000,
    nextRecommendedServiceMileage: 0,
    ...overrides,
  } as VehicleDTO;
}

describe("getVehicleDisplayName", () => {
  it("returns year make model trim as a space-separated string", () => {
    expect(getVehicleDisplayName(makeVehicle())).toBe("2020 Toyota Camry XSE");
  });

  it("reflects the actual year, make, model, and trim values", () => {
    const vehicle = makeVehicle({ year: 2018, make: "Honda", model: "Civic", trim: "Sport" });
    expect(getVehicleDisplayName(vehicle)).toBe("2018 Honda Civic Sport");
  });
});

describe("calculateNextRecommendedServiceMileage", () => {
  it("adds 5000 miles when oil type is SYNTHETIC", () => {
    const vehicle = makeVehicle({ mileage: 30000, oil: { type: "SYNTHETIC" } as any });
    expect(calculateNextRecommendedServiceMileage(vehicle)).toBe(35000);
  });

  it("adds 3000 miles when oil type is STANDARD", () => {
    const vehicle = makeVehicle({ mileage: 30000, oil: { type: "STANDARD" } as any });
    expect(calculateNextRecommendedServiceMileage(vehicle)).toBe(33000);
  });

  it("adds 3000 miles when oil is undefined", () => {
    const vehicle = makeVehicle({ mileage: 30000, oil: undefined });
    expect(calculateNextRecommendedServiceMileage(vehicle)).toBe(33000);
  });

  it("adds 3000 miles when oil type is undefined", () => {
    const vehicle = makeVehicle({ mileage: 30000, oil: {} as any });
    expect(calculateNextRecommendedServiceMileage(vehicle)).toBe(33000);
  });
});
