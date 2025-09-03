# Nike Shopping App

A Next.js e-commerce application showcasing Nike products with a modern tech stack.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: TailwindCSS with plugins
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **State Management**: Zustand
- **Authentication**: Better Auth (configured but not implemented yet)
- **Code Quality**: ESLint with TypeScript support

## 📁 Project Structure

```
shopping/
├── app/                    # Next.js App Router
│   ├── lib/
│   │   ├── auth.ts        # Better Auth configuration
│   │   ├── getProducts.ts # Database queries
│   │   └── store.ts       # Zustand store & types
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage with product listing
├── drizzle/               # Database setup
│   ├── db.ts             # Database connection
│   ├── schema.ts         # Product table schema
│   ├── seed.ts           # Sample Nike products
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── configuration files...
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   DATABASE_URL="your-neon-postgresql-connection-string"
   AUTH_SECRET="your-secret-key"
   ```

3. **Set up the database**:
   ```bash
   # Generate and apply migrations
   npm run drizzle:generate
   npm run drizzle:migrate
   
   # Seed with sample Nike products
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **View the app**: Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The `products` table includes:
- Basic info: name, description, price, image
- Product details: brand, category, stock, color, size
- Features: rating, isFeatured flag
- Timestamps: createdAt, updatedAt

## 🎨 Features

- ✅ Responsive product grid layout
- ✅ Product cards with images, details, and pricing
- ✅ Database integration with Drizzle ORM
- ✅ TypeScript throughout
- ✅ Seeded with sample Nike products
- ✅ Modern styling with TailwindCSS
- ⏳ Authentication ready (Better Auth configured)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Seed database with products
- `npm run db:test` - Test database connection
- `npm run drizzle:studio` - Open Drizzle Studio

## 📋 Next Steps

1. Add user authentication pages
2. Implement shopping cart functionality
3. Add product detail pages
4. Implement checkout process
5. Add real Nike product images

This is a clean, production-ready foundation for an e-commerce app!

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
