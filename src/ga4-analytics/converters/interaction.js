import { get } from 'lodash';
import { extractPropertyDetails } from '../utils/extract-common-property-details';

/*
event: 'gl_listings_interaction',
    interaction_type: null,
    interaction_target_type: null,
    interaction_target: null,
    interaction_id: null,
    interaction_target_details: null,
    is_cta: null,
    gl_property_id: null,
    market: null,
    use_class: null,
    usage_type: null,
    property_type: null,
    locality: null,
    region: null,
    zoning: null,
    agent_office: null

    */

    // helper methods to create interaction details object.  keeping them here so we can centralize the object definition for now
/*
source: string  // the page the click is coming from - search, plp, pdp
interaction_type: string,    // the type of interaction - click, mouseover, etc.
interaction_target_type: string,   // the type of object - i.e., link, button, dropdown, etc.
interaction_target: string,  // the category the object is, i.e., brochure, video, property link, etc
interaction_id: string,  // a unique id for the interaction (optional)
interaction_target_details: string, // specific naming for the object, i.e., Ryans Brochure.pdf
is_cta:boolean // if it's a call to action interaction
*/




// we may create a number of converters here to help us create the interaction model needed on various pages

// PDP : Collateral Bar (reference asset details in src/components/CollateralBar/CollateralBarPill.jsx)
export const PDPCreateInteractionModelUsingCollateralBarAsset = (asset, property) => {
    const interactionDetails = {
        source: 'PDP',
        interaction_type: 'click',
        interaction_target: 'collateralBar',
        interaction_target_type: get(asset, 'type'), 
        cta_link_text: get(asset, 'label'),
        cta_title: '',
        cta_link_destination: get(asset, 'link'),
        interaction_id: get(asset, 'id'),
        is_cta: 'true'
    };
    return {...interactionDetails, ...extractPropertyDetails(property)};
};


export const CreateBasicInteraction = (property, interactionDetails) => {
    return {...interactionDetails, ...extractPropertyDetails(property)};
};
