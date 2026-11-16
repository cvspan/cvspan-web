/**
 * Creates the first Super admin on a new, empty database. The seed script is for demos and wipes
 * tables, so it must never run in production; this adds one person and touches nothing else.
 *
 * The details come from the environment so the password never appears in a command line or shell history:
 *
 *   ADMIN_EMAIL=you@cvspan.com ADMIN_NAME="Your Name" ADMIN_PASSWORD='a long passphrase' npm run db:create-admin
 *
 * Refuses if that email already exists. Change the password after your first sign-in.
 */
import bcrypt from "bcryptjs";
import { sql } from "./sql";

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const name = (process.env.ADMIN_NAME ?? "").trim();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Set ADMIN_EMAIL to a valid email address.");
  if (!name) throw new Error("Set ADMIN_NAME to the person's full name.");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");

  const [existing] = await sql`select id from users where email = ${email}`;
  if (existing) throw new Error(`${email} already exists. Nothing was changed.`);

  const passwordHash = await bcrypt.hash(password, 12);
  await sql`
    insert into users (email, name, password_hash, role, status, employment_type, org_level, job_title)
    values (${email}, ${name}, ${passwordHash}, 'super_admin', 'active', 'full_time', 'member', 'Super admin')
  `;
  console.log(`Created Super admin ${name} <${email}>. Sign in, then change the password.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error.message ?? error);
    process.exit(1);
  });
