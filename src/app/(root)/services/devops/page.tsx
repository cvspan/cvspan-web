import { design } from '@/components/molecules/arrayOfFeatures/arrays';
import SharedFeaturesComponent from '@/components/molecules/sharedFeaturesComponent/SharedFeaturesComponent';
import React from 'react';

const Devops = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                title="Discover the benefits of professional UIUX design service "
                arrayOfFeatures={design}
                description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
            />
        </section>
    );
};

export default Devops;
