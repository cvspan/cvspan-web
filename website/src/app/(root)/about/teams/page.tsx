import React from 'react';
import TeamPage from '@/components/pages/about/teams';
import { fetchTeam } from '@/lib/portal';

// The team is managed in the CVSpan Portal; pick up changes within a minute.
export const revalidate = 60;

async function page() {
    const team = await fetchTeam();
    return <TeamPage team={team} />;
}

export default page;
