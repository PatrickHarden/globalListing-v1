import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Breadcrumb from '../../../list-map-components/Breadcrumb/Breadcrumb';
import MapView from '../../../list-map-components/MapView/MapView';
import ListView_R3 from '../ListView/ListView.r3';
import PageMetaData from '../../../list-map-components/PageMetaData/PageMetaData';
import propertiesContainer from '../../../containers/propertiesContainer';
import modalContainer from '../../../containers/modalContainer';
import ShareModal from '../../../list-map-components/ShareModal/ShareModal';
import RedirectModal from '../../components/RedirectModal/RedirectModal';
import APIMapping from '../../../constants/APIMapping';
import defaultValues from '../../../constants/DefaultValues';
import trackingEvent from '../../../utils/trackingEvent';
import TranslateString from '../../../utils/TranslateString';
import matchTypeStrings from '../../../utils/matchTypeStrings';
import { responsiveContainer } from '../../../external-libraries/agency365-components/components';
import ShareButton_R3 from '../../components/ShareButton/ShareButton.r3';
import SearchBar_R3 from '../SearchBar/SearchBar.r3';
import PdfButton from '../../../list-map-components/Pdf/PdfButton';
import Jumbotron from '../../../list-map-components/Jumbotron/Jumbotron';
import Filters_R3 from '../Filters';
import checkConditional from '../../../utils/checkConditional';
import { isPrerender } from '../../../utils/browser';
import CachedPlaces from '../../../utils/cachedPlaces';
import Places from '../../../utils/Places';
import DispatchCustomEvent from '../../../utils/dispatchCustomEvent';
import Notification from '../../components/Notification/Notification'
import { match } from 'react-router';

// Loaders
import CardLoader from '../../../list-map-components/CardLoader/CardLoader';
import Spinner from 'react-spinner';
import { FUSION_TABLES_LAYER } from 'react-google-maps/lib/constants';

class ListMapPage extends Component {
    constructor(props) {
        super(props);
        this.setMapState = this.setMapState.bind(this);
        this.propertyLinkClickHandler = this.propertyLinkClickHandler.bind(
            this
        );
        this.toggleCollapsingList = this.toggleCollapsingList.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.initialParams = {};
        this.initialSearchState = {};
        this.spinAfterTransition = false;
        this.features = context.stores.ConfigStore.getItem('features');
        this.fullScreenSticky = (this.features.plpFullScreenSticky && this.props.breakpoints.isTabletAndUp && this.ieVersion() == 0) ? true : false;

        // redux related references
        this.selectors = props.selectors;
        this.dispatches = props.dispatches;

        this.state = {
            dispatchCustomEvent: new DispatchCustomEvent(),
            isListCollapsed: !props.breakpoints.isTabletLandscapeAndUp,
            activeTab: 'list',
            shouldTriggerScroll: false,
            selectedItems: {
                group: {},
                property: {},
                marker: null,
                scrollToProperty: null,
                disableScroll: false
            },
            slideNr: 1,
            isGroupSlide: false,
            broaderSearch: {
                key: null,
                value: null
            },
        };
        this.onSliderChanged = this.onSliderChanged.bind(this);
    }

    ieVersion() {
        var ua = window.navigator.userAgent;
        if (ua.indexOf("Trident/7.0") > -1)
            return 11;
        else if (ua.indexOf("Trident/6.0") > -1)
            return 10;
        else if (ua.indexOf("Trident/5.0") > -1)
            return 9;
        else
            return 0;  // not IE9, 10 or 11
    }

    onSliderChanged(index, isGroupSlide) {
        this.setState({ slideNr: index + 1, isGroupSlide: !!isGroupSlide });
    }

    componentDidMount() {
        this.context.analytics.fireTracking();
        this.context.actions.fetchSiteMapsConfig();
    }

    componentWillMount() {
        this.getBroaderSearch(this.props.properties.length);
        this.props.modal.addModal('share');
        this.props.modal.addModal('redirect');
    }

    resetSearch(excludes = []) {
        const { actions, stores, location, router } = this.context;

        const params = Object.assign({}, this.initialParams);
        if (excludes.length) {
            excludes.forEach(ex => {
                const currentVal = stores.ParamStore.getParam(ex);
                if (typeof currentVal !== 'undefined') {
                    params[ex] = currentVal;
                }
            });
        }
        actions.updateProperties(
            params,
            stores.PropertyStore.isFetchAllMode(),
            stores.PropertyStore.getPropertiesMap(),
            location.pathname,
            router
        );
        trackingEvent('listMapClearFilters', params, stores, actions);
        // Avoid flicker of new params in zero results view before load state kicks in

        setTimeout(() => {
            actions.setSearchState(this.initialSearchState);
        });
    }

    setMapState(state) {
        const { stores, actions } = this.context;
        const currentState = stores.SearchStateStore.getItem('mapState') || {};
        const mapState = Object.assign({}, currentState, state);
        actions.setSearchStateItem('mapState', mapState);
    }

    componentWillReceiveProps(nextProps) {

        // Always collapse when tablet and smaller.
        const { isTabletLandscapeAndUp } = this.props.breakpoints;
        const gmaps = window.google && window.google.maps;
        const { stores } = this.context;

        const willBeTabletLandsacpeAndUp =
            nextProps.breakpoints.isTabletLandscapeAndUp;

        const switched = isTabletLandscapeAndUp !== willBeTabletLandsacpeAndUp;

        if (!willBeTabletLandsacpeAndUp) {
            this.setState(
                {
                    isListCollapsed: true
                },
                () => {
                    if (switched) {
                        setTimeout(() => {
                            const mapState =
                                stores.SearchStateStore.getItem('mapState') ||
                                {};
                            if (mapState.ref) {
                                gmaps.event.trigger(
                                    mapState.ref.props.map,
                                    'resize'
                                );
                                mapState.ref.fitBounds(mapState.bounds);
                            }
                        }, 500);
                    }
                }
            );
        }
    }

    renderingComplete() {
        this.state.dispatchCustomEvent.preRender(this.context.actions);
    }

    shouldSpinAfterTransition = () => {
        if (this.spinAfterTransition === true) {
            this.spinAfterTransition = false;
            return true;
        }
        return false;
    };

    toggleCollapsingList() {
        const gmaps = window.google && window.google.maps;

        const { stores } = this.context;

        this.spinAfterTransition = true;

        this.setState(
            {
                isListCollapsed: !this.state.isListCollapsed,
                shouldTriggerScroll: true
            },
            () => {
                this.setState({ shouldTriggerScroll: false });
                setTimeout(() => {
                    const mapState =
                        stores.SearchStateStore.getItem('mapState') || {};
                    if (mapState.ref) {
                        gmaps.event.trigger(mapState.ref.props.map, 'resize');
                        mapState.ref.fitBounds(mapState.bounds);
                    }
                }, 500);
            }
        );
    }

    renderCardLoader() {
        const { isMobile } = this.props.breakpoints;
        const cardCount = isMobile ? 5 : 5;

        let cardLoaders = [];
        for (let i = 0; i < cardCount; i++) {
            cardLoaders.push(<CardLoader key={`card_loader_${i}`} />);
        }

        return <div className={'card_list card-loader'}>{cardLoaders}</div>;
    }

    propertyLinkClickHandler(coordinates, index, propertyId) {
        const { stores, actions } = this.context;
        const { FavouritesStore, ParamStore } = stores;
        const { location } = this.props;

        const page = ParamStore.getParam('page') || defaultValues.page;
        const pageSize =
            ParamStore.getParam('pageSize') || defaultValues.pageSize;

        const propertyIndex = page * pageSize - pageSize + (index + 1);

        this.setMapState({
            centre: {
                lat: parseFloat(coordinates.lat),
                lng: parseFloat(coordinates.lon)
            }
        });

        if (FavouritesStore.isActive()) {
            FavouritesStore.setIndexByPropertyId(propertyId);
        } else {
            actions.setPropertyIndex(propertyIndex);
        }
        actions.setSearchContext({
            path: location.pathname,
            query: location.query
        });

        trackingEvent(
            'viewPropertyDetails',
            {
                propertyId: propertyId
            },
            stores,
            actions
        );
    }

    setSelectedItems = (selectedItems, cb) => {
        const newSelectedItems = {
            ...this.state.selectedItems,
            ...selectedItems
        };

        this.setState(
            {
                selectedItems: newSelectedItems
            },
            cb
        );
    };

    setTabState(tab) {
        this.context.actions.startLoading();
        setTimeout(() => {
            this.context.actions.stopLoading();
            this.setState({ activeTab: tab }, () => {
                if (tab === 'map') {
                    const { groupedProperties } = this.props;

                    let markerId;
                    if (groupedProperties[0].hasOwnProperty('PropertyId')) {
                        markerId = `${groupedProperties[0].PropertyId}_marker`;
                    } else {
                        markerId = `${groupedProperties[0].key}_cluster`;
                    }

                    this.setSelectedItems({ marker: markerId });
                }
            });
        });
    }

    onInitCallback = once => {
        const { ParamStore, SearchStateStore } = this.context.stores;
        // update the 'initial' state once first geo search completes
        if (!once || (once && Object.keys(this.initialParams).length === 0)) {
            this.initialParams = Object.assign({}, ParamStore.getParams());
            this.initialSearchState = Object.assign(
                {},
                SearchStateStore.getAll()
            );
        }
    };

    getSortBarRef = sort => {
        this.sortBarRef = sort;
    };

    clearAllFavourites = e => {
        e.preventDefault();
        const { stores, actions, router, location } = this.context;
        trackingEvent('clearedFavourites', {}, stores, actions);
        actions.clearAllFavourites();

        const searchParams = stores.ParamStore.getParams();
        const routing = {
            router,
            path: location.pathname,
            searchParams
        };
        
        // Hack paramstore.isFavourites is string if we share the link from fav and open in a window, in normal scenario it is boolean
        // refer this for more info https://dev.azure.com/cbre/GlobalListings/_workitems/edit/1101120
        actions.toggleFavourites(searchParams.isFavourites !== 'true', routing);
        if (this.props.reloadProperties && searchParams.isFavourites && searchParams.isFavourites === 'true') {
            stores.SearchStateStore.setItem('isFavourites',false);
            stores.ParamStore.setParam('isFavourites',false);
            stores.ParamStore.setParam('propertyId',null);
            this.props.reloadProperties();
        }
    };

    setBroaderSearch = result => {
        try {
            const searchLocationName = this.context.stores.SearchStateStore.getItem('searchLocationName');
            if (this.state.broaderSearch.value && this.state.broaderSearch.key == searchLocationName) return;
            const searchLocationNameFirstWord = searchLocationName.split(" ")[0].replace(/,/g, "");
            let indexOfNextLargerLocation = 0;

            for (var i = 0; i < result.length; i++) {
                if (result[i].long_name.indexOf(searchLocationNameFirstWord) == -1) {
                    indexOfNextLargerLocation = i;
                    break;
                }
            }

            if (!result[indexOfNextLargerLocation].long_name) return;
            const broaderSearch = { key: this.context.stores.SearchStateStore.getItem('searchLocationName'), value: `?location=${result[indexOfNextLargerLocation].long_name}` };
            this.setState({ broaderSearch: broaderSearch });
        }
        catch (e) {
            return;
        }
    };

    getBroaderSearch = (propertyCount) => {
        if (propertyCount != 0) return;
        const features = this.context.stores.ConfigStore.getItem('features');
        if (!features.enableBroaderSearch) return;

        const searchLocationName = this.context.stores.SearchStateStore.getItem('searchLocationName');
        const useCachedPlaces = features.useCachedPlaces && features.useCachedPlaces.enabled;
        const useCachedPlacesEndpoint = features.useCachedPlaces.addressEndpoint;

        try {
            if (useCachedPlaces) {
                CachedPlaces.lookup({ address: searchLocationName, endpoint: useCachedPlacesEndpoint + "?address=" + searchLocationName }, result => this.setBroaderSearch(result.gmaps.address_components), () => { });
            } else {
                Places.lookup({ address: searchLocationName }, result => this.setBroaderSearch(result.gmaps.address_components), () => { });
            }
        } catch (e) { return; }
    };


    render() {
        const {
            error,
            propertiesHasLoadedOnce,
            isLoading,
            propertyCount,
            config: { siteType, imageOrientation },
            breakpoints,
            modal,
            ...other
        } = this.props;

        let { groupedProperties, properties } = this.props;

        const {
            options: { renderOmissions }
        } = this.props;

        const { isMobile, isTabletAndUp, isTabletLandscapeAndUp } = breakpoints;



        const {
            activeTab,
            isListCollapsed,
            selectedItems,
            shouldTriggerScroll,
            isGroupSlide
        } = this.state;

        const { language, stores, spaPath } = this.context;
        var searchType = stores.SearchStateStore.getItem('searchType');
        // searchTypeExtended is the same as searchType except it has 'isSaleLetting' as an option as well rather than defaulting to 'isSale'
        const searchTypeExtended = stores.SearchStateStore.getItem('searchTypeExtended');
        var searchTypeString =
            searchTypeExtended === 'isSaleLetting'
                ? language['saleLetSearchType'] : null;
        if (!searchTypeString || searchTypeString.trim().length == 0) {
            searchTypeString = searchTypeExtended === 'isLetting'
                ? language['letSearchType']
                : language['saleSearchType'];
        }
        if (this.features.enableSearchType) {
            if (window.location.href.includes('aspects')) {
                searchType = stores.ParamStore.getParam("aspects");
                searchTypeString = searchType ? language[searchType + 'SearchType'] : null;
            }
        }

        const propertyTypePlural = matchTypeStrings(
            language,
            stores.ParamStore.getParams().propertySubType,
            stores.ParamStore.getParams().usageType
        );

        const recaptchaKey = stores.ConfigStore.getItem('recaptchaKey');
        const apiUrl = stores.ConfigStore.getItem('propertyContactApiUrl');
        const siteId = stores.ConfigStore.getItem('siteId');
        const mapState = stores.SearchStateStore.getItem('mapState') || {};
        const renderCarousel = !!isMobile && activeTab === 'map';
        const searchResultLimit =
            stores.ConfigStore.getItem('limitListMapResults') ||
            defaultValues.limitListMapResults;

        let mapViewMarkup;
        let listViewMarkup;
        let sortByMarkup;
        let propertiesCountMarkup;
        let propertiesTruncatedString;

        let favouritesIsActive = false;
        const params = this.context.stores.ParamStore.getParams();
        if (params.isFavourites && params.isFavourites === 'true' || params.isFavourites === true) {
            favouritesIsActive = true;
        }

        let searchLocationName = stores.SearchStateStore.getItem('searchLocationName') || '';
        searchLocationName = searchLocationName.includes(',') ? searchLocationName.substr(0, searchLocationName.lastIndexOf(",")) : searchLocationName; // Remove country

        if (error) {
            mapViewMarkup = (
                <MapView
                    {...other}
                    properties={[]}
                    searchType={searchType}
                    setSelectedItems={this.setSelectedItems}
                    spaPath={spaPath}
                />
            );

            listViewMarkup = (
                <div className="cbre_error cbre_error-api">
                    <h3>{language.SearchErrorSubTitle}</h3>
                    <p>{language.SearchErrorText}</p>
                </div>
            );
        } else if (propertiesHasLoadedOnce && isLoading) {
            listViewMarkup = <CardLoader />;
            mapViewMarkup = (
                <div className={'cbre_map'}>
                    <Spinner />
                </div>
            );
        } else if (propertiesHasLoadedOnce && propertyCount > 0) {
            if (this.features.sortPropertiesByRelevancy) {
                // Create a hash map to store properties by the sub-ID. (E.g. the "3" in "AU-5107079-3".)
                let propertyHash = {};
                properties.map(property => {
                    const split = property.PropertyId.split('-');
                    const propertyId = split[split.length - 1];
                    // If a key of that sub-ID (hash[3] doesn't exist, create it.)
                    if (!propertyHash[propertyId]) {
                        propertyHash[propertyId] = [];
                    }
                    // Add property to it's proper hash key.
                    propertyHash[propertyId].push(property);
                })
                let newProperties = [];
                // Reduce all values of propertyHash into an array.
                // Object.entries() will automatically order the keys of the object passed to it numerically, giving the correct sort order.
                Object.entries(propertyHash).map(entry => newProperties = newProperties.concat(entry[1]));
                properties = newProperties;
            }
            listViewMarkup = (
                <ListView_R3
                    renderAsCarousel={renderCarousel}
                    displayCarouselResultCount
                    properties={properties}
                    groupedProperties={groupedProperties}
                    searchType={searchType}
                    spaPath={spaPath}
                    recaptchaKey={recaptchaKey}
                    apiUrl={apiUrl}
                    language={language}
                    siteId={siteId}
                    propertyLinkClickHandler={this.propertyLinkClickHandler}
                    siteType={siteType}
                    imageOrientation={imageOrientation}
                    isListCollapsed={isListCollapsed}
                    spinAfterTransition={this.shouldSpinAfterTransition}
                    shouldTriggerScroll={shouldTriggerScroll}
                    selectedItems={selectedItems}
                    setSelectedItems={this.setSelectedItems}
                    modal={modal}
                    favouritesIsActive={favouritesIsActive}
                    sortBarRef={this.sortBarRef}
                    onSliderChanged={this.onSliderChanged}
                    fullScreenSticky={this.fullScreenSticky}
                />
            );

            mapViewMarkup = (
                <MapView
                    {...other}
                    searchType={searchType}
                    mapState={mapState}
                    selectedItems={selectedItems}
                    setMapState={state => this.setMapState(state)}
                    setSelectedItems={this.setSelectedItems}
                    properties={properties}
                />
            );

            if (!isMobile) {

                let label = '';
                const filters = this.context.stores.ConfigStore.getItem('filters') || [];

                filters.forEach(filter => {
                    if (checkConditional(filter, this.context.stores.ParamStore.getParams())
                        && filter.placement === 'lm_sortFilter') {
                        label = filter.label;
                    }
                });

                sortByMarkup = (
                    <div className="filters-wrapper">
                        <span className="filter-label">{label}</span>
                        <Filters_R3
                            type="auto"
                            view="map-list"
                            className="Select__small"
                            placement="lm_sortFilter"
                            disabled={false}
                        />
                    </div>
                );
            }

            if (isAreaSearch) {
                propertiesCountMarkup = (
                    <span className="propertyCount">
                        <TranslateString
                            className=""
                            propertyCount={propertyCount}
                            string="PropertiesResultsAreaSearch"
                            searchType={searchTypeString}
                            component={'p'}
                            propertyTypePlural={propertyTypePlural}
                            location={searchLocationName}
                        />
                    </span>
                );
            } else {
                propertiesCountMarkup = (
                    <span className="propertyCount">
                        <TranslateString
                            className=""
                            propertyCount={propertyCount}
                            string="PropertiesFound"
                            searchType={searchTypeString}
                            component={'p'}
                            propertyTypePlural={propertyTypePlural}
                            location={searchLocationName}
                        />
                    </span>
                );
            }
            if (favouritesIsActive) {
                propertiesCountMarkup = (
                    <span className="propertyCount">
                        <TranslateString
                            className="favourites-count"
                            propertyCount={propertyCount}
                            string="FavouritesCount"
                            component={'p'}
                        />
                        <a href="#" onClick={this.clearAllFavourites} className={classNames('cbre_button', 'cbre_button cbre_button__icon', 'clear-favorites-button')}>
                            <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-clearfavs.png" />
                            <span className="clear-favorites-button-text">{language.ClearFavouritesButton}</span>
                        </a>
                    </span>
                );
            }
            const isAreaSearch = stores.PropertyStore.isAreaSearch();

            // console.log(`is this an area search? ${isAreaSearch}`);

            if (isAreaSearch && (propertyCount < searchResultLimit)) {
                propertiesTruncatedString = (
                    <span className="propertyCount">
                        <TranslateString
                            className="propertiesTruncated"
                            propertyCount={propertyCount}
                            searchResultLimit={searchResultLimit}
                            string="PropertiesResultsAreaSearch"
                            searchType={searchTypeString}
                            propertyTypePlural={propertyTypePlural}
                            component={'span'}
                        />
                    </span>
                );
            } else if (propertyCount > searchResultLimit) {
                propertiesTruncatedString = (
                    <span className="propertyCount">
                        <TranslateString
                            className="propertiesTruncated"
                            propertyCount={propertyCount}
                            searchResultLimit={searchResultLimit}
                            string="PropertiesTruncated"
                            searchType={searchTypeString}
                            propertyTypePlural={propertyTypePlural}
                            component={'span'}
                        />
                    </span>
                );
            }
        } else if (
            propertiesHasLoadedOnce &&
            properties &&
            properties.length === 0 &&
            !favouritesIsActive
        ) {
            this.getBroaderSearch(properties.length);
            const heading = (
                <TranslateString string="NoResultsTitle" component={'h2'} />
            );

            let radiusType =
                stores.ParamStore.getParam('RadiusType') ||
                defaultValues.radiusType;
                radiusType = language[`DistanceUnits_${radiusType.toLowerCase()}`] || radiusType;
            const radius = stores.ParamStore.getParam('radius');

            let subtitle = radius ? (
                <TranslateString
                    className="cbre_largeText"
                    radius={radius}
                    radiusType={radiusType}
                    location={stores.SearchStateStore.getItem(
                        'searchLocationName'
                    )}
                    string="NoResultsInArea"
                    component={'p'}
                />
            ) : (
                <TranslateString
                    className="cbre_largeText"
                    string="NoResultsInPolygon"
                    component={'p'}
                />
            );

            if (favouritesIsActive) {
                subtitle = <p>{language.FavouritesViewNoResults}</p>;
            }

            const aspectType = stores.ParamStore.getParam('Common.Aspects') || stores.ParamStore.getParam('aspects') ;
            const searchAllHref = this.state.broaderSearch.value ? this.state.broaderSearch.value : `${spaPath.path}${spaPath.subPath}?aspects=${aspectType}`;

            const button = (
                <TranslateString
                    component="a"
                    className="cbre_button cbre_button__primary cbre_button__large"
                    string="SearchAll"
                    href={searchAllHref}
                />
            );

            const altButtonUrl = stores.ConfigStore.getItem(
                'noResultsSecondaryButtonUrl'
            );
            const altButton = altButtonUrl ? (
                <TranslateString
                    component="a"
                    className="cbre_button cbre_button__primary cbre_button__large"
                    string="noResultsSecondaryButtonText"
                    href={altButtonUrl}
                />
            ) : null;

            listViewMarkup = (
                <Jumbotron
                    heading={heading}
                    subtitle={subtitle}
                    button={button}
                    altButton={altButton}
                    isListCollapsed={isListCollapsed}
                />
            );

            mapViewMarkup = (
                <MapView
                    properties={properties}
                    searchType={searchType}
                    mapState={mapState}
                    selectedItems={selectedItems}
                    setMapState={state => this.setMapState(state)}
                    setSelectedItems={this.setSelectedItems}
                    {...this.props}
                />
            );


            const isAreaSearch = stores.PropertyStore.isAreaSearch();

            if (isAreaSearch) {
                propertiesCountMarkup = (
                    <span className="propertyCount">
                        <TranslateString
                            className=""
                            propertyCount={propertyCount}
                            string="PropertiesResultsAreaSearch"
                            searchType={searchTypeString}
                            component={'p'}
                            propertyTypePlural={propertyTypePlural}
                            location={searchLocationName}
                        />
                    </span>
                );
            } else {
                propertiesCountMarkup = (
                    <span className="propertyCount">
                        <TranslateString
                            className=""
                            propertyCount={propertyCount}
                            string="PropertiesFound"
                            searchType={searchTypeString}
                            component={'p'}
                            propertyTypePlural={propertyTypePlural}
                            location={searchLocationName}
                        />
                    </span>
                );
            }
        } else if (
            propertiesHasLoadedOnce &&
            properties &&
            properties.length === 0 &&
            favouritesIsActive
        ) {
            this.getBroaderSearch(properties.length);
            propertiesCountMarkup = (
                <span className="propertyCount">
                    <TranslateString
                        className="favourites-count"
                        propertyCount={propertyCount}
                        string="FavouritesCount"
                        component={'p'}
                    />
                </span>
            );

            mapViewMarkup = (
                <MapView
                    {...other}
                    properties={[]}
                    searchType={searchType}
                    setSelectedItems={this.setSelectedItems}
                />
            );

            listViewMarkup = (
                <div className="cbre_error cbre_error-api no-favorites">
                    <h3>{language.NoFavouritesText}</h3>
                </div>
            );
        } else {
            listViewMarkup = this.renderCardLoader();
            mapViewMarkup = (
                <div className={'cbre_map'}>
                    <Spinner />
                </div>
            );
        }

        this.renderingComplete();

        const sideBarClass = isTabletAndUp ? 'cbre_sidebar' : '';
        const isMobileMap = isMobile && activeTab === 'map';
        const carouselClass = isMobileMap ? 'carousel' : '';
        const isCollaped = isListCollapsed;
        const sideBarCollapsedClass =
            !isMobile && isTabletLandscapeAndUp && !isCollaped
                ? 'is_wide'
                : 'is_narrow';
        const hideSortClass =
            isMobile && this.state.activeTab === 'map' ? 'is-hidden' : '';

        const resetSearch = () => {
            this.resetSearch(['radius', 'lat', 'lon', 'location', 'placeId']);
        };

        const showPrintButton = !!(
            stores.FavouritesStore.isActive() && properties.length
        );

        const breadcrumb = this.context.stores.ConfigStore.getItem(
            'breadcrumbPrefix'
        );
        let showBreadcrumb = breadcrumb && breadcrumb.length;

        if (this.features.hideBreadcrumbOnPLP) {
            showBreadcrumb = false;
        }

        const disableMetaData = context.stores.ConfigStore.getItem('disableMetaData');

        return (
            <div className="main plp">
                {!!showBreadcrumb && <Breadcrumb appRoot={spaPath.path} />}
                {this.features && this.features.notification &&
                    <Notification isShown={true} config={this.features.notification} />
                }
                {/* 
                    To disable the SearchBar entirely, the options must include:
                    renderOmissions: {
                        Search: true,
                        Filters: true
                    }
                 */}
                {!(
                    renderOmissions.Search === true &&
                    renderOmissions.Filters === true
                ) && (
                        <SearchBar_R3
                            omitSearch={renderOmissions.Search}
                            omitFilters={renderOmissions.Filters}
                            activeTab={activeTab}
                            setTabViewFunc={this.setTabState.bind(this)}
                            breakpoints={breakpoints}
                            onInitCallback={this.onInitCallback}
                            resetSearch={resetSearch}
                            disabled={false}
                            fullScreenSticky={this.fullScreenSticky}
                        />
                    )}

                <div
                    ref={this.getSortBarRef}
                    className={classNames(
                        'propertyResults_sortBar',
                        hideSortClass
                    )}
                >
                    <div className="sortBar">
                        {disableMetaData
                            ? (
                                <h2 className="summary">
                                    {!propertiesTruncatedString &&
                                        propertiesCountMarkup}
                                    {propertiesTruncatedString}
                                </h2>
                            ) : (
                                <h1 className="summary">
                                    {!propertiesTruncatedString &&
                                        propertiesCountMarkup}
                                    {propertiesTruncatedString}
                                </h1>
                            )}
                        <div className="sortBar-right">
                            <PdfButton show={showPrintButton} />
                            <ShareButton_R3 modal={modal} showText={true} />
                            {!favouritesIsActive && sortByMarkup}
                        </div>
                    </div>
                </div>

                <div className="searchResults">

                    {mapViewMarkup}

                    <div
                        className={classNames(
                            'propertyResults',
                            sideBarClass,
                            carouselClass,
                            sideBarCollapsedClass,
                            isGroupSlide && 'showingGroupSlide'
                        )}
                        style={isPrerender ? { display: 'block !important' } : {}}
                    >

                        {this.fullScreenSticky &&
                            <a
                                onClick={this.toggleCollapsingList}
                                className="cbre_sidebar_toggle"
                            />
                        }

                        {listViewMarkup}

                        {isMobileMap && (
                            <div className="propertyResults_carouselCount">
                                <p>{`${this.state.slideNr} / ${properties.length
                                    }`}</p>
                            </div>
                        )}

                        {!this.fullScreenSticky &&
                            <a
                                onClick={this.toggleCollapsingList}
                                className="cbre_sidebar_toggle"
                            />
                        }
                    </div>
                </div>
                <ShareModal
                    className="listmap-modal"
                    {...modal.getModal('share')}
                />
                {document.body.classList.contains("redirect") &&
                    <RedirectModal
                        className="redirect-modal"
                        config={this.props.config}
                        isShown={(this.props.config.searchConfig.searchResultsPage && !this.props.config.features.redirect)}
                        {...modal.getModal('redirect')}
                    />
                }
                {/* {
                    props.router.listenBefore((e, callback) => {
                        if (e.error.PageNotFound){
                            return (
                                <RedirectModal
                                    className="redirect-modal"
                                    config={config}
                                    {...modal.getModal('redirect')}
                                />
                            )
                        }
                    })
                } */}
                <PageMetaData
                    searchType={searchType}
                    canonicalParams={['location']}
                />
            </div>
        );
    }
}

ListMapPage.contextTypes = {
    actions: PropTypes.object,
    stores: PropTypes.object,
    language: PropTypes.object,
    spaPath: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object,
    renderOmissions: PropTypes.object,
    analytics: PropTypes.object
};

ListMapPage.propTypes = {
    config: PropTypes.object.isRequired,
    properties: PropTypes.array,
    reduxDispatch: PropTypes.func
};

export default propertiesContainer(
    responsiveContainer(modalContainer(ListMapPage)),
    {
        bypassLoader: true,
        loadOnMount: true,
        fetchAllProperties: true,
        propertiesMap: [
            APIMapping.ContactGroup._key,
            APIMapping.Highlights._key,
            APIMapping.Walkthrough,
            APIMapping.MinimumSize._key,
            APIMapping.MaximumSize._key,
            APIMapping.TotalSize._key,
            APIMapping.GeoLocation._key,
            APIMapping.Sizes._key
        ]
});

export const ListMapPageTest = ListMapPage;
