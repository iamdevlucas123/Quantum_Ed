
import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "https://meusite.com",
  ],

  methods: ["GET", "POST", "PUT", "DELETE"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  credentials: true,
};