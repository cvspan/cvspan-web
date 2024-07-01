import { design } from '../arrayOfFeatures/arrays';
import SharedFeaturesComponent from '../sharedFeaturesComponent/SharedFeaturesComponent';

const Design = () => {
    return (
        <section>
            <SharedFeaturesComponent
                intro=" Professional designers focus on creating intuitive and user-friendly interfaces that make it easy for users to navigate and interact with a product or website, leading to a more satisfying user experience."
                title="Discover the benefits of professional UIUX design service"
                description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
                arrayOfFeatures={design}
            />
        </section>
    );
};

export default Design;
