import Places from './Places';
import CachedPlaces from './cachedPlaces';
import createPolygon from './createPolygon';

function getSearchLocationDetails(queryParams, config = {}) {
    const hasView = queryParams.hasOwnProperty('view');
    const hasPlaceId = queryParams.hasOwnProperty('placeId');
    const hasLocation = queryParams.hasOwnProperty('location');
    const hasLocationName =
        config.hasOwnProperty('searchConfig') &&
        config.searchConfig.hasOwnProperty('searchLocationName') &&
        config.searchConfig.searchLocationName.length;

    const useCachedPlaces = config.features && config.features.hasOwnProperty("useCachedPlaces") &&
        config.features.useCachedPlaces.enabled == true;

    const countryCode = config.hasOwnProperty("countryCode") ? config.countryCode : ""

    //const isBounding = config.searchMode === 'bounding';

    const getPlacesLookup = useCachedPlaces ?
        getSearchLocationDetails.getCachedPlacesLookup :
        getSearchLocationDetails.getPlacesLookup;

    const createPolygon = getSearchLocationDetails.createPolygon;

    let searchContext = {};

    return new Promise(function (resolve, reject) {
        if (
            queryParams &&
            Object.keys(queryParams).length !== 0 &&
            typeof queryParams !== 'undefined'
        ) {
            if (hasView) {
                searchContext.searchtype = queryParams.view;
                delete queryParams.view;
            }
            if (
                hasLocation ||
                hasPlaceId ||
                hasLocationName //&&
                //config.searchMode !== 'polygon'
            ) {
                const _location =
                    queryParams.location ||
                    config.searchConfig.searchLocationName;
                const location = decodeURIComponent(_location).replace(
                    /\+/g,
                    ' '
                );

                // order of pref for lookup string is QS location, QS placeid, config location, 
                // since it follows first-time load logic where no placeid is in url but location equals searchbox
                // location equals searchbox unless overriden in url with location query parameter
                let lookUp = { address: location };

                if (useCachedPlaces && hasLocation && !hasPlaceId) {
                    lookUp = { address: location, endpoint: config.features.useCachedPlaces.addressEndpoint + "?address=" + location + "&countryCode=" + countryCode};
                } else if (useCachedPlaces && hasPlaceId) {
                    lookUp = { placeId: queryParams.placeId, endpoint: config.features.useCachedPlaces.placeEndpoint + "?placeId=" + queryParams.placeId };
                } else if (useCachedPlaces && !hasPlaceId) {
                    lookUp = { address: location, endpoint: config.features.useCachedPlaces.addressEndpoint + "?address=" + location + "&countryCode=" + countryCode};
                }

                getPlacesLookup(
                    lookUp,
                    function (result) {
                        if (typeof result.location !== 'undefined') {
                            queryParams.lat = result.location.lat;
                            queryParams.lon = result.location.lng;

                            if (config.searchMode === 'bounding') {
                                var _polygon = createPolygon(
                                    result.gmaps.geometry.viewport
                                );

                                _polygon.bounds =
                                    result.gmaps.geometry.viewport;
                                searchContext.polygon = _polygon;
                            }

                            searchContext.placename =
                                location || result.gmaps.formatted_address;

                            searchContext.locationType = result.gmaps.geometry.location_type;
                        }

                        resolve(searchContext);
                    },
                    reject
                );
            } else {
                resolve(searchContext);
            }
        } else {
            resolve(searchContext);
        }
    });
}

getSearchLocationDetails.getPlacesLookup = function () {
    return Places.lookup.apply(this, arguments);
};

getSearchLocationDetails.getCachedPlacesLookup = function () {
    return CachedPlaces.lookup.apply(this, arguments);
};

getSearchLocationDetails.createPolygon = function () {
    return createPolygon.apply(this, arguments);
};

export default getSearchLocationDetails;