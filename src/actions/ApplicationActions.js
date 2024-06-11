var ActionTypes = require('../constants/ActionTypes'),
    Ajax = require('../utils/ajax'),
    haversine = require('../utils/haversine'),
    _ = require('lodash');
var mapParams = require('../utils/paramMap').mapParams;

import getSearchLocationDetails from '../utils/getSearchLocationDetails';
import createQueryString from '../utils/createQueryString';
import staticmaprequest from '../utils/static-map-request';
import defaultValues from '../constants/DefaultValues';
import { fetchAllFavourites, removeFavourite } from '../utils/favourites';
import { checkPolygonForAntiMeridianIntersection } from '../utils/checkParamsForAntiMeridian';

require('../utils/CustomEvent');

function _getFavouritesParams(stores) {
    let params = {};
    const requireParams = ['CurrencyCode', 'Unit', 'Interval'];

    requireParams.forEach(param => {
        let val;
        if (val === stores.ParamStore.getParam(param)) {
            params[param] = val;
        }
    });

    return params;
}

function _processParams(qp) {
    var queryParams = _.clone(qp) || {};

    for (var param in queryParams) {
        if (
            queryParams.hasOwnProperty(param) &&
            _.isPlainObject(queryParams[param])
        ) {
            for (var subParam in queryParams[param]) {
                if (queryParams[param].hasOwnProperty(subParam)) {
                    queryParams[param + '.' + subParam] =
                        queryParams[param][subParam];
                }
            }
            delete queryParams[param];
        }
    }

    // Is this a polygon or non geographical search?
    if (
        queryParams.hasOwnProperty('searchMode') &&
        (queryParams.searchMode === 'polygon' ||
            queryParams.searchMode === 'nonGeo')
    ) {
        // Yes so we don't want to pass the location params if they exist
        delete queryParams.lat;
        delete queryParams.lon;
        delete queryParams.radius;
    }

    return queryParams;
}

const stripQueryParam = (obj, queryParam) => {
    if (obj[queryParam]) {
        delete obj[queryParam];
    }
};

var shouldLoad = true;

module.exports = function (stores, Dispatcher) {
    this.bootstrap = function (configUrl, qp) {
        var queryParams = _processParams(qp);

        // Ensure components know we are loading, as we are making an AJAX request.
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_CONFIG
        });

        // Allow list map view to use other bootstrapping functionality
        if (!configUrl) {
            return;
        }

        Ajax.call(
            configUrl,
            function (data) {
                this.bootstrapConfig(data, queryParams);
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.CONFIG_ERROR
                });
            }
        );
    };

    this.bootstrapConfig = function (configJson, queryParams) {
        for (const query in queryParams) {
            if (
                queryParams.hasOwnProperty(query) &&
                queryParams[query] !== undefined
            ) {
                queryParams[query] = decodeURIComponent(queryParams[query]);
            }
        }

        var dispatch = {
            type: ActionTypes.BOOTSTRAP,
            queryParams: queryParams
        };

        dispatch.data = configJson;

        if (
            configJson.searchMode === 'nonGeo' ||
            queryParams.hasOwnProperty('_pdfrender')
        ) {
            // Don't do any location lookup in nonGeo mode
            Dispatcher.dispatch(dispatch);
        } else {
            // if no query param for location is provided, use the location in the search config, this may help to eventually remove the additional call to autocomplete
            queryParams = Object.keys(queryParams).length > 0 ? queryParams : { "location": configJson.searchConfig.searchLocationName };

            getSearchLocationDetails(queryParams, configJson)
                .then(function (searchContext) {
                    if (searchContext.hasOwnProperty('placename')) {
                        stores.SearchStateStore.setItem(
                            'searchLocationName',
                            searchContext.placename
                        );
                        dispatch.placename = searchContext.placename;
                    }

                    if (searchContext.hasOwnProperty('searchtype')) {
                        dispatch.searchtype = searchContext.searchtype;
                    }

                    var _polygon =
                        searchContext.polygon ||
                        stores.SearchStateStore.getItem(
                            'searchLocationPolygon'
                        );

                        if (!searchContext.placename){
                            Dispatcher.dispatch(dispatch);
                            return;
                        }
                        
                        const address = searchContext.placename.split(',');    
                        
                        if (searchContext.locationType && configJson.streetAddressExtraRadius && ((address.length > 2 && configJson.lessRestrictiveExtraRadius) || searchContext.locationType == "ROOFTOP")){
                        var centerSfo = new google.maps.LatLng(_polygon.centre.lat(), _polygon.centre.lng());
                        var circle = new google.maps.Circle({ radius: configJson.streetAddressExtraRadius, center: centerSfo });
                        var bounds = circle.getBounds();
                        bounds = new window.google.maps.Rectangle({
                            bounds: bounds
                        }).getBounds();
                        
                        var lats = bounds.Ya || bounds.Va;
                        var lngs = bounds.Sa || bounds.Qa;
                       
                        if(lats&&lngs){
                            _polygon.bounds = bounds;
                        var expandedPolygon = [];
                        expandedPolygon.push(
                            '"' + lats.j + ',' + lngs.j + '"',
                            '"' + lats.i + ',' + lngs.j + '"',
                            '"' + lats.i + ',' + lngs.i + '"',
                            '"' + lats.j + ',' + lngs.i + '"'
                        );
                        expandedPolygon = expandedPolygon.join(',');
                        _polygon.polygon = expandedPolygon;
                        }
                    }

                    if (_polygon) {
                        dispatch.polygon = _polygon;
                        // TODO:
                        // Tech debt: CBRE3-314 | The below is a bit of a cheat, ideally the flow of the app instantiation would be refactored to wait until the searchStateStore
                        // was complete. Adding a task to technical debt to remove this
                        stores.SearchStateStore.setItem(
                            'searchLocationPolygon',
                            _polygon
                        );
                    }

                    Dispatcher.dispatch(dispatch);
                })
                .catch((e) => {
                    Dispatcher.dispatch({
                        type: ActionTypes.PLACES_ERROR
                    });
                    Dispatcher.dispatch(dispatch);
                });
        }
    };

    this.toggleFavourites = (isActive, routing) => {
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_API
        });

        setTimeout(() => {
            Dispatcher.dispatch({
                type: ActionTypes.TOGGLE_FAVOURITES,
                isActive: isActive || false
            });

            if (routing) {
                const params = {
                    view:
                        stores.SearchStateStore.getItem('searchType') ||
                        defaultValues.searchType,
                    isFavourites: true,
                    Site: stores.ParamStore.getParam('Site'),
                    pagesize: 9999,
                    page: 1,
                    propertyId: this.getFilteredFavouriteParamsValues()
                };

                const { router, path, searchParams } = routing;

                const siteTheme = window.cbreSiteTheme;
                let r3 = false;
                if (siteTheme && siteTheme === 'commercialr3' || siteTheme === 'commercialr4') {
                    r3 = true;
                }

                let favoriteCheck = false;
                if (r3 && searchParams.isFavourites && searchParams.isFavourites === 'true') {
                    favoriteCheck = true;
                }

                if (isActive && !favoriteCheck) {
                    if (r3) {
                        const modifiedParams = { ...searchParams, ...params };
                        router.push({ pathname: path, query: modifiedParams });
                    } else {
                        router.push({ pathname: path, query: params });
                    }
                } else {
                    // we want to make sure the search query doesn't contain any of the favorite specific params 
                    if (r3) {
                        stripQueryParam(searchParams, 'view');
                        stripQueryParam(searchParams, 'isFavourites');
                        stripQueryParam(searchParams, 'pagesize');
                        stripQueryParam(searchParams, 'page');
                        stripQueryParam(searchParams, 'propertyId');
                    }
                    router.push({ pathname: path, query: searchParams });
                }
            }
        });
    };

    this.fetchStaticMapUrls = (url, req) => {
        staticmaprequest.getMap(
            url,
            req,
            data => {
                const maps = JSON.parse(data);
                Dispatcher.dispatch({
                    type: ActionTypes.SET_STATIC_MAPS,
                    payload: maps
                });
            },
            error => {
                console.warn('error with static map generator', error); //eslint-disable-line
                Dispatcher.dispatch({
                    type: ActionTypes.SET_STATIC_MAPS,
                    payload: []
                });
            }
        );
    };

    this.fetchPdfProperties = propertyIds => {
        const params = _getFavouritesParams(stores);
        this.fetchPropertiesByIds(propertyIds, params, data => {
            Dispatcher.dispatch({
                type: ActionTypes.SET_PDF_PROPERTIES,
                payload: data
            });
        });
    };

    this.fetchSiteMapsConfig = () => {
        const url = "/resources/configuration/SiteMapsConfig.json";

        if (url) {
            Ajax.call(
                url,
                function (data) {
                    // this.setConfigStoreItem(toLowerCase(data), 'siteMapsConfig');
                    this.setConfigStoreItem(data, 'siteMapsConfig');
                }.bind(this),
                function (error) {
                    console.warn('error with siteMapsConfig', error);
                    return;
                }
            );
        }
    };

    this.fetchOSMData = (placeId, callback) => {
        const polygonUrl = stores.ConfigStore.getFeatures().drawAdminBoundaries.url;
        const url = `${polygonUrl}?placeId=${placeId}`;

        if (url) {
            Ajax.call(
                url,
                function (data) {
                    callback(data);
                    // console.log(data);
                }.bind(this),
                function (error) {
                    console.warn('error with siteMapsConfig', error);
                    return;
                }
            );
        }
    }; 

    this.fetchPropertiesByIds = (ids, params, callback) => {
        let _params = Object.assign({}, params, {
            Site: stores.ParamStore.getParam('Site'),
            propertyId: ids
        });

        _params = mapParams(_params, true);
        _params = createQueryString(_params);
        const url = `${stores.ConfigStore.getItem(
            'api'
        )}/propertylistings/query${_params}`;

        Ajax.call(
            url,
            function (data) {
                callback(data);
                return data;
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.API_ERROR
                });
                return false;
            }
        );
    };

    this.updateFavourites = router => {
        // Get API data and dispatch.
        const ids = this.getFavouriteParamsValues();
        let params = {
            pagesize: 200,
            page: 1
        };
        params = Object.assign({}, params, _getFavouritesParams(stores));
        params = mapParams(params, true);
        this.fetchPropertiesByIds(ids, params, data => {
            Dispatcher.dispatch({
                type: ActionTypes.SET_FAVOURITES,
                payload: data
            });

            if (stores.FavouritesStore.isActive() && router) {
                const routing = {
                    router,
                    path: location.pathname,
                    searchParams: stores.ParamStore.getParams()
                };

                this.toggleFavourites(true, routing);
            }
        });
    };

    this.getFavouriteParamsValues = () => {
        const favouritedIds = fetchAllFavourites();
        let primaryKeyParamValues = favouritedIds.join();
        // Needed to return 0 results from api if no primary keys exist.
        if (!favouritedIds.length) {
            primaryKeyParamValues = '0';
        }

        return primaryKeyParamValues;
    };

    this.getFilteredFavouriteParamsValues = () => {
        const favIds = stores.FavouritesStore.getAll().map(p => p.PropertyId);
        let primaryKeyParamValues = favIds.join();
        // Needed to return 0 results from api if no primary keys exist.
        if (!favIds.length) {
            primaryKeyParamValues = '0';
        }

        return primaryKeyParamValues;
    };

    this.clearAllFavourites = () => {
        // Clear local storage of favs for current mode
        const favIds = stores.FavouritesStore.getAll().map(
            fav => fav.PropertyId
        );

        favIds.forEach(id => removeFavourite(id));

        Dispatcher.dispatch({
            type: ActionTypes.CLEAR_FAVOURITES
        });
    };

    this.fetchStampDutyConfig = () => {
        const SdcConfigUrl = stores.ConfigStore.getItem(
            'stampDutyCalculatorConfigUrl'
        );

        if (SdcConfigUrl) {
            Ajax.call(
                SdcConfigUrl,
                function (data) {
                    this.setConfigStoreItem(data, 'stampDutyConfig');
                }.bind(this),
                function (error) {
                    console.warn('error with stampDutyConfig', error); //eslint-disable-line
                    return;
                }
            );
        }
    };

    this.updateQueryParams = function (qp) {
        var queryParams = _processParams(qp);

        Dispatcher.dispatch({
            type: ActionTypes.LOADING_API
        });

        getSearchLocationDetails(queryParams, stores.ConfigStore.getConfig())
            .then(function (searchContext) {
                var dispatch = {
                    type: ActionTypes.UPDATE_QUERY_PARAMS,
                    queryParams: queryParams
                };

                if (searchContext && searchContext.placename) {
                    dispatch.placename = searchContext.placename;
                }

                var _polygon =
                    searchContext.polygon ||
                    stores.SearchStateStore.getItem('searchLocationPolygon');
                if (_polygon) {
                    dispatch.polygon = _polygon;
                }

                Dispatcher.dispatch(dispatch);
            })
            .catch((e) => {
                Dispatcher.dispatch({
                    type: ActionTypes.PLACES_ERROR
                });
            });
    };

    this.updatePropertiesMap = function (propertiesMap) {
        return Dispatcher.dispatch({
            type: ActionTypes.UPDATE_PROPERTIES_MAP,
            payload: propertiesMap
        });
    };

    this.resetProperties = function () {
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_API
        });
        Dispatcher.dispatch({
            type: ActionTypes.RESET_PROPERTIES
        });
    };

    this.updateParams = function (
        path,
        params,
        router
    ) {
        if (router && path && params) {
            router.push({ pathname: path, query: params });
        }
    };

    this.updateProperties = function (
        params,
        fetchAll,
        propertiesMap,
        path,
        router,
        reduxDispatchMapMarkers
    ) {
        this.setParams(params);
        return this.getProperties(
            fetchAll,
            propertiesMap,
            params,
            path,
            router,
            reduxDispatchMapMarkers
        );
    };

    this.updateFetchMode = function (isFetchAllMode) {
        return Dispatcher.dispatch({
            type: ActionTypes.UPDATE_FETCH_MODE,
            payload: isFetchAllMode
        });
    };

    this.updateIsAreaSearch = function (isAreaSearch) {
        return Dispatcher.dispatch({
            type: ActionTypes.UPDATE_ISAREA_SEARCH,
            payload: isAreaSearch
        });
    };

    this.updateRadiusIfModeIsBounding = function (params) {
        var mode = stores.ParamStore.getParam('searchMode');

        // If we're in bounding mode and we're passing a radius
        // We need to work out the actual required radius by adding the user defined value to the distance between the polygon centre and it's Northeast corner

        if (mode === 'bounding') {
            if (params.radius) {
                var polygon = stores.SearchStateStore.getItem(
                    'searchLocationPolygon'
                );

                if (polygon) {
                    params.radius = haversine(
                        polygon,
                        params.radius,
                        params.RadiusType
                    );
                }
            }
        }

        return params;
    };

    this.getProperties = function (
        fetchAll,
        selectFields,
        originalParams,
        path,
        router,
        reduxDispatches
    ) {
        // prevent api call from occuring again until ajax returns a success or a fail
        if (shouldLoad) {
            // disable api call for now
            shouldLoad = false;

            // Perhaps this happens during set params
            if (router && path && originalParams) {
                router.push({ pathname: path, query: originalParams });
            }

            var mode = stores.ParamStore.getParam('searchMode');

            if (stores.SearchStateStore.getItem('extendedSearch')) {
                originalParams.Sort = 'asc(_distance)';
                switch (mode) {
                    case 'bounding':
                        delete originalParams.polygons;
                        delete originalParams.radius;
                        break;
                    case 'pin':
                        delete originalParams.radius;
                        break;
                }
            }

            originalParams = Object.assign({}, originalParams);
            var params = Object.assign({}, originalParams); //@TODO <- CS: Find out why params isn't being sent through on HOMEPAGE

            if (!parseFloat(params.radius)) {
                delete params.radius;
            }

            params = this.updateRadiusIfModeIsBounding(params);

            // If we're in deeplinked favourites view we need to discard all the previous logic and fix the result set
            if (stores.SearchStateStore.getAll().isFavourites) {
                fetchAll = true;
                params = {
                    Site: stores.ParamStore.getParam('Site'),
                    propertyId: originalParams.propertyId
                };

                params = Object.assign({}, params, _getFavouritesParams(stores));
            }

            if (fetchAll) {
                params.pagesize =
                    stores.ConfigStore.getItem('limitListMapResults') ||
                    defaultValues.limitListMapResults ||
                    9999;
                params.page = 1;
            }
            params = mapParams(params, true);
            delete params.initialPolygons;
            delete params.initialRadius;
            var queryString = createQueryString(params);

            if (selectFields !== null && selectFields !== undefined) {
                queryString += '&_select=' + selectFields.join();
            }

            var url =
                stores.ConfigStore.getItem('api') +
                '/propertylistings/query' +
                queryString;

            // Ensure components know we are loading, as we are making an AJAX request.
            Dispatcher.dispatch({
                type: ActionTypes.LOADING_API
            });

            Ajax.call(
                url,
                function (data) {
                    // reenable api call
                    shouldLoad = true;
                    this.handlePropertyResults(
                        data,
                        fetchAll,
                        selectFields,
                        params,
                        originalParams,
                        path,
                        router,
                        reduxDispatches
                    );
                }.bind(this),
                function () {
                    // reenable api call
                    shouldLoad = true;
                    Dispatcher.dispatch({
                        type: ActionTypes.API_ERROR
                    });
                }
            );
        }
    };

    // DEVNOTE: This isn't exactly flux... but it handles the job with far fewer lines.
    // SEE CBRETWO-1367
    this.handlePropertyResults = function (
        properties,
        fetchAll,
        selectFields,
        params,
        originalParams,
        path,
        router,
        reduxDispatches
    ) {
        // Handle extended search.
        if (
            (properties.Documents.length === 0 ||
                properties.Documents[0].length === 0) && // no properties were retrieved
            stores.ConfigStore.getItem('extendSearches') && // extendedSearch feature is Enabled
            !stores.SearchStateStore.getItem('extendedSearch')
        ) {
            // and we haven't already extended

            // Dispatch search state and radius.
            this.setSearchStateItem('extendedSearch', true);
            this.setSearchStateItem(
                'originalSearchRadius',
                originalParams.radius
            );

            this.getProperties(
                fetchAll,
                selectFields,
                originalParams,
                path,
                router
            );
            return;
        }

        if (reduxDispatches && properties && properties.Documents) {
            // temporary: compile a list of map markers to feed our redux store
            // eventually we want this to be an actual independent API call
            const mapMarkers = [];
            const propertyLookup = {};
            const reduxProperties = [];

            properties.Documents[0].forEach((property, index) => {
                const id = property['Common.PrimaryKey'];
                mapMarkers.push({
                    'id': id,
                    'lat': property['Common.Coordinate'].lat,
                    'lon': property['Common.Coordinate'].lon,
                    'exact': property['Common.GeoLocation'] ? property['Common.GeoLocation']['Common.Exact'] : false,
                    'showInfo': true,
                    'active': true
                });
                propertyLookup[id] = index;
                reduxProperties.push(property);
            });

            // redux dispatches
            // reduxDispatches.updateProperties(reduxProperties);
            // reduxDispatches.updatePropertyLookup(propertyLookup);
            // reduxDispatches.updateMapMarkers(mapMarkers);
        }

        // normal flux dispatch
        Dispatcher.dispatch({
            type: ActionTypes.GET_PROPERTIES,
            data: properties,
            truncateAmount: this.getTruncateAmount()
        });
    };

    this.getTruncateAmount = function () {
        let truncateAmount = null;

        if (stores.ConfigStore.getItem('listmap')) {
            truncateAmount = stores.ConfigStore.getItem('limitListMapResults')
                ? stores.ConfigStore.getItem('limitListMapResults')
                : defaultValues.limitListMapResults;
        }
        return truncateAmount;
    };

    this.getProperty = function (id, outOfContext) {
        var params = createQueryString(
            _.pick(stores.ParamStore.getParams(), [
                'CurrencyCode',
                'Unit',
                'Interval',
                'Site'
            ])
        ),
            url =
                stores.ConfigStore.getItem('api') +
                '/propertylisting/' +
                id +
                params;

        // Ensure components know we are loading, as we are making an AJAX request.
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_API
        });

        Ajax.call(
            url,
            function (data) {
                Dispatcher.dispatch({
                    type: ActionTypes.GET_PROPERTY,
                    data: data,
                    outOfContext: outOfContext
                });
            }.bind(this),
            function (error) {
                var language = stores.LanguageStore.getLanguage();

                if (error === 404) {
                    this.declareError(
                        error,
                        language.ErrorSubTitle,
                        language.ErrorBadRequest
                    );
                } else {
                    Dispatcher.dispatch({
                        type: ActionTypes.API_ERROR
                    });
                }
            }.bind(this)
        );
    };

    this.fetchRelatedProperties = function (property, limit, areaSearch) {
        areaSearch = areaSearch || !property.ParentPropertyId;

        const searchInDevelopmentParams = {
            site: stores.ParamStore.getParam('Site'),
            aspects:
                stores.SearchStateStore.getItem('searchType') ||
                defaultValues.searchType,
            propertyId: '!' + property.PropertyId,
            parentProperty: property.ParentPropertyId,
            pagesize: limit || 9999,
            page: 1
        };

        let searchInAreaParams = Object.assign({}, searchInDevelopmentParams, {
            pagesize: limit || 9999,
            radius:
                stores.ConfigStore.getConfig().localPropertiesRadius ||
                defaultValues.localPropertiesRadius,
            usageType: property.UsageType,
            lat: property.Coordinates.lat,
            lng: property.Coordinates.lon
        });

        delete searchInAreaParams.parentProperty;

        const params =
            areaSearch || !property.ParentPropertyId
                ? searchInAreaParams
                : searchInDevelopmentParams;

        if (
            stores.ConfigStore.getFeatures().childListings &&
            stores.ConfigStore.getFeatures().childListings.enableChildListings
        ) {
            params.isParent = true;
        }

        const type = areaSearch
            ? 'PropertiesInArea'
            : 'PropertiesInDevelopment';

        let url =
            stores.ConfigStore.getItem('api') +
            '/propertylistings/query' +
            createQueryString(mapParams(params, true));

        if (stores.ConfigStore.getConfig().additionalCarouselQuery) {
            url = url.concat(stores.ConfigStore.getConfig().additionalCarouselQuery);
        }

        Ajax.call(
            url,
            function (data) {
                if (data.DocumentCount || areaSearch) {
                    Dispatcher.dispatch({
                        type: ActionTypes.GET_RELATED_PROPERTIES,
                        dataType: type,
                        data: data
                    });
                } else {
                    this.fetchRelatedProperties(property, limit, true);
                }
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.FAILED_GET_RELATED_PROPERTIES
                });
            }.bind(this)
        );
    };

    this.fetchChildProperties = function (property, limit, areaSearch) {
        const searchForChildren = {
            site: stores.ParamStore.getParam('Site'),
            aspects:
                stores.SearchStateStore.getItem('searchType') ||
                defaultValues.searchType,
            propertyId: '!' + property.PropertyId,
            parentProperty: property.PropertyId,
            pagesize: limit || 100,
            page: 1
        };

        const params = searchForChildren;

        const url =
            stores.ConfigStore.getItem('api') +
            '/propertylistings/query' +
            createQueryString(mapParams(params, true));
        Ajax.call(
            url,
            function (data) {
                if (data.DocumentCount || areaSearch) {
                    Dispatcher.dispatch({
                        type: ActionTypes.GET_CHILD_PROPERTIES,
                        data: data
                    });
                } else {
                    this.fetchChildProperties(property, limit, true);
                }
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.FAILED_GET_CHILD_PROPERTIES
                });
            }.bind(this)
        );
    };

    this.fetchListingCount = function (propertyId) {
        const params = {
            site: stores.ParamStore.getParam('Site'),
            aspects:
                stores.SearchStateStore.getItem('searchType') ||
                defaultValues.searchType,
            propertyId: '!' + propertyId,
            parentProperty: propertyId
        };

        const url =
            stores.ConfigStore.getItem('api') +
            '/propertylistings/query' +
            createQueryString(mapParams(params, true)) +
            '&_select=DocumentCount';
        Ajax.call(
            url,
            function (data) {
                Dispatcher.dispatch({
                    type: ActionTypes.GET_LISTING_COUNT,
                    data: data,
                    propertyId: propertyId
                });
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.FAILED_GET_LISTING_COUNT,
                    propertyId: propertyId
                });
            }.bind(this)
        );
    };

    // TODO:
    // When old PDP view is deprecated we can strip this function and all references to it,
    // the above function replaces it
    this.getRelatedProperties = function (params) {
        // TODO: constrain PageSize and Fields. Currently this call is returning nearly 300k for 4 thumbnails.
        params = mapParams(params, true);
        var url =
            stores.ConfigStore.getItem('api') +
            '/propertylistings/query' +
            createQueryString(params);

        Ajax.call(
            url,
            function (data) {
                Dispatcher.dispatch({
                    type: ActionTypes.GET_RELATED_PROPERTIES,
                    data: data
                });
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.FAILED_GET_RELATED_PROPERTIES
                });
            }.bind(this)
        );
    };

    this.setProperty = function (property) {
        Dispatcher.dispatch({
            type: ActionTypes.GET_PROPERTY,
            data: property,
            raw: true
        });
    };

    this.mapPolygonParams = function (params) {
        params.polygons = params.PolygonFilters;
        params.lat = params.Lat;
        params = checkPolygonForAntiMeridianIntersection(params);
        if (!params.polygons) {
            delete params.PolygonFilters;
        } else {
            delete params.polygons;
        }
        return params;
    }

    this.getAdjacentProperty = function (params, index) {
        params = this.updateRadiusIfModeIsBounding(params);
        //removing the inital polygons from the list
        delete params.initialPolygons;
        delete params.initialRadius;
        params = this.mapPolygonParams(params);

        var url =
            stores.ConfigStore.getItem('api') +
            '/propertylistings/query' +
            createQueryString(params);

        // Ensure components know we are loading, as we are making an AJAX request.
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_API
        });

        Ajax.call(
            url,
            function (data) {
                Dispatcher.dispatch({
                    type: ActionTypes.GET_ADJACENT_PROPERTY,
                    data: data,
                    index: index
                });
            }.bind(this),
            function () {
                Dispatcher.dispatch({
                    type: ActionTypes.API_ERROR
                });
            }
        );
    };

    this.setPropertyIndex = function (propertyIndex) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_PROPERTY_INDEX,
            value: propertyIndex
        });
    };

    this.setSearchState = function (init) {
        Dispatcher.dispatch({
            type: ActionTypes.CREATE_SEARCH_STATE,
            payload: init
        });
    };

    this.setSearchStateItem = function (item, value) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_SEARCH_STATE,
            item: item,
            value: value
        });
    };

    this.setConfigStoreItem = function (item, value) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_CONFIG_ITEM,
            item: item,
            value: value
        });
    };

    this.deleteSearchStateItem = function (item) {
        Dispatcher.dispatch({
            type: ActionTypes.DELETE_SEARCH_STATE_ITEM,
            item: item
        });
    };

    this.setSearchContext = function (value) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_SEARCH_CONTEXT,
            value: value
        });
    };

    this.setParams = function (params) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_PARAMS,
            params: params
        });
    };

    this.setParam = function (property, value) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_PARAM,
            property: property,
            value: value
        });
    };

    this.deleteParam = function (property) {
        Dispatcher.dispatch({
            type: ActionTypes.DELETE_PARAM,
            property: property
        });
    };

    this.setLanguage = function (data) {
        Dispatcher.dispatch({
            type: ActionTypes.SET_LANG,
            payload: data
        });
    };

    // Notify stores about application state change (action creator).
    this.updateApplicationState = function (route) {
        Dispatcher.dispatch({
            type: ActionTypes.STATE_CHANGE,
            route: route
        });
    };

    this.closeModal = function () {
        Dispatcher.dispatch({
            type: ActionTypes.CLOSE_MODAL,
            payload: 'closed_modal'
        });
    };

    this.publishCustomEvent = function (detail, eventName) {
        var event = new CustomEvent(eventName || 'CBRESpaUserEvent', {
            detail: detail
        });

        setTimeout(function () {
            document.dispatchEvent(event);
        });
    };

    this.declareError = function (statusCode, message, detail) {
        Dispatcher.dispatch({
            type: ActionTypes.APPLICATION_ERROR,
            payload: {
                statusCode: statusCode || 200,
                message: message,
                detail: detail
            }
        });
    };

    this.startLoading = function () {
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_VIEW_START
        });
    };

    this.stopLoading = function () {
        Dispatcher.dispatch({
            type: ActionTypes.LOADING_VIEW_END
        });
    };
};
