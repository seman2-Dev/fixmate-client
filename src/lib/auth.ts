import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is required");
}
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required");
}

const client = new MongoClient(mongoUri);
const db = client.db(process.env.DB_NAME || "fixmatedb");
const googleClientId = process.env.BETTER_AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.BETTER_AUTH_GOOGLE_CLIENT_SECRET;
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const productionUrl = vercelUrl ? `https://${vercelUrl.replace(/^https?:\/\//, "")}` : undefined;
const configuredUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  productionUrl ||
  "http://localhost:3000";
const trustedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(productionUrl ? [productionUrl] : []),
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean) || []),
];

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      "localhost:3000",
      "127.0.0.1:3000",
      "fixmate-client.vercel.app",
      "*.vercel.app",
    ],
    protocol: "auto",
    fallback: configuredUrl,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: { type: "string", required: false, input: true },
      area: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
    },
  },

  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});
