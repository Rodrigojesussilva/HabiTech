# Copilot Instructions

## Project Overview
- **Purpose:** Full-stack study project demonstrating a fictional housing-management workflow.
- **Frontend:** React, TypeScript, Vite, TanStack Router, TanStack Query, Axios, MSW, Tailwind CSS, and ShadCN UI.
- **Backend:** ASP.NET Core 10, Entity Framework Core, JWT authentication, and local SQL Server.
- **Structure:**
  - `src/` contains the frontend, organized by features and component type.
  - `src/components/` contains UI, form, and navigation components.
  - `src/service/` contains API clients and offline synchronization.
  - `src/mocks/` contains MSW handlers and fictional sample data.
  - `backend/HabiTech.Api/` contains the API and database migrations.
  - `backend/HabiTech.Api.Tests/` contains API integration tests.

## Key Patterns
- Use React Hook Form and Zod for forms and validation.
- Prefer existing Radix/ShadCN primitives and Tailwind utility classes.
- Route backend API requests through the local Vite proxy; MSW supplies mocks for features not yet implemented by the API.
- Local SQL Server LocalDB is the default backend. Do not add cloud provider connections or hard-coded external service URLs.
- Keep Socket.IO disconnected by default.
- Forms should preserve local autosave and offline operation.
- Keep real credentials and connection strings out of source control.

## Developer Workflows
- Frontend: `npm run dev`, `npm run build`, and `npm run lint`.
- Backend: `dotnet run --project backend\HabiTech.Api`.
- Backend tests: `dotnet test backend\HabiTech.Api.Tests\HabiTech.Api.Tests.csproj`.
- See `README.md` and `backend/README.md` for setup and current integration limits.

Update these instructions when the architecture or workflows change.
