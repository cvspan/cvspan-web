import React from 'react';

import LegalPage from '@/components/molecules/legal/LegalPage';
import { COOKIE_POLICY } from '@/components/molecules/legal/content/cookie-policy';

export default function Page() {
    return <LegalPage document={COOKIE_POLICY} />;
}
