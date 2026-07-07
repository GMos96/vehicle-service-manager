import { describe, expect, it } from "vitest";
import dayjs from "dayjs";
import {
  computeMaintenanceItems,
  worstStatus,
  type MaintenanceItemDTO,
} from "@/app/vehicles/maintenance";
import { ServiceLogType } from "@/types/service-logs";

const TODAY = dayjs("2026-07-06");

function oil(overrides: Partial<Parameters<typeof computeMaintenanceItems>[1][0]> = {}) {
  return {
    serviceType: ServiceLogType.OIL_CHANGE,
    serviceDate: "2026-01-01",
    mileage: 40000,
    ...overrides,
  };
}

function tire(overrides: Partial<Parameters<typeof computeMaintenanceItems>[1][0]> = {}) {
  return {
    serviceType: ServiceLogType.TIRE_ROTATION,
    serviceDate: "2026-01-01",
    mileage: 40000,
    ...overrides,
  };
}

function combo(overrides: Partial<Parameters<typeof computeMaintenanceItems>[1][0]> = {}) {
  return {
    serviceType: ServiceLogType.OIL_CHANGE_ROTATION,
    serviceDate: "2026-01-01",
    mileage: 40000,
    ...overrides,
  };
}

describe("computeMaintenanceItems", () => {
  it("returns unknown status for both kinds when no vehicle mileage and no logs", () => {
    const items = computeMaintenanceItems({}, [], TODAY);
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect(item.status).toBe("unknown");
      expect(item.dueMileage).toBeUndefined();
      expect(item.dueDate).toBeUndefined();
    }
  });

  it("computes dueMileage from vehicle mileage when no logs (standard oil)", () => {
    const items = computeMaintenanceItems({ mileage: 50000 }, [], TODAY);
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    const tireItem = items.find((i) => i.kind === "tire_rotation")!;

    expect(oilItem.dueMileage).toBe(53000);
    expect(oilItem.dueDate).toBeUndefined();
    expect(tireItem.dueMileage).toBe(56000);
    expect(tireItem.dueDate).toBeUndefined();
  });

  it("uses 5000mi and 6mo interval for synthetic oil", () => {
    const items = computeMaintenanceItems(
      { mileage: 50000, oil: { type: "SYNTHETIC" } },
      [],
      TODAY,
    );
    expect(items.find((i) => i.kind === "oil_change")!.dueMileage).toBe(55000);
  });

  it("returns ok when current mileage is well below due mileage", () => {
    const items = computeMaintenanceItems(
      { mileage: 45000 },
      [oil({ mileage: 45000, serviceDate: "2026-06-01" })],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    expect(oilItem.dueMileage).toBe(48000);
    expect(oilItem.status).toBe("ok");
  });

  it("returns overdue when vehicle mileage >= dueMileage", () => {
    const items = computeMaintenanceItems(
      { mileage: 52000 },
      [oil({ mileage: 49000, serviceDate: "2026-05-01" })],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    expect(oilItem.dueMileage).toBe(52000);
    expect(oilItem.status).toBe("overdue");
  });

  it("returns overdue when dueDate has passed", () => {
    const items = computeMaintenanceItems(
      { mileage: 40500 },
      // Oil change 4 months ago; standard interval is 3 months → overdue by date
      [oil({ mileage: 40000, serviceDate: "2026-03-01" })],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    // dueDate = 2026-06-01 which is before today (2026-07-06) → overdue
    expect(oilItem.status).toBe("overdue");
  });

  it("returns due_soon within 500 miles", () => {
    const items = computeMaintenanceItems(
      { mileage: 52600 },
      // Due at 53000
      [oil({ mileage: 50000, serviceDate: "2026-06-01" })],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    expect(oilItem.status).toBe("due_soon");
  });

  it("returns due_soon within 30 days", () => {
    const items = computeMaintenanceItems(
      { mileage: 40100 },
      // Oil change 2 months and 15 days ago, standard interval is 3 months → 15 days left
      [oil({ mileage: 40000, serviceDate: "2026-04-20" })],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    expect(oilItem.status).toBe("due_soon");
  });

  it("OIL_CHANGE_ROTATION satisfies both oil and tire rotation", () => {
    const items = computeMaintenanceItems(
      { mileage: 46000 },
      [combo({ mileage: 40000, serviceDate: "2026-01-01" })],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    const tireItem = items.find((i) => i.kind === "tire_rotation")!;

    // Both should use the combo log as their baseline
    expect(oilItem.dueMileage).toBe(43000);
    expect(tireItem.dueMileage).toBe(46000);
    // tire is exactly at due mileage → overdue
    expect(tireItem.status).toBe("overdue");
    // oil is overdue too (46000 > 43000)
    expect(oilItem.status).toBe("overdue");
  });

  it("picks the most recent matching log when multiple exist", () => {
    const items = computeMaintenanceItems(
      { mileage: 53000 },
      [
        oil({ mileage: 40000, serviceDate: "2025-01-01" }),
        oil({ mileage: 50000, serviceDate: "2026-05-01" }),
      ],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    // Should anchor on the most recent log (50000 + 3000 = 53000)
    expect(oilItem.dueMileage).toBe(53000);
    expect(oilItem.status).toBe("overdue");
  });

  it("handles logs without mileage (skips mileage axis, keeps date axis)", () => {
    const items = computeMaintenanceItems(
      { mileage: 50000 },
      [{ serviceType: ServiceLogType.OIL_CHANGE, serviceDate: "2026-06-01" }],
      TODAY,
    );
    const oilItem = items.find((i) => i.kind === "oil_change")!;
    expect(oilItem.dueMileage).toBeUndefined();
    // date axis: 2026-06-01 + 3 months = 2026-09-01 → ok
    expect(oilItem.status).toBe("ok");
  });
});

describe("worstStatus", () => {
  it("returns overdue if any item is overdue", () => {
    const items: MaintenanceItemDTO[] = [
      { kind: "oil_change", status: "due_soon", label: "Oil" },
      { kind: "tire_rotation", status: "overdue", label: "Tire" },
    ];
    expect(worstStatus(items)).toBe("overdue");
  });

  it("returns due_soon when nothing is overdue", () => {
    const items: MaintenanceItemDTO[] = [
      { kind: "oil_change", status: "ok", label: "Oil" },
      { kind: "tire_rotation", status: "due_soon", label: "Tire" },
    ];
    expect(worstStatus(items)).toBe("due_soon");
  });

  it("returns ok when all are ok", () => {
    const items: MaintenanceItemDTO[] = [
      { kind: "oil_change", status: "ok", label: "Oil" },
      { kind: "tire_rotation", status: "ok", label: "Tire" },
    ];
    expect(worstStatus(items)).toBe("ok");
  });

  it("returns unknown for empty list", () => {
    expect(worstStatus([])).toBe("unknown");
  });
});
