// checkout/route.ts
import { env } from "@/env";
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: env.POLAR_ACCESS_TOKEN,
  successUrl: env.POLAR_SUCCESS_URL,
  returnUrl: "https://localhost:3000", // An optional URL which renders a back-button in the Checkout
  server: "sandbox", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
  theme: "dark", // Enforces the theme - System-preferred theme will be set if left omitted
});
