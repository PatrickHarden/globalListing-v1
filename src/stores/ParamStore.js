const queryParams = require('../utils/queryParams');

var ActionTypes = require('../constants/ActionTypes'),
    // ParamMapping = require('../constants/ParamMapping'),
    BaseStore = require('./BaseStore'),
    mapParams = require('../utils/paramMap').mapParams,
    scrapeFilterParams = require('../utils/scrapeFilterParams'),
    $ = require('jQuery'),
    isExtendedPolygonReady = require('../utils/isExtendedPolygonReady'),
    _ = require('lodash');

// If (filters.useSubType === true); sets 'params.propertySubType' to a given value.
function mapSubType(country, resultsURL) {
    let res;
    if (country && resultsURL) {
        // Get the Country code (E.g. "ca-comm" => "ca")
        const regex = new RegExp(/\w{2}-(comm|resi)/);
        if (regex.test(country)) {
            country = country.split("-")[0];
        }
        // Get the usage type
          // Split the url at each slash
        const resultsURLSplit = resultsURL.split("/");
          // If resultsURL ends with a '/', the last element in the array is an empty string.
        const usageType = resultsURLSplit[resultsURLSplit.length-1] === "" ? resultsURLSplit[resultsURLSplit.length-2] : resultsURLSplit[resultsURLSplit.length-1];

        if (country === "Canada") {
            switch(usageType) {
                case "multifamily":
                    res = "MultifamilyLow-Rise,MultifamilyMid-Rise,MultifamilyHigh-Rise";
            }
        }
    }
    return res;
}

var ParamStore = function(stores, Dispatcher) {
    // Private
    var _params = [],
        _paramsLoaded = false,
        _searchContext = null,
        _searchLocation = null,
        _searchLocationName = null,
        _currentPlaceId;

    this.dispatchToken = Dispatcher.register(
        function(action) {
            switch (action.type) {
                case ActionTypes.BOOTSTRAP:
                    Dispatcher.waitFor([stores.ConfigStore.dispatchToken]);
                    this.bootstrap(
                        action.queryParams,
                        action.placename,
                        action.polygon
                    );
                    break;

                case ActionTypes.UPDATE_QUERY_PARAMS:
                    this.bootstrap(
                        action.queryParams,
                        action.placename,
                        action.polygon
                    );
                    break;

                case ActionTypes.SET_PARAMS:
                    this.setParams(action.params);
                    break;

                case ActionTypes.SET_PARAM:
                    this.setParam(action.property, action.value);
                    break;

                case ActionTypes.DELETE_PARAM:
                    this.deleteParam(action.property);
                    break;

                case ActionTypes.SET_SEARCH_CONTEXT:
                    this.setSearchContext(action.value);
                    break;

                default:
                // Do nothing
            }
        }.bind(this)
    );

    this.bootstrap = function(queryParams, placename, polygon) {
        var params = {...stores.ConfigStore.getItem('params')},
            _sm = stores.ConfigStore.getItem('searchMode'),
            filters = stores.ConfigStore.getItem('filters'),
            defaultParams = {...stores.ConfigStore.getItem('params')},
            features = stores.ConfigStore.getItem('features');
        // Insert the config widget mode into the params object. This will be overwritten as standard by anything in the query string
        if (_sm) {
            params.searchMode = _sm;
        }
        var filterParams = scrapeFilterParams(
            stores.ConfigStore.getItem('filters'),
            params,
            queryParams
        );

        // ensure that search is suppressed, the default rad, lat and lon values are always taken from the location object and not scraped from the filters
        if (
            (params && params.searchMode === 'nonGeo') ||
            (queryParams && queryParams.searchMode === 'nonGeo')
        ) {
            $.extend(
                params,
                filterParams,
                stores.ConfigStore.getItem('location')
            );
        } else {
            $.extend(
                params,
                stores.ConfigStore.getItem('location'),
                filterParams
            );
        }

        var mappedParams = mapParams(params);

        if (typeof queryParams !== 'undefined') {
            this.setSearchLocationName(placename);
            this.setSearchCurrentPlaceId(queryParams.placeId);
            $.extend(mappedParams, queryParams);
        }

        // Are we in polygon or nonGeo search mode? delete location parameters
        if (
            mappedParams.searchMode === 'polygon' ||
            mappedParams.searchMode === 'nonGeo'
        ) {
            delete mappedParams.lat;
            delete mappedParams.lon;
            delete mappedParams.radius;
        }

        // Are we in bounding mode and without a radius (and have location context)? create an initial search polygon
        if (
            mappedParams.searchMode === 'bounding' &&
            !isExtendedPolygonReady(mappedParams) &&
            polygon
        ) {
            mappedParams.lat = polygon.centre.lat();
            mappedParams.lon = polygon.centre.lng();
            mappedParams.polygons = '[[' + polygon.polygon + ']]';
            mappedParams.initialPolygons = '[[' + polygon.polygon + ']]';
        }

        mappedParams = this.mapAspects(defaultParams, features, filters, mappedParams);

        _params = mappedParams;
        _paramsLoaded = true;
        this.emitChange('PARAMS_UPDATED');
    };

    this.setParams = function(params) {
        const features = stores.ConfigStore.getFeatures();
        const filters = stores.ConfigStore.getItem('filters');
        const defaultParams = {...stores.ConfigStore.getItem('params')};
        const searchConfig = stores.ConfigStore.getItem("searchConfig");
        if (features && features.useSubType && searchConfig) {
         const subType = mapSubType(searchConfig.searchLocationName, searchConfig.searchResultsPage);
         // No results will return if `params.propertySubType === undefined`, so we only set it if a value is present.
         if (subType) params["Common.PropertySubType"] = subType;
        }
        _params = mapParams(params);
        // check aspects 
        _params = this.mapAspects(defaultParams, features, filters, params);
        this.emitChange('PARAMS_UPDATED');
    };

    this.getParams = function(outgoing) {
        if (isExtendedPolygonReady(_params)) {
            delete _params.polygons;
        }

        return outgoing ? mapParams(_params, true) : _params;
    };

    this.getParamsState = function() {
        return _paramsLoaded;
    };

    this.setParam = function(property, value) {
        _params[property] = value;
    };

    this.deleteParam = function(property) {
        delete _params[property];
    };

    this.getParam = function(property) {
        return typeof _params[property] !== 'undefined'
            ? _params[property]
            : null;
    };

    this.setSearchContext = function(path) {
        _searchContext = path;
        this.emitChange('SEARCH_CONTEXT_UPDATED');
    };

    this.getSearchContext = function() {
        return _searchContext;
    };

    this.setSearchLocation = function(location) {
        _searchLocation = location;
        this.emitChange('SEARCH_LOCATION_UPDATED');
    };

    this.getSearchLocation = function() {
        return _searchLocation;
    };

    this.setSearchLocationName = function(locationName) {
        _searchLocationName = locationName;
        this.emitChange('SEARCH_LOCATION_NAME_UPDATED');
    };

    this.getSearchLocationName = function() {
        return _searchLocationName;
    };

    this.setSearchCurrentPlaceId = function(currentPlaceId) {
        _currentPlaceId = currentPlaceId;
        this.emitChange('SEARCH_LOCATION_CURRENT_PLACE_ID_UDPATED');
    };

    this.getSearchCurrentPlaceId = function() {
        return _currentPlaceId;
    };

    this.mapAspects = function(defaultParams, features, filters, mappedParams){
        //If aspects param avaialble in filters? Not then if default params aspects exists in config then assign
        if(mappedParams.aspects) {
            let aspectsFilters = filters && Array.isArray(filters) && filters.find(x=>x.name.toLowerCase() === 'aspects');
            if(!(aspectsFilters 
                && aspectsFilters.options 
                && Array.isArray(aspectsFilters.options) 
                && aspectsFilters.options.some(x=>x.value.toLowerCase() === mappedParams.aspects.toLowerCase())
                ) &&  !_.isNil(defaultParams["Common.Aspects"]) && features && features.aspectsNotAvailableInFilterSetToDefault) {
                    mappedParams.aspects = defaultParams["Common.Aspects"];
                    // replace the url as well so it can be shared
                    const urlParts = window.location.href.split("?");
                    if(urlParts[1]){
                        const queryParamStr = urlParts[1];
                        const urlParams = queryParamStr.split("&");
                        let newQueryParamStr = '';            
                        if(urlParams && urlParams.length > 0){
                            urlParams.forEach((param,idx) => {
                                if(param.toLowerCase().indexOf("aspects") > -1){
                                    urlParams[idx] = "aspects=" + defaultParams["Common.Aspects"];
                                }
                            });
                            newQueryParamStr = urlParams.length > 1 ? urlParams.join("&") : urlParams[0];
                        }

                        if(newQueryParamStr.length > 0){
                            window.history.replaceState(null, null, '?' + newQueryParamStr);
                        }
                    }
            }
        }
        return mappedParams;
    };
};

ParamStore.prototype = Object.create(BaseStore.prototype);

module.exports = ParamStore;
