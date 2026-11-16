export type LegalBlock =
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'subheading'; text: string };

export type LegalSection = {
    heading: string;
    blocks: LegalBlock[];
};

export type LegalDocument = {
    title: string;
    /** Shown under the title, e.g. "Last updated 5 September 2026". */
    updated: string;
    /** Short opening paragraphs shown before the numbered sections. */
    intro: LegalBlock[];
    sections: LegalSection[];
};
