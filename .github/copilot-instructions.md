# Copilot Instructions for AI Coding Agents

## Project Overview
- **Purpose:** Frontend for SEHAB's research instruments system (Secretaria de Habitação de São Paulo).
- **Stack:** React + TypeScript + Vite, TanStack Router, TanStack Query, Axios, MSW, and Socket.IO client; Tailwind CSS and ShadCN UI for styling.
- **Structure:**
  - `src/` contains all source code, organized by feature and component type.
  - `src/components/` holds UI, form, and utility components, often grouped by domain (e.g., `forms/`, `ui/`, `formController/`).
  - `src/service/` contains the Axios demo client and service helpers.
  - `src/mocks/` contains MSW handlers and browser worker setup for all simulated API data.
  - `src/hooks/` for custom React hooks.
  - `src/lib/` and `src/utils/` for shared utilities and configuration.

## Key Patterns & Conventions
- **Form Handling:**
  - Uses `React Hook Form` and `Zod` for schema validation.
  - Form definitions and logic are modularized under `src/components/forms/` and `src/components/formController/`.
  - Input masking via `Cleave.js`.
- **UI Components:**
  - Prefer ShadCN UI primitives in `src/components/ui/` for consistency.
  - Custom UI logic (e.g., modals, avatars) is in `src/components/ui/` and `src/components/` subfolders.
- **API and demo data:**
  - The app runs without a backend; keep all API requests on the local `/mock-api` origin and implement responses in `src/mocks/handlers.ts`.
  - Use `src/service/demo.api.ts` for Axios requests; do not add external API URLs or direct backend connections.
  - Socket.IO is opt-in and must remain disconnected by default; create clients through `src/service/realtime.client.ts`.
- **Navigation and queries:**
  - Use TanStack Router for app routes and TanStack Query for server-state-style data.
- **State & Data Flow:**
  - Use React context and hooks for state management; avoid global state libraries.
  - Shared logic is extracted to `src/hooks/` and `src/utils/`.
- **Styling:**
  - Tailwind CSS is the default for styling; avoid inline styles.
  - Theme configuration in `src/lib/theme-config.json` and utilities in `src/lib/theme-utils.ts`.

## Developer Workflows
- **Development:**
  - Start with `npm run dev` (Vite dev server).
  - Use `pnpm` or `npm` for dependency management (see `pnpm-lock.yaml`).
- **Build:**
  - Run `npm run build` to generate production assets.
- **Testing:**
  - No explicit test runner found; add tests under `src/` if needed, following the component structure.
- **Debugging:**
  - Use `src/components/debug/` tools only for local demo/MSW diagnostics; do not add production/local backend switching.

## Integration & Extensibility
- **Mock API:**
  - Add simulated API routes to `src/mocks/handlers.ts`; do not connect to external backends or lookup services.
- **Adding Forms:**
  - Place new form definitions in `src/components/forms/` and connect logic via `formController/`.
- **Adding UI Components:**
  - Add to `src/components/ui/` and follow ShadCN UI conventions.

## Examples
- To add a new API resource, create a service in `src/service/` and import it where needed.
- To add a new form section, define it in `src/components/forms/[your-section]/` and register it in the relevant controller.

## References
- See `README.md` for stack and setup.
- Explore `src/components/` and `src/service/` for main patterns.

---

*Update this file if you introduce new architectural patterns or workflows.*
