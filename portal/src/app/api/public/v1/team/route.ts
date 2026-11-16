import { getPublicTeam } from "@/db/queries-team";
import { portalPublicUrl, preflight, publicJson } from "@/lib/public-api";
import { toPublicTeamMember } from "@/lib/public-content";

/**
 * GET /api/public/v1/team
 * The people on the website's Team page, in the order set in the portal. Hidden people are left out.
 */
export async function GET(request: Request) {
  const portalUrl = portalPublicUrl(request);
  const members = await getPublicTeam();
  return publicJson(request, { members: members.map((member) => toPublicTeamMember(member, portalUrl)) });
}

export const OPTIONS = (request: Request) => preflight(request, { write: false });
