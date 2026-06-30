# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vehicle Service Manager** is a full-stack web application built with Next.js 15 and TypeORM that helps users manage vehicle maintenance records including oil changes, oil filters, tires, and service logs.

### Technology Stack
- **Frontend**: Next.js 15.4.10 (App Router), React 18.3.1, TypeScript 5
- **UI Framework**: Chakra UI 3.x with dark theme support (next-themes)
- **Backend/Database Access**: TypeORM 0.3.27 with PostgreSQL
- **Authentication**: JWT-based (jsonwebtoken v9)
- **State Management**: React Context + useReducer for auth state

### Project Structure
```
vehicle-service-manager/
├── db/init/              # PostgreSQL database initialization scripts
│   └── init.sql         # Database schema and setup
├── frontend/             # Next.js application
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── app/         # Next.js App Router pages
│   │   │   ├── api/     # API routes (TypeScript route handlers)
│   │   │   ├── login/   # Login page
│   │   │   ├── register/# Registration page
│   │   │   └── vehicles/# Vehicle management pages
│   │   ├── components/  # Reusable UI components
│   │   ├── core/        # Core utilities (API client, data source)
│   │   ├── entities/    # TypeORM entity classes
│   │   ├── hooks/       # Custom React hooks
│   │   └── providers/   # Context providers
│   ├── .env             # Database connection config
│   ├── next.config.ts   # Next.js configuration
│   └── tsconfig.json    # TypeScript configuration
└── CLAUDE.md           # This file
```

## Database Setup

The application uses PostgreSQL with a single schema. To initialize the database:

```bash
# Create and initialize database
psql -f db/init/init.sql <(echo "create database vehicle-service-manager;")

# Load schema (after DB exists)
psql -U postgres -d vehicle-service-manager -f db/init/init.sql
```

### Environment Variables (.env)
Required in `frontend/.env`:
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (default: vehicle-service-manager)
- `JWT_SECRET` - Secret for JWT token generation

## Common Development Tasks

### Run Development Server
```bash
cd frontend
npm run dev
# or
yarn dev
```
Opens at http://localhost:3000

### Build for Production
```bash
cd frontend
npm run build
npm run start
```

### Lint and Format
```bash
cd frontend
npm run lint          # Run ESLint
prettier --write "**/*"  # Format all files
```

The project uses Husky with lint-staged for pre-commit hooks that automatically format staged files.

## API Architecture

All API endpoints use the Next.js App Router pattern with TypeScript route handlers:

### Route Handler Pattern (`api/.../route.ts`)
Each route file exports HTTP method functions (GET, POST, PUT, DELETE) as exported functions. The pattern follows:
1. Parse request body if needed
2. Validate input using class-validator decorators
3. Perform business logic via TypeORM repositories
4. Return NextResponse with appropriate status codes

Example location patterns:
- `vehicles` - List all vehicles (GET), Create vehicle (POST)
- `vehicles/[vehicleId]` - Get vehicle (GET), Update vehicle (PUT)
- `vehicles/[vehicleId]/oil` - Oil change operations
- `service-logs` - Service history management

## TypeORM Entity Architecture

The application uses an entity-based architecture with the following entities:

### Core Entities
- **User** - User account with email/password (bcrypt hashed)
- **Vehicle** - Car details (year, make, model, trim, mileage)
  - OneToOne relationships to Oil, OilFilter, Tire
- **Oil** - Oil change records (brand, weight, type)
- **OilFilter** - Oil filter records (brand, model)
- **Tire** - Tire information (brand, size)
- **ServiceLog** - Service history with serviceDate, description, mileage, repair_cost, service_type

### Entity Files Location
All entities are in `frontend/src/entities/`:
- `user/user.entity.ts`
- `vehicles/vehicle.entity.ts` (with Oil/OilFilter/Tire relations)
- `vehicles/oil.entity.ts`
- `vehicles/oil-filter.entity.ts`
- `vehicles/tire.entity.ts`
- `service-log/service-log.entity.ts`

### Naming Strategy
TypeORM uses a DefaultNamingStrategy which converts PascalCase entity names to lowercase_snake_case table/column names (e.g., `User.emailAddress` → `user.email_address`).

## State Management

Auth state is managed via React Context:
- **AuthContext** - Boolean indicating authentication status
- **AuthDispatchContext** - Dispatcher function to toggle auth state
- Stored in `sessionStorage` via "vsm-token" key

The provider stack in `provider.tsx`:
1. ChakraProvider (theme system)
2. Theme with dark appearance (next-themes)

## UI Component Architecture

Reusable components in `frontend/src/components/`:

### Segments
- **navbar.tsx** - Navigation bar

### UI Primitives
Located in `ui/` subdirectory:
- **button.tsx** - Button component with variants
- **input-group.tsx** - Input wrapper with label
- **field.tsx** - Field wrapper for form inputs
- **select.tsx, controlled-select.tsx, editable-select.tsx** - Dropdown components
- **dialog.tsx, dialog-button.tsx** - Modal dialogs
- **table.tsx** - Data table component
- **editable-input.tsx** - Inline editable input

## Key Configuration Files

### next.config.ts
- Enables optimizePackageImports for @chakra-ui/react
- Sets output: "standalone" for static generation

### tsconfig.json
- Target: ES2017
- Strict mode enabled (except strictPropertyInitialization)
- Module resolution: bundler
- Path alias: @/* maps to ./src/*

### .eslintrc.json
- Extends next/core-web-vitals and next/typescript
- Disabled: no-explicit-any, no-unused-vars for flexibility

## TypeScript Path Aliases

The project uses `@` as path prefix:
- `@/*` → `./src/*`
- `@/entities/...` → `./src/entities/...`
- `@/core/...` → `./src/core/...`
- `@/providers/...` → `./src/providers/...`

## API Client (core/api.ts)

The centralized axios instance configured in `core/api.ts`:
- Base URL: /api (Next.js auto-prefixes)
- Request interceptor attaches JWT token from sessionStorage
- Response interceptor handles 401 redirects to /login

### Error Handling
- **handleValidationError**: Extracts validation error messages from server responses
- Automatic redirect on 401 Unauthorized errors

## Database Initialization Script

The `db/init/init.sql` script:
1. Creates all tables with proper constraints (primary keys, unique, foreign keys)
2. Uses serial columns for auto-increment IDs
3. Sets sequence values to max ID after inserts
4. All timestamps use PostgreSQL defaults (`default now()`)

## Form Actions Pattern

Some pages use server-side actions in `frontend/src/app/.../*.action.ts`:
- Location: `login/login.action.ts`, `register/register.action.ts`
- Handles form submission with validation and mutations
- Returns data for client-side rendering
