import { betterAuth } from "better-auth";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";

import { db } from "@/server/db";
import { env } from "@/env";
import { Polar } from "@polar-sh/sdk";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { P } from "node_modules/better-auth/dist/shared/better-auth.DIwF0vtL";

export const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: "sandbox",
});
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://dayfly-oligochaetous-florentino.ngrok-free.dev",
  ],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "92924f6e-f751-467b-bac0-599a30f24e60", // ID of Product from Polar Dashboard
              slug: "medium", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            },
            {
              productId: "8fb266a2-aa86-4470-9307-18f399756119", // ID of Product from Polar Dashboard
              slug: "large", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            },
          ],
          successUrl: "/",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;
            if (!externalCustomerId) {
              console.error("No external customer Id found.");
              throw new Error("No external customer id found.");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;
            switch (productId) {
              case "92924f6e-f751-467b-bac0-599a30f24e60":
                creditsToAdd = 5;
                break;

              case "8fb266a2-aa86-4470-9307-18f399756119":
                creditsToAdd = 10;
                break;
            }

            await db.user.update({
              where: {
                id: externalCustomerId,
              },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });
          },
        }),
      ],
    }),
  ],
});
