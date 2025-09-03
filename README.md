# 🏃‍♂️ Nike Store - Premium Athletic Wear E-commerce

A modern, SEO-optimized e-commerce platform built with Next.js 15, featuring Nike's latest athletic wear, sneakers, and sports equipment with comprehensive SEO optimizations.

## 🚀 Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse premium Nike products with high-quality images
- **Shopping Cart**: Add, remove, and manage products with Zustand state management
- **Responsive Design**: Mobile-first design with TailwindCSS v4
- **Real-time Inventory**: Live stock tracking and availability

### 🔍 SEO & Performance Optimizations
- **Structured Data**: Rich snippets for products, organization, and website
- **Dynamic Sitemap**: Auto-generated XML sitemap with product pages
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Image Optimization**: Next.js Image component with lazy loading
- **Core Web Vitals**: Optimized for Google's performance metrics
- **PWA Ready**: Progressive Web App with manifest and service worker

### 🛡️ Security & Best Practices
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Secure form handling and API validation
- **Image Security**: Configured remote patterns for external images
- **Environment Variables**: Secure configuration management

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS v4 with custom design system
- **State Management**: Zustand for shopping cart and global state
- **TypeScript**: Full type safety throughout the application
- **Icons**: Heroicons for consistent iconography

### Backend & Database
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Icons**: Heroicons

## Features

- 🛍️ Product catalog with Nike shoes and apparel
- 🛒 Shopping cart functionality
- 📱 Responsive design
- 🔐 Authentication with Better Auth
- 💾 PostgreSQL database with Drizzle ORM
- ⚡ Fast development with Next.js 15 and Turbopack

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Setup
1. Copy `.env.example` to `.env.local`
2. Get your Neon PostgreSQL database URL from [Neon Console](https://console.neon.tech)
3. Update the `.env.local` file:

```env
DATABASE_URL="your_neon_database_url_here"
BETTER_AUTH_SECRET="your_secret_key_here"
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Database Setup
Generate and run database migrations:
```bash
npm run db:generate
npm run db:push
```

### 4. Seed the Database
Populate the database with sample Nike products:
```bash
npm run seed
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run seed` - Seed database with sample data

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts    # Better Auth API routes
│   │   └── products/route.ts          # Products API endpoint
│   └── page.tsx                       # Home page
├── components/
│   ├── Header.tsx                     # Navigation header with cart
│   ├── ProductCard.tsx               # Individual product card
│   ├── Loading.tsx                   # Loading component
│   └── CartSidebar.tsx               # Shopping cart sidebar
├── lib/
│   ├── auth.ts                       # Better Auth configuration
│   ├── auth-client.ts               # Client-side auth utilities
│   ├── db.ts                        # Database connection
│   ├── schema.ts                    # Drizzle schema definitions
│   └── store.ts                     # Zustand state management
└── scripts/
    └── seed.ts                      # Database seeding script
```
