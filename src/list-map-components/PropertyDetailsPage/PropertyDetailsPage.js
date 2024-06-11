import PropTypes from 'prop-types';
import React, { Component } from 'react';
import getFormattedString from '../../utils/getFormattedString';
import DispatchCustomEvent from '../../utils/dispatchCustomEvent';
import createQueryString from '../../utils/createQueryString';
import DefaultValues from '../../constants/DefaultValues';
import ErrorView from '../../components/ErrorView';
import DetailViewResi from './DetailView.residential.js';
import DetailViewComm from './DetailView.commercial.js';
import DetailViewCommv2 from './DetailView.commercialv2.js';
import DetailViewPdf from './DetailView.pdf.js';
import LoadingViewResi from './LoadingView.residential.js';
import LoadingViewComm from './LoadingView.commercial.js';
import PageMetaData from '../PageMetaData/PageMetaData';
import { responsiveContainer } from '../../external-libraries/agency365-components/components';
import TrackingEvents from '../../constants/TrackingEvents';
import trackingEvent from '../../utils/trackingEvent';
import _ from 'lodash';
import deepEqual from 'deep-equal';
import modalContainer from '../../containers/modalContainer';
import redirect from '../../utils/301redirect';
import letterFromIndex from '../../utils/letterFromIndex';
import classNames from 'classnames';
import { PdfHeader, PdfList } from '../Pdf';
import Notification from '../../r3/components/Notification/Notification'
// revision 3
import DetailViewComm_R3 from '../../r3/PDP/DetailView/DetailView.commercial.r3';
import DetailViewComm_R4 from '../../r4/PDP/DetailView/DetailView.commercial.r4';
import getValidSearchAspect from '../../utils/getValidSearchAspect';


import CaptureError from '../../utils/captureError';
class PropertyDetailsPage extends Component {
    constructor(props, context) {
        super(props);

        const favsMode = context.stores.FavouritesStore.isActive();
        const store = favsMode
            ? context.stores.FavouritesStore
            : context.stores.PropertyStore;

        this.state = {
            error: false,
            property: store.getProperty(),
            pdfProperties: [],
            staticMaps: [],
            loading: _.isEmpty(context.stores.PropertyStore.getProperty()),
            dispatchCustomEvent: new DispatchCustomEvent(),
            index: 0,
            features: context.stores.ConfigStore.getFeatures(),
            is404: false
        };

        this.spaPath = context.spaPath;
        this.searchType = context.stores.SearchStateStore.getItem('searchType');
        this.siteTheme =
            window.cbreSiteTheme ||
            DefaultValues.cbreSiteTheme;
        this.siteType =
            window.cbreSiteType ||
            context.stores.ConfigStore.getItem('siteType') ||
            DefaultValues.cbreSiteType;
        window.dataLayer = window.dataLayer || [];
    }

    componentDidMount() {
        // Handle errors
        this.context.stores.ApplicationStore.onChange(
            'API_ERROR',
            this.throwError
        );

        this.context.stores.ApplicationStore.onChange(
            'APPLICATION_ERROR',
            this.throw404
        );

        // Listen to changes
        this.context.stores.ApplicationStore.onChange(
            'LOADING_API',
            this.loading
        );
        this.context.stores.ApplicationStore.onChange(
            'APPLICATION_STATE_UPDATED',
            this.onTransition
        );
        this.context.stores.PropertyStore.onChange(
            'CURRENT_PROPERTY_UPDATED',
            this.updateProperty
        );
        this.context.stores.FavouritesStore.onChange(
            'ACTIVE_FAVOURITE_UPDATED',
            this.updateProperty
        );
        this.context.stores.PropertyStore.onChange(
            'RELATED_PROPERTIES_UPDATED',
            this.updateRelatedProperties
        );
        this.context.stores.PropertyStore.onChange(
            'CHILD_PROPERTIES_UPDATED',
            this.updateChildProperties
        );
        this.context.stores.FavouritesStore.onChange(
            'PDF_PROPERTIES_UPDATED',
            this.updatePDFProperties
        );
        this.context.stores.FavouritesStore.onChange(
            'STATIC_MAPS_UPDATED',
            this.updateStaticMaps
        );

        // Get property
        if (this.props.isPdf) {
            const { limitDisplayedProperties } = Object.assign(
                {},
                DefaultValues.pdf,
                this.context.stores.ConfigStore.getItem('pdf')
            );
            const location = this.props.location;
            if (location && location.query && location.query.properties) {
                const propertyArray = location.query.properties.split(',');
                const truncatedProperties = propertyArray
                    .slice(0, limitDisplayedProperties)
                    .join(',');
                this.context.actions.fetchPdfProperties(truncatedProperties);
            }
        } else {
            this.context.actions.getProperty(this.props.params.propertyId);
        }
        this.context.actions.fetchStampDutyConfig();
        this.context.actions.fetchSiteMapsConfig();
        window.scrollTo(0, 0);
        document.body.classList.add(
            this.props.isPdf ? 'cbre-map-list-pdf' : 'cbre-map-list-pdp'
        );
        if (this.state.features.showFullBreadcrumb) {
            document.body.classList.add(
                'display-full-breadcrumb'
            );
        }

    }

    componentWillUnmount() {
        this.context.stores.ApplicationStore.off('API_ERROR', this.throwError);
        this.context.stores.ApplicationStore.off('LOADING_API', this.loading);
        this.context.stores.ApplicationStore.off(
            'APPLICATION_STATE_UPDATED',
            this.onTransition
        );
        this.context.stores.PropertyStore.off(
            'CURRENT_PROPERTY_UPDATED',
            this.updateProperty
        );
        this.context.stores.FavouritesStore.off(
            'ACTIVE_FAVOURITE_UPDATED',
            this.updateProperty
        );
        this.context.stores.PropertyStore.off(
            'RELATED_PROPERTIES_UPDATED',
            this.updateRelatedProperties
        );
        this.context.stores.PropertyStore.off(
            'CHILD_PROPERTIES_UPDATED',
            this.updateChildProperties
        );
        this.context.stores.FavouritesStore.off(
            'PDF_PROPERTIES_UPDATED',
            this.updatePDFProperties
        );
        this.context.stores.FavouritesStore.off(
            'STATIC_MAPS_UPDATED',
            this.updateStaticMaps
        );

        document.body.classList.remove(
            'cbre-map-list-pdp',
            'cbre-map-list-pdf'
        );
    }

    declare400Error(errorMessage) {
        this.context.actions.declareError(
            400,
            this.context.language.ErrorSubTitle,
            errorMessage
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            !this.state.loading &&
            !this.props.isPdf &&
            prevState.property.PropertyId !== this.state.property.PropertyId
        ) {
            this.checkAndApplyPropertyRedirects();
        }
    }

    checkAndApplyPropertyRedirects = () => {
        const addressSummary = this.state.property.ActualAddress.urlAddress;
        const spaPath = this.spaPath;
        const redirectPath =
            (spaPath.path === '/' ? '' : spaPath.path) +
            '/details/' +
            this.state.property.PropertyId +
            '/' +
            addressSummary;

        const query = this.checkPropertyViewQueryAndRedirect();

        // If the url address summary doesn't exist or match the current expected format then...
        if (
            query &&
            this.props.params && (window.cbreSiteTheme !== 'commercialr4') &&
            (!deepEqual(this.props.location.query, query) ||
                this.props.params.addressSummary !== addressSummary)
        ) {
            redirect(this.context.router, redirectPath, query).then(() => {
                this.dispatchCustomEvents();
            });
        }

        this.dispatchCustomEvents();
    };

    checkPropertyViewQueryAndRedirect = () => {
        const storeAspects = this.propertyAspects();
        var validSearchAspect = getValidSearchAspect(storeAspects);

        // take the one that's there or try to find one that is valid to use
        const viewType = validSearchAspect;

        const strings = this.context.language.TokenReplaceStrings;
        let query = {};

        const addressSummary = this.state.property.ActualAddress.urlAddress;
        const spaPath = this.spaPath;
        const redirectPath = (spaPath.path === '/' ? '' : spaPath.path) + '/details/' + this.state.property.PropertyId + '/' + addressSummary;

        // Exit and error if 'view' query does not exist.
        if (!viewType) {
            this.declare400Error(strings.PdpViewErrorText);
            return;
        }

        switch (viewType) {
            case 'isSold':
            case 'isLeased':
            case 'isLetting':
            case 'isSale':
                // Does this 'view' exist on the current property.
                if (!this.validateAspectView(viewType)) {
                    const availableAspects = storeAspects.filter(x => x != viewType);
                    query = { view: availableAspects[0] };
                    redirect(this.context.router, redirectPath, query).then(() => {
                        this.dispatchCustomEvents();
                    });
                    query['view'] = availableAspects[0];
                } else {
                    query['view'] = viewType;
                }
                break;

            // Reset google indexed cases - these are no longer in API.
            case 'lettings':
            case 'sales':
                query['view'] = viewType == 'lettings' ? 'isLetting' : 'isSale';
                break;

            // Error if query is invalid.
            default:
                if (this.state.property && this.state.property.aspect && this.state.property.aspect !== '') {
                    return;
                } else {
                    this.declare400Error(strings.PdpViewErrorText);
                    return;
                }
        }

        return query;
    };

    propertyAspects = () => {
        const { FavouritesStore, PropertyStore } = this.context.stores;
        const store = FavouritesStore.isActive()
            ? FavouritesStore
            : PropertyStore;
        const property = store.getProperty();

        return property.Aspect;
    };

    validateAspectView = aspect => {
        const { FavouritesStore, PropertyStore } = this.context.stores;
        const store = FavouritesStore.isActive()
            ? FavouritesStore
            : PropertyStore;
        const property = store.getProperty();
        // Return true if 'aspect' exists in current property.
        return (
            property.hasOwnProperty('Aspect') &&
            property.Aspect.length &&
            property.Aspect.includes(aspect)
        );
    };

    dispatchCustomEvents = fire => {
        if (!this.state.features.relatedProperties || fire) {
            this.state.dispatchCustomEvent.preRender(this.context.actions);
            this.state.dispatchCustomEvent.propertyLoaded(
                this.context.actions,
                this.state.property.PropertyId
            );
            // Fire legacy 'CBRESpaRouteEvent' to support Drupal listeners
            let _loc = _.clone(this.props.location);
            _loc.spaRoute = _loc.pathname.replace(this.spaPath.path, '');
            this.context.actions.publishCustomEvent(_loc, 'CBRESpaRouteEvent');
        }
    };

    loading = () => {
        this.setState({
            loading: true
        });
    };

    onTransition = () => {
        this.context.actions.getProperty(this.props.searchParams.propertyId);
    };

    updateProperty = () => {
        const favsMode = this.context.stores.FavouritesStore.isActive();
        const property = favsMode
            ? this.context.stores.FavouritesStore.getProperty()
            : this.context.stores.PropertyStore.getProperty();

        const isLoading = _.isEmpty(property);

        if (!isLoading) {
            const addressSummary = property.ActualAddress.urlAddress;
            const spaPath = this.spaPath;

            let path =
                (spaPath.path === '/' ? '' : spaPath.path) +
                '/details/' +
                property.PropertyId +
                '/' +
                addressSummary;

            if (this.props.params.propertyId !== property.PropertyId) {
                this.context.router.push({
                    pathname: path,
                    query: { view: this.searchType }
                });
            }

            if (this.state.features.relatedProperties) {
                this.context.actions.fetchRelatedProperties(property, 20);
            }

            if (
                this.state.features.childListings &&
                this.state.features.childListings.enableChildListings &
                !property.ParentPropertyId
            ) {
                this.context.actions.fetchChildProperties(property, 100);
            }

            window.scrollTo(0, 0);

            if (!this.state.features.ga4) {
                window.dataLayer.push({
                    siteType: window.cbreSiteType || DefaultValues.cbreSiteType,
                    propertyId: property.PropertyId,
                    propertyAddress: property.ActualAddress.line1,
                    propertyCity: property.ActualAddress.locality,
                    propertyRegion: property.ActualAddress.region,
                    event: 'PropertyDetailsLoaded'
                });
            }
        }

        this.setState({
            property,
            loading: isLoading
        });
    };

    updatePDFProperties = pdfProperties => {
        const { mapSize, maptype, markerColour, staticMapApi } = Object.assign(
            {},
            DefaultValues.pdf,
            this.context.stores.ConfigStore.getItem('pdf')
        );

        let mapOptions = {
            zoom: 12,
            size: mapSize,
            maptype: maptype
        };

        let markerArray = [];
        let maps = pdfProperties.map((property, i) => {
            const lat = property.Coordinates.lat;
            const lon = property.Coordinates.lon;
            const label = `%7Clabel:${letterFromIndex(i)}`;
            markerArray.push(
                `markers=color:${markerColour}${label}%7C${lat},${lon}`
            );
            return {
                Id: `staticMap${i}`,
                Querystring: `${createQueryString(
                    mapOptions
                )}&markers=color:${markerColour}${label}%7C${lat},${lon}`
            };
        });

        mapOptions.size = '640x300';

        maps.push({
            Id: 'staticMapList',
            Querystring: `${createQueryString(mapOptions)}&${markerArray.join(
                '&'
            )}`
        });

        this.context.actions.fetchStaticMapUrls(staticMapApi, maps);

        this.setState({
            pdfProperties
        });
    };

    updateStaticMaps = staticMaps => {
        this.setState({
            staticMaps: staticMaps,
            loading: false
        });
    };

    updateRelatedProperties = () => {
        if (this.state.features.relatedProperties) {
            const properties = this.context.stores.PropertyStore.getRelatedProperties();
            const type = this.context.stores.PropertyStore.getRelatedPropertiesType();
            const status = !this.context.stores.PropertyStore.getRelatedPropertiesFailed();
            this.setState(
                {
                    relatedProperties: {
                        properties,
                        type,
                        status
                    }
                },
                this.dispatchCustomEvents.bind(null, true)
            );
        }
    };

    updateChildProperties = () => {
        const property = this.context.stores.PropertyStore.getProperty();
        if (
            this.state.features.childListings.enableChildListings &&
            !property.ParentPropertyId
        ) {
            const properties = this.context.stores.PropertyStore.getChildProperties();
            const status = !this.context.stores.PropertyStore.getChildPropertiesFailed();
            this.setState(
                {
                    childProperties: {
                        properties,
                        status
                    }
                },
                this.dispatchCustomEvents.bind(null, true)
            );
        }
    };

    throwError = () => {
        this.setState({
            error: true
        });
    };

    throw404 = () => {
        this.setState({
            is404: true
        });
    };

    getSharingImage = propertyImages => {
        if (propertyImages && propertyImages.length) {
            var resources = propertyImages[0].resources,
                basePath =
                    document.location.protocol + '//' + document.location.host,
                shareImg = _.filter(resources, { breakpoint: 'medium' });

            if (shareImg.length && shareImg[0].uri) {
                return basePath + shareImg[0].uri;
            }
        }
    };

    fireOpenLightboxEvent = actionType => {
        const property = this.context.stores.PropertyStore.getProperty();

        this._fireEvent(actionType + 'OpenLightbox', {
            propertyId: property.PropertyId
        });
    };

    _fireEvent = (eventName, opts) => {
        // Default options
        opts = opts || {};
        opts.event = TrackingEvents[eventName];
        opts.eventType = 'analytics';
        opts.spaType = this.siteType;
        opts.path = window.location.href;
        opts.searchType =
            this.context.stores.SearchStateStore.getItem('searchType') ||
            DefaultValues.searchType;
        opts.widgetName = this.context.stores.ConfigStore.getItem('title');
        // Additional options
        if (!opts.hasOwnProperty('placeName')) {
            opts.placeName = this.context.stores.SearchStateStore.getItem(
                'searchLocationName'
            );
        }
        // Fire a user event
        this.context.actions.publishCustomEvent(opts);
    };

    getLightboxFunctions = () => {
        return {
            fireOpenLightboxEvent: this.fireOpenLightboxEvent,
            fireEvent: this._fireEvent
        };
    };

    loadRelatedProperty = (coordinates, index, id) => {
        const { stores, actions } = this.context;
        // Get related property
        this.context.actions.getProperty(id, true);

        trackingEvent(
            'siblingCarouselClickThru',
            {
                propertyId: id
            },
            stores,
            actions
        );
    };

    loadChildProperty = (coordinates, index, id, parentId) => {
        const { stores, actions } = this.context;
        this.context.actions.getProperty(id, true);
        trackingEvent(
            'childPropertyClickThru',
            {
                propertyId: id,
                ParentPropertyId: parentId
            },
            stores,
            actions
        );
    };

    getMatchingPropertyIds(propertyId) {
        const propertyIdBase = propertyId.slice(0, -2);
        switch (propertyId.slice(-2)) {
            case "-1":
                return [propertyIdBase + "-2", propertyIdBase + "-3"];
            case "-2":
                return [propertyIdBase + "-1", propertyIdBase + "-3"];
            case "-3":
                return [propertyIdBase + "-1", propertyIdBase + "-2"];
        }
    }

    fetchUsageType(propertyId) {
        var api = context.stores.ConfigStore.getItem('api');
        var siteId = context.stores.ConfigStore.getItem('siteId');
        return fetch(`${api}/propertylistings/query?site=${siteId}&Common.PrimaryKey=${propertyId}`)
            .then(response => response.json())
            .then(data => {
                const property = data.Documents.find(f => f).map(field => {
                    return {
                        PropertyId: propertyId,
                        UsageType: field["Common.UsageType"] || null,
                        Aspect: field["Common.Aspects"].find(f => f) || null
                    }
                }).find(f => f);

                return property;
            });
    }

    getMatchingProperties(property) {
        const matchingPropertyIds = this.getMatchingPropertyIds(property.PropertyId);

        context.stores.PropertyStore.setStartTime(new Date());

        if (matchingPropertyIds) {
            Promise.all(matchingPropertyIds.map(p => this.fetchUsageType(p))).then(properties => {

                // filter out undefined from search results that yielded no results
                const matchingProperties = properties.filter(property => property != undefined);

                // set the remainder as identical listings and set the query state as completed
                // the results are used down stream by other components
                context.stores.PropertyStore.setMatchingProperties(matchingProperties);
                context.stores.PropertyStore.setQueryForMatchingPropertiesCompleted();

                // define an object for the current property in case it is the primary listing
                const currentProperty = {
                    PropertyId: property.PropertyId,
                    UsageType: property.UsageType || null,
                    Aspect: property.Aspect.find(f => f) || null
                }

                // see if the primary is in one of the matching properties, if not then use the current property listing
                context.stores.PropertyStore.setPrimaryListing(
                    matchingProperties.find(property => property.PropertyId.slice(-2) == "-1")
                    || currentProperty);

                // trigger a component refresh
                this.setState({});

                // generate a timer for the elapsed time
                const startTime = context.stores.PropertyStore.getStartTime() || new Date();
                const endTime = new Date();
                console.log(`Matching properties lookup finished in ${(endTime - startTime) / 1000} secs`);
            });
        }
    }

    renderDetails = properties => {
        const { stores } = this.context;

        const { modal, breakpoints, location, isPdf } = this.props;

        const searchResultsPage = stores.ConfigStore.getItem('searchConfig')
            .searchResultsPage;

        const features = stores.ConfigStore.getFeatures();

        let DetailView;

        switch (this.siteTheme) {
            case 'residential':
                DetailView = DetailViewResi;
                break;
            case 'commercialv2':
                DetailView = DetailViewCommv2;
                break;
            case 'commercialr3':
                DetailView = DetailViewComm_R3;
                break;
            case 'commercialr4':
                DetailView = DetailViewComm_R4;
                break;
            default:
                if (this.siteType === 'residential') {
                    DetailView = DetailViewResi;

                }
                else {
                    DetailView = DetailViewComm;
                }
                break;
        }

        if (isPdf) {
            DetailView = DetailViewPdf;
        }

        const carouselCardProps = {
            spaPath: this.spaPath,
            siteType: this.siteType,
            propertyLinkClickHandler: this.loadRelatedProperty
        };

        const childCardProps = {
            spaPath: this.spaPath,
            siteType: this.siteType,
            propertyLinkClickHandler: this.loadChildProperty
        };

        return properties.map((property, index) => {

            // reset matching properties query if property is not in current url
            if (!window.location.pathname.includes(property.PropertyId)) {
                this.context.stores.PropertyStore.setQueryForMatchingPropertiesNotStarted();
            }

            // this component is called a lot with old state data, so make sure the current PropertyId is in the url before requerying for matching properties
            if (window.location.pathname.includes(property.PropertyId)
                && features.displayMultiUsageStrapline
                && !this.context.stores.PropertyStore.getQueryForMatchingPropertiesStarted()) {

                //entry point for querying for other listings with matching primary key
                this.searchForMatchingProperties(property);
            }
            return (
                <DetailView
                    key={`${property.PropertyId}_detailsView`}
                    property={property}
                    propertyIndex={index}
                    carouselCardProps={carouselCardProps}
                    childCardProps={childCardProps}
                    relatedProperties={this.state.relatedProperties}
                    childProperties={this.state.childProperties}
                    staticMaps={this.state.staticMaps}
                    location={location}
                    searchType={this.searchType}
                    siteType={this.siteType}
                    searchResultsPage={searchResultsPage}
                    shareImg={this.getSharingImage(this.state.property.Photos)}
                    breakpoints={breakpoints}
                    lightboxFunctions={this.getLightboxFunctions()}
                    modal={modal}
                    renderDisclaimer={index === properties.length - 1}
                    spaPath={this.spaPath}
                />
            );
        });
    };


    searchForMatchingProperties = (property) => {

        // check to see if current property listing is the parent, if so, set it as the primarylisting in property store
        if (property.IsParent) {
            const primaryListing = {
                PropertyId: property.PropertyId,
                UsageType: property.UsageType,
                Aspect: property.Aspect.find(f => f)
            };
            context.stores.PropertyStore.setPrimaryListing(primaryListing);
            // console.log(`Set primary listing ${JSON.stringify(primaryListing)}`);
        }

        // continue on regardless to query for listings matching property id
        this.getMatchingProperties(property);

        this.context.stores.PropertyStore.setQueryForMatchingPropertiesStarted();
    }


    render() {
        const enforceUsageType = () => {
            if (this.context.stores.ParamStore.getParams().usageType && !this.state.loading) {
                var uses = this.context.stores.ParamStore.getParams().usageType.split(",").filter((value, index) => value === this.state.property.UsageType)
                if (uses.length == 0) {
                    this.context.actions.declareError(this.throwError);
                }
            }
        }

        const features = this.context.stores.ConfigStore.getFeatures()
        if (typeof features.doNotEnforceUsageType === 'undefined' || features.doNotEnforceUsageType === false) {
            { enforceUsageType() }
        }

        const { language } = this.context;

        const { isPdf } = this.props;

        if (this.state.error) {
            const config = this.context.stores.ConfigStore.getConfig();
            CaptureError(
                'Component Error',
                {
                    component: 'PropertyDetailsPage LM',
                    errorType: 'API_ERROR',
                    config: config
                },
                { site: config.siteId || 'unknown' }
            );
            return (
                <ErrorView
                    title={language.SearchErrorTitle}
                    className="api-error container"
                >
                    <h4>{language.SearchErrorSubTitle}</h4>
                    <p>{language.SearchErrorText}</p>
                </ErrorView>
            );
        }

        if (this.state.is404) {
            return (
                <div style={{ paddingBottom: '20px' }}>
                    <ErrorView
                        title={language.ErrorPageNotFoundTitle}
                        className="api-error container"
                    >
                        <h4>{language.ErrorPageNotFoundText}</h4>
                        <a href={this.context.stores.ConfigStore.getItem('searchConfig').searchResultsPage}>
                            {language.ErrorPageSearchPageText}
                        </a>
                    </ErrorView>
                </div>
            );
        }

        let LoadingView;

        switch (this.siteType) {
            case 'residential':
                LoadingView = LoadingViewResi;
                break;
            default:
                LoadingView = LoadingViewComm;
                break;
        }

        if (this.state.loading) {
            return <LoadingView />;
        }

        const properties = this.state.pdfProperties.length
            ? this.state.pdfProperties
            : [this.state.property];

        const pageMetaData = !this.props.isPdf ? (
            <PageMetaData
                property={this.state.property}
                searchType={this.searchType}
            />
        ) : null;

        const pdfTop = this.props.isPdf ? (
            <div className="cbre_page">
                <PdfHeader siteType={this.siteType} />
                <PdfList
                    spaPath={this.spaPath}
                    siteType={this.siteType}
                    properties={properties}
                    staticMaps={this.state.staticMaps}
                />
            </div>
        ) : null;

        const parentClass = isPdf
            ? 'wrapper cbre_brochure'
            : 'propertyDetails_content';
        const detailsPageTypeClass =
            this.searchType === 'isLetting'
                ? 'propertyDetails--lettings'
                : 'propertyDetails--sales';
        const classes = [parentClass, !isPdf && detailsPageTypeClass];



        return (
            <div className={classNames(classes)}>
                {features && features.notification &&
                    <Notification isShown={true} config={features.notification} />
                }
                {pdfTop}
                {this.renderDetails(properties)}
                {pageMetaData}
            </div>
        );
    }
}



PropertyDetailsPage.contextTypes = {
    router: PropTypes.object,
    spaPath: PropTypes.object,
    stores: PropTypes.object,
    actions: PropTypes.object,
    language: PropTypes.object
};

PropertyDetailsPage.propTypes = {
    isPdf: PropTypes.bool
};

export default responsiveContainer(modalContainer(PropertyDetailsPage));
export const PropertyDetailsPageTest = PropertyDetailsPage;
