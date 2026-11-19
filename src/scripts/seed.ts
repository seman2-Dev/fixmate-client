/**
 * Seeds the demo accounts into MongoDB Atlas (database fixmatedb).
 * Run with: npm run seed
 * Safe to re-run: existing emails are skipped.
 */
import { auth } from "../lib/auth";
import { db, mongoClient } from "../lib/mongo";
import { DEMO_PASSWORD, seedUsers } from "../lib/mock-data";

async function main() {
  const users = db.collection("users");

  for (const seed of seedUsers) {
    const existing = await users.findOne({ email: seed.email });
    if (existing) {
      console.log(`skip   ${seed.email} (already exists)`);
      continue;
    }

    try {
      await auth.api.signUpEmail({
        body: {
          name: seed.name,
          email: seed.email,
          password: DEMO_PASSWORD,
          // Admin is never accepted by sign-up; promote the seeded account below.
          role: seed.role === "admin" ? "customer" : seed.role,
          phone: seed.phone,
          area: seed.area,
          bio: seed.bio,
          image: seed.image || undefined,
        },
      });
      if (seed.role === "admin") {
        await users.updateOne({ email: seed.email }, { $set: { role: "admin" } });
      }
      console.log(`create ${seed.email} (${seed.role})`);
    } catch (error) {
      console.error(`fail   ${seed.email}:`, error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }

  console.log("done");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });
