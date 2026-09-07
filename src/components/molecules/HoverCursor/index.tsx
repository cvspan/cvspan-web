'use client';

import React from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

type Props = {
    children: React.ReactNode;
    /** Cursor artwork shown while hovering a target. */
    icon: string;
    /** Rendered diameter in px. */
    size?: number;
    className?: string;
};

/**
 * Circular cursor that follows the pointer over tagged children.
 *
 * This replaces the old Tailwind arbitrary cursor utility, which silently
 * failed here: browsers drop any CSS cursor image larger than 128px, and on a
 * 2x display the 110px badge resolved to 220px. Driving the badge in JS also
 * lets it ease into position and scale on enter/exit, which CSS cannot do.
 *
 * Note: avoid writing arbitrary-value utility syntax literally in comments.
 * Tailwind scans source files as plain text and will emit a rule from it.
 *
 * Mark hover targets with `data-cursor-target`.
 */
export default function HoverCursor({ children, icon, size = 96, className = '' }: Props) {
    const [enabled, setEnabled] = React.useState(false);
    const [active, setActive] = React.useState(false);

    // Motion values avoid a React re-render on every mousemove; the springs
    // give the badge a slight trailing ease rather than snapping to the pointer.
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { stiffness: 550, damping: 40, mass: 0.5 };
    const smoothX = useSpring(x, springConfig);
    const smoothY = useSpring(y, springConfig);

    React.useEffect(() => {
        // Only for real pointers, and never when the user asked for less motion.
        const finePointer = window.matchMedia('(pointer: fine)').matches;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setEnabled(finePointer && !reducedMotion);
    }, []);

    const handleMove = React.useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (!enabled) return;

            const target = event.target as HTMLElement | null;
            const overTarget = Boolean(target?.closest?.('[data-cursor-target]'));

            if (overTarget) {
                // Jump straight to the pointer on the first frame so the badge
                // fades in where the cursor already is instead of flying across.
                if (!active) {
                    x.jump(event.clientX);
                    y.jump(event.clientY);
                }
                x.set(event.clientX);
                y.set(event.clientY);
            }

            setActive(overTarget);
        },
        [active, enabled, x, y],
    );

    return (
        <div
            // `hover-cursor-area` hides the native pointer over tagged children.
            // Kept in globals.css because the equivalent Tailwind arbitrary
            // variant needs nested brackets, which its parser cannot handle.
            className={`${className} ${enabled ? 'hover-cursor-area' : ''}`}
            onMouseMove={handleMove}
            onMouseLeave={() => setActive(false)}
        >
            {children}

            {enabled ? (
                <AnimatePresence>
                    {active ? (
                        <motion.div
                            key="hover-cursor"
                            aria-hidden="true"
                            className="pointer-events-none fixed left-0 top-0 z-[70]"
                            style={{ x: smoothX, y: smoothY }}
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.4 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Offset by half the size so the badge centres on the pointer. */}
                            <div style={{ transform: `translate(-50%, -50%)`, width: size, height: size }}>
                                <img src={icon} alt="" className="h-full w-full select-none" draggable={false} />
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            ) : null}
        </div>
    );
}
