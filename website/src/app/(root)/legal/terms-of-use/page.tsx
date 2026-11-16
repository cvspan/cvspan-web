import React from 'react';

import LegalPage from '@/components/molecules/legal/LegalPage';
import { TERMS_OF_USE } from '@/components/molecules/legal/content/terms-of-use';

export default function Page() {
    return <LegalPage document={TERMS_OF_USE} />;
}
