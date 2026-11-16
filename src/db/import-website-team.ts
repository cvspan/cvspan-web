/**
 * One-off: copies the team that was hard-coded in the website (src/components/ui/data/index.ts)
 * into the portal, so the Team page looks the same the moment it starts reading from here.
 *
 * Pictures stay as paths on the website (/assets/images/team/…), which the website still serves.
 * Does nothing if there are already people in the table, so it cannot double up. Safe to re-run.
 *
 *   npm run db:import-website-team [path to the website's data file]
 */
import { sql } from "./sql";

const DEFAULT_SOURCE = "/Users/m.arfo/Documents/GitHub/website-frontend/src/components/ui/data/index.ts";

type Team = { id: string; name: string; role: string; avatar: string; bio: string[] };

async function main() {
  const [{ n }] = await sql`select count(*)::int as n from website_team_members`;
  if (n > 0) {
    console.log(`Already has ${n} people; nothing imported.`);
    return;
  }

  const { TEAMS } = (await import(process.argv[2] ?? DEFAULT_SOURCE)) as { TEAMS: Team[] };
  let order = 0;
  for (const person of TEAMS) {
    order += 1;
    await sql`
      insert into website_team_members (slug, name, role, bio, photo_url, sort_order)
      values (
        ${person.id}, ${person.name}, ${person.role},
        ${person.bio?.length ? person.bio.join("\n\n") : null},
        ${person.avatar || null}, ${order}
      )
    `;
  }
  console.log(`Imported ${order} people`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
