import type { CorsOptions } from "cors";
import { env } from "./env";

export const corsConfig: CorsOptions = {
  origin: env.CORS_ORIGINS,

  methods: ["GET", "POST", "PUT", "DELETE"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
};
