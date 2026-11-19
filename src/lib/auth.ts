import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { db, mongoClient } from "./mongo";

/**
 * BetterAuth with the MongoDB Atlas adapter (database `fixmatedb`).
 * The adapter uses plural collections: users, sessions, accounts, verifications.
 * Role/phone/area/bio are BetterAuth additional fields on the users collection.
 */
export const auth = betterAuth({
  appName: "FixMate",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient, usePlural: true }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
        // Server-side rule: nobody can sign up as admin.
        transform: { input: (value) => (value === "technician" ? "technician" : "customer") },
      },
      phone: { type: "string", required: false, defaultValue: "", input: true },
      area: { type: "string", required: false, defaultValue: "", input: true },
      bio: { type: "string", required: false, defaultValue: "", input: true },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const body = ctx.body as { password?: unknown } | undefined;
        const password = body?.password;
        if (
          typeof password !== "string" ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password)
        ) {
          throw new APIError("BAD_REQUEST", {
            message: "Password needs at least one uppercase and one lowercase letter",
          });
        }
      }
      // Only an admin (Express API) may change roles; never through profile updates.
      if (ctx.path === "/update-user" && ctx.body && "role" in ctx.body) {
        delete (ctx.body as Record<string, unknown>).role;
      }
    }),
  },
});

export type AuthSession = typeof auth.$Infer.Session;
