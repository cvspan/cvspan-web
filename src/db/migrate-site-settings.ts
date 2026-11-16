/**
 * The table behind Site settings: one row of search and tracking settings that admins edit in the
 * portal and the website reads. The row is created empty, so until someone fills it in the website
 * behaves exactly as it did.
 *
 * Additive and safe to re-run.
 *
 *   npm run db:migrate-site-settings
 */
import { sql } from "./sql";

async function main() {
  await sql`
    create table if not exists site_settings (
      id text primary key default 'site',
      site_name text, tagline text, description text, title_template text,
      default_share_image text, twitter_handle text,
      facebook_url text, twitter_url text, instagram_url text, linkedin_url text, tiktok_url text, youtube_url text,
      google_verification text, bing_verification text, yandex_verification text, facebook_domain_verification text,
      ga_measurement_id text, gtm_container_id text, meta_pixel_id text, linkedin_partner_id text,
      allow_indexing boolean not null default true,
      robots_extra text, head_tags text, body_start_tags text, body_end_tags text,
      updated_at timestamptz not null default now(),
      updated_by_id uuid references users(id) on delete set null
    )
  `;
  await sql`insert into site_settings (id) values ('site') on conflict (id) do nothing`;
  console.log(await sql`select id, allow_indexing from site_settings`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
