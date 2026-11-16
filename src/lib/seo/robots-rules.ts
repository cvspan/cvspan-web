type Rule = { userAgent: string; allow: string[]; disallow: string[]; crawlDelay?: number };

/**
 * Turns the extra rules typed in Site settings into robots.txt groups. The portal has already
 * checked every line is a standard directive; unknown lines are dropped here as well.
 */
export function parseRobotsExtra(text: string | null | undefined) {
    const rules: Rule[] = [];
    const sitemaps: string[] = [];
    let current: Rule | null = null;
    let collecting = false;

    for (const raw of (text ?? '').split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const [directive, ...rest] = line.split(':');
        const value = rest.join(':').trim();
        switch (directive.trim().toLowerCase()) {
            case 'user-agent':
                if (!collecting || !current) {
                    current = { userAgent: value, allow: [], disallow: [] };
                    rules.push(current);
                }
                collecting = true;
                break;
            case 'allow':
                current?.allow.push(value);
                collecting = false;
                break;
            case 'disallow':
                current?.disallow.push(value);
                collecting = false;
                break;
            case 'crawl-delay':
                if (current && Number.isFinite(Number(value))) current.crawlDelay = Number(value);
                collecting = false;
                break;
            case 'sitemap':
                if (/^https:\/\//i.test(value)) sitemaps.push(value);
                break;
        }
    }
    return { rules, sitemaps };
}
