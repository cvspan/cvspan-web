import React from 'react';
import { cn } from '@/lib/utils';
import './portal-html.css';

/** Renders HTML from the portal. The portal cleans it (allow-listed tags only) before it leaves. */
const PortalHtml = ({ html, className }: { html: string; className?: string }) => (
    <div className={cn('portal-html', className)} dangerouslySetInnerHTML={{ __html: html }} />
);

export default PortalHtml;
