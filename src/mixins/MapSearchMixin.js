var DefaultValues = require('../constants/DefaultValues');
var createPolygon = require('../utils/createPolygon');
var _ = require('lodash');
var isExtendedPolygonReady = require('../utils/isExtendedPolygonReady');

var MapSearchMixin = {
    getInitialState: function () {
        return this.getMapSearchState();
    },

    getMapSearchState: function () {
        var ParamStore = this.getParamStore();
        var SearchStateStore = this.getSearchStateStore();

        var defaultLocation = {
            params: {
                lat: ParamStore.getParam('lat') || null,
                lon: ParamStore.getParam('lon') || null,
                radius: ParamStore.getParam('radius') || null
            }
        };

        return {
            locationBias: SearchStateStore.getItem('searchBias'),
            biasRadius:
                SearchStateStore.getItem('biasRadius') ||
                DefaultValues.searchBiasRadius,
            restrictToCountry: SearchStateStore.getItem('restrictToCountry'),
            searchPlaceTypes:
                SearchStateStore.getItem('searchPlaceTypes') || null,
            locationTypeDefinitions:
                SearchStateStore.getItem('locationTypeDefinitions') || [],
            searchLocationName:
                SearchStateStore.getItem('searchLocationName') || null,
            defaultLocation: defaultLocation
        };
    },

    _setToDefaultLocation: function () {
        var actions = this.getActions(),
            defaults = this.state.defaultLocation,
            params = _.clone(this.getParamStore().getParams());

        _.forOwn(defaults.params, function (val, key) {
            if (params.hasOwnProperty(key)) {
                if (val) {
                    actions.setParam(key, val);
                } else {
                    actions.deleteParam(key);
                }
            }
        });

        if (defaults.searchLocationName) {
            actions.setSearchStateItem(
                'searchLocationName',
                defaults.searchLocationName
            );
        }

        actions.deleteParam('placeId');
        actions.deleteSearchStateItem('currentPlaceId');
    },

    _suggestionSelected: function (suggestion, auto) {
        var actions = this.getActions(),
            isExtended = this.getSearchStateStore().getItem('extendedSearch'),
            bootStrapParams = _.clone(this.getParamStore().getParams());

        // turn area search off when using autocomplete
        this.getActions().updateIsAreaSearch(false);

        if (suggestion && !suggestion.propertyId) {
            const address = suggestion.label.split(',');
            var _polygon = createPolygon(suggestion.gmaps.geometry.viewport);
            var standalone = this.props.isStandalone;

            _polygon.bounds = suggestion.gmaps.geometry.viewport;

            var config = this.getConfigStore().getConfig();

            // expand bounds if street address search && feature flag enabled
            if (config.streetAddressExtraRadius && ((address.length > 1 && config.lessRestrictiveExtraRadius) || suggestion.gmaps.geometry.location_type == "ROOFTOP")) {
                var centerSfo = new google.maps.LatLng(suggestion.location.lat, suggestion.location.lng);
                var circle = new google.maps.Circle({ radius: config.streetAddressExtraRadius, center: centerSfo });
                var bounds = circle.getBounds();
                bounds = new window.google.maps.Rectangle({
                    bounds: bounds
                }).getBounds();
                var _ne = bounds.getNorthEast();
                var _sw = bounds.getSouthWest();
                _polygon.bounds = bounds;
                // southwest coord then northeast

                var expandedPolygon = [];
                expandedPolygon.push(
                    '"' + _ne.lat() + ',' + _ne.lng() + '"',
                    '"' + _sw.lat() + ',' + _ne.lng() + '"',
                    '"' + _sw.lat() + ',' + _sw.lng() + '"',
                    '"' + _ne.lat() + ',' + _sw.lng() + '"'
                );
                expandedPolygon = expandedPolygon.join(',');
                _polygon.polygon = expandedPolygon;
            }

            if (
                !standalone &&
                this.getParamStore().getParam('searchMode') === 'bounding' &&
                (!isExtendedPolygonReady(bootStrapParams) || isExtended)
            ) {
                if (
                    !bootStrapParams.hasOwnProperty('polygons') &&
                    !isExtended
                ) {
                    bootStrapParams.lat = _polygon.centre.lat();
                    bootStrapParams.lon = _polygon.centre.lng();
                    bootStrapParams.polygons = '[[' + _polygon.polygon + ']]';
                    actions.setParams(bootStrapParams);
                } else {
                    actions.deleteParam('radius');
                    actions.setParam('lat', suggestion.location.lat);
                    actions.setParam('lon', suggestion.location.lng);
                    actions.setParam(
                        'polygons',
                        '[[' + _polygon.polygon + ']]'
                    );
                    actions.setParam(
                        'initialPolygons',
                        '[[' + _polygon.polygon + ']]'
                    );
                }
            } else {
                if (bootStrapParams.initialRadius) {
                    actions.setParam('radius', bootStrapParams.initialRadius);
                    actions.deleteParam('initialRadius');
                }
                else
                    actions.deleteParam('radius');
                actions.setParam('lat', suggestion.location.lat);
                actions.setParam('lon', suggestion.location.lng);
            }

            if (window.cbreSiteTheme != 'commercialr4') {
                actions.setSearchStateItem('searchLocationPolygon', _polygon);
            }

            // this sets the location name, i.e., Dallas, TX so leave in all implementations
            actions.setSearchStateItem('searchLocationName', suggestion.label);

            actions.setParam('location', suggestion.label);
            actions.setParam('placeId', suggestion.gmaps.place_id);

            if (this.props.isStandalone) {
                if (this.state.locationTypeDefinitions.length) {
                    actions.setParam(
                        'radius',
                        this._getRadius(suggestion.gmaps.types)
                    );
                }
                actions.setSearchStateItem(
                    'currentPlaceId',
                    suggestion.gmaps.place_id
                );
            }

            if (auto) {
                this._updateSearch();
            }
        } else {
            this._setToDefaultLocation();
        }
    },

    _getRadius: function (types) {
        var definitions = this.state.locationTypeDefinitions,
            radius = null;

        // Loop through the location types passed in from config
        for (var a = 0; a < definitions.length; a++) {
            var defs = definitions[a].definitions,
                match = false;

            // Loop through the locations definition arrays
            for (var b = 0; b < defs.length; b++) {
                var matchArray = _.intersection(defs[b], types);

                // If the google place types can all be found in this definition array we have a match and can stop testing
                if (matchArray.length) {
                    match = true;
                    break;
                }
            }
            if (match === true) {
                radius = definitions[a].radius;
                break;
            }
        }

        // If no matches were found then set the radius to the default
        if (!radius && radius !== 0) {
            var defaultDefinition = definitions.filter(function (def) {
                return def.name == 'default';
            })[0];
            radius = defaultDefinition.radius;
        }
        return radius.toString();
    }
};

module.exports = MapSearchMixin;
