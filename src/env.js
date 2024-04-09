import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    ADDRESS_ZIP_CODE_API_URL: z.string().url(),
    ADDRESS_ZIP_CODE_API_KEY: z.string(),
    APP_URL: z.string().url(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    SENDGRID_API_KEY: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // OAuth
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    // Lock to hide the app before launch
    APP_SECRET_KEY_LOCK: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ADDRESS_ZIP_CODE_API_URL: process.env.ADDRESS_ZIP_CODE_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    APP_URL: process.env.APP_URL,
    ADDRESS_ZIP_CODE_API_KEY: process.env.ADDRESS_ZIP_CODE_API_KEY,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,

    // OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // Lock to hide the app before launch
    APP_SECRET_KEY_LOCK: process.env.APP_SECRET_KEY_LOCK,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
