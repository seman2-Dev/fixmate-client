# FixMate — Client (Next.js)

<p align="center">
  <img src="docs/fixmate-demo.gif" alt="FixMate demo — booking and tracking a repair" />
</p>

On-demand device & home appliance repair booking platform. Verified **technicians** list repair services, **customers** request repairs, track each job step by step and pay with Stripe only after completion, and **admins** moderate listings, users and revenue.

> **Status: Phase 1 (frontend).** All pages, layouts and interactions are built and run against a client-side mock database (`src/lib/mock-db.ts`, persisted in `localStorage`). Phase 2 replaces it with the Express + MongoDB server, BetterAuth, JWT, ImgBB and Stripe.

- **Live URL:** _to be added after deployment_
- **Server repository:** _Phase 2_

## Demo credentials (mock, Phase 1)

All demo accounts use the password `FixMate1`.

| Role | Email |
| --- | --- |
| Admin | `admin@fixmate.dev` |
| Technician | `rafiq@fixmate.dev` (also `nusrat@fixmate.dev`, `imran@fixmate.dev`) |
| Customer | `ayesha@fixmate.dev` (also `tanvir@fixmate.dev`, `sadia@fixmate.dev`) |

Payment test card (mock checkout, same as Stripe test mode): `4242 4242 4242 4242`, any future date, any CVC.

## Design system

"Workshop Warm": warm paper surfaces, deep ink navy and one accessible orange (`--primary` #c2410c). Tokens are shadcn semantic variables in `src/app/globals.css` (`--primary`, `--card`, `--sidebar-*` …) plus the `ink-*` / `brand-*` scales. Status colours: Requested blue, Accepted indigo, In Progress amber, Completed green, Rejected red, Cancelled gray.

## Extras

- Dark theme (toggle in navbar and dashboard header, saved in `localStorage`, follows the OS on first visit)
- `Ctrl/⌘ + K` command palette for pages, categories, services and actions
- Sortable, paginated data tables; all tables become labelled cards on phones

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

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, **shadcn/ui** (new-york style, hand-added components in `src/components/ui` on `radix-ui` + `class-variance-authority`), `lucide-react` (icons), `cmdk` (command palette), `@tanstack/react-table` v8 (sortable, paginated tables), `sonner` (toasts), `clsx` + `tailwind-merge`, `@fontsource-variable/bricolage-grotesque` and `@fontsource-variable/figtree` (self-hosted fonts). Charts are hand-written SVG (no chart dependency). All animation is native CSS (transitions/keyframes + one IntersectionObserver reveal helper) and respects `prefers-reduced-motion`; no animation library.

Phase 2 adds: BetterAuth (MongoDB adapter), Stripe, ImgBB.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

### Environment variables

Phase 1 needs none. Phase 2 will use `.env.local` (never committed); see `.env.example`.

## Project structure

```
src/app/(public)   Home, services, service details, about, sign-in, sign-up
src/app/dashboard  customer / technician / admin / profile (guarded layout)
src/app/payment    checkout (Phase 1 stand-in for Stripe), success, cancel
src/components     ui primitives, layout, home, services, dashboard, charts
src/lib            types, mock-db, services-query, seed data, helpers
```

## Phase 2 swap points

Each mock-db action maps to one API endpoint and is marked with a `// Phase 2:` comment. `/payment/checkout` is removed when real Stripe Checkout is wired in.
