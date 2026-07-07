import { describe, expect, it } from "vitest";
import { parseReceiptText } from "@/app/vehicles/receipt-parse";
import { ServiceLogType } from "@/types/service-logs";

// Representative multi-line receipt texts

const OIL_CHANGE_RECEIPT = `
Jiffy Lube
Date: 03/15/2026
Odometer: 48,250
Description: Full synthetic oil change 5W-30
Labor: $25.00
Parts: $34.99
Total: $59.99
Thank you for your business!
`;

const TIRE_ROTATION_RECEIPT = `
Discount Tire
Service Date 01/20/2026
Current Miles: 51000
Tire Rotation Service
Total Amount Due: $25.00
`;

const COMBO_RECEIPT = `
Midas
4/5/2026
Odometer: 47,500 mi
Oil Change & Tire Rotation
Synthetic oil, filter
Total $89.00
`;

const FUTURE_DATE_RECEIPT = `
Service Date: 12/01/2099
Oil change
Total: $49.99
`;

const ISO_DATE_RECEIPT = `
Date: 2026-06-01
Mileage 52000
Synthetic oil change
Total: $64.00
`;

const MONTH_NAME_RECEIPT = `
Service: Oil Change
Date: February 10, 2026
Odometer: 49000
Amount Due: $55.00
`;

describe("parseReceiptText", () => {
  it("parses a standard oil change receipt", () => {
    const result = parseReceiptText(OIL_CHANGE_RECEIPT);
    expect(result.serviceDate).toBe("2026-03-15");
    expect(result.mileage).toBe(48250);
    expect(result.repairCost).toBe(60);
    expect(result.serviceType).toBe(ServiceLogType.OIL_CHANGE);
  });

  it("parses a tire rotation receipt", () => {
    const result = parseReceiptText(TIRE_ROTATION_RECEIPT);
    expect(result.serviceDate).toBe("2026-01-20");
    expect(result.mileage).toBe(51000);
    expect(result.repairCost).toBe(25);
    expect(result.serviceType).toBe(ServiceLogType.TIRE_ROTATION);
  });

  it("parses a combo oil-change-and-rotation receipt", () => {
    const result = parseReceiptText(COMBO_RECEIPT);
    expect(result.serviceDate).toBe("2026-04-05");
    expect(result.mileage).toBe(47500);
    expect(result.repairCost).toBe(89);
    expect(result.serviceType).toBe(ServiceLogType.OIL_CHANGE_ROTATION);
  });

  it("rejects future dates", () => {
    const result = parseReceiptText(FUTURE_DATE_RECEIPT);
    expect(result.serviceDate).toBeUndefined();
    // cost and service type still parsed
    expect(result.repairCost).toBe(50);
    expect(result.serviceType).toBe(ServiceLogType.OIL_CHANGE);
  });

  it("parses ISO 8601 date format", () => {
    const result = parseReceiptText(ISO_DATE_RECEIPT);
    expect(result.serviceDate).toBe("2026-06-01");
    expect(result.mileage).toBe(52000);
    expect(result.serviceType).toBe(ServiceLogType.OIL_CHANGE);
  });

  it("parses month-name date format", () => {
    const result = parseReceiptText(MONTH_NAME_RECEIPT);
    expect(result.serviceDate).toBe("2026-02-10");
    expect(result.repairCost).toBe(55);
    expect(result.serviceType).toBe(ServiceLogType.OIL_CHANGE);
  });

  it("rounds cost to whole dollars", () => {
    const result = parseReceiptText("Total: $59.99\nOil change");
    expect(result.repairCost).toBe(60);
  });

  it("returns undefined for all fields when text is empty", () => {
    const result = parseReceiptText("");
    expect(result.serviceDate).toBeUndefined();
    expect(result.mileage).toBeUndefined();
    expect(result.repairCost).toBeUndefined();
    expect(result.serviceType).toBeUndefined();
  });

  it("returns undefined service type for unrecognized service", () => {
    const result = parseReceiptText("Detail & wash\nTotal: $20.00");
    expect(result.serviceType).toBeUndefined();
  });

  it("prefers total/amount-due over individual line items for cost", () => {
    const receipt = `
      Parts: $34.99
      Labor: $25.00
      Tax: $4.50
      Total: $64.49
      Oil change
    `;
    const result = parseReceiptText(receipt);
    expect(result.repairCost).toBe(64);
  });
});
