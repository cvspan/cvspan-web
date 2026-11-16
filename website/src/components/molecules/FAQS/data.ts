export type FaqItem = {
    id: number;
    question: string;
    answer: string;
};

/**
 * Single source of truth for the homepage FAQ.
 *
 * Shared by the rendered accordion and the FAQPage JSON-LD, so the structured
 * data can never drift from what visitors actually see — Google treats that
 * mismatch as a rich-result violation.
 */
export const FAQS: FaqItem[] = [
    {
        id: 1,
        question: 'Do you offer consultations before starting a project?',
        answer: 'Yes, we offer a free initial consultation to discuss your project needs, goals, and vision. This helps us understand how we can best work together and provide a tailored proposal.',
    },
    {
        id: 2,
        question: 'What is your design and development process?',
        answer: 'Our process includes discovery and research, concept development, wireframing and prototyping, design execution, development, quality assurance testing, and final deployment. We work closely with our clients at each stage to ensure their vision is accurately realized.',
    },
    {
        id: 3,
        question: 'Who are your typical clients?',
        answer: 'Our clients range from startups and small businesses to large corporations across various industries, including technology, healthcare, retail, finance, and education.',
    },
    {
        id: 4,
        question: 'How do you manage projects and keep them on schedule?',
        answer: 'We use project management tools to track progress, set milestones, and communicate regularly with clients. This ensures that all tasks are completed on time and that any potential issues are addressed promptly.',
    },
];
