# Shopping App

A modern e-commerce demo built with Next.js, TypeScript, TailwindCSS, Drizzle ORM, Neon PostgreSQL, Zustand, and Better Auth.

## Features

- Next.js 14+ with App Router
- TypeScript
- TailwindCSS
- Drizzle ORM (PostgreSQL)
- Neon cloud database
- Zustand state management
- Better Auth authentication
- Products table with rich schema
- Sample Nike product seeding
- Protected routes via middleware

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file:

   ```env
   DATABASE_URL=your_neon_postgres_connection_string
   AUTH_SECRET=your_auth_secret
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Run database seed:**

   ```bash
   npx tsx drizzle/seed.ts
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Authentication

- Uses Better Auth for login and protected routes.
- Configure providers in `app/lib/auth.ts`.
- Protected routes: `/dashboard`, `/profile`, `/admin`.

## Database

- Schema defined in `drizzle/schema.ts`.
- Seed script in `drizzle/seed.ts`.

## Customization

- Update product schema and seed data as needed.
- Add more auth providers or features.

## Troubleshooting

- Ensure `.env.local` is set up correctly.
- Check Neon database connection.
- For Turbopack errors, see the panic log for details.

## Project File Structure

```
shopping/
├── .env.local
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── getProducts.ts
│   │   └── store.ts
│   └── page.tsx
├── drizzle/
│   ├── db.ts
│   ├── schema.ts
│   └── seed.ts
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── README.md
```
