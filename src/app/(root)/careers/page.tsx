import React from 'react';
import CareersPage from '@/components/pages/careers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers at CV Span',
    description:
        'Join CVSpan, a remote-first design and development agency. Explore open roles and work with a supportive, diverse team that is kind, truth seeking and authentic.',
};

export default function page() {
    return <CareersPage />;
}
