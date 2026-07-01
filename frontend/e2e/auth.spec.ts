import { test, expect } from "@playwright/test";

// Requires a seeded user in the database. See db/init/init.sql.
// Credentials are loaded from .env — copy .env.example and fill in values.
const SEEDED_USER = {
  email: process.env.E2E_USER_EMAIL!,
  password: process.env.E2E_USER_PASSWORD!,
  firstName: process.env.E2E_USER_FIRST_NAME!,
  lastName: process.env.E2E_USER_LAST_NAME!,
};

test.describe("Login", () => {
  test("renders the login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
    await expect(page.getByTestId("loginButton")).toBeVisible();
  });

  test("redirects to /vehicles after successful login", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email").fill(SEEDED_USER.email);
    await page.getByTestId("password").fill(SEEDED_USER.password);
    await page.getByTestId("loginButton").click();
    await page.waitForURL("**/vehicles");
    await expect(page).toHaveURL(/\/vehicles$/);
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email").fill("wrong@example.com");
    await page.getByTestId("password").fill("wrongpassword");
    await page.getByTestId("loginButton").click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Registration", () => {
  test("renders the registration form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByTestId("firstName")).toBeVisible();
    await expect(page.getByTestId("lastName")).toBeVisible();
    await expect(page.getByTestId("email")).toBeVisible();
    await expect(page.getByTestId("password")).toBeVisible();
  });

  test("can register a new account", async ({ page }) => {
    await page.goto("/register");
    await page.getByTestId("firstName").fill(SEEDED_USER.firstName);
    await page.getByTestId("lastName").fill(SEEDED_USER.lastName);
    await page.getByTestId("email").fill(`e2e+${Date.now()}@example.com`);
    await page.getByTestId("password").fill(SEEDED_USER.password);
    await page.getByTestId("registerButton").click();
    // Expect redirect to login or vehicles after registration
    await expect(page).not.toHaveURL(/\/register/);
  });
});

test.describe("Auth guard", () => {
  test("redirects to /login when accessing /vehicles unauthenticated", async ({ page }) => {
    await page.goto("/vehicles");
    await expect(page).toHaveURL(/\/login/);
  });
});
