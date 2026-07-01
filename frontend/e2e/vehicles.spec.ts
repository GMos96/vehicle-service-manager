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
});
