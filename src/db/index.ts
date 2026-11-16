import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createResilientFetch } from "@/lib/resilient-fetch";
import * as schema from "./schema";

/*
 * The portal runs against Neon (reached over HTTP, for serverless hosting) or any ordinary Postgres
 * server such as the Contabo one (reached over TCP, for a long-running Node process). The driver is
 * chosen from DATABASE_URL: a *.neon.tech host uses Neon's HTTP driver, anything else uses postgres.js.
 * Set DATABASE_DRIVER=neon or DATABASE_DRIVER=postgres to force one.
 *
 * Both drivers expose the same query builder, so the rest of the code does not care which one it has.
 * The two things that differ are handled here: `batch` (an atomic group of writes) and `rowsOf`
 * (the shape of a raw `execute` result).
 */

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and add your Postgres connection string.");
}

export type Driver = "neon" | "postgres";

export function driverFor(connectionString: string, forced = process.env.DATABASE_DRIVER): Driver {
  if (forced === "neon" || forced === "postgres") return forced;
  try {
    return new URL(connectionString).hostname.endsWith(".neon.tech") ? "neon" : "postgres";
  } catch {
    return "postgres";
  }
}

export const driver = driverFor(url);

type Db = NeonHttpDatabase<typeof schema>;

/**
 * One connection pool per process, kept on globalThis so a dev-server reload doesn't open another.
 * A long-running server keeps a small pool; idle connections close after 30 seconds.
 */
const globalForDb = globalThis as unknown as { __cvspanPg?: ReturnType<typeof postgres> };

function connect(): Db {
  if (driver === "neon") {
    /** Neon is reached over HTTP; a brief network failure should be retried, not crash the page. */
    neonConfig.fetchFunction = createResilientFetch();
    return drizzleNeon(neon(url!), { schema });
  }

  globalForDb.__cvspanPg ??= postgres(url!, {
    max: Number(process.env.DATABASE_POOL_MAX ?? 10),
    idle_timeout: 30,
    connect_timeout: 10,
  });
  /** The query builder is the same on both drivers; only the type of the HTTP one is declared. */
  return drizzlePostgres(globalForDb.__cvspanPg, { schema }) as unknown as Db;
}

export const db: Db = connect();
export { schema };

/**
 * Runs several writes as one all-or-nothing unit. The callback receives the database to build them
 * with (always use that argument, not the outer `db`), so on plain Postgres they run inside a real
 * transaction, and on Neon they go out as one HTTP batch.
 */
export async function batch(build: (database: Db) => unknown[]): Promise<void> {
  if (driver === "neon") {
    await (db as unknown as { batch: (queries: unknown[]) => Promise<unknown> }).batch(build(db));
    return;
  }

  await (db as unknown as { transaction: <T>(work: (tx: Db) => Promise<T>) => Promise<T> }).transaction(async (tx) => {
    for (const query of build(tx)) await query;
  });
}

/** The rows of a raw `db.execute(...)` result, which Neon wraps in `{ rows }` and postgres.js returns directly. */
export function rowsOf<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  return ((result as { rows?: T[] }).rows ?? []) as T[];
}
