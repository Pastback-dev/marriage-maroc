# Arsi – My Wedding

## Overview

Arsi – My Wedding is a fullstack wedding planning platform targeting the Moroccan market. It allows users to browse wedding service providers (traiteurs, wedding halls, DJs, photographers, neggafas), generate AI-powered wedding plans (mock/demo logic, no real AI APIs), manage guest lists, and plan budgets. The app features a Moroccan-themed UI with gold, emerald, and royal blue colors, using custom fonts (Cinzel, Lato, Amiri for Arabic text). This is a demo/MVP project — no real payment processing or AI integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with HMR in development
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state; no global client state library
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (Moroccan wedding color palette)
- **Animations**: Framer Motion for page transitions and hero animations
- **Forms**: React Hook Form with Zod resolvers for validation
- **Image Carousels**: Embla Carousel (via shadcn carousel component)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with TypeScript (via tsx for dev, esbuild for production)
- **Framework**: Express 5
- **Authentication**: Passport.js with Local Strategy (username/password), session-based auth with express-session
- **Password Security**: scrypt hashing with random salt
- **Session Store**: connect-pg-simple (PostgreSQL-backed sessions)
- **API Pattern**: RESTful JSON APIs under `/api/` prefix; route definitions shared between client and server in `shared/routes.ts`

### Shared Layer (`shared/`)
- **Schema**: `shared/schema.ts` — Drizzle ORM table definitions and Zod insert schemas
- **Routes**: `shared/routes.ts` — Typed API route contracts (paths, methods, input/output Zod schemas) shared between frontend and backend
- Tables: `users`, `providers`, `plans`, `guests`

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: node-postgres (`pg` Pool)
- **Connection**: Via `DATABASE_URL` environment variable (required)
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema sync
- **Schema location**: `shared/schema.ts`
- **Migration output**: `./migrations/`

### Key Database Tables
- **users**: id, username (email), password (hashed), displayName, createdAt
- **providers**: id, category, name, description, city, priceMin, priceMax, images (text array), packages (JSONB), rating, contactInfo
- **plans**: id, userId, guestCount, totalBudget, city, weddingStyle, selectedProviders (JSONB), totalCost, createdAt
- **guests**: id, userId, name, type (local/foreign), pricePerGuest

### Build & Deployment
- **Dev**: `npm run dev` — runs tsx with Vite dev server middleware (HMR)
- **Build**: `npm run build` — Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs`
- **Production**: `npm start` — serves static files from `dist/public/` with Express, SPA fallback routing
- **Type checking**: `npm run check` — runs tsc with noEmit

### Pages & Routes
- `/` — Landing page (Home) with hero section and Moroccan wedding theme
- `/login` — Login form
- `/register` — Registration form
- `/plan` — AI Recommendation (mock logic: budget allocation by percentage)
- `/guests` — Guest list management (add/remove, local/foreign classification)
- `/providers` — Browse/filter service providers by category and city
- `/categories` — All categories page with descriptions and provider counts
- `/about` — About Us page with platform info, values, stats, and city coverage
- `/rules` — Platform rules and guidelines for providers and users
- `/moodboard` — Mood board for wedding inspiration (image collection)

### Mock/Demo Features
- AI Planner: Simple percentage-based budget allocation (40% traiteur, 30% hall, 10% DJ, 10% cameraman)
- Provider data is seeded on server startup via `storage.seedProviders()`
- No real payment or AI API integrations

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connected via `DATABASE_URL` environment variable. Used for all data storage and session management.

### Key NPM Dependencies
- **drizzle-orm** + **drizzle-kit**: ORM and migration tooling for PostgreSQL
- **express** (v5): HTTP server framework
- **passport** + **passport-local**: Authentication
- **express-session** + **connect-pg-simple**: Session management with PostgreSQL store
- **@tanstack/react-query**: Server state management on the client
- **wouter**: Client-side routing
- **framer-motion**: Animations
- **react-hook-form** + **@hookform/resolvers**: Form handling with Zod validation
- **shadcn/ui components**: Full suite of Radix-based UI components
- **embla-carousel-react**: Image carousel functionality
- **zod** + **drizzle-zod**: Schema validation (shared between client and server)

### Fonts (External CDN)
- Google Fonts: Cinzel (display), Lato (body), Amiri (Arabic), DM Sans, Geist Mono, Fira Code

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Session encryption key (defaults to `r3pl1t_s3cr3t` in dev)