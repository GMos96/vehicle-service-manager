import { describe, expect, it } from "vitest";
import { computeVehicleAnalytics } from "@/app/vehicles/analytics";
import { ServiceLogType } from "@/types/service-logs";

describe("computeVehicleAnalytics", () => {
  it("returns zeros and nulls for no logs", () => {
    const result = computeVehicleAnalytics({ mileage: 50000 }, []);
    expect(result.totalSpend).toBe(0);
    expect(result.costPerMile).toBeNull();
    expect(result.trackedMiles).toBeNull();
    expect(result.byServiceType).toEqual([]);
    expect(result.byYear).toEqual([]);
  });

  it("aggregates a single log", () => {
    const result = computeVehicleAnalytics(
      { mileage: 50000 },
      [
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 60,
          serviceDate: "2026-03-01",
          mileage: 45000,
        },
      ],
    );
    expect(result.totalSpend).toBe(60);
    expect(result.byServiceType).toEqual([
      { serviceType: ServiceLogType.OIL_CHANGE, total: 60, count: 1 },
    ]);
    expect(result.byYear).toEqual([{ year: 2026, total: 60 }]);
    expect(result.trackedMiles).toBe(5000);
    expect(result.costPerMile).toBe(60 / 5000);
  });

  it("handles logs missing mileage by excluding them from the cost-per-mile denominator", () => {
    const result = computeVehicleAnalytics(
      { mileage: 50000 },
      [
        {
          serviceType: ServiceLogType.OTHER,
          repairCost: 100,
          serviceDate: "2026-01-01",
        },
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 40,
          serviceDate: "2026-02-01",
          mileage: 48000,
        },
      ],
    );
    expect(result.trackedMiles).toBe(2000);
    expect(result.costPerMile).toBe(140 / 2000);
  });

  it("returns null cost-per-mile when no logs have mileage", () => {
    const result = computeVehicleAnalytics(
      { mileage: 50000 },
      [
        {
          serviceType: ServiceLogType.OTHER,
          repairCost: 100,
          serviceDate: "2026-01-01",
        },
      ],
    );
    expect(result.costPerMile).toBeNull();
    expect(result.trackedMiles).toBeNull();
  });

  it("returns null cost-per-mile when the denominator is zero or negative", () => {
    const result = computeVehicleAnalytics(
      { mileage: 45000 },
      [
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 60,
          serviceDate: "2026-03-01",
          mileage: 45000,
        },
      ],
    );
    expect(result.costPerMile).toBeNull();
    expect(result.trackedMiles).toBeNull();
  });

  it("returns null cost-per-mile when vehicle mileage is undefined", () => {
    const result = computeVehicleAnalytics(
      {},
      [
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 60,
          serviceDate: "2026-03-01",
          mileage: 45000,
        },
      ],
    );
    expect(result.costPerMile).toBeNull();
  });

  it("buckets spend by year across multiple years", () => {
    const result = computeVehicleAnalytics(
      { mileage: 50000 },
      [
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 50,
          serviceDate: "2025-06-15",
        },
        {
          serviceType: ServiceLogType.TIRE_ROTATION,
          repairCost: 30,
          serviceDate: "2026-01-10",
        },
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 55,
          serviceDate: "2026-06-20",
        },
      ],
    );
    expect(result.byYear).toEqual([
      { year: 2025, total: 50 },
      { year: 2026, total: 85 },
    ]);
  });

  it("groups multiple logs of the same service type", () => {
    const result = computeVehicleAnalytics(
      { mileage: 50000 },
      [
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 50,
          serviceDate: "2026-01-01",
        },
        {
          serviceType: ServiceLogType.OIL_CHANGE,
          repairCost: 55,
          serviceDate: "2026-06-01",
        },
        {
          serviceType: ServiceLogType.TIRE_ROTATION,
          repairCost: 30,
          serviceDate: "2026-03-01",
        },
      ],
    );
    expect(result.byServiceType).toEqual([
      { serviceType: ServiceLogType.OIL_CHANGE, total: 105, count: 2 },
      { serviceType: ServiceLogType.TIRE_ROTATION, total: 30, count: 1 },
    ]);
  });
});
