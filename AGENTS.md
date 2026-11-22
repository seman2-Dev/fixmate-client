<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FixMate client — Full-stack Next.js app

Next.js 16.4.6 App Router + React 19 + TypeScript + Tailwind 4, single app (no workspace/monorepo). Product and feature docs live in `README.md`; this file covers what isn't obvious from reading it.

## Verify changes

```bash
npm run lint          # ESLint flat config (eslint.config.mjs)
npx tsc --noEmit      # typecheck — there is no `typecheck` script
npm run build         # succeeds with no backend or env vars
```

Run all three in that order before finishing; each passes on a clean tree. There is **no test runner** of any kind — don't look for one. `npm run dev` is the Turbopack dev server on :3000. Next.js itself has breaking changes vs. your training data: read `node_modules/next/dist/docs/` before writing Next-specific code (see managed block above; `next dev` rewrites only that marker-delimited block, so edit and commit the rest of this file freely).

## Data and authentication

- BetterAuth owns sign-up, sign-in, profile sessions and JWT issuance. The Express server owns protected business data and Stripe operations.
- Public and dashboard data is read from `NEXT_PUBLIC_API_URL` through `src/lib/api-client.ts`, with JWT bearer tokens obtained from BetterAuth.
- Keep mutation responses explicit and surface API errors with toasts. Do not return to the legacy `src/lib/mock-db.ts` as an application data source.
- Session: `useSession()` returns `{ user, ready }`. Guards (`DashboardShell`, `RequireRole`) must wait for `ready` before redirecting — redirecting on `!user` alone bounces signed-in users to `/sign-in` whenever a private route reloads.
- Demo login: password `FixMate1` (`DEMO_PASSWORD` in `src/lib/mock-data.ts`); emails listed in README and hardcoded in `src/components/auth/sign-in-form.tsx`.

## Structure and conventions

- Routes: `src/app/(public)` (home, services, about, sign-in/up), `src/app/dashboard/{customer,technician,admin,profile}` behind the client-side `DashboardShell`, `src/app/payment/*` behind `RequireRole`. `/dashboard` itself renders null and redirects per role.
- shadcn/ui is hand-maintained, not CLI-managed on demand: new-york style (`components.json`), primitives in `src/components/ui` import from the **unified `radix-ui` package** (`import { Dialog as DialogPrimitive } from "radix-ui"`), not `@radix-ui/react-*`. Match that when adding components.
- Tailwind 4 is CSS-first: no `tailwind.config`/`postcss.config` exists and none should be added — the `@tailwindcss/turbopack` loader is wired in `next.config.ts`, design tokens live in `src/app/globals.css`.
- Charts are hand-written SVG and animation is native CSS honoring `prefers-reduced-motion`; don't add chart or animation dependencies.
- Path alias `@/*` → `src/*`.

## Git notes

- BetterAuth and MongoDB are intentional Phase 2 dependencies in the client (`src/lib/auth.ts`, `src/lib/auth-client.ts`, and `src/app/api/auth/[...all]/route.ts`). Never move business mutations into Next.js API routes; Express owns bookings, services, payments and moderation.
- `.gitignore`'s `.env*` pattern also ignores `.env.example`, so it stays untracked — that's expected, not a mistake to fix.
