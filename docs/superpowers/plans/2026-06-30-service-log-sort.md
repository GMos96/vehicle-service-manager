# Service Log Sort Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sort service logs in descending chronological order (most recent date first) in the table display.

**Architecture:** Client-side sort applied in the component's render logic. The `data` array is spread and sorted before mapping over it to create table rows. This keeps sorting logic in one place and ensures the display is always correctly ordered.

**Tech Stack:** React, TypeScript, existing service-log-list component

## Global Constraints

- No backend or API changes
- No new dependencies
- Maintain existing component API and props
- Service logs must always display newest-first

---

### Task 1: Write Test for Sorted Service Logs

**Files:**
- Create: `frontend/src/app/vehicles/components/__tests__/service-log-list.test.tsx`
- Reference: `frontend/src/app/vehicles/components/service-log-list.tsx`

**Interfaces:**
- Consumes: `ServiceLogDTO` type, component props
- Produces: Test file verifying sort order

- [ ] **Step 1: Create test file with setup**

Create `frontend/src/app/vehicles/components/__tests__/service-log-list.test.tsx`:

```typescript
import { render, screen } from "@testing-library/react";
import ServiceLogList from "@/app/vehicles/components/service-log-list";
import * as useFetchServiceLogsModule from "@/app/vehicles/hooks/use-fetch-service-logs";
import { ServiceLogDTO } from "@/app/vehicles/types";

describe("ServiceLogList", () => {
  const mockServiceLogs: ServiceLogDTO[] = [
    {
      id: 1,
      serviceDate: new Date("2026-01-15"),
      serviceType: "Oil Change",
      description: "Regular oil change",
      repairCost: 50,
    },
    {
      id: 2,
      serviceDate: new Date("2026-06-20"),
      serviceType: "Tire Rotation",
      description: "Rotated tires",
      repairCost: 75,
    },
    {
      id: 3,
      serviceDate: new Date("2026-03-10"),
      serviceType: "Filter Replacement",
      description: "Replaced air filter",
      repairCost: 30,
    },
  ];

  beforeEach(() => {
    jest.spyOn(useFetchServiceLogsModule, "useFetchServiceLogs").mockReturnValue({
      data: mockServiceLogs,
      refresh: jest.fn(),
      loading: false,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render service logs sorted by date in descending order (newest first)", () => {
    render(<ServiceLogList vehicleId={1} />);

    const dateCells = screen.getAllByText(/\d{2}-\d{2}-\d{4}/);
    
    expect(dateCells[0]).toHaveTextContent("06-20-2026");
    expect(dateCells[1]).toHaveTextContent("03-10-2026");
    expect(dateCells[2]).toHaveTextContent("01-15-2026");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd frontend
npm test -- service-log-list.test.tsx
```

Expected: Test fails because logs are not yet sorted in the component.

- [ ] **Step 3: Commit test file**

```bash
git add frontend/src/app/vehicles/components/__tests__/service-log-list.test.tsx
git commit -m "test: add service log sort order test"
```

---

### Task 2: Implement Sort in Service Log List Component

**Files:**
- Modify: `frontend/src/app/vehicles/components/service-log-list.tsx:28-54`

**Interfaces:**
- Consumes: `data` array from `useFetchServiceLogs` hook, `ServiceLogDTO` type
- Produces: Sorted table rows in descending date order

- [ ] **Step 1: Update the map function to sort data**

In `service-log-list.tsx`, find the `Table.Root` component and the `.map()` that iterates over `data` (currently lines 28-54). Replace it with sorted data:

```typescript
<Table.Root loading={loading} headerRow={HeaderRow} data={data}>
  {[...data]
    .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())
    .map((serviceLog: ServiceLogDTO) => (
      <Table.Row key={serviceLog.id}>
        <Table.Cell fontFamily="mono" fontSize="sm" color="fg.muted">
          {formatDate(serviceLog.serviceDate, "MM-DD-YYYY")}
        </Table.Cell>
        <Table.Cell fontFamily="heading" fontWeight="500">
          {serviceLog.serviceType}
        </Table.Cell>
        <Table.Cell
          display={{ base: "none", sm: "table-cell" }}
          className="vsm-mono-num"
        >
          {serviceLog.mileage?.toLocaleString()} mi
        </Table.Cell>
        <Table.Cell display={{ base: "none", sm: "table-cell" }}>
          {serviceLog.description}
        </Table.Cell>
        <Table.Cell
          display={{ base: "none", md: "table-cell" }}
          className="vsm-mono-num"
          color="accent.solidColor"
        >
          ${serviceLog.repairCost}
        </Table.Cell>
      </Table.Row>
    ))}
</Table.Root>
```

The key change: `.sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())` added after spreading the data array.

- [ ] **Step 2: Run the test to verify it passes**

```bash
cd frontend
npm test -- service-log-list.test.tsx
```

Expected: Test passes with all dates in descending order (newest first).

- [ ] **Step 3: Run the full test suite to ensure no regressions**

```bash
cd frontend
npm test
```

Expected: All tests pass, no new failures.

- [ ] **Step 4: Commit the implementation**

```bash
git add frontend/src/app/vehicles/components/service-log-list.tsx
git commit -m "feat: sort service logs by date descending (most recent first)"
```

---

### Task 3: Manual Browser Verification

**Files:**
- Reference: `frontend/src/app/vehicles/components/service-log-list.tsx`

**Interfaces:**
- Consumes: Running Next.js dev server
- Produces: Visual verification of sort order in browser

- [ ] **Step 1: Start the development server**

```bash
cd frontend
yarn dev
```

Opens at http://localhost:3000

- [ ] **Step 2: Navigate to a vehicle with service logs**

1. Log in with test credentials (or create a test account)
2. Navigate to any vehicle that has existing service logs
3. Observe the service log table

- [ ] **Step 3: Verify sort order**

Confirm that:
- The most recent service date appears in the first row
- Dates descend chronologically down the table
- After adding a new service log, it appears at the top of the list

- [ ] **Step 4: Test on different screen sizes**

Resize browser to verify the sort order persists on mobile (base), tablet (sm), and desktop (md) views.

---

## Plan Self-Review

✓ **Spec coverage:** 
- Requirements met: Logs sorted descending by date
- Implementation in component: Task 2 handles this
- Testing: Task 1 verifies sort order
- No backend changes needed: Correct, all client-side

✓ **Placeholder scan:** No TBD, TODO, or vague steps. All code is complete.

✓ **Type consistency:** `ServiceLogDTO` used consistently across tasks.

✓ **Completeness:** TDD cycle (test → fail → implement → pass), manual verification, and commit in each task.
