'use client';
import { StaticImageData } from 'next/image';
import Image from 'next/image';
import icon1 from '../../../public/d43c39003d5d16ce7c5a3590839f1d374f6f1dd7-140x25 1.png';
import icon2 from '../../../public/a7e12b626d11ed7a53220f515f4968d6079df27c-155x44 1.png';
import icon3 from '../../../public/0212b325db645046ac471a20ca66331652113833-131x45 1.png';
import icon4 from '../../../public/1486dc4762b9160fb9ec48e0ed6ac46a0d9d6f35-132x33 1.png';
import icon5 from '../../../public/369c8218b1fa3f3b3a675915f6f73a5037689b31-322x86 1.png';
import icon6 from '../../../public/44435101ab1add80f647fc69adcc4c69ec4a53a7-948x191 1.png';
import icon7 from '../../../public/500c51a1de4c15ca79f1da5e3faf026af0a50865-272x92 1.png';
import icon8 from '../../../public/7da9418ce9f65f07176bb7cc08cda6596ebc13f3-108x40 1.png';

interface Brand {
    id: number;
    name: string;
    logo: StaticImageData;
}

const brands: Brand[] = [
    { id: 1, name: 'Brand 1', logo: icon1 },
    { id: 2, name: 'Brand 2', logo: icon2 },
    { id: 3, name: 'Brand 3', logo: icon3 },
    { id: 4, name: 'Brand 4', logo: icon4 },
    { id: 5, name: 'Brand 5', logo: icon5 },
    { id: 6, name: 'Brand 6', logo: icon6 },
    { id: 7, name: 'Brand 7', logo: icon7 },
    { id: 8, name: 'Brand 8', logo: icon8 },
];

const Clients: React.FC = () => {
    return (
        <div className="container relative w-full overflow-hidden py-8">
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8))',
                }}
            ></div>
            <div className="flex items-center justify-between">
                {brands.map((brand) => (
                    <div key={brand.id} className="">
                        <Image src={brand.logo} alt={brand.name} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clients;
