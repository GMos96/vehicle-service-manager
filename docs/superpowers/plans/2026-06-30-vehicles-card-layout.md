# Vehicle List Card Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the table-based vehicle list with a responsive card-based grid that displays vehicle information with calculated next service mileage.

**Architecture:** 
1. Backend calculates `nextRecommendedServiceMileage` and includes it in all `VehicleDTO` responses
2. Frontend renders each vehicle as a clickable card in a responsive grid
3. New `VehicleCard` component displays vehicle details with oil type tag and next service callout
4. Grid flows responsively: 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)

**Tech Stack:** React 18, Next.js 15, TypeScript 5, Chakra UI 3, TypeORM (backend)

## Global Constraints

- Oil type "synthetic" → next service at mileage + 5000; otherwise mileage + 3000
- All vehicle API responses must include `nextRecommendedServiceMileage`
- Entire card is clickable (no button within card)
- Grid uses Chakra UI responsive utilities
- Follow existing code patterns and naming conventions

---

### Task 1: Add nextRecommendedServiceMileage to VehicleDTO

**Files:**
- Modify: `frontend/src/app/vehicles/types.ts`

**Interfaces:**
- Consumes: None (foundational change)
- Produces: `VehicleDTO` with new field `nextRecommendedServiceMileage: number`

- [ ] **Step 1: Open types.ts and add the field to VehicleDTO**

Edit `frontend/src/app/vehicles/types.ts`. Find the `VehicleDTO` interface and add the new field:

```typescript
export interface VehicleDTO {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  lastUpdatedDate?: Date;
  nextRecommendedServiceMileage: number;  // ADD THIS LINE
  oil?: Partial<OilDTO>;
  oilFilter?: Partial<OilFilterDTO>;
  tire?: Partial<TireDTO>;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd frontend && npm run build`
Expected: Build succeeds (types compile)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/vehicles/types.ts
git commit -m "feat: add nextRecommendedServiceMileage to VehicleDTO"
```

---

### Task 2: Add calculation helper function

**Files:**
- Modify: `frontend/src/app/vehicles/util.ts`

**Interfaces:**
- Consumes: `VehicleDTO` with oil data
- Produces: `calculateNextRecommendedServiceMileage(vehicle: VehicleDTO): number`

- [ ] **Step 1: Open util.ts and add the helper function**

Edit `frontend/src/app/vehicles/util.ts`. Add this function at the end:

```typescript
export function calculateNextRecommendedServiceMileage(vehicle: VehicleDTO): number {
  const oilType = vehicle.oil?.type;
  const increment = oilType === "synthetic" ? 5000 : 3000;
  return vehicle.mileage + increment;
}
```

- [ ] **Step 2: Verify the function is exported and typed correctly**

Run: `cd frontend && npm run build`
Expected: Build succeeds, no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/vehicles/util.ts
git commit -m "feat: add calculateNextRecommendedServiceMileage helper"
```

---

### Task 3: Update backend API to calculate and include the field

**Files:**
- Modify: `frontend/src/app/api/vehicles/route.ts`

**Interfaces:**
- Consumes: Vehicle data from database, `calculateNextRecommendedServiceMileage` utility
- Produces: API responses with `nextRecommendedServiceMileage` included in each vehicle object

- [ ] **Step 1: Open the vehicles API route file and examine the structure**

Read `frontend/src/app/api/vehicles/route.ts` to understand:
- How vehicles are fetched from the database
- What format the response uses
- Where the response is built before returning

- [ ] **Step 2: Import the calculation helper at the top of the file**

Add this import near the other imports at the top of `frontend/src/app/api/vehicles/route.ts`:

```typescript
import { calculateNextRecommendedServiceMileage } from "@/app/vehicles/util";
```

- [ ] **Step 3: Update the GET handler to calculate the field**

In the `GET` function (or wherever vehicles are returned), after fetching vehicles from the database, calculate the field for each vehicle before returning:

```typescript
// After fetching vehicles from database (before NextResponse)
const vehiclesWithServiceMileage = vehicles.map(vehicle => ({
  ...vehicle,
  nextRecommendedServiceMileage: calculateNextRecommendedServiceMileage(vehicle as VehicleDTO),
}));

// Then return vehiclesWithServiceMileage instead of vehicles
return NextResponse.json(vehiclesWithServiceMileage);
```

- [ ] **Step 4: Test the API endpoint**

Start the dev server: `cd frontend && npm run dev`
Navigate to `http://localhost:3000/api/vehicles` in your browser or use curl:

```bash
curl http://localhost:3000/api/vehicles
```

Expected: JSON response includes `nextRecommendedServiceMileage` for each vehicle (e.g., `"nextRecommendedServiceMileage": 48230`)

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/api/vehicles/route.ts
git commit -m "feat: backend calculates nextRecommendedServiceMileage in vehicle responses"
```

---

### Task 4: Create the VehicleCard component

**Files:**
- Create: `frontend/src/app/vehicles/components/vehicle-card.tsx`

**Interfaces:**
- Consumes: `VehicleDTO` (with `nextRecommendedServiceMileage` and oil data)
- Produces: Rendered card component, clickable via `onClick` prop

- [ ] **Step 1: Create the new file with the complete VehicleCard component**

Create `frontend/src/app/vehicles/components/vehicle-card.tsx` with this content:

```typescript
"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { getVehicleDisplayName } from "@/app/vehicles/util";
import { formatDate } from "@/util/date-util";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";

type Props = {
  vehicle: VehicleDTO;
  onClick?: () => void;
};

export default function VehicleCard({ vehicle, onClick }: Props) {
  const oilTypeDisplay = vehicle.oil?.type
    ? vehicle.oil.type.charAt(0).toUpperCase() + vehicle.oil.type.slice(1)
    : "Standard";

  return (
    <Box
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      p={5}
      border="1px"
      borderColor="border.hairline"
      borderRadius="md"
      bg="bg.panel"
      transition="all 0.2s"
      _hover={
        onClick
          ? {
              shadow: "md",
            }
          : undefined
      }
    >
      {/* Vehicle Name */}
      <Text
        fontFamily="heading"
        fontWeight="700"
        fontSize="lg"
        mb={3}
      >
        {getVehicleDisplayName(vehicle)}
      </Text>

      {/* Mileage + Oil Type Row */}
      <HStack justify="space-between" mb={3}>
        <Text className="vsm-mono-num" fontSize="md">
          {vehicle.mileage?.toLocaleString()} mi
        </Text>
        <Box
          as="span"
          fontSize="xs"
          textTransform="uppercase"
          px={2}
          py={1}
          borderRadius="sm"
          bg="bg.subtle"
          color="fg.muted"
          fontWeight="600"
        >
          {oilTypeDisplay}
        </Box>
      </HStack>

      {/* Next Service Box */}
      <Box
        p={3}
        mb={3}
        borderRadius="sm"
        bg="bg.subtle"
      >
        <Text fontSize="sm" color="fg.muted" mb={1}>
          Next Service
        </Text>
        <Text className="vsm-mono-num" fontSize="md" fontWeight="600">
          @ {vehicle.nextRecommendedServiceMileage?.toLocaleString()} mi
        </Text>
      </Box>

      {/* Last Updated Footer */}
      <Text
        fontFamily="mono"
        fontSize="xs"
        color="fg.muted"
      >
        Updated {formatDate(vehicle.lastUpdatedDate)}
      </Text>
    </Box>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `cd frontend && npm run build`
Expected: Build succeeds, no TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/vehicles/components/vehicle-card.tsx
git commit -m "feat: create VehicleCard component with oil type tag and next service info"
```

---

### Task 5: Replace table with responsive grid in VehicleList

**Files:**
- Modify: `frontend/src/app/vehicles/components/vehicle-list.tsx`

**Interfaces:**
- Consumes: `VehicleDTO[]`, props same as before (`vehicles`, `loading`, `enableClickToNavigate`)
- Produces: Rendered grid of VehicleCard components (replaces Table)

- [ ] **Step 1: Open vehicle-list.tsx and replace the entire component**

Replace the contents of `frontend/src/app/vehicles/components/vehicle-list.tsx` with:

```typescript
"use client";

import { VehicleDTO } from "@/app/vehicles/types";
import { useRouter } from "next/navigation";
import VehicleCard from "@/app/vehicles/components/vehicle-card";
import { Grid, Box, Text, Center } from "@chakra-ui/react";

type Props = {
  vehicles: VehicleDTO[];
  loading: boolean;
  enableClickToNavigate?: boolean;
};

export default function VehicleList({
  vehicles,
  loading,
  enableClickToNavigate = true,
}: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <Center py={20}>
        <Text color="fg.muted">Loading vehicles...</Text>
      </Center>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Center py={20}>
        <Text color="fg.muted">No vehicles yet. Add one to get started.</Text>
      </Center>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={4}
    >
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onClick={
            enableClickToNavigate
              ? () => router.push(`/vehicles/${vehicle.id}`)
              : undefined
          }
        />
      ))}
    </Grid>
  );
}
```

- [ ] **Step 2: Remove the old Table import and update imports**

At the top of the file, remove:
```typescript
import Table from "@/components/ui/table";
```

Add/ensure these imports exist:
```typescript
import { Grid, Box, Text, Center } from "@chakra-ui/react";
import VehicleCard from "@/app/vehicles/components/vehicle-card";
```

The file should only have the imports it needs.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd frontend && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Test the feature in the browser**

1. Start dev server: `cd frontend && npm run dev`
2. Navigate to `http://localhost:3000/vehicles`
3. Verify:
   - Cards display in a grid
   - On mobile: 1 column
   - On tablet (resize to ~800px): 2 columns
   - On desktop (resize to ~1200px+): 3-4 columns
   - Each card shows: vehicle name, mileage, oil type tag, next service, last updated
   - Entire card is clickable and navigates to vehicle detail page
   - Hover effect (shadow lift) appears on desktop

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/vehicles/components/vehicle-list.tsx
git commit -m "feat: replace table with responsive card grid layout"
```

---

### Task 6: Test the complete feature end-to-end

**Files:**
- No new files; verification of existing work

**Interfaces:**
- Consumes: All previous task outputs
- Produces: Verified, working feature

- [ ] **Step 1: Start the dev server and navigate to vehicles list**

```bash
cd frontend && npm run dev
```

Navigate to `http://localhost:3000/vehicles` in your browser.

- [ ] **Step 2: Test on different screen sizes**

Use browser DevTools to test:
- **Mobile (375px):** Should show 1 column cards, full width
- **Tablet (768px):** Should show 2 columns
- **Desktop (1024px+):** Should show 3-4 columns

Expected: Grid reflows smoothly as you resize

- [ ] **Step 3: Verify card content and styling**

For each visible vehicle card, check:
- ✓ Vehicle name displays (year, make, model, trim)
- ✓ Mileage shows with comma separators (e.g., "45,230 mi")
- ✓ Oil type shows in a tag/badge (e.g., "Synthetic" or "Standard")
- ✓ "Next Service @ {mileage} mi" displays in highlighted box
- ✓ Last updated date shows at bottom
- ✓ Hover effect (shadow lift) works on desktop

- [ ] **Step 4: Test card interaction**

Click on a card and verify:
- ✓ Navigates to the vehicle detail page (`/vehicles/{id}`)
- ✓ Correct vehicle is displayed

- [ ] **Step 5: Verify next service calculation**

For a vehicle with:
- Mileage: 45,000
- Oil type: "synthetic"
- Expected next service: 50,000 (45000 + 5000)

For a vehicle with:
- Mileage: 45,000
- Oil type: "standard" or missing
- Expected next service: 48,000 (45000 + 3000)

Check the displayed "Next Service @ X mi" values match expectations.

- [ ] **Step 6: Check for errors in browser console**

Open DevTools (F12) → Console tab.
Expected: No red errors related to VehicleCard or vehicle list.

- [ ] **Step 7: Verify no TypeScript errors**

Run: `cd frontend && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 8: Run linter**

```bash
cd frontend && npm run lint
```

Expected: No new lint errors

---

## Spec Coverage Verification

✓ Task 1: VehicleDTO updated with `nextRecommendedServiceMileage` field  
✓ Task 2: Helper function `calculateNextRecommendedServiceMileage` created  
✓ Task 3: Backend calculates and includes field in all vehicle responses  
✓ Task 4: VehicleCard component created with required fields, styling, and interactions  
✓ Task 5: VehicleList refactored to use responsive Grid layout  
✓ Task 6: End-to-end testing covering all requirements  

**Spec requirements addressed:**
- ✓ Card displays: vehicle name, mileage, oil type tag, next service, last updated
- ✓ Next service calculation: synthetic (+5000) vs. standard (+3000)
- ✓ Responsive grid: 1 column (mobile) / 2 (tablet) / 3-4 (desktop)
- ✓ Entire card clickable
- ✓ Visual styling with callout box for next service
- ✓ Backend calculates field for API consistency
