/*
 * The raw SQL connection the one-off scripts in this folder use (migrations, imports, backfills):
 * `sql` is a tagged template that returns rows, and `sql.query(text)` runs a plain string. It picks
 * the same driver as the app (see index.ts), so the same scripts work against Neon and against a
 * plain Postgres server.
 */
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { driverFor } from "./index";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set.");

/** Scripts read columns they know exist, as `neon` lets them; the rows are not worth a type per query. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rows = Record<string, any>[];
export type Sql = {
  (strings: TemplateStringsArray, ...values: unknown[]): PromiseLike<Rows>;
  query: (text: string) => PromiseLike<Rows>;
  /** Neon-only: several statements in one transaction. Plain Postgres runs them one after another in `psql` instead. */
  transaction: (queries: PromiseLike<unknown>[]) => PromiseLike<unknown>;
};

function connect(): Sql {
  if (driverFor(url!) === "neon") return neon(url!) as unknown as Sql;

  /** One connection that closes itself a second after the script stops asking, so the script can exit. */
  const client = postgres(url!, { max: 1, idle_timeout: 1, connect_timeout: 10 });
  return Object.assign(
    (strings: TemplateStringsArray, ...values: unknown[]) => client(strings, ...(values as never[])) as unknown as PromiseLike<Rows>,
    {
      query: (text: string) => client.unsafe(text) as unknown as PromiseLike<Rows>,
      transaction: () => {
        throw new Error(
          "This one-off migration needs a transaction and only runs against Neon. On a new database, `npm run db:push` creates the current schema directly.",
        );
      },
    },
  );
}

export const sql = connect();
