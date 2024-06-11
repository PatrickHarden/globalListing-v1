var getFormattedString = require('../utils/getFormattedString');
var DefaultValues = require('../constants/DefaultValues');
var matchTypeStrings = require('../utils/matchTypeStrings');
var queryParams = require('../utils/queryParams');
var paramMap = require('../utils/paramMap');
var _ = require('lodash');


module.exports = {
    getSharedMetaDescription: function() {
        var strings = this.context.language.TokenReplaceStrings,
            searchType = this.props.searchType == 'isSale' ? this.context.language.ForSale : this.context.language.ToRent,

            machineSiteType = window.cbreSiteType || DefaultValues.cbreSiteType,
            siteType = machineSiteType === 'residential' ? this.context.language.Residential : this.context.language.Commercial,

            propertyTypePlural = matchTypeStrings(
              this.context.language,
              this.getParamStore().getParams().propertySubType,
              this.getParamStore().getParams().usageType
            ),

            searchLocation = this.getSearchStateStore().getItem('searchLocationName'),

            metaDescription =  getFormattedString({
                propertyTypePlural: propertyTypePlural,
                searchType: searchType,
                searchLocation: searchLocation,
                siteType: siteType
            }, strings.ListMetaDescription);

        return metaDescription;
    },

    getCanonicalUrl: function () {
        var loc = window.location;
        var formattedObject = queryParams.parseQueryString(loc.search);

        if (!formattedObject.aspects) {
            formattedObject = paramMap.mapParams(formattedObject);
        }

        var mappedParams = _.pick(formattedObject, ['aspects']);

        if (!mappedParams.aspects) {
            console.warn('Cannot find aspect param to attach to canonical link'); // eslint-disable-line no-console
            return loc.href;
        }

        var searchAsString = queryParams.parseQueryObject(mappedParams, true);
        return loc.protocol + '//' + loc.host + loc.pathname + searchAsString;
    },

    buildSharedSearchMetaTags: function () {
        var strings = this.context.language.TokenReplaceStrings,
            searchType = this.props.searchType == 'isSale' ? this.context.language.ForSale : this.context.language.ToRent,

            machineSiteType = window.cbreSiteType || DefaultValues.cbreSiteType,
            siteType = machineSiteType === 'residential' ? this.context.language.Residential : this.context.language.Commercial,

            searchLocation = this.getSearchStateStore().getItem('searchLocationName'),

            propertyTypePlural = matchTypeStrings(
                this.context.language,
                this.getParamStore().getParams().propertySubType,
                this.getParamStore().getParams().usageType
            ),

            metaTitle = getFormattedString({
                propertyTypePlural: propertyTypePlural,
                searchType: searchType,
                searchLocation: searchLocation,
                siteType: siteType
            }, strings.ListMetaTitle),

            metaDescription =  this.getSharedMetaDescription();

        var updateTags = [
            { property: 'title', value: metaTitle, type: 'title' },
            { property: 'title', value: metaTitle, type: 'html' },
            { property: 'title', value: metaTitle },
            { property: 'og:title', value: metaTitle },

            { property: 'description', value: metaDescription, type: 'html' },
            { property: 'description', value: metaDescription },
            { property: 'og:description', value: metaDescription },

            { property: 'og:url', value: window.location.href, type: 'meta'},
            { property: 'canonical', value: this.getCanonicalUrl(), type: 'link'}
        ];

        return updateTags;
    }
};
