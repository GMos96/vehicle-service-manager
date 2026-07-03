# Vehicle Service Manager — Security & Feature Audit

**Date:** 2026-07-03  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Scope:** Full-stack review of `frontend/` source, `db/init/init.sql`, and project configuration

---

## Security Issues

### Critical

#### 1. JWT Secret Fallback Mismatch
- **Files:** `frontend/src/app/api/auth/login/route.ts`, `frontend/src/core/auth/index.ts`
- **Detail:** `login/route.ts` falls back to `"your-secret-key"` when `JWT_SECRET` is unset; `auth/index.ts` falls back to `""`. Tokens signed at login cannot be verified — auth silently breaks without the env var set.
- **Fix:** Remove all fallbacks. Throw at startup if `JWT_SECRET` is missing.

#### 2. JWT Stored in sessionStorage (XSS Risk)
- **Files:** `frontend/src/providers/provider.tsx`, `frontend/src/core/api.ts`
- **Detail:** The JWT is stored in `sessionStorage`, which is accessible to any JavaScript running on the page. A single XSS vector can exfiltrate the token.
- **Fix:** Store the token in an HTTP-only, Secure, SameSite=Strict cookie and remove it from sessionStorage entirely.

#### 3. No HTTP Security Headers
- **File:** `frontend/next.config.ts`
- **Detail:** No `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Strict-Transport-Security` headers are configured. The app is exposed to clickjacking and content-injection attacks.
- **Fix:** Add a `headers()` export in `next.config.ts` with a restrictive CSP and standard security headers.

### Medium

#### 4. No Rate Limiting on Auth Endpoints
- **Files:** `frontend/src/app/api/auth/login/route.ts`, `frontend/src/app/api/auth/register/route.ts`
- **Detail:** Login and register accept unlimited requests with no throttling. Credential brute-force is trivial.
- **Fix:** Add rate limiting middleware (e.g., `next-rate-limit` or an upstream reverse proxy rule). Lock accounts after N failed attempts.

#### 5. No Token Revocation on Logout
- **Files:** `frontend/src/providers/provider.tsx`, `frontend/src/core/auth/index.ts`
- **Detail:** Logout only clears client-side sessionStorage. The JWT remains valid server-side for its full 1-day lifespan — a stolen token cannot be invalidated.
- **Fix:** Maintain a server-side token denylist (Redis works well) checked on every authenticated request, or switch to short-lived access tokens with refresh tokens.

#### 6. No Password Strength Enforcement
- **File:** `frontend/src/app/api/auth/register/route.ts`
- **Detail:** Registration accepts any password with no minimum length or complexity requirement.
- **Fix:** Add `@MinLength(8)` and a complexity pattern validator to `CreateUserDto`. Mirror validation on the client form.

#### 7. SQL Query Logging Enabled
- **File:** `frontend/src/core/datasource/data-source.ts`
- **Detail:** `logging: ["error", "query"]` logs every SQL statement to the console. In production this can leak PII and query structure to server logs.
- **Fix:** Set `logging: ["error"]` in production, controlled by `NODE_ENV`.

### Low

#### 8. Stack Traces in Route Handlers
- **Detail:** Several API routes call `console.error(error)` in catch blocks, which can expose internal stack traces and query details in server logs.
- **Fix:** Log a structured message with an error code; omit the raw error object from production logs.

---

## Bugs

### 1. Missing Cascading Deletes
- **Files:** `db/init/init.sql`, vehicle entity relations
- **Detail:** Deleting a vehicle leaves orphaned `oil`, `oil_filter`, `tire`, and `service_log` records. The schema has no `ON DELETE CASCADE` on the relevant foreign keys.
- **Fix:** Add `ON DELETE CASCADE` to all FK columns that reference `vehicle.id`. Mirror with TypeORM `onDelete: "CASCADE"` on the relation decorators.

### 2. No Indexes on Foreign Key Columns
- **File:** `db/init/init.sql`
- **Detail:** `service_log.vehicle_id`, `service_log.user_id`, and `vehicle.user_id` are unindexed. Queries will full-scan as data grows.
- **Fix:** Add `CREATE INDEX` statements for each FK column in the init script.

### 3. No FK Constraint from `user_id` to `user` Table
- **File:** `db/init/init.sql`
- **Detail:** `user_id` columns on `vehicle`, `oil`, `oil_filter`, `tire`, and `service_log` have no foreign key to the `user` table. Deleting a user leaves all their data as unowned orphans.
- **Fix:** Add `REFERENCES "user"(id) ON DELETE CASCADE` to all `user_id` columns.

### 4. `VehicleCard` Renders `undefined`
- **File:** `frontend/src/components/VehicleCard.tsx` (or equivalent)
- **Detail:** `nextRecommendedServiceMileage` is rendered inline without a null guard, producing the string `"@ undefined mi"` when the value is not set.
- **Fix:** Add a conditional: only render the mileage line when the value is non-null.

### 5. No 404 on Invalid Vehicle ID
- **File:** `frontend/src/app/vehicles/[vehicleId]/page.tsx`
- **Detail:** Navigating to a non-existent vehicle ID causes the page to spin indefinitely rather than showing an error or redirecting.
- **Fix:** Check the API response for 404 and render an appropriate error state or redirect to `/vehicles`.

### 6. Vehicle Year Not Validated at API Level
- **File:** `frontend/src/app/api/vehicles/route.ts`, vehicle DTO
- **Detail:** The database constrains year to 1900–9999 but `CreateVehicleDto` has no `@Min`/`@Max` decorators. Invalid input hits the DB and returns an opaque 500.
- **Fix:** Add `@Min(1900) @Max(new Date().getFullYear() + 1)` to the `year` field in the DTO.

---

## Feature Opportunities

### 1. Maintenance Schedule & Smart Alerts
Proactively surface when service is due based on mileage intervals (e.g., oil every 5,000 mi) and date intervals (e.g., annual inspection). A dashboard panel showing overdue and upcoming items transforms the app from a passive logbook into a daily-use tool. Most competitors do not do this.

### 2. OCR Receipt / Service Invoice Upload
Allow users to photograph a shop receipt and auto-populate the service log via OCR or an LLM extraction pipeline (date, mileage, service type, cost). Manual entry is the primary reason users abandon maintenance apps — removing that friction is a strong retention lever.

### 3. Lifetime Cost Analytics Per Vehicle
Show total spend broken down by service category (oil, tires, repairs) over time, with a cost-per-mile metric. This data is exactly what users need when deciding whether to repair or replace a vehicle, and it is nowhere else already compiled in a personal context.

### 4. Multi-Vehicle Household / Shared Access
Allow a vehicle to be shared with other users (family members, fleet managers) with configurable read/write permissions. Nearly all personal maintenance apps treat accounts as strictly single-user; shared access is table stakes for any multi-car household.

### 5. VIN Decode & Recall Visibility
Accept a VIN at vehicle creation and auto-populate year/make/model/trim using the free NHTSA VIN decode API. Surface open recall information tied to that VIN directly in the app. Zero friction for the user, and proactive recall visibility is a genuine safety differentiator.

---

## Prioritized Action List

| Priority | Item |
|----------|------|
| P0 | Fix JWT secret fallback mismatch |
| P0 | Move JWT to HTTP-only cookie |
| P0 | Add security headers in `next.config.ts` |
| P1 | Add rate limiting to auth endpoints |
| P1 | Add cascading deletes to DB schema and entities |
| P1 | Add DB indexes on FK columns |
| P1 | Add FK constraint from `user_id` to `user` table |
| P2 | Enforce password strength in DTO and form |
| P2 | Disable SQL query logging in production |
| P2 | Fix `VehicleCard` undefined mileage render |
| P2 | Add 404 handling for invalid vehicle ID |
| P2 | Add year validation to vehicle DTO |
| P3 | Implement token revocation on logout |
| P3 | Remove raw error objects from production logs |
