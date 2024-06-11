import { get } from 'lodash';

const getCharges = (property, key) => {
    const charges = get(property, 'Charges');
    if(charges && charges.length > 0){
        if(charges[0][key]){
            return charges[0][key];
        }
    }
    return null;
};

export const ConvertPropertyDataForPDPPageView = (property, moreData) => {

    // we have to manually construct the event model that we will be sending to GA4.  
    // reference the correct event model (i.e.; gl-pdp-page-view) to determine how to build our object out
    // the data will pass through a verification process at the end to ensure no properties are sent that GA4 isn't expecting (eventually; we can just use typescript for this)

    const data = {};

    data.glPropertyId = get(property, 'PropertyId');
    data.glMarketId = get(property, 'HomeSite');
    data.listing_transaction_type = property.Aspect && property.Aspect.length > 0 ? property.Aspect[0] : null;
    data.listing_size = get(property, 'TotalSize.area');
    data.listing_size_measure_type = get(property, 'TotalSize.units');
    data.listing_price = getCharges(property, 'amount');
    data.listing_price_measure_type = getCharges(property, 'chargeType');
    data.listing_price_currency = getCharges(property, 'currencyCode');
    data.listing_country = get(property,'ActualAddress.country');
    data.listing_city = get(property,'ActualAddress.locality');     // note - city and locality are equivalent currently (see line below)
    data.listing_locality = get(property,'ActualAddress.locality');
    data.listing_state_province = get(property,'ActualAddress.region'); // note - state_province and region are equivalent currently
    data.listing_region = get(property,'ActualAddress.region');
    data.listing_postal_code = get(property,'ActualAddress.postcode');
    data.listing_street_address = get(property,'ActualAddress.line2');
    data.listing_zoning = get(property,'ActualAddress.zone');
    data.listing_status = get(property,'PropertyStatus');
    data.listing_title = document.title;
    data.listing_use_class = get(property,'UseClass');
    data.listing_property_type = get(property,'UsageType');
    data.listing_usage_type = get(property,'PropertySubType');
    data.canonical_url = window.location.href;
    data.listing_agent_office = get(property,'RelatedListingOffice');

    return {...data, ...moreData};
};