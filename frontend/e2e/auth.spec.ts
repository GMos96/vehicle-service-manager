import { test, expect, type Page } from "@playwright/test";

// Requires a seeded user in the database. See db/init/init.sql.
// Credentials are loaded from .env — copy .env.example and fill in values.
const SEEDED_USER = {
  email: process.env.E2E_USER_EMAIL!,
  password: process.env.E2E_USER_PASSWORD!,
  firstName: process.env.E2E_USER_FIRST_NAME!,
  lastName: process.env.E2E_USER_LAST_NAME!,
};

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

  test("shows a toast with the server's error message on failed login", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid email or password" }),
      }),
    );
    await page.goto("/login");
    await page.getByTestId("email").fill(SEEDED_USER.email);
    await page.getByTestId("password").fill(SEEDED_USER.password);
    await page.getByTestId("loginButton").click();

    await expectToast(page, "Login failed", "Invalid email or password");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows a network-error toast when the login request can't reach the server", async ({ page }) => {
    await page.route("**/api/auth/login", (route) => route.abort());
    await page.goto("/login");
    await page.getByTestId("email").fill(SEEDED_USER.email);
    await page.getByTestId("password").fill(SEEDED_USER.password);
    await page.getByTestId("loginButton").click();

    await expectToast(page, "Network error");
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

  test("shows a toast instead of field errors when registration fails for a non-validation reason", async ({ page }) => {
    await page.route("**/api/auth/register", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal server error" }),
      }),
    );
    await page.goto("/register");
    await page.getByTestId("firstName").fill(SEEDED_USER.firstName);
    await page.getByTestId("lastName").fill(SEEDED_USER.lastName);
    await page.getByTestId("email").fill(`e2e+${Date.now()}@example.com`);
    await page.getByTestId("password").fill(SEEDED_USER.password);
    await page.getByTestId("registerButton").click();

    await expectToast(page, "Internal server error");
    await expect(page).toHaveURL(/\/register/);
  });
});

test.describe("Auth guard", () => {
  test("redirects to /login when accessing /vehicles unauthenticated", async ({ page }) => {
    await page.goto("/vehicles");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Session expiration", () => {
  test("shows a warning toast and redirects to /login when a request comes back 401", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email").fill(SEEDED_USER.email);
    await page.getByTestId("password").fill(SEEDED_USER.password);
    await page.getByTestId("loginButton").click();
    await page.waitForURL("**/vehicles");

    await page.route("**/api/vehicles", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({ status: 401, contentType: "application/json", body: "{}" });
      }
      return route.continue();
    });
    await page.reload();

    await expectToast(page, "Session expired");
    await expect(page).toHaveURL(/\/login/);
  });
});
