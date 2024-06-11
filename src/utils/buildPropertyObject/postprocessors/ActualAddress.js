import getFormattedSlug from '../../../utils/getFormattedSlug';
import defaultValues from '../../../constants/DefaultValues';

module.exports = (item, _comparators, _urlslug) => {
    // Extract language from culture code
    const language = _comparators.culture.split('-')[0];
    let addressObject = item;

    let addresses = addressObject.postalAddresses;
    delete addressObject.postalAddresses;

    // If we have no postal address then we can just revert back to the higher level address object
    if(!addresses || !addresses.length){
        addresses = [item];
    }

    let enAddress;
    let languageAddress;

    /*
        First build the main address object using the following logic:
        1. Match language
        2. Match 'en'
        3. Pick first
    */
    for (var i = 0; i < addresses.length; i++) {
        if (addresses[i].language === language) {
            languageAddress = addresses[i];
        }
        if (addresses[i].language === 'en') {
            enAddress = addresses[i];
        }
        
    }
    const selectedAddress = languageAddress || enAddress || addresses[0];

    if(!selectedAddress.region){
        selectedAddress.region = item.region;
    }
    // Merge our selected address into the higher level address object ensuring that any missing fields remain backfilled
    addressObject = Object.assign({}, addressObject, selectedAddress);

    // Select our address format based on present tokens, I really don't like this but it's CBRE dictated
    let addressSummaryFormat = 'AddressSummary';
    if(addressObject.line1 && !addressObject.line2) {
        addressSummaryFormat = 'AddressSummaryShort';
    } else if (!addressObject.line1) {
        addressSummaryFormat = 'AddressSummaryArea';
    }
    addressObject.addressSummaryFormat = addressSummaryFormat;

    /*
        Next build the url slug using the following logic:
        1. Match 'en'
            1a. If all required tokens are missing use default
        2. Match language
            2a. If all required tokens are missing use default
        3. Pick first
            3a. If all required tokens are missing use default
    */
    let urlAddress = enAddress || languageAddress || addresses[0];
    urlAddress = Object.assign({}, addressObject, urlAddress);
    let tokens = getTokens(_urlslug);
    let match = 0;

    if(urlAddress){
        Object.keys(urlAddress).forEach(function (key) {
            for (var s = 0; s < tokens.length; s++) {
                if(key === tokens[s] && urlAddress[key] != ''){
                    match ++;
                }
            }
        });

        _urlslug = (match > 0) ? _urlslug : defaultValues.urlPropertyAddressFormat;

        addressObject.urlAddress = getFormattedSlug({
            ActualAddress: urlAddress
        }, _urlslug);
    }

    return [
        {
            prop: 'ActualAddress',
            val: addressObject
        }
    ];
};

function getTokens(string){
    const regexp = /%\((.*?)\)s/gi;
    let tokens = string.match(regexp);
    return tokens ? tokens.map((token) => {
        return token.replace('%(', '').replace(')s', '').toLowerCase();
    }) : [];
}
