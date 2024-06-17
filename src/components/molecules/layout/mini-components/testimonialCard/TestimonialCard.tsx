import TestimonialProfile from '../testimonialProfile/TestimonialProfile';

const TestimonialCard = () => {
    return (
        <div className="w-full">
            <svg width="37" height="30" viewBox="0 0 37 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M9.08624 8.05837L9.08239 8.06443L9.07862 8.07055C8.49632 9.01591 8.16667 10.0973 8.12086 11.2088L8.07796 12.25H9.12002H14.807C15.0278 12.25 15.2424 12.3388 15.4028 12.5014L16.0603 11.8529L15.4028 12.5014C15.5636 12.6645 15.6564 12.8885 15.6564 13.125V26.25C15.6564 27.7788 14.4323 29 12.9576 29H1.86105C1.64023 29 1.42564 28.9112 1.26526 28.7486C1.10441 28.5855 1.01163 28.3615 1.01163 28.125V18.7504V18.75L1.01718 13.2779L1.01722 13.2375L1.01399 13.1972C1.00176 13.0441 0.684295 8.48573 3.87866 4.97047C6.22617 2.39033 9.84263 1 14.807 1H15.6564V4.46824L14.9707 4.60744C14.9707 4.60746 14.9706 4.60748 14.9705 4.60749C12.2968 5.14967 10.2323 6.25625 9.08624 8.05837ZM21.3552 28.125V18.751V18.75L21.3608 13.2779L21.3608 13.2375L21.3576 13.1972C21.3454 13.0441 21.0279 8.48537 24.2226 4.97006C26.5702 2.39018 30.1865 1 35.1506 1H36V4.46824L35.3143 4.60744C35.3143 4.60746 35.3142 4.60748 35.3141 4.60749C32.6404 5.14967 30.5759 6.25625 29.4298 8.05837L29.426 8.06443L29.4222 8.07055C28.8399 9.01591 28.5103 10.0973 28.4645 11.2088L28.4216 12.25H29.4636H35.1506C35.3714 12.25 35.586 12.3388 35.7464 12.5014C35.9072 12.6645 36 12.8885 36 13.125V26.25C36 27.7788 34.7759 29 33.3012 29H22.2047C21.9838 29 21.7692 28.9112 21.6089 28.7486C21.448 28.5855 21.3552 28.3615 21.3552 28.125Z"
                    stroke="#A6F46A"
                    stroke-width="2"
                />
            </svg>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.{' '}
            </p>
            <div>
                <TestimonialProfile />
            </div>
        </div>
    );
};

export default TestimonialCard;
