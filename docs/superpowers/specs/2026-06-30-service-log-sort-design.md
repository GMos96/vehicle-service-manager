# Service Log Table Sort by Most Recent Date

**Date:** 2026-06-30  
**Scope:** Sort service logs in descending chronological order (most recent first)

## Overview

The service log table currently renders logs in whatever order they are received from the backend. This spec implements client-side sorting to display the most recent service date at the top of the table, with older dates below.

## Requirements

- Service logs must be sorted by `serviceDate` in descending order (newest first)
- Sorting happens on every render, ensuring the table is always correctly ordered
- No user interaction needed; sorting is automatic and always active
- No changes to backend or API

## Implementation Details

**Location:** `frontend/src/app/vehicles/components/service-log-list.tsx`

**Change:** Sort the `data` array before rendering rows. In the `.map()` function that currently iterates over `data`, apply a sort operation:

```typescript
[...data].sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime())
```

**Rationale:**
- Spreads `data` to avoid mutating the original array (safe React practice)
- Converts `serviceDate` strings/dates to timestamps for comparison
- Sorts in descending order: `b - a` puts larger (newer) dates first
- Logic is contained in the component where it's used, keeping code readable

## What Changes

- Service logs display in newest-to-oldest chronological order
- No API changes
- No UI changes (same table, same columns)
- No changes to data fetching or state management

## What Stays the Same

- Table structure and columns remain unchanged
- Add Service Log form functionality unchanged
- Service log refresh mechanism unchanged
- All other vehicle management features unchanged

## Testing

- Verify that after adding a new service log, it appears at the top of the table
- Verify that when the page loads, logs are in descending date order
- Verify that refreshing the list maintains the correct sort order

## Success Criteria

- Most recent service date appears in the first row
- Older dates follow in descending chronological order
- Sorting works consistently across page loads and list refreshes
