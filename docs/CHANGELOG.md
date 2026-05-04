# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-05-02

### Added
- **Fishermen Management Module:**
  - Implemented full CRUD Server Actions in `src/lib/actions/fisherman.ts`.
  - Created card-based UI with search and barangay filtering.
  - Added `AddFishermanModal` component for new registrations.
- **Catch Logging System:**
  - Developed multi-entry catch logging form in `src/components/catches/CatchLoggingForm.tsx`.
  - Implemented transactional database actions in `src/lib/actions/catch.ts` to link catches with multiple species details.
- **Database Seeding:**
  - Created `prisma/seed.ts` to initialize roles (`admin`, `staff`), common fish species (Tambakol, Tanigue, etc.), and a default admin user.
- **Dynamic Dashboard:**
  - Connected dashboard summary cards to live database aggregations (Total Weight, Active Fishermen, Top Species).
  - Implemented live "Recent Catches" feed.
- **Reports Page:**
  - Created a dedicated reports shell at `/reports` with export and filtering UI.

### Changed
- **Database Migration:**
  - Transitioned from PostgreSQL to **SQLite** for easier local development.
  - Updated connection string in `.env` to `file:./dev.db`.
- **Prisma 7 Architecture:**
  - Migrated `schema.prisma` to use the new Prisma 7 `prisma-config` pattern.
  - Moved connection URLs to `prisma.config.ts`.
  - Configured custom client output to `src/generated/client`.
  - Implemented `PrismaBetterSqlite3` driver adapter in `src/lib/prisma.ts`.
- **Removed Bypass Mode:**
  - Deleted mock data logic; the application now relies entirely on live database queries.

## [Initial Prototype] - 2026-04-26

### Added
- **Project Initialization:**
  - Initialized Next.js project with TypeScript, Tailwind CSS v4, and App Router.
  - Configured NextAuth.js for credentials-based authentication.
- **UI & Design:**
  - Implemented system motif: **Slate Blue (#1e293b)** and **White**.
  - Created responsive Dashboard layout with Sidebar and Topbar navigation.
- **Database:**
  - Defined initial schema for `User`, `Role`, `Fisherman`, `FishSpecies`, `Catch`, and `CatchDetail`.
