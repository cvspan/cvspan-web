import React from 'react';
import CareersPage from '@/components/pages/careers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers at CV Span',
    description:
        'We are pioneering the future of work, working together to bring creativity to another scale. We are a supportive and diverse community of people that are kind, truth seeking, and authentic',
};

export default function page() {
    return <CareersPage />;
}
