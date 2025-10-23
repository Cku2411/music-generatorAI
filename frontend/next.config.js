/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      new URL(
        "https://music-generation-cku24.s3.ap-southeast-1.amazonaws.com/**",
      ),
    ],
  },
};

export default config;
