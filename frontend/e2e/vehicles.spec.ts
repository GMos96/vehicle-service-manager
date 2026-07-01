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
  });
});

test.describe("Vehicle detail page", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("clicking a vehicle card navigates to the detail page", async ({ page }) => {
    const firstCard = page.locator("text=/\\d{4} /").first();
    await firstCard.click();
    await page.waitForURL(/\/vehicles\/\d+/);
    await expect(page).toHaveURL(/\/vehicles\/\d+/);
  });
});
