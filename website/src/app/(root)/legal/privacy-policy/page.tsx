import React from 'react';

import LegalPage from '@/components/molecules/legal/LegalPage';
import { PRIVACY_POLICY } from '@/components/molecules/legal/content/privacy-policy';

export default function Page() {
    return <LegalPage document={PRIVACY_POLICY} />;
}
