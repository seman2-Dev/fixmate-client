# FixMate — Client (Next.js)

On-demand device & home appliance repair booking platform. Verified **technicians** list repair services, **customers** request repairs, track each job step by step and pay with Stripe only after completion, and **admins** moderate listings, users and revenue.

> **Status: Phase 2 in progress.** Authentication and profile storage use BetterAuth with the MongoDB Atlas adapter (database `fixmatedb`). Services, bookings, payments and the admin user-role page still run against the client-side mock database (`src/lib/mock-db.ts`, persisted in `localStorage`) until the Express API is wired.

- **Live URL:** _to be added after deployment_
- **Server repository:** _Phase 2_

## Demo credentials

All demo accounts are seeded into MongoDB Atlas (`users` collection) and use the password `FixMate1`.

| Role | Email |
| --- | --- |
| Admin | `admin@fixmate.dev` |
| Technician | `rafiq@fixmate.dev` (also `nusrat@fixmate.dev`, `imran@fixmate.dev`) |
| Customer | `ayesha@fixmate.dev` (also `tanvir@fixmate.dev`, `sadia@fixmate.dev`) |

Payment test card (mock checkout, same as Stripe test mode): `4242 4242 4242 4242`, any future date, any CVC.

## Key features

- Role-based experience for Customer, Technician and Admin with a sticky navbar, role badge and avatar menu
- Home: hero search, 6 latest approved services (equal-height cards), How It Works, popular categories, trust stats, testimonials
- `/services` search, category and mode filters and sort, all driven by URL params (survive reload; `/services?category=AC` deep links work)
- Service details with a role-restricted repair request form (phone, address, date, 20+ char problem), duplicate-active-request guard
- Job pipeline Requested → Accepted → In Progress → Completed (Rejected / Cancelled), only valid actions shown, final amount set on completion
- Pay Now only for completed + unpaid jobs; success page verification is idempotent (never saves a payment twice)
- Responsive dashboard layout with collapsible sidebar, stat cards and SVG charts, consistent status badges
- Technician service CRUD with approval reset on edit, availability toggle and image upload
- Admin: user roles (cannot change own), service approval, all bookings, transactions with total revenue
- Custom 404, error boundary, loading skeletons, toasts, empty states and confirmation modals
- Protected routes that wait for the session, so reloading a private route never bounces a signed-in user

## Tech and packages

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, `lucide-react` (icons), `sonner` (toasts), `clsx` + `tailwind-merge`, `@fontsource-variable/bricolage-grotesque` and `@fontsource-variable/figtree` (self-hosted fonts). Charts are hand-written SVG (no chart dependency).

Auth/storage: `better-auth` (email/password + MongoDB adapter), `mongodb` (Atlas driver), `tsx` (seed script runner). ImgBB is used for image uploads when `NEXT_PUBLIC_IMGBB_API_KEY` is set.

Phase 2 still adds: Express + JWT API, Stripe checkout/webhook.

## Getting started

```bash
npm install
npm run seed     # creates the demo accounts in MongoDB Atlas (safe to re-run)
npm run dev      # http://localhost:3000
npm run build && npm start
```

### Environment variables

A populated `.env` is required (never committed; `.env.example` is the template):

- `MONGODB_URI` — Atlas connection string; the path must end in `/fixmatedb` (an empty path falls back to the `test` database).
- `BETTER_AUTH_SECRET` — BetterAuth signing secret.
- `BETTER_AUTH_URL` — must match the running origin (e.g. `http://localhost:3000`).
- `NEXT_PUBLIC_IMGBB_API_KEY` — enables ImgBB uploads; without it images fall back to data URLs.
- `NEXT_PUBLIC_API_URL` — reserved for the Express API.

## Project structure

```
src/app/(public)   Home, services, service details, about, sign-in, sign-up
src/app/api/auth   BetterAuth route handler (MongoDB adapter)
src/app/dashboard  customer / technician / admin / profile (guarded layout)
src/app/payment    checkout (Phase 1 stand-in for Stripe), success, cancel
src/components     ui primitives, layout, home, services, dashboard, charts
src/lib            auth + mongo setup, types, mock-db, services-query, seed data
src/scripts        seed script for the demo Atlas accounts
```

## Phase 2 swap points

Each mock-db action maps to one API endpoint and is marked with a `// Phase 2:` comment. `/payment/checkout` is removed when real Stripe Checkout is wired in.
