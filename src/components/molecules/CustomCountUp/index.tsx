'use client';
import React from 'react';
import { CountUp } from 'use-count-up';

const CustomCountUp = ({ end = 0, duration = 3 }: { end?: number; duration?: number }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const componentRef = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(componentRef?.current);
                }
            },
            {
                threshold: 0.5, // Adjust the threshold as needed
            },
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    return (
        <span ref={componentRef}>
            <CountUp end={end} isCounting={isVisible} duration={duration} />
        </span>
    );
};

export default CustomCountUp;
