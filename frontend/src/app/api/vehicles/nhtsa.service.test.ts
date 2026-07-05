import { describe, it, expect, vi, beforeEach } from "vitest";
import { decodeVin, NhtsaUnavailableError } from "./nhtsa.service";
import incompleteVinFixture from "./__fixtures__/nhtsa-decode-vin.json";

function mockFetch(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("decodeVin", () => {
  it("decodes make, model, year, and trim from the variable-list response", async () => {
    const fixture = {
      Results: [
        { Variable: "Error Code", Value: "0" },
        { Variable: "Error Text", Value: "" },
        { Variable: "Make", Value: "TOYOTA" },
        { Variable: "Model", Value: "Camry" },
        { Variable: "Model Year", Value: "2019" },
        { Variable: "Trim", Value: "SE" },
      ],
    };
    mockFetch(fixture);

    const result = await decodeVin("4T1B11HK9KU000000");

    expect(result).toEqual({ year: 2019, make: "TOYOTA", model: "Camry", trim: "SE" });
  });

  it("includes a warning for an incomplete VIN (error code 6) and still returns partial data", async () => {
    mockFetch(incompleteVinFixture);

    const result = await decodeVin("5UXWX7C5*BA");

    expect(result.make).toBe("BMW");
    expect(result.model).toBe("X3");
    expect(result.year).toBe(2011);
    expect(result.trim).toBe("xDrive35i");
    expect(result.warning).toBe("6 - Incomplete VIN");
  });

  it("omits fields that are null or empty in the response", async () => {
    const fixture = {
      Results: [
        { Variable: "Error Code", Value: "0" },
        { Variable: "Error Text", Value: "" },
        { Variable: "Make", Value: "HONDA" },
        { Variable: "Model", Value: "Civic" },
        { Variable: "Model Year", Value: "2020" },
        { Variable: "Trim", Value: null },
      ],
    };
    mockFetch(fixture);

    const result = await decodeVin("2HGFC2F59LH000000");

    expect(result.trim).toBeUndefined();
    expect(result.warning).toBeUndefined();
  });

  it("throws NhtsaUnavailableError when the API returns a non-OK status", async () => {
    mockFetch({}, 503);

    await expect(decodeVin("1HGBH41JXMN109186")).rejects.toBeInstanceOf(NhtsaUnavailableError);
  });

  it("throws NhtsaUnavailableError when fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    await expect(decodeVin("1HGBH41JXMN109186")).rejects.toBeInstanceOf(NhtsaUnavailableError);
  });
});
