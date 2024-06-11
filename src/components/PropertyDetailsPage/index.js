var PropTypes = require('prop-types');
var React = require('react'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    getFormattedString = require('../../utils/getFormattedString'),
    DispatchCustomEvent = require('../../utils/dispatchCustomEvent'),
    DefaultValues = require('../../constants/DefaultValues'),
    Spinner = require('react-spinner'),
    ErrorView = require('../ErrorView'),
    DetailView = require('../Property').DetailView,
    _ = require('lodash'),
    IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
    deepEqual = require('deep-equal'),
    MetaTagsMixin = require('../../mixins/MetaTagsMixin'),
    $ = require('jQuery');

var createReactClass = require('create-react-class');

import CaptureError from '../../utils/captureError';
import redirect from '../../utils/301redirect';

var PropertyDetailsPage = createReactClass({
    displayName: 'PropertyDetailsPage',

    mixins: [
        StoresMixin,
        ApplicationActionsMixin,
        LanguageMixin,
        ComponentPathMixin,
        IsInArrayMixin,
        MetaTagsMixin
    ],

    propTypes: {
        searchType: PropTypes.string.isRequired,
        spaPath: PropTypes.object.isRequired
    },

    contextTypes: {
        router: PropTypes.object,
        spaPath: PropTypes.object
    },

    getInitialState: function() {
        return {
            error: false,
            property: this.getPropertyStore().getProperty(),
            loading: _.isEmpty(this.getPropertyStore().getProperty()),
            dispatchCustomEvent: new DispatchCustomEvent()
        };
    },

    componentDidMount: function() {
        // Handle errors
        this.getApplicationStore().onChange('API_ERROR', this._throwError);

        // Listen to changes
        this.getApplicationStore().onChange('LOADING_API', this._loading);
        this.getPropertyStore().onChange(
            'CURRENT_PROPERTY_UPDATED',
            this._updateProperty
        );
        this.getApplicationStore().onChange(
            'APPLICATION_STATE_UPDATED',
            this._onTransition
        );
        this.getPropertyStore().onChange(
            'RELATED_PROPERTIES_UPDATED',
            this._updateRelatedProperties
        );

        // Get property
        if (
            _.isEmpty(this.state.property) ||
            this.props.params.propertyId !== this.state.property.PropertyId
        ) {
            this.getActions().getProperty(this.props.params.propertyId);
        } else if (!this.state.loading) {
            this.setMetaTags(this.buildMetaTags(this.state.property));
            this.firePrerenderEvents();
        }

        // Add body classes
        $('body').addClass(
            'cbre-react--pdp-page cbre-react--pdp-page--type-' +
                this._getPdpTypeClass()
        );
    },

    componentWillUnmount: function() {
        this.removeMetaTags();
        this.getApplicationStore().off('API_ERROR', this._throwError);
        this.getApplicationStore().off('LOADING_API', this._loading);
        this.getApplicationStore().off(
            'APPLICATION_STATE_UPDATED',
            this._onTransition
        );
        this.getPropertyStore().off(
            'CURRENT_PROPERTY_UPDATED',
            this._updateProperty
        );
        this.getPropertyStore().off(
            'RELATED_PROPERTIES_UPDATED',
            this._updateRelatedProperties
        );

        $('body').removeClass(
            'cbre-react--pdp-page cbre-react--pdp-page--type-' +
                this._getPdpTypeClass()
        );
    },

    _validateAspectView: function(aspect) {
        var property = this.getPropertyStore().getProperty();

        // Return true if 'aspect' exists in current property.
        return (
            property.hasOwnProperty('Aspect') &&
            property.Aspect.length &&
            this.searchArray(property.Aspect, aspect)
        );
    },

    _declare400Error: function(errorMessage) {
        this.getActions().declareError(
            400,
            this.context.language.ErrorSubTitle,
            errorMessage
        );
    },

    componentDidUpdate: function() {
        var _renderPage = true;
        if (!this.state.loading) {
            var addressSummary = this.state.property.ActualAddress.urlAddress,
                spaPath = this.props.spaPath,
                redirectPath =
                    (spaPath.path === '/' ? '' : spaPath.path) +
                    '/details/' +
                    this.state.property.PropertyId +
                    '/' +
                    addressSummary,
                query = {},
                viewType = this.props.location.query.view,
                strings = this.context.language.TokenReplaceStrings;

            this.removeMetaTags();
            this.setMetaTags(this.buildMetaTags(this.state.property));

            // Exit and error if 'view' query does not exist.
            if (!this.props.location.query.hasOwnProperty('view')) {
                this._declare400Error(this.context.language.PdpViewErrorText);
                return;
            }

            switch (viewType) {
                case 'isSold':
                case 'isLeased':
                case 'isLetting':
                case 'isSale':
                    // Does this 'view' exist on the current property.
                    if (!this._validateAspectView(viewType)) {
                        this._declare400Error(
                            getFormattedString(
                                { viewType: viewType },
                                strings.PdpViewStateError
                            )
                        );
                    }

                    query['view'] = viewType;
                    break;
                // Reset google indexed cases - these are no longer in API.
                case 'lettings':
                case 'sales':
                    query['view'] =
                        viewType == 'lettings' ? 'isLetting' : 'isSale';
                    break;

                // Error if query is invalid.
                default:
                    this._declare400Error(
                        this.context.language.PdpViewErrorText
                    );
            }

            // If the url address summary doesn't exist or match the current expected format then...
            if (
                this.props.params &&
                (!deepEqual(this.props.location.query, query) ||
                    this.props.params.addressSummary !== addressSummary)
            ) {
                redirect(this.context.router, redirectPath, query).then(
                    function(render) {
                        _renderPage = render;
                    }
                );
            }

            if (_renderPage) {
                this.firePrerenderEvents();
            }
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return (
            this.props.params.propertyId !== this.state.property.PropertyId ||
            this.state.relatedProperties !== nextState.relatedProperties ||
            !deepEqual(this.props, nextProps)
        );
    },

    firePrerenderEvents: function(fire) {
        if (!this.getConfigStore().getFeatures().relatedProperties || fire) {
            this.state.dispatchCustomEvent.preRender(this.getActions());
            this.state.dispatchCustomEvent.propertyLoaded(
                this.getActions(),
                this.state.property.PropertyId
            );
        }
    },

    _getRelatedPropertiesByLocation: function(property) {
        var _siteId = this.getParamStore().getParam('Site');

        this.relatedPropertiesTitle = this.context.language.PropertiesInArea;
        this.relatedPropertiesCallComplete = true;

        this.getActions().getRelatedProperties({
            site: _siteId,
            aspects: this.props.searchType,
            propertyId: '!' + property.PropertyId,
            radius:
                this.getConfigStore().getConfig().localPropertiesRadius ||
                DefaultValues.localPropertiesRadius,
            usageType: property.UsageType,
            lat: property.Coordinates.lat,
            lng: property.Coordinates.lon,
            pagesize: 999999,
            page: 1
        });
    },

    relatedPropertiesCallComplete: false,

    _updateRelatedProperties: function() {
        var _properties = this.getPropertyStore().getRelatedProperties();

        if (this.getPropertyStore().getRelatedPropertiesFailed()) {
            this.relatedPropertiesCallComplete = true;
            this.setState(
                {
                    relatedProperties: [],
                    failedRelatedProperties: true
                },
                this.firePrerenderEvents.bind(null, true)
            );
        } else {
            if (_properties.length || this.relatedPropertiesCallComplete) {
                this.setState(
                    {
                        relatedProperties: _properties
                    },
                    this.firePrerenderEvents.bind(null, true)
                );
            } else {
                this._getRelatedPropertiesByLocation(this.state.property);
            }
        }
    },

    _getPdpTypeClass: function() {
        return this.props.searchType == 'isSale' ? 'sales' : 'lettings';
    },

    _loading: function() {
        this.setState({
            loading: true
        });
    },

    _onTransition: function() {
        this.getActions().getProperty(this.props.searchParams.propertyId);
    },

    _updateProperty: function() {
        var property = this.getPropertyStore().getProperty(),
            loading = _.isEmpty(property);

        if (!loading) {
            // RSTODO
            var addressSummary = property.ActualAddress.urlAddress,
                spaPath = this.props.spaPath,
                path =
                    (spaPath.path === '/' ? '' : spaPath.path) +
                    '/details/' +
                    property.PropertyId +
                    '/' +
                    addressSummary;

            if (this.props.params.propertyId !== property.PropertyId) {
                this.context.router.push({
                    pathname: path,
                    query: { view: this.props.searchType }
                });
            }

            var siteId = this.getParamStore().getParam('Site');

            if (this.getConfigStore().getFeatures().relatedProperties) {
                if (property.ParentPropertyId) {
                    this.relatedPropertiesTitle = this.context.language.PropertiesInDevelopment;
                    this.getActions().getRelatedProperties({
                        site: siteId,
                        aspects: this.props.searchType,
                        propertyId: '!' + property.PropertyId,
                        parentProperty: property.ParentPropertyId,
                        pagesize: 999999,
                        page: 1
                    });
                } else {
                    this._getRelatedPropertiesByLocation(property);
                }
            }
        }

        this.setState({
            property: this.getPropertyStore().getProperty(),
            loading: _.isEmpty(this.getPropertyStore().getProperty())
        });
    },

    disableAutoMetaTags: true,

    buildMetaTags: function(property) {
        var strings = this.context.language.TokenReplaceStrings,
            address = property.ActualAddress || {},
            machineSiteType = window.cbreSiteType || DefaultValues.cbreSiteType,
            siteType =
                machineSiteType === 'residential'
                    ? this.context.language.Residential
                    : this.context.language.Commercial,
            searchType =
                this.props.searchType == 'isSale'
                    ? this.context.language.ForSale
                    : this.context.language.ToRent,
            bedrooms = this.getBedrooms(
                machineSiteType,
                property.NumberOfBedrooms,
                strings.NumberOfBedroomsSingular
            ),
            usageType =
                property.UsageType &&
                this.context.language['PDPPropertyType' + property.UsageType]
                    ? this.context.language[
                          'PDPPropertyType' + property.UsageType
                      ]
                    : this.context.language.Property,
            propertyType =
                property.PropertySubType &&
                property.PropertySubType != 'Unknown' &&
                this.context.language[
                    'PDPPropertyType' + property.PropertySubType
                ]
                    ? this.context.language[
                          'PDPPropertyType' + property.PropertySubType
                      ]
                    : usageType,
            addressSummary = getFormattedString(
                {
                    Line1: address.line1,
                    Line2: address.line2 || address.line3,
                    Region: address.region,
                    Locality: address.locality,
                    Country: address.country,
                    PostCode: address.postcode
                },
                strings.AddressSummaryLong
            ),
            metaTitle = getFormattedString(
                {
                    bedrooms: bedrooms,
                    propertyType: propertyType,
                    searchType: searchType,
                    siteType: siteType,
                    addressSummary: addressSummary
                },
                strings.PDPMetaTitle
            ).trim();

        var basePath =
            document.location.protocol + '//' + document.location.host;
        var path =
            this.props.spaPath.path +
            '/details/' +
            property.PropertyId +
            '?view=' +
            this.props.searchType;
        path = path.replace('//', '/'); // double slashes might be introduced by the spaPath which we can't entirely trust here
        path = basePath + path;

        var updateTags = [
            { property: 'title', value: metaTitle, type: 'title' },
            { property: 'title', value: metaTitle, type: 'html' },
            { property: 'title', value: metaTitle },
            { property: 'og:title', value: metaTitle },

            {
                property: 'description',
                value: property.LongDescription,
                type: 'html'
            },
            { property: 'description', value: property.LongDescription },
            { property: 'og:description', value: property.LongDescription },

            { property: 'og:updated_time', value: property.LastUpdated },
            {
                property: 'article:published_time',
                value: property.Created || property.LastUpdated
            },
            { property: 'article:modified_time', value: property.LastUpdated },
            { property: 'og:url', value: path },
            { property: 'canonical', value: path, type: 'link' }
        ];

        if (property.Photos.length && property.Photos[0].resources.length) {
            var shareImgUri = this.getSharingImage(property.Photos);
            updateTags.push({
                property: 'og:image',
                value: shareImgUri,
                label: 'property',
                type: 'meta'
            });
        }

        if (
            window.siteBasePath !== undefined &&
            window.siteLangCode !== undefined
        ) {
            var newCanonical = '';
            if (property.ParentPropertyId === 'cbrrps-WES140988') {
                newCanonical =
                    window.siteBasePath +
                    window.siteLangCode +
                    '/new-developments/london-dock';
                newCanonical = newCanonical.replace('//', '/');
                newCanonical = basePath + newCanonical;
                _.filter(updateTags, {
                    property: 'canonical'
                })[0].value = newCanonical;
            }

            if (property.ParentPropertyId === 'cbrrps-WES130066') {
                newCanonical =
                    window.siteBasePath +
                    window.siteLangCode +
                    '/new-developments/fulham-riverside';
                newCanonical = newCanonical.replace('//', '/');
                newCanonical = basePath + newCanonical;
                updateTags.push({
                    property: 'up',
                    value: newCanonical,
                    type: 'link'
                });
            }
        }

        return updateTags;
    },

    getBedrooms: function(siteType, count, stringTemplate) {
        var string = '';

        if (siteType !== 'residential') {
            return string;
        }

        if (count && count > 0) {
            string += getFormattedString(
                { bedroomCount: count },
                stringTemplate
            );
        } else {
            string += this.context.language.Studio;
        }

        return string;
    },

    _throwError: function() {
        this.setState({
            error: true
        });
    },

    getSharingImage: function(propertyImages) {
        if (propertyImages && propertyImages.length) {
            var resources = propertyImages[0].resources,
                basePath =
                    document.location.protocol + '//' + document.location.host,
                shareImg = '';

            shareImg = _.filter(resources, { breakpoint: 'medium' });
            if (shareImg.length && shareImg[0].uri) {
                return basePath + shareImg[0].uri;
            }
        }
    },

    render: function() {
        const config = this.getConfigStore().getConfig();
        var searchResultsPage = this.getConfigStore().getItem('searchConfig')
            .searchResultsPage;

        if (this.state.error) {
            CaptureError(
                'Component Error',
                {
                    component: 'PropertyDetailsPage',
                    errorType: 'API_ERROR',
                    config: config
                },
                { site: config.siteId }
            );
            return (
                <ErrorView
                    title={this.context.language.SearchErrorTitle}
                    className="api-error container"
                >
                    <h4>{this.context.language.SearchErrorSubTitle}</h4>
                    <p>{this.context.language.SearchErrorText}</p>
                </ErrorView>
            );
        }

        if (this.state.loading) {
            return (
                <div>
                    <Spinner />
                </div>
            );
        }

        return (
            <DetailView
                property={this.state.property}
                relatedProperties={this.state.relatedProperties}
                relatedPropertiesTitle={this.relatedPropertiesTitle}
                location={this.props.location}
                searchType={this.props.searchType}
                searchResultsPage={searchResultsPage}
                shareImg={this.getSharingImage(this.state.property.Photos)}
            />
        );
    }
});

module.exports = PropertyDetailsPage;
