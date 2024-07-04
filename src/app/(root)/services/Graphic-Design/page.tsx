import { brandIdentity, graphicDesign } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

const GraphicDesign = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro="A unique identity is more than just a logo. It’s a story, a message, a promise. Make your brand memorable by creating an identity that resonates with your audience."
                title="Graphic design solutions we offer!"
                arrayOfFeatures={graphicDesign}
                description="Our graphic design services take a deliberate approach to meeting clients' creative objectives while producing high-quality visuals that successfully communicate their message. This is a detailed description of how a graphic design service could be constructed."
            />
        </section>
    );
};

export default GraphicDesign;
