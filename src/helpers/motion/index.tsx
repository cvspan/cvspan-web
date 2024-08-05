import React from 'react';

interface I_ANIMATE_PROPS {
    delay?: number;
    from?: 'top' | 'bottom' | 'left' | 'right';
}

export const ANIMATE_PROPS = (props?: I_ANIMATE_PROPS) => {
    const { delay = 0, from = 'bottom' } = props || {};

    if (from === 'bottom')
        return {
            initial: { opacity: 0, y: 40 },
            whileInView: {
                opacity: 1,
                y: 1,
                transition: { delay },
            },
            viewport: { once: true, amount: 0.8 },
        };

    if (from === 'left')
        return {
            initial: { opacity: 0, x: -100 },
            whileInView: {
                opacity: 1,
                x: 1,
                transition: { delay },
            },
            viewport: { once: true, amount: 0.8 },
        };
};
