# 2HOL Town Hall - Community Terminal

A Next.js application for managing Two Hours One Life town resources, infrastructure, issues, and projects.

## Getting Started

### Development Mode
To run the development server with hot-reload:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production Build (Testing)
To build and test the production version locally (simulating the Vercel deployment):

1. **Build the application:**
   ```bash
   npm run build
   ```
   This compiles the code and checks for errors.

2. **Start the production server:**
   ```bash
   npm start
   ```
   This serves the built application at [http://localhost:3000](http://localhost:3000).

## Features
- **Status Dashboard:** Track town resources (Food, Water, Tools, Medicine)
- **Infrastructure:** Monitor key buildings (Bakery, Smithy, Wells, etc.)
- **Project Management:** Track active community projects and progress
- **Issue Tracking:** Report and resolve town issues
- **Authentication:** secure "Eve" login for admin capabilities

## Tech Stack
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** Vercel Postgres
- **Auth:** Custom Context-based Auth
