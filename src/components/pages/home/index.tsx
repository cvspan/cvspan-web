import Clients from '@/components/molecules/Clients';
import Cta from '@/components/molecules/Cta';
import Testimonial from '@/components/molecules/Testimonial';

export default function Homepage() {
    return (
        <main className="">
            <Clients/>
            <Testimonial/>
            <Cta />
        </main>
    );
}
