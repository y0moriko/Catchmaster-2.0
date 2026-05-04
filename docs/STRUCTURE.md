🧠 Architecture Style:

Modern Fullstack (Next.js + Server Actions + DB)

[ Client (UI) ]
   ↓
[ Next.js App Router ]
   ↓
[ Server Actions ]
   ↓
[ Database (SQLite) ]

🧩 Core Layers
1. Frontend (Next.js App Router)
   - Pages: `/dashboard`, `/fishermen`, `/catches`, `/reports`
   - UI Components: Tailwind CSS v4, Lucide Icons
   - State: React `useState` for local form state, Server Components for data fetching.

2. Backend (Next.js Server Actions)
   - Logic: Transactional CRUD for Fishermen and Catch records in `src/lib/actions`.
   - Security: NextAuth.js Credentials provider + Role-based access logic.

3. Persistence (Prisma 7 ORM)
   - Provider: SQLite (local `dev.db`)
   - Driver Adapter: `@prisma/adapter-better-sqlite3`
   - Config: Centralized in `prisma.config.ts`

🔑 Database Schema
- **User**: Identity and Authentication.
- **Role**: Access levels (admin, staff).
- **Fisherman**: Specific profile for local fishers (linked to User).
- **FishSpecies**: Catalog of local fish varieties.
- **Catch**: Header record for a fishing trip landing.
- **CatchDetail**: Line items for specific fish species caught in a trip (quantity, weight).

📊 Features
- **Dashboard Overview**: Key metrics (Total Catch, Active Fishermen, Top Species).
- **Fishermen Management**: Card-based interface for registration and monitoring.
- **Catch Logging**: Streamlined entry for recording daily fishing results.
- **Reports**: Data export and filtering (Phase 4).

📁 Folder Structure
- `/src/app`: Routes and Page components.
- `/src/components`: Reusable UI modules (Fishermen, Catches).
- `/src/lib/actions`: Server-side business logic.
- `/src/generated`: Prisma 7 generated client.
- `/prisma`: Schema definition and seed script.
