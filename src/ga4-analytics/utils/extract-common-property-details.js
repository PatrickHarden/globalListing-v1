import { get } from "lodash";

// property details extracted from a property object and put into the interaction model
export const extractPropertyDetails = (property) => {

    const getSize = (property, type) => {
        const totalSize = get(property, 'TotalSize');
        if(totalSize){
            if(type === 'size'){
                return totalSize.area;
            }else if(type === 'type'){
                return totalSize.units;
            }
        }
    };

    const getPrice = (property, type) => {
        const charges = get(property, 'Charges');
        if(charges){
            let sale = 0;
            let leaseLow = 0;
            let leaseHigh = 0;
            let currency;
            charges.forEach(charge => {
                if(get(charge, 'chargeType') === 'SalePrice'){
                    sale = get(charge, 'amount');
                    currency = get(charge, 'currencyCode');
                }else if(get(charge, 'chargeType') === 'Rent'){
                    if(get(charge,'chargeModifier') === 'From'){
                        leaseLow = get(charge, 'amount');
                    }else if(get(charge, 'chargeModifier') === 'To'){
                        leaseHigh = get(charge, 'amount');
                    }
                    currency = get(charge, 'currencyCode');
                }
            });
        
            if(type === 'price'){
                if(sale){
                    return sale;
                }else{
                    if(leaseLow === leaseHigh){
                        return leaseLow;
                    }else if(leaseLow && leaseHigh){
                        return leaseLow + ' - ' + leaseHigh;
                    }else if(leaseLow){
                        return leaseLow;
                    }else if(leaseHigh){
                        return leaseHigh;
                    }
                }
            }else if(type === 'currency' && currency){
                return currency;
            }
        }
        return null;
    };


    return {
        glPropertyId: get(property, 'PropertyId'),
        glMarketId: get(property, 'HomeSite'),
        listing_use_class: get(property,'UseClass'),
        listing_usage_type: get(property,'PropertySubType'),
        listing_property_type: get(property,'UsageType'),
        listing_locality: get(property,'ActualAddress.locality'),
        listing_region: get(property,'ActualAddress.region'),
        listing_zoning: get(property,'ActualAddress.zone'),
        listing_status: get(property, 'PropertyStatus'),
        listing_title: get(property, 'ActualAddress.line1'),
        listing_country: get(property, 'ActualAddress.country'),
        listing_city: get(property, 'ActualAddress.locality'),
        listing_state_province: get(property, 'ActualAddress.region'),
        listing_postal_code: get(property, 'ActualAddress.postcode'),
        listing_street_address: get(property, 'ActualAddress.line2'),
        listing_transaction_type: get(property, 'Aspect') ? get(property, 'Aspect').join(',') : null,
        listing_size: getSize(property, 'size'),
        listing_size_measure_type: getSize(property, 'type') ,
        listing_price: getPrice(property, 'price'),
        listing_price_currency: getPrice(property, 'currency'),
        listing_market: get(property, 'HomeSite')
    };
};