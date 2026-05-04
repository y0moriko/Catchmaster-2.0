# CatchMaster V2

A modern fishery catch management system built with Next.js, Prisma, and SQLite.

## Features

- Dashboard with analytics and reports
- Fisherman management
- Catch recording and tracking
- Authentication with NextAuth
- Admin invite system

## Tech Stack

- **Framework:** Next.js 16
- **Database:** SQLite (Prisma ORM)
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_INVITE_CODE="your-invite-code"
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
npm run seed
```

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── lib/              # Utilities and configurations
│   ├── actions/      # Server actions
│   ├── auth.ts       # Auth configuration
│   └── prisma.ts     # Database client
└── types/            # TypeScript type definitions
```

## License

MIT
