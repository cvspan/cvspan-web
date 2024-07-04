import React from 'react';
import './index.css';
import { SpecificJobDetail } from '@/components/molecules/SpecificJobDetail';
import { SpecificJobGlobalTeam } from '@/components/molecules/SepcificJobGlobalTeam';

export default function SpecificJobPage() {
    return (
        <>
            <SpecificJobDetail />
            <SpecificJobGlobalTeam />
        </>
    );
}
