import React from 'react';
import { ImageResponse } from 'next/og';

/**
 * Shared Open Graph image template.
 *
 * Social crawlers (Facebook, LinkedIn, X, Slack) do not render SVG, so share
 * images must be raster. Generating them here keeps a single branded template
 * instead of maintaining a hand-made PNG per route.
 *
 * Note: this runs through Satori, which supports only a subset of CSS —
 * every element needs an explicit `display: flex`, and shorthand properties
 * are unreliable. Keep the markup flat and explicit.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

export function renderOgImage({ title, eyebrow }: { title: string; eyebrow?: string }) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor: '#050505',
                    padding: '72px',
                }}
            >
                {/* Accent bar echoing the brand gradient. */}
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        height: '8px',
                        backgroundImage: 'linear-gradient(90deg, #0A1EB9 0%, #17B978 55%, #00FFB2 100%)',
                    }}
                />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {eyebrow ? (
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 28,
                                color: '#00FFB2',
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                marginBottom: '24px',
                            }}
                        >
                            {eyebrow}
                        </div>
                    ) : null}
                    <div
                        style={{
                            display: 'flex',
                            fontSize: title.length > 46 ? 64 : 82,
                            fontWeight: 700,
                            color: '#FFFFFF',
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {title}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <div style={{ display: 'flex', fontSize: 40, fontWeight: 700, color: '#FFFFFF' }}>CVSPAN</div>
                    <div style={{ display: 'flex', fontSize: 26, color: '#A3A3A3' }}>www.cvspan.com</div>
                </div>
            </div>
        ),
        { ...OG_SIZE },
    );
}
