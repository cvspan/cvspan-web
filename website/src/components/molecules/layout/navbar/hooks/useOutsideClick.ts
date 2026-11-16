import { useEffect, useRef } from 'react';

/**
 * Calls `callback` when a click lands outside the returned ref.
 *
 * Previously typed with `Function` and `any`, which needed two eslint-disable
 * comments for rules that were not even loaded for this file. Real types remove
 * both the suppressions and the guesswork.
 */
const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [callback]);

    return ref;
};
export { useOutsideClick };
