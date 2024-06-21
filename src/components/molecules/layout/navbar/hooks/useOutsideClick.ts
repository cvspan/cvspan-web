/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-types
const useOutsideClick = (callback: Function) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
        };
    }, [ref]);

    return ref;
};
export { useOutsideClick };
