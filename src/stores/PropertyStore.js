/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */
var ActionTypes = require('../constants/ActionTypes'),
    APIMapping = require('../constants/APIMapping'),
    DefaultValues = require('../constants/DefaultValues'),
    BaseStore = require('./BaseStore'),
    buildPropertyObject = require('../utils/buildPropertyObject'),
    _ = require('lodash');

var PropertyStore = function (stores, Dispatcher) {
    // Private
    var _properties = [],
        _isPlpPage = false,
        _relatedPropertiesFailed = false,
        _queriedForMatchingPropertiesStarted = false,
        _queriedForMatchingPropertiesCompleted = false,
        _startTime = {},
        _relatedProperties = [],
        _matchingProperties = [],
        _primaryListing = {},
        _relatedPropertiesType,
        _childPropertiesFailed = false,
        _childProperties = [],
        _listingCountFailed = false,
        _listingCount = [],
        _currentProperty = {},
        _totalResults = 0,
        _currentPropertyIndex = null,
        _currentPropertyLightboxData = [],
        _culture = DefaultValues.culture,
        _currency = DefaultValues.currency,
        _units = DefaultValues.uom,
        _urlslug = DefaultValues.uom,
        _configStore = null;

    var _propertiesMap = [].concat(DefaultValues.defaultPropertiesMap);
    var _isFetchAllMode = false;
    var _isAreaSearch = false;
    var _areaBounds = null;
    var _areaZoom = null;

    var _propertiesHasLoadedOnce = false;

    var _isOutOfContext = false;
    var _isIgnoreCultureCheck = false;

    this.stores = stores;

    this.dispatchToken = Dispatcher.register(
        function (action) {
            _culture =
                this.stores.ConfigStore.getItem('language') ||
                DefaultValues.culture;
            _units =
                this.stores.ParamStore.getParam('Unit') || DefaultValues.uom;
            _currency =
                this.stores.ParamStore.getParam('CurrencyCode') ||
                DefaultValues.currency;
            _urlslug =
                this.stores.ConfigStore.getItem('urlPropertyAddressFormat') ||
                DefaultValues.urlPropertyAddressFormat;
            _configStore = this.stores.ConfigStore;
            switch (action.type) {
                case ActionTypes.UPDATE_FETCH_MODE:
                    updateIsFetchAllMode(action.payload);
                    return this.emitChange(ActionTypes.UPDATE_FETCH_MODE);

                case ActionTypes.UPDATE_ISAREA_SEARCH:
                    updateIsAreaSearch(action.payload);
                    return this.emitChange(ActionTypes.UPDATE_ISAREA_SEARCH);

                case ActionTypes.UPDATE_PROPERTIES_MAP:
                    updatePropertiesMap(action.payload);
                    return this.emitChange(ActionTypes.UPDATE_PROPERTIES_MAP);

                case ActionTypes.GET_PROPERTIES:
                    this.setProperties(action.data, action.truncateAmount);
                    break;

                case ActionTypes.GET_PROPERTY:
                    this.setProperty(action.data, action.raw);
                    updateIsOutOfContext(action.outOfContext);
                    break;

                case ActionTypes.GET_ADJACENT_PROPERTY:
                    this.setAdjacentProperty(action.data, action.index);
                    updateIsOutOfContext(false);
                    break;

                case ActionTypes.SET_PROPERTY_INDEX:
                    this.setCurrentPropertyIndex(action.value);
                    break;

                case ActionTypes.GET_RELATED_PROPERTIES:
                    updateRelatedProperties(action.data, action.dataType);
                    this.emitChange(ActionTypes.RELATED_PROPERTIES_UPDATED);
                    break;

                case ActionTypes.FAILED_GET_RELATED_PROPERTIES:
                    relatedPropertiesFailed();
                    this.emitChange(ActionTypes.RELATED_PROPERTIES_UPDATED);
                    break;

                case ActionTypes.GET_CHILD_PROPERTIES:
                    updateChildProperties(action.data);
                    this.emitChange(ActionTypes.CHILD_PROPERTIES_UPDATED);
                    break;

                case ActionTypes.FAILED_GET_CHILD_PROPERTIES:
                    childPropertiesFailed();
                    this.emitChange(ActionTypes.CHILD_PROPERTIES_UPDATED);
                    break;

                case ActionTypes.GET_LISTING_COUNT:
                    updateListingCount(action.data, action.propertyId);
                    this.emitChange(ActionTypes.LISTING_COUNT_UPDATED);
                    break;

                case ActionTypes.FAILED_GET_LISTING_COUNT:
                    listingCountFailed(action.propertyId);
                    this.emitChange(ActionTypes.LISTING_COUNT_UPDATED);
                    break;

                case ActionTypes.RESET_PROPERTIES:
                    this.resetProperties();
                    break;

                default:
                // Do nothing
            }
        }.bind(this)
    );

    this.setProperties = function (data, truncateAmount) {
        _properties = [];

        // Set the total amount of results.
        this.setTotalResults(
            data[APIMapping._resultProperties.TotalProperties]
        );

        if (data.Documents.length && data.Documents[0].length) {
            let docs = data.Documents[0];
            if (truncateAmount) {
                docs = docs.slice(0, truncateAmount);
            }

            _properties = docs.map(doc =>
                buildPropertyObject(
                    doc,
                    _culture,
                    _units,
                    _currency,
                    _urlslug,
                    _configStore
                )
            );
        }

        _propertiesHasLoadedOnce = true;
        this.emitChange('PROPERTIES_UPDATED');
    };

    this.resetProperties = function () {
        this.emitChange('PROPERTIES_UPDATED');
    };

    this.getPropertiesHasLoadedOnce = function () {
        return _propertiesHasLoadedOnce;
    };

    this.getProperties = function () {
        return _properties;
    };

    this.setProperty = function (data, raw) {
        raw = raw === undefined;

        // if we have any multi-cultural checks to do before we pass to the buildPropertyObject function, do them here
        // for example, in highlights, if we are missing the culture we should just remove the corresponding node

        const property = data[APIMapping._resultProperties.PropertyResult];

        if (property) {
            if (_.get(property, 'Common.Highlights')) {
                const allHighlights = _.get(property, 'Common.Highlights');
                allHighlights.forEach(highlightDoc => {
                    if (_.get(highlightDoc, 'Common.Highlight')) {
                        removeNodes(_.get(highlightDoc, 'Common.Highlight'));
                    }
                });
            }

            if (_.get(property, 'Common.FloorsAndUnits')) {
                const floorAndUnits = _.get(property, 'Common.FloorsAndUnits');
                floorAndUnits.forEach(floorAndUnit => {
                    if (_.get(floorAndUnit, 'Common.SubdivisionName')) {
                        removeNodes(_.get(floorAndUnit, 'Common.SubdivisionName'));
                    }
                    if (_.get(floorAndUnit, 'Common.SpaceDescription')) {
                        removeNodes(_.get(floorAndUnit, 'Common.SpaceDescription'));
                    }
                });
            }

            if (_.get(property, 'Common.Strapline')) {
                removeNodes(_.get(property, 'Common.Strapline'));
            }
            if (_.get(property, 'Common.LocationDescription')) {
                removeNodes(_.get(property, 'Common.LocationDescription'));
            }
            if (_.get(property, 'Common.LongDescription')) {
                removeNodes(_.get(property, 'Common.LongDescription'));
            }
        }

        if (raw) {
            _currentProperty = buildPropertyObject(
                property,
                _culture,
                _units,
                _currency,
                _urlslug,
                _configStore
            );

            // Add common charges. For some reason the APIMapping doesn't always work. I have no idea why.
            try {
                _currentProperty.CommonCharges = data.Document["Common.Charges"];
            } catch (e) {
                console.log(e);
            }
        } else {
            _currentProperty = data;
        }

        this.setPropertyLightboxData();

        this.emitChange('CURRENT_PROPERTY_UPDATED');
    };

    this.getProperty = function () {
        return _currentProperty;
    };

    this.setPropertyLightboxData = function () {
        var apiResources = [],
            lightboxItems = [],
            cdnUrl = stores.ConfigStore.getItem('cdnUrl');

        // Assign Api data to use in lightboxing.
        apiResources['photos'] = this.getProperty().Photos || [];

        // for floorplans, filter out any pdfs so they don't get added to the lightbox carousel
        const rawFloorplans = this.getProperty().FloorPlans || [];
        const floorplans = [];
        rawFloorplans.forEach((fp) => {
            if (fp && fp.resources && fp.resources.length > 0 && fp.resources[0].uri &&
                fp.resources[0].uri.substring(fp.resources[0].uri.lastIndexOf('.') + 1) !== 'pdf') {
                floorplans.push(fp);
            }
        });
        apiResources['floorplans'] = floorplans;

        // Add large photo for zooming.
        apiResources.photos.forEach(function (photoItem) {

            if (photoItem.resources && photoItem.resources.length) {
                photoItem.resources.forEach(function (resource) {
                    if (
                        resource.breakpoint !== null &&
                        resource.breakpoint === 'large'
                    ) {
                        var lightboxPhoto = {};

                        // Build Photoswipe object.
                        lightboxPhoto['src'] = cdnUrl + resource.uri;
                        lightboxPhoto['w'] = resource.width;
                        lightboxPhoto['h'] = resource.height;
                        lightboxPhoto['title'] = photoItem.caption;
                        lightboxPhoto['dataType'] = 'photo'; // Used as a key for indexing.

                        // Merge items.
                        lightboxItems.push(lightboxPhoto);
                    }
                });
            }
        });

        if (typeof apiResources.floorplans.forEach !== 'undefined') {
            // Add floorplans
            apiResources.floorplans.forEach(function (floorplan) {
                if (
                    floorplan.resources &&
                    floorplan.resources.length &&
                    floorplan.resources[0].uri
                ) {
                    var resource = floorplan.resources[0],
                        lightboxFloorplan = {};

                    lightboxFloorplan['src'] = cdnUrl + resource.uri;
                    lightboxFloorplan['w'] = resource.width;
                    lightboxFloorplan['h'] = resource.height;
                    lightboxFloorplan['title'] = floorplan.caption;
                    lightboxFloorplan['dataType'] = 'floorplan'; // Used as a key for indexing.

                    // Merge items.
                    lightboxItems.push(lightboxFloorplan);
                }
            });
        }

        // TODO integrate EPC when they are available in API.

        _currentPropertyLightboxData = lightboxItems;
    };

    this.getPropertyLightboxData = function () {
        return _currentPropertyLightboxData;
    };

    this.setAdjacentProperty = function (data, index) {
        this.setCurrentPropertyIndex(index);
        _currentProperty = buildPropertyObject(
            data[APIMapping._resultProperties.PropertyResults][0][0],
            _culture,
            _units,
            _currency,
            _urlslug,
            _configStore
        );
        this.emitChange('CURRENT_PROPERTY_UPDATED');
    };

    this.setCurrentPropertyIndex = function (value) {
        _currentPropertyIndex = value;
        this.emitChange('CURRENT_PROPERTY_INDEX_UPDATED');
    };

    this.getCurrentPropertyIndex = function () {
        return _currentPropertyIndex;
    };

    this.setTotalResults = function (total) {
        _totalResults = total;
        this.emitChange('TOTAL_RESULTS_UPDATED');
    };

    this.getTotalResults = function () {
        return _totalResults;
    };

    this.getPropertiesMap = function () {
        return _propertiesMap;
    };

    this.isFetchAllMode = function () {
        return _isFetchAllMode;
    };

    this.isAreaSearch = function () {
        return _isAreaSearch;
    };

    this.getAreaBounds = function () {
        return _areaBounds;
    };

    this.setAreaBounds = function (areaBounds) {
        _areaBounds = areaBounds;
    };

    this.getAreaZoom = function () {
        return _areaZoom;
    };

    this.setAreaZoom = function (areaZoom) {
        _areaZoom = areaZoom;
    };

    this.isOutOfContext = function () {
        return _isOutOfContext;
    };

    this.setIsPlpPage = function (isPlpPage) {
        _isPlpPage = isPlpPage;
    };

    this.getIsPlpPage = function () {
        return _isPlpPage;
    };

    this.setQueryForMatchingPropertiesStarted = function () {
        _queriedForMatchingPropertiesStarted = true;
    };

    this.setQueryForMatchingPropertiesNotStarted = function () {
        _queriedForMatchingPropertiesStarted = false;
    };

    this.getQueryForMatchingPropertiesStarted = function () {
        return _queriedForMatchingPropertiesStarted;
    };

    this.setQueryForMatchingPropertiesCompleted = function () {
        _queriedForMatchingPropertiesCompleted = true;
    };

    this.getQueryForMatchingPropertiesCompleted = function () {
        return _queriedForMatchingPropertiesCompleted;
    };


    this.setStartTime = function (time) {
        _startTime = time;
    };

    this.getStartTime = function () {
        return _startTime;
    };


    this.setMatchingProperties = function (properties) {
        _matchingProperties = properties;
    };

    this.getMatchingProperties = function () {
        return _matchingProperties;
    };

    this.setPrimaryListing = function (listing) {
        _primaryListing = listing;
    };

    this.getPrimaryListing = function () {
        return _primaryListing;
    };

    this.getRelatedProperties = function () {
        return _relatedProperties;
    };

    this.getRelatedPropertiesType = function () {
        return _relatedPropertiesType;
    };

    this.getRelatedPropertiesFailed = function () {
        return _relatedPropertiesFailed;
    };

    this.getChildProperties = function () {
        return _childProperties;
    };

    this.getChildPropertiesFailed = function () {
        return _childPropertiesFailed;
    };

    this.getListingCount = function () {
        return _listingCount;
    };

    this.getListingCountFailed = function () {
        return _listingCountFailed;
    };

    function updateRelatedProperties(data, dataType) {
        var properties = [];

        if (data.Documents.length && data.Documents[0].length) {
            const docs = data.Documents[0];
            properties = docs.map(doc =>
                buildPropertyObject(
                    doc,
                    _culture,
                    _units,
                    _currency,
                    _urlslug,
                    _configStore
                )
            );
        }

        if (dataType) {
            _relatedPropertiesType = dataType;
        }

        _relatedPropertiesFailed = false;
        _relatedProperties = properties;
    }

    function relatedPropertiesFailed() {
        _relatedPropertiesFailed = true;
    }
    function updateChildProperties(data) {
        var properties = [];

        if (data.Documents.length && data.Documents[0].length) {
            const docs = data.Documents[0];
            properties = docs.map(doc =>
                buildPropertyObject(
                    doc,
                    _culture,
                    _units,
                    _currency,
                    _urlslug,
                    _configStore
                )
            );
        }

        _childPropertiesFailed = false;
        _childProperties = properties;
    }

    function childPropertiesFailed() {
        _childPropertiesFailed = true;
    }

    function updateListingCount(data, propertyId) {
        if (data.Found && propertyId) {
            _listingCount.push({
                propertyId: propertyId,
                count: data.DocumentCount,
                status: true
            });
        } else {
            _listingCount.push({
                propertyId: propertyId,
                count: 0,
                status: true
            });
        }
    }

    function listingCountFailed(propertyId) {
        _listingCount.push({ propertyId: propertyId, count: 0, status: true });
    }

    function updatePropertiesMap(mappedArray) {
        return (_propertiesMap = [].concat(
            DefaultValues.defaultPropertiesMap,
            mappedArray
        ));
    }

    function updateIsFetchAllMode(isFetchAllMode) {
        _isFetchAllMode = isFetchAllMode;
    }

    function updateIsAreaSearch(isAreaSearch) {
        _isAreaSearch = isAreaSearch;
    }


    function updateIsOutOfContext(isOutOfContext) {
        _isOutOfContext = isOutOfContext;
    }

    // if we are missing the culture, removing the corresponding node from the Property Object
    function removeNodes(items) {
        // Ignoring culture check to show nodes for Ireland Region
        if (_culture.toLowerCase() === 'en-ie' || _culture.toLowerCase() === 'en-pt' || _culture.toLowerCase() === 'sr-sp') {
            _isIgnoreCultureCheck = true;
        }
        if (!_isIgnoreCultureCheck) {
            var i = items.length;
            while (i--) {
                if (_.get(items[i], 'Common.CultureCode').toLowerCase() != _culture.toLowerCase()) {
                    items.splice(i, 1);
                }
            }
        }
    }
};

PropertyStore.prototype = Object.create(BaseStore.prototype);

module.exports = PropertyStore;