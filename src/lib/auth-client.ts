import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
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
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;