import { test, expect, type Page } from "@playwright/test";

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

// Fake shares API response that includes a REVOKED and ACCEPTED invitation
// alongside a PENDING one. The bug: the API returns all statuses, exposing
// revoked/accepted invite token URLs to the client.
const SHARES_WITH_MIXED_STATUSES = {
  shares: [],
  invitations: [
    {
      id: 1,
      vehicleId: 1,
      userId: 1,
      inviteeEmail: "pending@example.com",
      level: "READ",
      token: "pending-token-abc123",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      inviteUrl: "http://localhost:3000/invitations/pending-token-abc123",
    },
    {
      id: 2,
      vehicleId: 1,
      userId: 1,
      inviteeEmail: "accepted@example.com",
      level: "READ",
      token: "accepted-token-def456",
      status: "ACCEPTED",
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      inviteUrl: "http://localhost:3000/invitations/accepted-token-def456",
    },
    {
      id: 3,
      vehicleId: 1,
      userId: 1,
      inviteeEmail: "revoked@example.com",
      level: "WRITE",
      token: "revoked-token-ghi789",
      status: "REVOKED",
      expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      inviteUrl: "http://localhost:3000/invitations/revoked-token-ghi789",
    },
  ],
};

// Bug: GET /vehicles/:id/shares returns invitations of all statuses.
// The API should only return PENDING invitations — revoked and accepted ones
// expose stale invite token URLs to the client unnecessarily.
test.describe("Sharing: GET /shares token exposure bug", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("GET /shares response should not include REVOKED invitation tokens", async ({
    page,
  }) => {
    let sharesResponse: object | null = null;

    await page.route("**/api/vehicles/*/shares", async (route) => {
      if (route.request().method() === "GET") {
        // Let the real request through and capture its response body
        const response = await route.fetch();
        const body = await response.json();
        sharesResponse = body;
        await route.fulfill({ response });
      } else {
        await route.continue();
      }
    });

    await goToFirstVehicle(page);

    // Wait for the shares section to finish loading
    await page.waitForTimeout(1000);

    // The API response should not contain any REVOKED invitations
    // This test will FAIL until the bug is fixed (server-side status filter added)
    expect(sharesResponse).not.toBeNull();
    const invitations =
      ((sharesResponse as unknown) as { invitations?: Array<{ status: string }> })
        .invitations ?? [];
    const revokedInvitations = invitations.filter((inv) => inv.status === "REVOKED");
    expect(
      revokedInvitations,
      "GET /shares must not return REVOKED invitations — they expose stale token URLs to the client",
    ).toHaveLength(0);
  });

  test("GET /shares response should not include ACCEPTED invitation tokens", async ({
    page,
  }) => {
    let sharesResponse: object | null = null;

    await page.route("**/api/vehicles/*/shares", async (route) => {
      if (route.request().method() === "GET") {
        const response = await route.fetch();
        const body = await response.json();
        sharesResponse = body;
        await route.fulfill({ response });
      } else {
        await route.continue();
      }
    });

    await goToFirstVehicle(page);
    await page.waitForTimeout(1000);

    expect(sharesResponse).not.toBeNull();
    const invitations =
      ((sharesResponse as unknown) as { invitations?: Array<{ status: string }> })
        .invitations ?? [];
    const acceptedInvitations = invitations.filter((inv) => inv.status === "ACCEPTED");
    expect(
      acceptedInvitations,
      "GET /shares must not return ACCEPTED invitations — they expose stale token URLs to the client",
    ).toHaveLength(0);
  });

  test("pending invitations section does not render revoked invitation emails", async ({
    page,
  }) => {
    await page.route("**/api/vehicles/*/shares", (route) => {
      if (route.request().method() === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(SHARES_WITH_MIXED_STATUSES),
        });
      }
      return route.continue();
    });

    await goToFirstVehicle(page);

    // The pending invitation should be visible
    await expect(page.getByText("pending@example.com")).toBeVisible();

    // Revoked and accepted emails must NOT appear in the pending invitations section.
    // This test will FAIL because the server sends all statuses and the token URLs
    // for non-pending invitations are unnecessarily exposed in the API response.
    // (The UI filters client-side, but the data is still sent over the wire.)
    //
    // To verify the fix: the server should filter to status=PENDING before responding,
    // so these emails never reach the client at all.
    await expect(
      page.getByText("revoked@example.com"),
      "Revoked invitation email must not appear on the page",
    ).not.toBeVisible();
    await expect(
      page.getByText("accepted@example.com"),
      "Accepted invitation email must not appear on the page",
    ).not.toBeVisible();
  });
});
