import { CONTACT_EMAIL, OFFICES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES, absoluteUrl } from './config';

/**
 * Schema.org JSON-LD builders.
 *
 * Stable `@id` values let the graph cross-reference itself (e.g. a Service's
 * provider points at the Organization node) instead of duplicating the org on
 * every page — this is what search engines use to consolidate entity signals.
 */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
    return {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        legalName: 'CV Span LLC',
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        email: CONTACT_EMAIL,
        logo: {
            '@type': 'ImageObject',
            url: absoluteUrl('/assets/images/logo.svg'),
            caption: SITE_NAME,
        },
        image: absoluteUrl('/opengraph-image'),
        sameAs: SOCIAL_PROFILES,
        address: OFFICES.map((office) => ({
            '@type': 'PostalAddress',
            streetAddress: office.streetAddress,
            addressLocality: office.addressLocality,
            addressRegion: office.addressRegion,
            postalCode: office.postalCode,
            addressCountry: office.addressCountry,
        })),
        contactPoint: [
            {
                '@type': 'ContactPoint',
                contactType: 'sales',
                email: CONTACT_EMAIL,
                availableLanguage: ['English'],
            },
        ],
        knowsAbout: [
            'UI/UX Design',
            'Product Design',
            'Web Development',
            'Mobile App Development',
            'Brand Identity',
            'Design Systems',
        ],
    };
}

export function websiteSchema() {
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en',
    };
}

/** Professional-service node with both office locations, for local/entity search. */
export function professionalServiceSchema() {
    return OFFICES.map((office, index) => ({
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#office-${index + 1}`,
        name: office.name,
        parentOrganization: { '@id': ORGANIZATION_ID },
        url: SITE_URL,
        email: CONTACT_EMAIL,
        image: absoluteUrl('/opengraph-image'),
        address: {
            '@type': 'PostalAddress',
            streetAddress: office.streetAddress,
            addressLocality: office.addressLocality,
            addressRegion: office.addressRegion,
            postalCode: office.postalCode,
            addressCountry: office.addressCountry,
        },
        areaServed: ['GB', 'NG', 'US', 'Worldwide'],
        priceRange: '$$$',
    }));
}

export function serviceSchema({
    name,
    description,
    path,
    serviceType,
}: {
    name: string;
    description: string;
    path: string;
    serviceType: string;
}) {
    return {
        '@type': 'Service',
        '@id': `${absoluteUrl(path)}#service`,
        name,
        description,
        serviceType,
        url: absoluteUrl(path),
        provider: { '@id': ORGANIZATION_ID },
        areaServed: ['GB', 'NG', 'US', 'Worldwide'],
    };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
    return {
        '@type': 'BreadcrumbList',
        '@id': `${absoluteUrl(trail[trail.length - 1]?.path ?? '/')}#breadcrumb`,
        itemListElement: trail.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
        })),
    };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };
}

export function creativeWorkSchema({
    name,
    description,
    path,
    image,
}: {
    name: string;
    description: string;
    path: string;
    image?: string;
}) {
    return {
        '@type': 'CreativeWork',
        '@id': `${absoluteUrl(path)}#work`,
        name,
        description,
        url: absoluteUrl(path),
        creator: { '@id': ORGANIZATION_ID },
        ...(image ? { image: absoluteUrl(image) } : {}),
    };
}

export function jobPostingSchema({
    title,
    description,
    path,
    employmentType = 'FULL_TIME',
    datePosted,
    validThrough,
    salary,
    skills,
}: {
    title: string;
    /** Plain text or HTML; Google wants the full description, not a teaser. */
    description: string;
    path: string;
    employmentType?: string;
    datePosted: string;
    /** ISO date after which the role is closed. Lets Google drop the listing on time. */
    validThrough?: string | null;
    salary?: {
        min: number | null;
        max: number | null;
        currency: string;
        period: 'year' | 'month' | 'day' | 'hour';
    } | null;
    skills?: string[];
}) {
    const unit = salary && { year: 'YEAR', month: 'MONTH', day: 'DAY', hour: 'HOUR' }[salary.period];

    return {
        '@type': 'JobPosting',
        '@id': `${absoluteUrl(path)}#job`,
        url: absoluteUrl(path),
        title,
        description,
        datePosted,
        ...(validThrough ? { validThrough } : {}),
        employmentType,
        hiringOrganization: { '@id': ORGANIZATION_ID },
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: { '@type': 'Country', name: 'Worldwide' },
        directApply: true,
        ...(skills && skills.length > 0 ? { skills: skills.join(', ') } : {}),
        ...(salary && (salary.min || salary.max)
            ? {
                  baseSalary: {
                      '@type': 'MonetaryAmount',
                      currency: salary.currency,
                      value: {
                          '@type': 'QuantitativeValue',
                          ...(salary.min ? { minValue: salary.min } : {}),
                          ...(salary.max ? { maxValue: salary.max } : {}),
                          unitText: unit,
                      },
                  },
              }
            : {}),
    };
}

/** Wraps nodes into a single connected @graph — one script tag per page. */
export function buildGraph(nodes: unknown[]) {
    return {
        '@context': 'https://schema.org',
        '@graph': nodes.flat(),
    };
}
