# AI Rules & Tech Stack - Arsi Wedding Planner

## Tech Stack
- **Frontend**: React 18 with TypeScript and Vite for fast development.
- **Backend**: Express 5 (Node.js) providing a RESTful JSON API.
- **Database**: PostgreSQL managed via Drizzle ORM for type-safe queries.
- **State Management**: TanStack React Query (v5) for all server-side state and data fetching.
- **Styling**: Tailwind CSS for utility-first styling and responsive design.
- **UI Components**: shadcn/ui (Radix UI primitives) for accessible, high-quality components.
- **Routing**: Wouter for lightweight, hook-based client-side routing.
- **Authentication**: Passport.js with Local Strategy and session-based persistence.
- **Validation**: Zod for schema definition and runtime validation (shared between client/server).
- **Internationalization**: i18next with support for English, French, and Arabic (RTL).

## Library Usage Rules
- **UI Components**: Always prioritize `shadcn/ui` components located in `client/src/components/ui/`. Do not build custom components if a shadcn equivalent exists.
- **Icons**: Use `lucide-react` for all iconography.
- **Data Fetching**: Use `useQuery` and `useMutation` from `@tanstack/react-query`. Do not use `useEffect` for data fetching.
- **Forms**: Use `react-hook-form` with the `@hookform/resolvers/zod` resolver.
- **Routing**: Use `Link` and `useLocation` from `wouter`.
- **Styling**: Use Tailwind utility classes exclusively. Avoid writing custom CSS in `index.css` unless defining theme variables.
- **Schema**: All database tables and Zod schemas must be defined in `shared/schema.ts`.
- **API Routes**: Define API contracts and paths in `shared/routes.ts` to ensure frontend/backend synchronization.
- **Animations**: Use `framer-motion` for transitions and interactive elements.