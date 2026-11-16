# cvspan-web

The CVSpan website and the CVSpan portal, side by side.

| Folder | What it is | Runs on |
| --- | --- | --- |
| `website/` | The public site (cvspan.com): services, work, about, careers, blog | port 2000 |
| `portal/` | The staff portal (cvspan.com/portal): people, attendance, leave, certificates, blog, website settings | port 3000 |

They are two separate Next.js apps with their own `package.json`. The website reads its blog, careers, team and
search settings from the portal's public API (`/portal/api/public/v1/*`), so the portal is deployed first.

## Run both locally

```bash
# portal
cd portal && npm ci
cp .env.example .env.local        # fill in DATABASE_URL, AUTH_SECRET and the rest
npm run dev                       # http://localhost:3000/portal

# website (in another terminal)
cd website && npm ci
echo 'NEXT_PUBLIC_PORTAL_API_URL="http://localhost:3000/portal/api/public/v1"' > .env.local
npm run dev -- -p 2000            # http://localhost:2000
```

Never commit `.env` or `.env.local`. They hold database and mail secrets.

## Where to read next

- `portal/docs/deploy-contabo.md` — deploying to your own server: database, environment, Caddy, smoke tests.
- `portal/docs/website-integration.md` — how the website and portal connect.
- `portal/docs/seo.md` — search, analytics and the Site settings page.
- `portal/docs/architecture-scale-review.md` — bottlenecks and what to do about them.

## Database

The portal uses Postgres. A `*.neon.tech` address uses Neon's HTTP driver; any other address uses a normal Postgres
connection. Create the schema on a new database with `npm run db:push` and the first Super admin with
`npm run db:create-admin` (both in `portal/`). Never run `npm run db:seed` on a real database: it wipes tables.
