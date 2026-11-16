'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe, { type COBEOptions } from 'cobe';
import { useMotionValue, useSpring } from 'framer-motion';

import { cn } from '@/lib/utils';

const MOVEMENT_DAMPING = 1400;

/** Radians per second. Matches the 0.005 per frame that cobe 0.6 examples use. */
const SPIN_RATE = 0.005 * 60;

/**
 * The `id` on each marker is what cobe uses to publish an anchor and a
 * visibility flag for it, which is how the labels below track the markers as
 * the globe turns. `label` is ours, cobe ignores it.
 */
const MARKERS: { id: string; label: string; location: [number, number]; size: number }[] = [
    { id: 'us', label: 'United States', location: [40.7128, -74.006], size: 0.05 },
    { id: 'ng', label: 'Nigeria', location: [9.0765, 7.3986], size: 0.05 },
    { id: 'uk', label: 'United Kingdom', location: [51.5074, -0.1278], size: 0.05 },
];

const GLOBE_CONFIG: COBEOptions = {
    width: 800,
    height: 800,
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: 0,
    // The card only reveals the top cap of the sphere, which is the part cobe
    // washes out: its glow rises as (1-i)^4 towards the limb, and the dots fade
    // as i^diffuse at the same time, so the visible slice came through as a
    // near-featureless white ball. Flattening diffuse keeps the dots dark that
    // far out, a stronger mapBrightness deepens them, and a dimmer glow stops
    // the rim blowing out. Measured over the region the card actually shows:
    // dark pixels 7.0% -> 9.4%, blown-out white 36.6% -> 28.6%.
    diffuse: 0.12,
    mapSamples: 16000,
    mapBrightness: 1.6,
    baseColor: [1, 1, 1],
    glowColor: [0.6, 0.6, 0.6],
    // #1A1AFF, the brand primary used for buttons and links.
    markerColor: [26 / 255, 26 / 255, 255 / 255],
    markers: MARKERS.map(({ id, location, size }) => ({ id, location, size })),
};

export function Globe({ className, config = GLOBE_CONFIG }: { className?: string; config?: COBEOptions }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const phiRef = useRef(0);
    const widthRef = useRef(0);
    const pointerInteracting = useRef<number | null>(null);

    const r = useMotionValue(0);
    const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

    const updatePointerInteraction = (value: number | null) => {
        pointerInteracting.current = value;
        if (canvasRef.current) {
            canvasRef.current.style.cursor = value !== null ? 'grabbing' : 'grab';
        }
    };

    const updateMovement = (clientX: number) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current;
            r.set(r.get() + delta / MOVEMENT_DAMPING);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onResize = () => {
            if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
        };
        window.addEventListener('resize', onResize);
        onResize();

        // cobe quietly returns a do nothing object when it cannot get a context,
        // rather than throwing, so check first and leave the still image up.
        const probe = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!probe) {
            window.removeEventListener('resize', onResize);
            return;
        }

        const globe = createGlobe(canvas, {
            ...config,
            width: widthRef.current,
            height: widthRef.current,
        });

        // cobe 2 dropped the `onRender` callback and no longer runs a loop of its
        // own: `update()` is what draws a frame. Nothing is persisted between
        // frames either (the context is created without preserveDrawingBuffer),
        // so the globe has to be redrawn continuously or it clears to nothing.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0;
        let last = performance.now();

        const draw = (now: number) => {
            const elapsed = Math.min(now - last, 100);
            last = now;

            if (pointerInteracting.current === null && !reduceMotion.matches) {
                // Advance on wall clock so the speed does not double on a 120Hz screen.
                phiRef.current += (SPIN_RATE * elapsed) / 1000;
            }

            globe.update({
                phi: phiRef.current + rs.get(),
                width: widthRef.current,
                height: widthRef.current,
            });

            frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);

        canvas.style.opacity = '1';

        return () => {
            cancelAnimationFrame(frame);
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [rs, config]);

    return (
        <div className={cn('absolute inset-0 mx-auto aspect-square w-full max-w-[600px]', className)}>
            <canvas
                className="size-full opacity-0 transition-opacity duration-500"
                ref={canvasRef}
                onPointerDown={(e) => updatePointerInteraction(e.clientX)}
                onPointerUp={() => updatePointerInteraction(null)}
                onPointerOut={() => updatePointerInteraction(null)}
                onMouseMove={(e) => updateMovement(e.clientX)}
                onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
            />

            {MARKERS.map((m) => (
                <span
                    key={m.id}
                    className="cobe-marker-label"
                    style={
                        {
                            positionAnchor: `--cobe-${m.id}`,
                            // cobe only defines this while the marker faces us,
                            // so the fallback is what hides the label otherwise.
                            opacity: `var(--cobe-visible-${m.id}, 0)`,
                        } as React.CSSProperties
                    }
                >
                    {m.label}
                </span>
            ))}
        </div>
    );
}

export default Globe;
