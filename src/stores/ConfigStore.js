/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */
var ActionTypes = require('../constants/ActionTypes'),
    BaseStore = require('./BaseStore'),
    defaultValues = require('../constants/DefaultValues');

function _ifLocationTypeDefinitionsExists(config) {
    return (
        config.searchConfig &&
        config.searchConfig.locationTypeDefinitions &&
        config.searchConfig.locationTypeDefinitions.length
    );
}

function _ifDefinitionsExistAndHasItems(locationTypeDefinition) {
    return (
        locationTypeDefinition.definitions &&
        locationTypeDefinition.definitions.length
    );
}

var ConfigStore = function(stores, Dispatcher) {
    // For backwards compatibility:
    // If a setting is missing, then we can invoke a setting mapper to look for the previous incarnation's implementation, and map those settings forwards
    var _self = this,
        _configMappers = {
            siteId: function() {
                var siteID = _self
                    .getItem('countryCode')
                    .toLowerCase()
                    .replace('gb', 'uk');
                var usageType = _self
                    .getItem('siteType')
                    .toLowerCase()
                    .substr(0, 4);
                return siteID + '-' + usageType;
            },
            searchMode: function() {
                return defaultValues.searchMode;
            },
            searchWidgetType: function() {
                return _self.getItem('searchMode');
            },
            mapZoom: function() {
                return defaultValues.mapZoom;
            }
        },
        _config = {},
        _currentBreakpoint = 'xsmall';

    this.dispatchToken = Dispatcher.register(
        function(action) {
            switch (action.type) {
                case ActionTypes.BOOTSTRAP:
                    this.setConfig(action.data);
                    this.emitChange('CONFIG_UPDATED', _config);
                    break;

                case ActionTypes.SET_CONFIG_ITEM:
                    this.setItem(action.value, action.item);
                    this.emitChange('CONFIG_UPDATED', _config);
                    break;

                default:
                // Do nothing
            }
        }.bind(this)
    );

    this.setConfig = function(config) {
        // Split comma seperated values into arrays in location type definitions
        if (_ifLocationTypeDefinitionsExists(config)) {
            config.searchConfig.locationTypeDefinitions.forEach(function(
                locationTypeDefinition,
                locationTypeDefinitionIndex
            ) {
                if (_ifDefinitionsExistAndHasItems(locationTypeDefinition)) {
                    locationTypeDefinition.definitions.forEach(function(
                        definition,
                        definitionIndex
                    ) {
                        if (definition.split) {
                            var items = definition.split(',');

                            items.forEach(function(item, itemIndex) {
                                items[itemIndex] = item.trim();
                            });

                            config.searchConfig.locationTypeDefinitions[
                                locationTypeDefinitionIndex
                            ].definitions[definitionIndex] = items;
                        }
                    });
                }
            });
        }

        _config = config;
    };

    this.getConfig = function() {
        return _config;
    };

    this.setItem = function(element, value) {
        _config[element] = value;
    };

    this.getItem = function(element) {
        if (typeof _config[element] !== 'undefined') {
            return _config[element];
        }

        if (typeof _configMappers[element] !== 'undefined') {
            return _configMappers[element]();
        }

        return null;
    };

    this.getBackToSearchRadius = function() {
        return (
            this.getItem('backToSearchRadius') ||
            defaultValues.backToSearchRadius
        );
    };

    this.getFeatures = function() {
        return _config.features || {};
    };

    this.getLeasesAndCharges = function() {
        return _config.leasesAndCharges || {};
    };

    this.getFloorsAndUnits = function() {
        return _config.floorsAndUnits || {};
    };

    this.getListMap = function() {
        return _config.listMap || {};
    };

    this.getAllBreakpointValues = function() {
        return _config.breakpoints;
    };

    this.getBreakpointValue = function(size) {
        return _config.breakpoints[size];
    };

    this.getCarouselAspectRatio = function() {
        var ratioString = _config.carouselAspectRatio;

        if (!/\d+:\d+/.test(ratioString)) {
            console.warn(
                'Invalid aspect ratio given (' +
                    ratioString +
                    '), reverting to default (' +
                    defaultValues.carouselAspectRatio +
                    ')'
            ); // eslint-disable-line
            ratioString = defaultValues.carouselAspectRatio;
        }

        var ratio = ratioString.split(':');

        return {
            ratio: ratioString,
            asDecimal: ratio[0] / ratio[1]
        };
    };

    this.getCurrentBreakpoint = function() {
        var returnedBreakpoint = 'xsmall';

        for (var breakpoint in this.getAllBreakpointValues()) {
            if (matchMedia) {
                var mqString = this.getRenderedBreakpoint(breakpoint);
                if (window.matchMedia(mqString).matches) {
                    returnedBreakpoint = breakpoint;
                }
            }
        }

        _currentBreakpoint = returnedBreakpoint;
        return returnedBreakpoint;
    };

    this.getRenderedBreakpoint = function(size) {
        return '(min-width: ' + _config.breakpoints[size] + 'px)';
    };

    window.onresize = function() {
        var currentBreakpoint = _currentBreakpoint;

        this.getCurrentBreakpoint();

        if (currentBreakpoint !== _currentBreakpoint) {
            this.emitChange('BREAKPOINT_UPDATED');
        }
    }.bind(this);

    this.getCurrentBreakpoint();
};

ConfigStore.prototype = Object.create(BaseStore.prototype);

module.exports = ConfigStore;
