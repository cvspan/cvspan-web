import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { createResilientFetch } from "@/lib/resilient-fetch";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.");
}

/** Neon is reached over HTTP; a brief network failure should be retried, not crash the page. */
neonConfig.fetchFunction = createResilientFetch();

export const db = drizzle(neon(url), { schema });
export { schema };
