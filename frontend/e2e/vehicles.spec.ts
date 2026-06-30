import { test, expect, type Page } from "@playwright/test";

// Requires a seeded user in the database. See db/init/init.sql.
// Credentials are loaded from .env — copy .env.example and fill in values.
const SEEDED_USER = {
  email: process.env.E2E_USER_EMAIL!,
  password: process.env.E2E_USER_PASSWORD!,
};

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(SEEDED_USER.email);
  await page.getByLabel(/password/i).fill(SEEDED_USER.password);
  await page.getByRole("button", { name: /log in/i }).click();
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
    await expect(page.getByRole("button", { name: /add vehicle/i })).toBeVisible();
  });

  test("Add Vehicle button opens a dialog with the form", async ({ page }) => {
    await page.getByRole("button", { name: /add vehicle/i }).click();
    await expect(page.getByLabel(/year/i)).toBeVisible();
    await expect(page.getByLabel(/make/i)).toBeVisible();
    await expect(page.getByLabel(/model/i)).toBeVisible();
  });

  test("can add a new vehicle and it appears in the list", async ({ page }) => {
    const uniqueMake = `TestMake${Date.now()}`;
    await page.getByRole("button", { name: /add vehicle/i }).click();
    await page.getByLabel(/year/i).fill("2022");
    await page.getByLabel(/make/i).fill(uniqueMake);
    await page.getByLabel(/model/i).fill("TestModel");
    await page.getByLabel(/trim/i).fill("Base");
    await page.getByLabel(/mileage/i).fill("15000");
    await page.getByRole("button", { name: /add vehicle/i }).last().click();
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
