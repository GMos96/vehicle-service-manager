import { test, expect, type Page } from "@playwright/test";

// Requires a seeded user in the database. See db/init/init.sql.
// Credentials are loaded from .env — copy .env.example and fill in values.
const SEEDED_USER = {
  email: process.env.E2E_USER_EMAIL!,
  password: process.env.E2E_USER_PASSWORD!,
};

async function login(page: Page) {
  await page.goto("/login");
  await page.getByTestId("email").fill(SEEDED_USER.email);
  await page.getByTestId("password").fill(SEEDED_USER.password);
  await page.getByTestId("loginButton").click();
  await page.waitForURL("**/vehicles");
}

async function goToFirstVehicle(page: Page) {
  const firstCard = page.locator("text=/\\d{4} /").first();
  await firstCard.click();
  await page.waitForURL(/\/vehicles\/\d+/);
}

// React's dev-mode double-invoke of effects can fire a failing request twice,
// producing two toasts with identical content. Scope to a toast containing
// all the expected text rather than assuming exactly one toast is present.
function expectToast(page: Page, ...text: string[]) {
  const toast = text.reduce(
    (locator, t) => locator.filter({ hasText: t }),
    page.getByTestId("toast"),
  );
  return expect(toast.first()).toBeVisible();
}

test.describe("Vehicles list", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows My Garage heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /my garage/i })).toBeVisible();
  });

  test("shows vehicle count subtitle", async ({ page }) => {
    await expect(page.getByText(/vehicles tracked/i)).toBeVisible();
  });

  test("Add Vehicle button is visible", async ({ page }) => {
    await expect(page.getByTestId("addVehicleButton")).toBeVisible();
  });

  test("Add Vehicle button opens a dialog with the form", async ({ page }) => {
    await page.getByTestId("addVehicleButton").click();
    await expect(page.getByTestId("year")).toBeVisible();
    await expect(page.getByTestId("make")).toBeVisible();
    await expect(page.getByTestId("model")).toBeVisible();
  });

  test("can add a new vehicle and it appears in the list", async ({ page }) => {
    const uniqueMake = `TestMake${Date.now()}`;
    await page.getByTestId("addVehicleButton").click();
    await page.getByTestId("year").fill("2022");
    await page.getByTestId("make").fill(uniqueMake);
    await page.getByTestId("model").fill("TestModel");
    await page.getByTestId("trim").fill("Base");
    await page.getByTestId("mileage").fill("15000");
    await page.getByTestId("addVehicleSubmitButton").click();
    await expect(page.getByText(`2022 ${uniqueMake} TestModel Base`)).toBeVisible({
      timeout: 5000,
    });
    await expectToast(page, "Vehicle created");
  });

  test("shows a toast instead of field errors when adding a vehicle fails for a non-validation reason", async ({ page }) => {
    await page.route("**/api/vehicles", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Internal server error" }),
        });
      }
      return route.continue();
    });
    await page.getByTestId("addVehicleButton").click();
    await page.getByTestId("year").fill("2022");
    await page.getByTestId("make").fill("TestMake");
    await page.getByTestId("model").fill("TestModel");
    await page.getByTestId("trim").fill("Base");
    await page.getByTestId("mileage").fill("15000");
    await page.getByTestId("addVehicleSubmitButton").click();

    await expectToast(page, "Internal server error");
    await expect(page.getByTestId("addVehicleSubmitButton")).toBeVisible();
  });

  test("shows a toast when the vehicle list fails to load", async ({ page }) => {
    await page.route("**/api/vehicles", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Could not load vehicles" }),
        });
      }
      return route.continue();
    });
    await page.reload();

    await expectToast(page, "Could not load vehicles");
    await expect(page.getByRole("heading", { name: /my garage/i })).toBeVisible();
  });
});

test.describe("Vehicle detail page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("clicking a vehicle card navigates to the detail page", async ({ page }) => {
    await goToFirstVehicle(page);
    await expect(page).toHaveURL(/\/vehicles\/\d+/);
  });

  test("shows a toast when the vehicle fails to load", async ({ page }) => {
    await page.route("**/api/vehicles/*", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Could not load vehicle" }),
        });
      }
      return route.continue();
    });
    await goToFirstVehicle(page);

    await expectToast(page, "Could not load vehicle");
  });

  test("shows a toast when saving an edit fails", async ({ page }) => {
    await goToFirstVehicle(page);

    await page.route("**/api/vehicles/*", (route) => {
      if (route.request().method() === "PUT") {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Could not save changes" }),
        });
      }
      return route.continue();
    });
    await page.getByTestId("editableInputEditButton").first().click();
    await page.getByTestId("editableInputSubmitButton").first().click();

    await expectToast(page, "Could not save changes");
  });
});

test.describe("Add Service Log", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows a toast when service log types fail to load", async ({ page }) => {
    await page.route("**/api/service-logs/types", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Could not load service types" }),
      }),
    );
    await goToFirstVehicle(page);
    await page.getByTestId("addServiceLogButton").click();

    await expectToast(page, "Could not load service types");
  });

  test("shows a toast when adding a service log fails", async ({ page }) => {
    await goToFirstVehicle(page);
    await page.route("**/api/service-logs", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Server error" }),
        });
      }
      return route.continue();
    });

    await page.getByTestId("addServiceLogButton").click();
    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option").first().click();
    await page.getByTestId("serviceLogMileage").fill("50000");
    await page.getByTestId("description").fill("Oil change");
    await page.getByTestId("repairCost").fill("40");
    await page.getByTestId("addServiceLogSubmitButton").click();

    await expectToast(page, "Could not add service log");
  });

  test("shows a success toast when a service log is added", async ({ page }) => {
    await goToFirstVehicle(page);
    await page.getByTestId("addServiceLogButton").click();
    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option").first().click();
    await page.getByTestId("serviceLogMileage").fill("50000");
    await page.getByTestId("description").fill("Oil change");
    await page.getByTestId("repairCost").fill("40");
    await page.getByTestId("addServiceLogSubmitButton").click();

    await expectToast(page, "Service log added");
  });

  test("selecting a service type fills in a default description", async ({ page }) => {
    await goToFirstVehicle(page);
    await page.getByTestId("addServiceLogButton").click();
    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option", { name: "Tire Rotation", exact: true }).click();

    await expect(page.getByTestId("description")).toHaveValue("Tire Rotation");
  });

  test("switching service types updates the default description while it is untouched", async ({
    page,
  }) => {
    await goToFirstVehicle(page);
    await page.getByTestId("addServiceLogButton").click();
    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option", { name: "Oil Change", exact: true }).click();
    await expect(page.getByTestId("description")).toHaveValue("Oil Change");

    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option", { name: "Tire Rotation", exact: true }).click();

    await expect(page.getByTestId("description")).toHaveValue("Tire Rotation");
  });

  test("does not overwrite a manually edited description when the service type changes", async ({
    page,
  }) => {
    await goToFirstVehicle(page);
    await page.getByTestId("addServiceLogButton").click();
    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option", { name: "Oil Change", exact: true }).click();

    await page.getByTestId("description").fill("Custom notes about this service");

    await page.getByTestId("serviceType").getByRole("combobox").click();
    await page.getByRole("option", { name: "Tire Rotation", exact: true }).click();

    await expect(page.getByTestId("description")).toHaveValue(
      "Custom notes about this service",
    );
  });
});

function uniqueVin() {
  // Digits are always valid VIN characters, so appending a timestamp keeps
  // this both well-formed and unique across test runs.
  return `1HGCM8263${Date.now().toString().slice(-8)}`;
}

async function fillVehicleForm(
  page: Page,
  fields: { year: string; make: string; model: string; trim: string; mileage: string; vin?: string },
) {
  if (fields.vin) {
    await page.getByTestId("vin").fill(fields.vin);
  }
  await page.getByTestId("year").fill(fields.year);
  await page.getByTestId("make").fill(fields.make);
  await page.getByTestId("model").fill(fields.model);
  await page.getByTestId("trim").fill(fields.trim);
  await page.getByTestId("mileage").fill(fields.mileage);
}

test.describe("VIN decode", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("Add Vehicle form shows an optional VIN field with a Decode button", async ({ page }) => {
    await page.getByTestId("addVehicleButton").click();
    await expect(page.getByTestId("vin")).toBeVisible();
    await expect(page.getByTestId("decodeVinButton")).toBeVisible();
  });

  test("shows an error toast for a malformed VIN without calling the server", async ({ page }) => {
    let decodeCalled = false;
    await page.route("**/api/vehicles/vin-decode*", (route) => {
      decodeCalled = true;
      return route.continue();
    });
    await page.getByTestId("addVehicleButton").click();
    await page.getByTestId("vin").fill("SHORTVIN");
    await page.getByTestId("decodeVinButton").click();

    await expectToast(page, "Enter a valid 17-character VIN");
    expect(decodeCalled).toBe(false);
  });

  test("decoding a VIN pre-fills year, make, model, and trim", async ({ page }) => {
    await page.route("**/api/vehicles/vin-decode*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ year: 2003, make: "Honda", model: "Accord", trim: "EX" }),
      }),
    );
    await page.getByTestId("addVehicleButton").click();
    await page.getByTestId("vin").fill(uniqueVin());
    await page.getByTestId("decodeVinButton").click();

    await expect(page.getByTestId("year")).toHaveValue("2003");
    await expect(page.getByTestId("make")).toHaveValue("Honda");
    await expect(page.getByTestId("model")).toHaveValue("Accord");
    await expect(page.getByTestId("trim")).toHaveValue("EX");
    await expectToast(page, "VIN decoded");
  });

  test("does not overwrite a field the user already filled in with a blank decode result", async ({
    page,
  }) => {
    await page.route("**/api/vehicles/vin-decode*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ make: "Honda" }),
      }),
    );
    await page.getByTestId("addVehicleButton").click();
    await page.getByTestId("year").fill("1999");
    await page.getByTestId("vin").fill(uniqueVin());
    await page.getByTestId("decodeVinButton").click();

    await expect(page.getByTestId("make")).toHaveValue("Honda");
    await expect(page.getByTestId("year")).toHaveValue("1999");
  });

  test("shows an error toast and keeps the form usable when the decode service is unavailable", async ({
    page,
  }) => {
    await page.route("**/api/vehicles/vin-decode*", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "VIN decode service is temporarily unavailable" }),
      }),
    );
    await page.getByTestId("addVehicleButton").click();
    await page.getByTestId("vin").fill(uniqueVin());
    await page.getByTestId("decodeVinButton").click();

    await expectToast(page, "VIN decode service is temporarily unavailable");
    await expect(page.getByTestId("addVehicleSubmitButton")).toBeEnabled();
  });

  test("can add a vehicle with a VIN, and the VIN is optional", async ({ page }) => {
    const uniqueMake = `VinMake${Date.now()}`;
    await page.getByTestId("addVehicleButton").click();
    await fillVehicleForm(page, {
      vin: uniqueVin(),
      year: "2005",
      make: uniqueMake,
      model: "TestModel",
      trim: "Base",
      mileage: "60000",
    });
    await page.getByTestId("addVehicleSubmitButton").click();

    await expect(page.getByText(`2005 ${uniqueMake} TestModel Base`)).toBeVisible({
      timeout: 5000,
    });
    await expectToast(page, "Vehicle created");
  });

  test("rejects a duplicate VIN for the same user with a field-level error", async ({ page }) => {
    const vin = uniqueVin();

    await page.getByTestId("addVehicleButton").click();
    await fillVehicleForm(page, {
      vin,
      year: "2005",
      make: `DupMakeA${Date.now()}`,
      model: "TestModel",
      trim: "Base",
      mileage: "60000",
    });
    await page.getByTestId("addVehicleSubmitButton").click();
    await expectToast(page, "Vehicle created");

    await page.getByTestId("addVehicleButton").click();
    await fillVehicleForm(page, {
      vin,
      year: "2005",
      make: `DupMakeB${Date.now()}`,
      model: "TestModel",
      trim: "Base",
      mileage: "60000",
    });
    await page.getByTestId("addVehicleSubmitButton").click();

    await expect(page.getByText("You already have a vehicle with this VIN")).toBeVisible();
    // The dialog stays open on a field-level error, unlike the toast-only 500 case.
    await expect(page.getByTestId("addVehicleSubmitButton")).toBeVisible();
  });

  test("rejects a malformed VIN on submit with a field-level error", async ({ page }) => {
    await page.getByTestId("addVehicleButton").click();
    await fillVehicleForm(page, {
      year: "2005",
      make: "TestMake",
      model: "TestModel",
      trim: "Base",
      mileage: "60000",
    });
    // Bypass the client-side decode check to exercise server-side DTO validation.
    await page.getByTestId("vin").fill("SHORTVIN");
    await page.getByTestId("addVehicleSubmitButton").click();

    await expect(page.getByText(/VIN must be exactly 17 characters/)).toBeVisible();
  });
});

test.describe("Recalls", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows recall rows when the API returns recalls", async ({ page }) => {
    await page.route("**/api/vehicles/*/recalls", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            campaignNumber: "23V123000",
            component: "AIRBAGS",
            summary: "Test recall summary",
            reportReceivedDate: "2023/01/05",
          },
        ]),
      }),
    );
    await goToFirstVehicle(page);

    await expect(page.getByRole("heading", { name: "Recalls" })).toBeVisible();
    await expect(page.getByText("AIRBAGS")).toBeVisible();
    await expect(page.getByText("Test recall summary")).toBeVisible();
  });

  test("shows an empty state when there are no recalls", async ({ page }) => {
    await page.route("**/api/vehicles/*/recalls", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      }),
    );
    await goToFirstVehicle(page);

    await expect(page.getByText("No open recalls found for this vehicle.")).toBeVisible();
  });

  test("shows a persistent message and a toast when the recall service is unavailable", async ({
    page,
  }) => {
    await page.route("**/api/vehicles/*/recalls", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Recall service is temporarily unavailable" }),
      }),
    );
    await goToFirstVehicle(page);

    await expect(page.getByText("Unable to check recalls right now.")).toBeVisible();
    await expectToast(page, "Recall service is temporarily unavailable");
  });
});
