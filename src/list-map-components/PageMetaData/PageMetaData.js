import PropTypes from 'prop-types'; //eslint-disable-line
import React from 'react';
import matchTypeStrings from '../../utils/matchTypeStrings';
import getFormattedString from '../../utils/getFormattedString';
import queryParams from '../../utils/queryParams';
import writeMetaTag from '../../utils/writeMetaTag';
import DefaultValues from '../../constants/DefaultValues';
import { isPrerender } from '../../utils/browser';
import getValidSearchAspect from '../../utils/getValidSearchAspect';

class PageMetaData extends React.Component {

    constructor(props, context) {
        super(props);
        this.state = {
            
        };
    }
    componentWillMount() {
        this.setMetaTags();
    }

    componentDidUpdate() {
        this.setMetaTags();
    }

    setMetaTags() {
        let metaTags;
        const property = this.props.property;

        const { stores } = this.context;

        const disableMetaTags = stores.ConfigStore.getItem('disableMetaData');
        const disableResultsRedirect = stores.ConfigStore.getFeatures().disableResultsRedirect && stores.ConfigStore.getFeatures().disableResultsRedirect == true;
        const plpPath = window.location.pathname.replace("\/results", "");
        const hasResultsInPath = window.location.pathname.length > plpPath.length;  // when you remove /results from the url (if it exists) is the url path now greater than it was before?

        if(isPrerender && disableResultsRedirect && hasResultsInPath) { // if it is for prerender then write some meta tags to the page for prerender.io to know the correct path
            writeMetaTag("prerender-status-code", "301");
            writeMetaTag("prerender-header", `Location: ${window.location.origin}${plpPath}${window.location.search}`);
        }
        
        // build meta tags and canonical for a PDP page (not a campaign, broker or results page)
        // both methods below (getPropertyMetaTags and getPropertiesMetaTags call the method getSharedMetaTags -> getCanonicalUrl)
        if (property) {
            metaTags = this.getPropertyMetaTags(property);   
            stores.PropertyStore.setIsPlpPage(false);
        } else { // non-detail pages go here
            if (disableMetaTags) {
                return;
            }
            stores.PropertyStore.setIsPlpPage(true);
            metaTags = this.getPropertiesMetaTags();        
        }

        // Write tags.
        if (Array.isArray(metaTags) && metaTags.length > 0) {
            for (var i = 0; i < metaTags.length; i++) {
                writeMetaTag(
                    metaTags[i].property,
                    metaTags[i].value,
                    metaTags[i].type
                );
            }
        }
    }

    getPropertyMetaTags(property) {
        const { searchType } = this.props;

        const { language, stores } = this.context;

        // if it's an AU site (multiusagestrapline) and the primary listing was returned with a usage type
        // if (stores.ConfigStore.getFeatures().displayMultiUsageStrapline && !stores.PropertyStore.getPrimaryListing().usageType)
        //     return null;

        // Prepare data to build tags.
        const strings = language.TokenReplaceStrings;
        const address = property.ActualAddress || {};
        const machineSiteType =
            window.cbreSiteType || DefaultValues.cbreSiteType;
        const siteType =
            machineSiteType === 'residential'
                ? language.Residential
                : language.Commercial;
        const searchTypeString =
            property.Aspect.indexOf('isSale') > -1 ? language.ForSale : language.ToRent;
        const bedrooms = this.getBedrooms(
            machineSiteType,
            property.NumberOfBedrooms,
            strings.NumberOfBedroomsSingular
        );

        // get the primary listing usage type instead
        const usageType =
            property.UsageType &&
            language['PDPPropertyType' + property.UsageType]
                ? language['PDPPropertyType' + property.UsageType]
                : language.Property;
        const propertyType =
            property.PropertySubType &&
            property.PropertySubType != 'Unknown' &&
            language['PDPPropertyType' + property.PropertySubType]
                ? language['PDPPropertyType' + property.PropertySubType]
                : usageType;


        const addressSummary = getFormattedString(
            {
                Line1: address.line1,
                Line2: address.line2 || address.line3,
                Line3: address.line3,
                Region: address.region,
                Locality: address.locality,
                Country: address.country,
                PostCode: address.postcode
            },
            strings.AddressSummaryLong
        );

        const metaTitle = getFormattedString(
            {
                bedrooms,
                propertyType,
                searchType: searchTypeString,
                siteType,
                addressSummary: addressSummary,
                usageType
            },
            strings.PDPMetaTitle
        ).trim();

        // Build shared tags.
        let updateTags = this.getSharedMetaTags(
            metaTitle,
            property.LongDescription
        );

        // Add share image.
        if (property.Photos.length && property.Photos[0].resources.length) {
            const shareImgUri = this.getSharingImage(property.Photos);
            updateTags.push({
                property: 'og:image',
                value: shareImgUri,
                label: 'property',
                type: 'meta'
            });
        }

        // Add created and updated times.
        const publishedTime = property.Created || property.LastUpdated;
        updateTags.push(
            { property: 'article:published_time', value: publishedTime },
            { property: 'article:modified_time', value: property.LastUpdated }
        );

        return updateTags;
    }

    getSharingImage(propertyImages) {
        if (propertyImages && propertyImages.length) {
            const resources = propertyImages[0].resources;
            const basePath =
                window.location.protocol + '//' + window.location.host;

            return resources.map(function(item) {
                if (item.breakpoint === 'medium') {
                    return basePath + item.uri;
                }
            }).find(_ => ![undefined, null].includes(_)); // Return first image that isn't null
        }
    }

    getBedrooms(siteType, count, stringTemplate) {
        let string = '';
        if (siteType !== 'residential') {
            return string;
        }

        if (count && count > 0) {
            string = getFormattedString(
                { bedroomCount: count },
                stringTemplate
            );
        } else {
            string = this.context.language.Studio;
        }
        return string;
    }

    getPropertiesMetaTags() {
        const { searchType } = this.props;

        const { language, stores } = this.context;

        // Prepare data to build tags.
        const strings = language.TokenReplaceStrings;
        const searchTypeString =
        searchType == 'isLetting' ? language.ToRent : (searchType == 'isLetting,isSale') ? language.saleLetSearchType : language.ForSale;
        const machineSiteType =
            window.cbreSiteType || DefaultValues.cbreSiteType;
        const siteType =
            machineSiteType === 'residential'
                ? language.Residential
                : language.Commercial;
        const searchLocation = stores.SearchStateStore.getItem(
            'searchLocationName'
        );
        const propertyTypePlural = matchTypeStrings(
            language,
            stores.ParamStore.getParams().propertySubType,
            stores.ParamStore.getParams().usageType
        );

        // Title handling.
        const metaTitle = getFormattedString(
            {
                propertyTypePlural,
                searchType: searchTypeString,
                searchLocation,
                siteType
            },
            strings.ListMetaTitle
        );

        // Description handling.
        const metaDescription = getFormattedString(
            {
                propertyTypePlural,
                searchType: searchTypeString,
                searchLocation,
                siteType
            },
            strings.ListMetaDescription
        );

        return this.getSharedMetaTags(metaTitle, metaDescription);
    }

    getSharedMetaTags(title, description) {
        // Tags shared across listings and PDP.
        let metaTags = [
            { property: 'title', value: title, type: 'title' },
            { property: 'title', value: title, type: 'html' },
            { property: 'title', value: title },
            { property: 'og:title', value: title },

            { property: 'description', value: description, type: 'html' },
            { property: 'description', value: description },
            { property: 'og:description', value: description },

            { property: 'og:url', value: window.location.href, type: 'meta' },
            {
                property: 'canonical',
                value: this.getCanonicalUrl(),
                type: 'link'
            }
        ];

        return metaTags;
    }

    getDetailPageUrl(listing) {
        if(!listing)
            return null;

        const { searchType } = this.props;
        let detailPageUrl;

        try {
            const siteMapsConfig = context.stores.ConfigStore.getItem('siteMapsConfig');
            const siteId = this.props.property.HomeSite.toLowerCase(); // Use siteid from listing data instead of the config (this will correct canoncials where the listing homesite doesn't match the config's siteid)
            const usageType = listing.UsageType.toLowerCase();
            const language = context.stores.ConfigStore.getItem('language').toLowerCase();

            var validSearchAspect = getValidSearchAspect(this.props.property.Aspect);

            // try the entire locale, then fall back to just the language segment
            const lang = Object.keys(siteMapsConfig[siteId][usageType]).filter(x => (x == language || language.split('-').splice(0, 1))).reduce(x => x);

            let searchPath = siteMapsConfig[siteId][usageType][lang];
            detailPageUrl = searchPath.replace('{0}', listing.PropertyId).replace('{1}', validSearchAspect);

            if (this.context.stores.ConfigStore.getFeatures().enableLongUrlCanonical) {
                detailPageUrl = searchPath.replace('{0}', `${listing.PropertyId}/${this.props.property.ActualAddress.urlAddress}`).replace('{1}', validSearchAspect);
            }
        } catch (err) {
            return null;
        }
        return detailPageUrl;
    }

    possiblyRedirectUserToCanonical(detailPageUrl, listing) {
        if (!detailPageUrl) return;
        
        // If there's a mismatch between the listing's homesite and the config's siteid, then redirect to the canonical.
        try {
            // Feature flag to turn disable this logic
            if (this.context.stores.ConfigStore.getFeatures().disableCanonicalRedirectOnSiteIdMismatch || window.location.href.toLowerCase().indexOf("-prev") > -1) {
                return;
            }

            const homeSite = listing.HomeSite.toLowerCase();
            const siteId = context.stores.ConfigStore.getItem('siteId').toLowerCase();
    
            if (homeSite != siteId){
                window.location = detailPageUrl;
            }
        } catch (err){
            return null;
        }
    }

    getCanonicalUrl() {
        const { stores } = this.context;
        // extras is an array of params to add to canonical URL from ParamStore
        const extras = this.props.canonicalParams;
        const loc = window.location;
        let formattedObject = this.context.stores.ParamStore.getParams();
        
        let primaryListing = stores.PropertyStore.getPrimaryListing();
        
        if (Object.keys(primaryListing).length == 0) {
            primaryListing = this.props.property;
        }

        const detailPageUrl = this.getDetailPageUrl(primaryListing);

        this.possiblyRedirectUserToCanonical(detailPageUrl, primaryListing);

        // In the PDP the only parameter is view so just return the current URL
        if (this.props.property && !extras.length) {
            const { urlAddress } = this.props.property.ActualAddress;
            const urlAddressIndex = loc.href.lastIndexOf(urlAddress);
            if (urlAddress.length && urlAddressIndex !== -1) {
                // the -1 below accounts for the / before address
                let withoutAddress =
                    loc.href.substr(0, urlAddressIndex - 1) +
                    loc.href.substr(urlAddressIndex + urlAddress.length);

                if (
                    stores.ConfigStore.getFeatures().childListings &&
                    stores.ConfigStore.getFeatures().childListings
                        .enableChildListings &&
                    this.props.property.ParentPropertyId
                ) {
                    withoutAddress = withoutAddress.replace(
                        this.props.property.PropertyId,
                        this.props.property.ParentPropertyId
                    );
                }

                if(detailPageUrl) {
                    withoutAddress = detailPageUrl;
                }

                const siteMapsConfig = context.stores.ConfigStore.getItem('siteMapsConfig');
                const siteId = context.stores.ConfigStore.getItem('siteId').toLowerCase();
                const language = context.stores.ConfigStore.getItem('language');

                // set the canonical according to the SiteMapsConfig.json
                if (siteId && siteMapsConfig && siteMapsConfig[siteId] && siteMapsConfig[siteId][primaryListing.UsageType] && siteMapsConfig[siteId][primaryListing.UsageType][language] || siteMapsConfig[siteId][primaryListing.UsageType]){
                    let target = siteMapsConfig[siteId][primaryListing.UsageType][language] || siteMapsConfig[siteId][primaryListing.UsageType];
                    if (typeof target === 'object'){
                        target = target[language.substr(0, 2)] || target[language];
                    }
                    if (typeof target === 'string'){
                        target = target.replace('{0}', primaryListing.PropertyId);
                        target = target.replace('?view={1}', '')
                        withoutAddress = target;
                    }
                }

                console.log(`Canonical set to: ${withoutAddress}`);

                return withoutAddress;
            }
            if (
                stores.ConfigStore.getFeatures().childListings &&
                stores.ConfigStore.getFeatures().childListings
                    .enableChildListings &&
                this.props.property.ParentPropertyId
            ) {
                if (!formattedObject['noredirect']) {
                    loc.href = loc.href.replace(
                        this.props.property.PropertyId,
                        this.props.property.ParentPropertyId
                    );
                }
            }
            return loc.href;
        }
        // items we want to extract from params to canonical URL
        // { canonicalKey: paramName }
        const canonicalParams = [...extras, 'aspects'];

        const canonicalValues = {};

        canonicalParams.forEach(key => {
            if (formattedObject[key]) {
                canonicalValues[key] = formattedObject[key];
            }
        });

        let searchAsString = '';
        if (Object.keys(canonicalValues).length) {
            searchAsString = encodeURI(
                queryParams.parseQueryObject(canonicalValues, true)
            );
        }
        return loc.protocol + '//' + loc.host + loc.pathname + searchAsString;
    }

    render() {
        return null;
    }
}

PageMetaData.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

PageMetaData.propTypes = {
    searchType: PropTypes.string,
    canonicalParams: PropTypes.array,
    property: PropTypes.object
};

PageMetaData.defaultProps = {
    canonicalParams: []
};

export default PageMetaData;

export const PageMetaDataTest = PageMetaData;
