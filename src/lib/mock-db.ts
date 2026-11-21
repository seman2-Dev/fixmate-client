"use client";

/**
 * Phase 1 only: a tiny client-side database persisted in localStorage.
 *
 * It enforces the same business rules the Express server will own in Phase 2
 * (status pipeline, duplicate-request guard, role checks, payment gate), so the
 * UI is built against realistic behaviour. Every exported action maps 1:1 to a
 * future API endpoint and returns `{ ok, error }` like an API response would.
 */

import { useSyncExternalStore } from "react";
import {
  DEMO_PASSWORD,
  seedBookings,
  seedPayments,
  seedServices,
  seedUsers,
  type MockUser,
} from "./mock-data";
import type {
  ApprovalStatus,
  Booking,
  BookingStatus,
  Category,
  Payment,
  Role,
  Service,
  ServiceMode,
  User,
} from "./types";
import { uid } from "./utils";

export { DEMO_PASSWORD };

interface CheckoutSession {
  id: string;
  bookingId: string;
  customerEmail: string;
  amount: number;
}

interface DB {
  users: MockUser[];
  services: Service[];
  bookings: Booking[];
  payments: Payment[];
  sessions: CheckoutSession[];
  sessionEmail: string | null;
}

const STORAGE_KEY = "fixmate-mock-db-v1";

const seed: DB = {
  users: seedUsers,
  services: seedServices,
  bookings: seedBookings,
  payments: seedPayments,
  sessions: [],
  sessionEmail: null,
};

let state: DB = seed;
let loaded = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) – keep in-memory state */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: DB) {
  state = next;
  persist();
  emit();
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DB>;
      if (parsed.users && parsed.services && parsed.bookings && parsed.payments) {
        const services = parsed.services.map((service) => {
          if (!/\.svg(?:$|\?)/i.test(service.image)) return service;
          const seeded = seed.services.find((candidate) => candidate._id === service._id);
          return seeded ? { ...service, image: seeded.image } : service;
        });
        state = { ...seed, ...parsed, services } as DB;
        persist();
      }
    }
  } catch {
    /* corrupted storage – fall back to the seed */
  }
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // state may have just been hydrated from storage
  queueMicrotask(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => seed;

/** Subscribe to the whole mock database. */
export function useDB(): DB {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};
/** `false` on the server and during hydration, `true` once client state is live. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function resetMockDB() {
  commit({ ...seed, sessionEmail: null });
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type Result<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

function stripPassword(u: MockUser): User {
  const { password, ...rest } = u;
  void password;
  return rest;
}

export function selectSessionUser(db: DB): User | null {
  if (!db.sessionEmail) return null;
  const u = db.users.find((x) => x.email === db.sessionEmail);
  return u ? stripPassword(u) : null;
}

export function dashboardPathFor(role: Role) {
  return `/dashboard/${role}`;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Result<User> {
  const email = input.email.trim().toLowerCase();
  if (state.users.some((u) => u.email === email)) {
    return fail("An account with this email already exists");
  }
  // Server rule: anything except technician becomes customer. Admin is never selectable.
  const role: Role = input.role === "technician" ? "technician" : "customer";
  const user: MockUser = {
    _id: uid("u"),
    name: input.name.trim(),
    email,
    image: "",
    role,
    phone: "",
    area: "",
    bio: "",
    createdAt: new Date().toISOString(),
    password: input.password,
  };
  commit({ ...state, users: [...state.users, user], sessionEmail: email });
  return { ok: true, data: stripPassword(user) };
}

export function signIn(emailRaw: string, password: string): Result<User> {
  const email = emailRaw.trim().toLowerCase();
  const user = state.users.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return fail("Invalid email or password");
  }
  commit({ ...state, sessionEmail: email });
  return { ok: true, data: stripPassword(user) };
}

export function signOut() {
  commit({ ...state, sessionEmail: null });
}

export function updateProfile(
  email: string,
  patch: { name: string; phone: string; area: string; bio: string; image?: string },
): Result {
  const idx = state.users.findIndex((u) => u.email === email);
  if (idx < 0) return fail("User not found");
  const users = state.users.slice();
  users[idx] = {
    ...users[idx],
    name: patch.name.trim(),
    phone: patch.phone.trim(),
    area: patch.area.trim(),
    bio: patch.bio.trim(),
    image: patch.image ?? users[idx].image,
  };
  // keep denormalised technician name in sync (Phase 2 does this on the server)
  const services = state.services.map((s) =>
    s.technicianEmail === email ? { ...s, technicianName: patch.name.trim() } : s,
  );
  commit({ ...state, users, services });
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export interface ServiceInput {
  title: string;
  category: Category;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
}

export function addService(tech: User, input: ServiceInput): Result<Service> {
  if (tech.role !== "technician") return fail("Only technicians can add services");
  const service: Service = {
    ...input,
    _id: uid("svc"),
    technicianName: tech.name,
    technicianEmail: tech.email,
    approvalStatus: "pending",
    isAvailable: true,
    createdAt: new Date().toISOString(),
  };
  commit({ ...state, services: [service, ...state.services] });
  return { ok: true, data: service };
}

function ownedService(id: string, email: string) {
  const s = state.services.find((x) => x._id === id);
  if (!s) return { error: "Service not found" as const };
  if (s.technicianEmail !== email) return { error: "You can only manage your own services" as const };
  return { service: s };
}

export function updateService(id: string, email: string, input: ServiceInput): Result {
  const r = ownedService(id, email);
  if ("error" in r) return fail(r.error!);
  commit({
    ...state,
    services: state.services.map((s) =>
      s._id === id ? { ...s, ...input, approvalStatus: "pending" as ApprovalStatus } : s,
    ),
  });
  return { ok: true };
}

export function deleteService(id: string, email: string): Result {
  const r = ownedService(id, email);
  if ("error" in r) return fail(r.error!);
  commit({ ...state, services: state.services.filter((s) => s._id !== id) });
  return { ok: true };
}

export function toggleAvailability(id: string, email: string): Result<boolean> {
  const r = ownedService(id, email);
  if ("error" in r) return fail(r.error!);
  const next = !r.service.isAvailable;
  commit({
    ...state,
    services: state.services.map((s) => (s._id === id ? { ...s, isAvailable: next } : s)),
  });
  return { ok: true, data: next };
}

export function setServiceApproval(id: string, actor: User, status: ApprovalStatus): Result {
  if (actor.role !== "admin") return fail("Admin access required");
  commit({
    ...state,
    services: state.services.map((s) => (s._id === id ? { ...s, approvalStatus: status } : s)),
  });
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Bookings                                                            */
/* ------------------------------------------------------------------ */

const ACTIVE: BookingStatus[] = ["requested", "accepted", "in-progress"];

export function createBooking(
  customer: User,
  serviceId: string,
  form: { customerPhone: string; address: string; preferredDate: string; problemDescription: string },
): Result<Booking> {
  if (customer.role !== "customer") return fail("Only customers can request a repair");
  const svc = state.services.find((s) => s._id === serviceId);
  if (!svc || svc.approvalStatus !== "approved" || !svc.isAvailable) {
    return fail("This service is not available");
  }
  const dup = state.bookings.some(
    (b) =>
      b.customerEmail === customer.email &&
      b.serviceId === serviceId &&
      ACTIVE.includes(b.status),
  );
  if (dup) return fail("You already have an active request for this service");

  const booking: Booking = {
    _id: uid("bk"),
    serviceId: svc._id,
    serviceTitle: svc.title,
    serviceImage: svc.image,
    category: svc.category,
    basePrice: svc.basePrice,
    technicianName: svc.technicianName,
    technicianEmail: svc.technicianEmail,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: form.customerPhone.trim(),
    address: form.address.trim(),
    preferredDate: form.preferredDate,
    problemDescription: form.problemDescription.trim(),
    status: "requested",
    finalAmount: svc.basePrice,
    paymentStatus: "unpaid",
    statusHistory: [{ status: "requested", changedAt: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };
  commit({ ...state, bookings: [booking, ...state.bookings] });
  return { ok: true, data: booking };
}

export function cancelBooking(id: string, customerEmail: string): Result {
  const b = state.bookings.find((x) => x._id === id);
  if (!b) return fail("Booking not found");
  if (b.customerEmail !== customerEmail) return fail("This is not your booking");
  if (b.status !== "requested") return fail("Only a requested job can be cancelled");
  commit({
    ...state,
    bookings: state.bookings.map((x) =>
      x._id === id
        ? {
            ...x,
            status: "cancelled" as const,
            statusHistory: [...(x.statusHistory ?? []), { status: "cancelled" as const, changedAt: new Date().toISOString() }],
          }
        : x,
    ),
  });
  return { ok: true };
}

const NEXT: Record<string, BookingStatus[]> = {
  requested: ["accepted", "rejected"],
  accepted: ["in-progress"],
  "in-progress": ["completed"],
};

export function updateBookingStatus(
  id: string,
  techEmail: string,
  next: BookingStatus,
  finalAmount?: number,
): Result {
  const b = state.bookings.find((x) => x._id === id);
  if (!b) return fail("Booking not found");
  if (b.technicianEmail !== techEmail) return fail("Only the assigned technician can update this job");
  if (!(NEXT[b.status] ?? []).includes(next)) {
    return fail(`A ${b.status} job cannot move to ${next}`);
  }
  if (next === "completed" && !(typeof finalAmount === "number" && finalAmount > 0)) {
    return fail("Enter a final amount greater than 0");
  }
  commit({
    ...state,
    bookings: state.bookings.map((x) =>
      x._id === id
        ? {
            ...x,
            status: next,
            finalAmount: next === "completed" ? finalAmount! : x.finalAmount,
            statusHistory: [...(x.statusHistory ?? []), { status: next, changedAt: new Date().toISOString() }],
          }
        : x,
    ),
  });
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Payments (mock of Stripe Checkout)                                  */
/* ------------------------------------------------------------------ */

export function createCheckoutSession(bookingId: string, customerEmail: string): Result<string> {
  const b = state.bookings.find((x) => x._id === bookingId);
  if (!b) return fail("Booking not found");
  if (b.customerEmail !== customerEmail) return fail("This is not your booking");
  if (b.status !== "completed" || b.paymentStatus !== "unpaid") {
    return fail("Only completed, unpaid jobs can be paid");
  }
  const session: CheckoutSession = {
    id: `cs_test_${uid("")}`.replace("_", ""),
    bookingId,
    customerEmail,
    amount: b.finalAmount, // amount always comes from the stored booking, never the client
  };
  commit({ ...state, sessions: [...state.sessions, session] });
  return { ok: true, data: session.id };
}

export function getCheckoutSession(sessionId: string) {
  const s = state.sessions.find((x) => x.id === sessionId);
  if (!s) return null;
  const booking = state.bookings.find((b) => b._id === s.bookingId);
  return booking ? { session: s, booking } : null;
}

/** Idempotent: verifying the same session twice never creates a second payment. */
export function verifyCheckoutSession(
  sessionId: string,
  customerEmail: string,
): Result<Payment> {
  const existing = state.payments.find((p) => p.stripeSessionId === sessionId);
  if (existing) return { ok: true, data: existing };

  const found = getCheckoutSession(sessionId);
  if (!found) return fail("Payment session not found");
  const { session, booking } = found;
  if (session.customerEmail !== customerEmail) return fail("This payment belongs to another account");
  if (booking.paymentStatus === "paid") return fail("This booking is already paid");

  const payment: Payment = {
    _id: uid("pay"),
    bookingId: booking._id,
    serviceTitle: booking.serviceTitle,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    technicianName: booking.technicianName,
    technicianEmail: booking.technicianEmail,
    amount: session.amount,
    currency: "usd",
    transactionId: `pi_${uid("3Q")}${Math.random().toString(36).slice(2, 8)}`,
    stripeSessionId: session.id,
    paymentStatus: "paid",
    paidAt: new Date().toISOString(),
  };
  commit({
    ...state,
    payments: [payment, ...state.payments],
    bookings: state.bookings.map((b) =>
      b._id === booking._id
        ? {
            ...b,
            paymentStatus: "paid" as const,
            statusHistory: [...(b.statusHistory ?? []), { status: "paid" as const, changedAt: new Date().toISOString() }],
          }
        : b,
    ),
  });
  return { ok: true, data: payment };
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export function setUserRole(actor: User, userId: string, role: Role): Result {
  if (actor.role !== "admin") return fail("Admin access required");
  const target = state.users.find((u) => u._id === userId);
  if (!target) return fail("User not found");
  if (target.email === actor.email) return fail("You cannot change your own role");
  commit({
    ...state,
    users: state.users.map((u) => (u._id === userId ? { ...u, role } : u)),
  });
  return { ok: true };
}
