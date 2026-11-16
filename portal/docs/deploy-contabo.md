# Deploying the portal to your own server (Contabo)

The portal is an ordinary Node.js app plus a Postgres database. This guide covers a server you run yourself:
the database on the Contabo Postgres server, the portal as a long-running Node process behind Caddy.

What was tested, and what was not:

- **Tested:** a production build, the app signing in and working against a plain Postgres 16 built from scratch
  with `npm run db:push`, including uploads (binary data), lists, raw queries and all-or-nothing batches.
- **Not tested here, so check them on the server:** your Contabo Postgres itself (version, TLS, firewall), Caddy,
  the process manager, and the data copy from Neon. The commands below are standard but were not run against your
  server.

## 0. Passwords

People sign in with a password that only they know:

- You create the first Super admin with `npm run db:create-admin` (section 1).
- After that, HR and admins open a person's profile and press **Set password** (or **Reset password**). A
  temporary password is shown once, to pass on in person or in a message. It is stored only as a hash.
- The person is made to choose their own password the first time they sign in, and can change it later in
  Settings. Changing or resetting a password signs out every older session.
- After 8 wrong passwords for one email in 15 minutes, sign-in pauses for that email. Resetting the password
  clears the pause.

Passwords are at least 10 characters, cannot be a common password (the old demo one is blocked), and cannot
contain the person's email or name. The portal does not send email, so there is no "forgot password" link: a person
who forgets asks HR or an admin for a new temporary one.

Never run `npm run db:seed` on the production database: it wipes tables and gives every account the same known
demo password. If you copy data from Neon (option B below), every account in it still has that demo password, so
reset them all or start fresh.

## 1. The database

Postgres **13 or newer** (the schema uses `gen_random_uuid()`, built in from 13). Create a database and a login that
owns only it:

```sql
create role cvspan_app login password '…a long random password…';
create database cvspan owner cvspan_app;
```

Allow connections only from where the portal runs (same machine: `localhost`; otherwise firewall port 5432 to that
address and turn TLS on). Connection string for the portal:

```
postgresql://cvspan_app:PASSWORD@HOST:5432/cvspan?sslmode=require
```

Use `sslmode=disable` only when the database and portal are on the same machine. Special characters in the
password must be percent-encoded in the URL.

### Option A, a fresh start (recommended)

```bash
cd cvspan-portal
npm ci
export DATABASE_URL='postgresql://cvspan_app:PASSWORD@HOST:5432/cvspan?sslmode=require'
npm run db:push          # creates every table from the current schema
ADMIN_EMAIL=you@cvspan.com ADMIN_NAME='Your Name' ADMIN_PASSWORD='a long passphrase' npm run db:create-admin
```

`db:push` builds the whole current schema, so none of the `db:migrate-*` scripts are needed on a new database.

### Option B, keep the data from Neon

Run this on a machine with the Postgres client tools (`brew install libpq`, or `apt install postgresql-client`).
The dump holds staff personal data, password hashes and every uploaded file: keep it private and delete it after.

```bash
pg_dump --no-owner --no-privileges -Fc "$NEON_URL" -f cvspan.dump
pg_restore --no-owner --no-privileges -d "$CONTABO_URL" cvspan.dump
```

The restored schema is already current, so no migrations are needed. Check it:

```bash
psql "$CONTABO_URL" -c "select count(*) from users" -c "select count(*) from media"
```

Then reset every password (section 0): the copied accounts still use the demo password.

## 2. The portal

Build **on the server, with the environment set**, because the `NEXT_PUBLIC_*` values are baked in at build time.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | the connection string above |
| `AUTH_SECRET` | a new random value (`npx auth secret`), never reuse the development one |
| `AUTH_URL` | the public **origin only**, for example `https://www.cvspan.com` (no `/portal`) |
| `NEXT_PUBLIC_WEBSITE_URL` | `https://www.cvspan.com` |
| `PORTAL_PUBLIC_URL` | `https://www.cvspan.com/portal` |
| `WEBSITE_ORIGINS` | `https://cvspan.com,https://www.cvspan.com` |
| `WEBSITE_REVALIDATE_URL`, `WEBSITE_REVALIDATE_SECRET` | optional: makes website changes show at once |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional; Site settings can override it |
| `DATABASE_POOL_MAX` | optional, default 10 |

```bash
npm ci
npm run build
npm run start            # port 3000; set PORT to change it
```

Keep it running with a process manager. A systemd unit (`/etc/systemd/system/cvspan-portal.service`):

```ini
[Unit]
Description=CVSpan portal
After=network.target

[Service]
WorkingDirectory=/srv/cvspan-portal
EnvironmentFile=/srv/cvspan-portal/.env.production
ExecStart=/usr/bin/npm run start
Restart=always
User=cvspan

[Install]
WantedBy=multi-user.target
```

Put the same variables in `/srv/cvspan-portal/.env.production`, readable only by that user (`chmod 600`).

### Caddy

If the portal is served on its own host name:

```
portal.cvspan.com {
    reverse_proxy localhost:3000
}
```

The portal lives under the `/portal` prefix, so its pages are at `https://portal.cvspan.com/portal/...`. If the
website serves `cvspan.com/portal`, set `PORTAL_ORIGIN` on the website to the portal's address and it proxies that
prefix (see `docs/website-integration.md`).

## 3. The website

Merge the website branch, set `PORTAL_ORIGIN` (the portal's address, no trailing slash), `NEXT_PUBLIC_PORTAL_API_URL`
(`https://www.cvspan.com/portal/api/public/v1`), and `REVALIDATE_SECRET` (the same value as
`WEBSITE_REVALIDATE_SECRET` in the portal). Deploy the portal first: the website reads from it.

## 4. Smoke test, in this order

1. `https://…/portal/login` loads, and you can sign in as the admin you created.
2. `…/portal/api/public/v1/team`, `/blog`, `/careers`, `/site-settings` each answer 200 with JSON.
3. Upload a picture (Settings, change photo) and reload: it shows, and survives a restart of the portal.
4. Roles & access, People and Attendance open without errors. The Attendance page shows you as clocked in.
5. Save something in Site settings, then check the website's `/robots.txt` and home page reflect it within a minute.
6. The website's Team page lists the people from the portal.

## 5. Rolling back

Keep the Neon database untouched until the new server has run for a few days. To go back, point `DATABASE_URL` at
Neon again and restart: the portal picks the driver from the address, so no code change is needed.

## Notes

- **Backups:** nothing backs up your server's database by itself. Schedule `pg_dump` nightly, copy it off the
  machine, and try a restore.
- **Uploaded images and CVs live in the database** (they are stored in Postgres). That is fine at this size, but it
  makes backups larger; moving them to object storage is the first scaling step (`docs/architecture-scale-review.md`).
- **One server process** is enough for staff use. To run several, the only shared state is the database.
