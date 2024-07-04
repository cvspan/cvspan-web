import React from 'react';
import { design } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import CustomizableDesign from '@/components/molecules/customizableDesign/CustomizableDesign';
import Design from '@/components/molecules/design/page';

const DesignPage = () => {
    return (
        <div>
            <SharedFeaturesComponent
                intro="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                title="Discover the benefits of professional UIUX design service"
                description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
                arrayOfFeatures={design}
            />
            <Design />

            <CustomizableDesign />
        </div>
    );
};

export default DesignPage;
