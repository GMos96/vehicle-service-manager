# Vehicle Service Manager — UX Findings

20 findings, 4 phases. Two marked **(live-verified)** were reproduced in the running dev build; the rest are code-review findings (no seeded database was available to exercise the Garage/Vehicle Detail pages live).

## Phase 0 — Stop the Bleeding
*This sprint. Actively broken for a subset of users, not just degraded.*

### 1. Login card overflows the viewport and clips its own labels (P0 · Effort S) — live-verified
**File:** `frontend/src/app/login/page.tsx`
**Issue:** At a 334px-wide viewport the login card renders at 384px with a −7.6px left offset — the "Email Address" label starts off-screen and the page grows a horizontal scrollbar. That's roughly small-phone width, not an edge case.
**Fix:** Cap the card at `w="full"` with a responsive `maxW` instead of a fixed width; check `input-group.tsx` for the same assumption. Register uses the same card shell and likely has the identical bug.

### 2. Vehicle cards can't be opened with a keyboard (P0 · Effort S)
**File:** `frontend/src/app/vehicles/components/vehicle-card.tsx`
**Issue:** The card is an `onClick`-only `Box` — no `tabIndex`, `role`, key handler, or focus ring. It's the only way into a vehicle's detail page, so keyboard/screen-reader users are locked out of the app's primary flow.
**Fix:** Copy `GaugePanel`'s existing pattern — `tabIndex={0}`, Enter/Space handler, visible focus ring — or wrap the card in a Next `Link`.

### 3. A failed vehicle fetch spins forever (P0 · Effort S)
**File:** `frontend/src/app/vehicles/[id]/page.tsx:62–68`
**Issue:** If the single-vehicle fetch fails (bad id, dropped connection, real 404), `vehicle` never gets set and the full-page spinner never clears. The only signal is a toast that fades on its own, after which the user is stuck on a permanent loading state.
**Fix:** Track an explicit error state and render a "couldn't load this vehicle — back to Garage" panel instead of leaving the spinner as the only fallback.

### 4. No submit button ever shows a pending state (P0 · Effort S)
**Files:** Login, Register, Add Vehicle, Add Service Log
**Issue:** `components/ui/button.tsx` already has a `loading` prop that swaps in a spinner and disables the button, but none of the four forms pass it. A click during network latency gives zero feedback, inviting duplicate submissions.
**Fix:** Wire `loading={formState.isSubmitting}` into each submit button.

### 5. Nav wordmark wraps to three lines with no mobile menu (P0 · Effort S) — live-verified
**File:** `frontend/src/components/segments/navbar.tsx`
**Issue:** At small-phone width, "VEHICLE / SERVICE / MANAGER" stacks into three lines and crowds into the Log In / Sign Up buttons. No hamburger menu, no breakpoint handling for nav content (only for padding).
**Fix:** Swap to a short mark ("VSM" or the glowing dot alone) below `md`, and/or collapse auth actions into a menu once a "My Garage" link is added.

## Phase 1 — Consistency Pass
*Next sprint. Every form and state should behave the same way everywhere.*

### 6. Error feedback is a different experience on every form (P1 · Effort M)
**Files:** `login/page.tsx`, `add-service-log-form.tsx` vs. `register/page.tsx`, `add-vehicle-form.tsx`
**Issue:** Register and Add Vehicle show inline field errors. Login shows only a generic toast, even for field-specific problems. Add Service Log doesn't wire field errors at all — a regression relative to the forms next to it.
**Fix:** Standardize every form on the `Field` + `errors` pattern already used by Register and Add Vehicle.

### 7. Required fields are marked inconsistently — and sometimes decoratively (P1 · Effort M)
**Files:** `register/page.tsx`, `add-vehicle-form.tsx`, `login/page.tsx`
**Issue:** Register shows a required asterisk on 2 of 4 fields with no backing validation rule (purely visual). Add Vehicle and Login mark nothing required, even though the backend DTOs enforce make/model/mileage and email/password.
**Fix:** Add matching `required` indicators and validation rules on the client wherever the backend DTO already enforces one.

### 8. Edit/cancel/save icon buttons have no accessible name (P1 · Effort S)
**File:** `frontend/src/components/ui/editable-input.tsx:37,42,47`
**Issue:** The pencil/✕/✓ icon buttons driving every inline edit on the vehicle detail page carry no `aria-label`. A screen reader announces "button" three times with no way to tell them apart. (`EditableSelect`'s single trigger does have a label.)
**Fix:** Add `aria-label="Edit"` / `"Cancel"` / `"Save"` to the three triggers.

### 9. No persistent way back to "My Garage" once signed in (P1 · Effort S)
**File:** `frontend/src/components/segments/navbar.tsx`
**Issue:** The only nav item for an authenticated user is "Log Out." Getting back to the garage list from a vehicle's detail page depends entirely on the browser back button.
**Fix:** Add a "My Garage" link to the authenticated nav state, with `aria-current="page"` when active.

### 10. "Nothing here yet" looks like two different products (P1 · Effort S)
**Files:** `vehicles/components/vehicle-list.tsx:29–34` vs. `ui/table.tsx:100–121`
**Issue:** The empty garage state is plain centered text. The empty service-log state is an icon inside a bordered panel. Same meaning, two unrelated treatments.
**Fix:** Extract one empty-state component and reuse it everywhere a list can be empty.

### 11. Repair cost isn't formatted like money anywhere it appears (P1 · Effort S)
**File:** `vehicles/components/service-log-list.tsx:53`
**Issue:** Repair cost renders as `${repairCost}` via string concatenation (1500 → "$1500," not "$1,500.00"). Mileage right next to it already uses `.toLocaleString()`.
**Fix:** Format with `Intl.NumberFormat(..., { style: 'currency', currency: 'USD' })`.

### 12. Inputs don't tell the browser or keyboard what they are (P1 · Effort S)
**Files:** `login/page.tsx`, `register/page.tsx`, `add-vehicle-form.tsx`
**Issue:** Email fields on Login/Register are plain `<Input>` with no `type="email"`. Add Vehicle's Year field is plain text while Mileage beside it is `type="number"`.
**Fix:** Set semantic `type` / `inputMode` per field, consistently within each form.

## Phase 2 — Scale & Resilience
*Two to four weeks out. Nothing here is broken today with two sample vehicles — all of it will be as data grows.*

### 13. Service-log table hides most of its data on mobile (P2 · Effort M)
**File:** `vehicles/components/service-log-list.tsx`
**Issue:** Mileage, Description, and Repair Cost are `display: none` below `sm`/`md`. On a phone, a log entry shows only date and service type.
**Fix:** Collapse to a stacked card layout (or expandable row) below `sm` instead of hiding columns.

### 14. No search, filter, or sort anywhere (P2 · Effort M)
**Files:** `vehicles/components/vehicle-list.tsx`, `service-log-list.tsx`
**Issue:** The garage grid and service-log table render everything they fetch. Sort order on logs is hardcoded date-descending client-side, with no user control and no sorted indicator.
**Fix:** Add a search box + sort control to the garage grid; sortable column headers to the log table.

### 15. Service logs have no pagination (P2 · Effort M)
**File:** `service-log-list.tsx` / `service-log.actions.ts`
**Issue:** Every service log for a vehicle loads in one unbounded request. A vehicle with years of history — the core use case — will eventually load a very long list.
**Fix:** Paginate or virtualize once a vehicle's log count passes roughly 50 rows.

### 16. No branded fallback for crashes or unknown routes (P2 · Effort S)
**File:** `frontend/src/app/` (root)
**Issue:** No `error.tsx`, `loading.tsx`, or `not-found.tsx` anywhere in the App Router tree. An uncaught render error falls through to Next's default dev overlay; no custom 404.
**Fix:** Add the three standard App Router files at the root, styled to match the app.

## Phase 3 — Polish & Backlog
*No deadline pressure. The difference between "works" and "feels considered."*

### 17. The app's best visual asset only shows fake data (P3 · Effort M)
**File:** `frontend/src/components/ui/gauge-panel.tsx`
**Issue:** The animated radial-arc gauge — correct keyboard handling, respects reduced motion — only appears on the marketing homepage rendering two hardcoded sample vehicles. It never touches real data.
**Fix:** Reuse it on the real vehicle detail page for something like "miles to next service."

### 18. `next-themes` is installed and does nothing (P3 · Effort S)
**Files:** `frontend/package.json`, `frontend/src/app/provider.tsx`
**Issue:** The dependency is installed but nothing in `src` imports it. No `ThemeProvider`, no `useTheme`, no toggle — dark mode is instead hardcoded three separate ways.
**Fix:** Either build the light-mode toggle this dependency implies, or remove it.

### 19. A built password-strength meter is never shown (P3 · Effort S)
**File:** `frontend/src/components/ui/password-input.tsx`
**Issue:** `PasswordStrengthMeter` exists, fully built, and is never rendered on Register or anywhere else — leftover from the component snippet it was adapted from.
**Fix:** Wire it into Register, or delete it.

### 20. "Click to edit" can be mistaken for real data (P3 · Effort S)
**File:** `frontend/src/components/ui/editable-input.tsx:28`
**Issue:** Unset fields default to the literal string "Click to edit," styled identically to a real value. A brand-new vehicle with no oil brand yet shows text that reads as data until you look closely.
**Fix:** Give unset fields a visibly distinct treatment (muted/italic) so "empty" and "filled" are never styled the same.
