import { fetchSiteSettings, type PortalSiteSettings } from '@/lib/portal';
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SOCIAL_PROFILES, TWITTER_HANDLE } from './config';

/**
 * The site's identity: what an admin set in the portal where there is a value, the built-in
 * constants where there isn't. One function, so every consumer (metadata, robots, structured data)
 * agrees. The fetch is cached for a minute by the portal client.
 */
export async function getSiteConfig() {
    const settings: PortalSiteSettings | null = await fetchSiteSettings();
    const name = settings?.siteName || SITE_NAME;
    const tagline = settings?.tagline || SITE_TAGLINE;

    return {
        settings,
        name,
        tagline,
        description: settings?.description || SITE_DESCRIPTION,
        titleTemplate: settings?.titleTemplate || `%s | ${name}`,
        shareImage: settings?.shareImage || DEFAULT_OG_IMAGE,
        twitterHandle: settings?.twitterHandle || TWITTER_HANDLE,
        profiles: settings
            ? Array.from(new Set(Object.values(settings.social).filter((url): url is string => Boolean(url))))
            : [],
        builtInProfiles: SOCIAL_PROFILES,
        allowIndexing: settings?.allowIndexing ?? true,
    };
}
