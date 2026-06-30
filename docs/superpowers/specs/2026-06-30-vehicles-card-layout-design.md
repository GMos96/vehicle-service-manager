# Vehicle List Card Layout Design

**Date:** 2026-06-30  
**Scope:** Replace the table-based vehicle list with a responsive card-based grid layout

## Overview

Transform the vehicles list page from a table layout to a dynamic card-based grid that improves mobile readability and displays additional vehicle information at a glance. Each card shows vehicle details, current mileage, oil type, and a calculated "next recommended service" mileage based on oil type.

## Goals

1. Improve mobile user experience with better-suited card layout
2. Display more contextual information (oil type, next service) without overwhelming users
3. Create reusable vehicle card component for potential use in other screens
4. Calculate and expose `nextRecommendedServiceMileage` at the backend level for API consistency

## Design

### Card Content

Each vehicle card displays:

- **Vehicle Name** (heading): Year, make, model, trim (e.g., "2020 Honda Civic EX")
- **Info Row**: Mileage on left (e.g., "45,230 mi") + Oil Type as tag/badge on right (e.g., "Synthetic")
- **Next Service Box** (highlighted callout): "Next Service @ {mileage} mi" based on calculated recommended service mileage
- **Footer**: Last updated date in muted text

### Card Interaction

- Entire card is clickable
- Clicking navigates to the vehicle detail page: `/vehicles/{vehicleId}`
- Hover state: Subtle shadow lift and pointer cursor to indicate interactivity

### Responsive Grid Layout

The vehicle cards flow in a responsive grid:

- **Mobile (< 768px)**: Single column (full width)
- **Tablet (768px - 1024px)**: 2 columns
- **Desktop (> 1024px)**: 3-4 columns, auto-flowing

Grid uses Chakra UI's native responsive utilities for automatic reflow and wrapping.

### Visual Design

**Card Container:**
- White background (light mode) / dark gray (dark mode, via Chakra theme)
- 1px subtle border (hairline color)
- Rounded corners (8px / md)
- Padding: 20px
- Gap between sections: 12-16px

**Typography:**
- Vehicle name: Bold heading (fontSize: lg, fontWeight: 700, fontFamily: heading)
- Mileage/Oil info: Regular body (fontSize: md)
- Oil type tag: Small uppercase label (fontSize: xs, textTransform: uppercase)
- Next service: Body text in secondary color (fontSize: sm)
- Last updated: Muted text (fontSize: xs, color: fg.muted)

**Next Service Box:**
- Subtle background (light gray or theme-aware)
- Light padding (12px)
- Rounded corners (4px / sm)
- Helps distinguish "recommended action" callout

### Next Recommended Service Calculation

**Logic:**
- If vehicle has oil type "synthetic": `nextRecommendedServiceMileage = currentMileage + 5000`
- Otherwise (standard or missing): `nextRecommendedServiceMileage = currentMileage + 3000`

**Implementation Location:** Backend calculates on API response to ensure the field is consistently available across all API endpoints and screens.

## Implementation

### Files to Modify/Create

1. **`frontend/src/app/vehicles/types.ts`**
   - Add `nextRecommendedServiceMileage: number` to `VehicleDTO`

2. **`frontend/src/app/vehicles/util.ts`**
   - Add helper function `calculateNextRecommendedServiceMileage(vehicle: VehicleDTO): number`
   - Implements the oil type logic above

3. **`frontend/src/app/vehicles/components/vehicle-card.tsx`** (new)
   - New component: Renders a single vehicle card
   - Props: `vehicle: VehicleDTO`, `onClick?: () => void`
   - Internal structure:
     - Vehicle name heading
     - Flex row: mileage left, oil type tag right
     - Next service callout box
     - Last updated footer
   - Entire card has `cursor: pointer` and onClick handler

4. **`frontend/src/app/vehicles/components/vehicle-list.tsx`**
   - Replace `Table` component with Chakra `Grid`
   - Map vehicles to `VehicleCard` components
   - Grid responsive columns: 1 (mobile) / 2 (tablet) / 3-4 (desktop)
   - Pass `onClick={() => router.push(...)}` to each card

5. **`frontend/src/app/api/vehicles/route.ts`** (backend)
   - In GET endpoint(s), calculate `nextRecommendedServiceMileage` for each vehicle response
   - Import and use the utility function from `util.ts`
   - Include field in all `VehicleDTO` responses

### Data Flow

```
Backend API Response
  ↓ (includes calculated nextRecommendedServiceMileage)
VehicleList Component
  ↓ (receives vehicles array)
Grid (Chakra responsive)
  ↓
VehicleCard × N
  ├─ Display vehicle name
  ├─ Display mileage + oil type tag
  ├─ Display next service box
  └─ Handle click → navigate to detail page
```

## Testing Considerations

- Verify card displays correctly on mobile, tablet, and desktop viewports
- Test grid responsiveness: columns reflow at breakpoints
- Confirm entire card click navigates to detail page
- Verify oil type tag displays correctly (when oil data exists)
- Confirm `nextRecommendedServiceMileage` calculation is correct for both synthetic and standard oils
- Test with vehicles missing oil information (should default to +3000)

## Edge Cases

- **Missing oil data:** Display "Oil Type" as tag with fallback text; calculate with standard (+3000) assumption
- **Missing mileage:** Next service box should handle gracefully (consider hiding or showing N/A)
- **Responsive reflow:** Grid should not have orphaned single cards; Chakra handles this naturally

## Success Criteria

- Cards display on all screen sizes with appropriate column counts
- All vehicle information (name, mileage, oil type, next service, last updated) is visible and readable
- Entire card is clickable and navigates correctly
- Design feels intentional and not "templated"
- Backend sends `nextRecommendedServiceMileage` on all vehicle API responses
