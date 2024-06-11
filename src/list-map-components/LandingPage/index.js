import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import MapView from '../MapView/MapView';
import ListView from '../ListView/ListView';
import PageMetaData from '../PageMetaData/PageMetaData';
import propertiesContainer from '../../containers/propertiesContainer';
import modalContainer from '../../containers/modalContainer';
import ShareModal from '../ShareModal/ShareModal';
import APIMapping from '../../constants/APIMapping';
import defaultValues from '../../constants/DefaultValues';
import trackingEvent from '../../utils/trackingEvent';
import TranslateString from '../../utils/TranslateString';
import matchTypeStrings from '../../utils/matchTypeStrings';
import { responsiveContainer } from '../../external-libraries/agency365-components/components';
import ShareButton from '../ShareButton/ShareButton';
import SearchBar from '../SearchBar/SearchBar';
import PdfButton from '../Pdf/PdfButton';
import Jumbotron from '../Jumbotron/Jumbotron';
import Filters from '../../components/Filters';

import DispatchCustomEvent from '../../utils/dispatchCustomEvent';

// Loaders
import CardLoader from '../CardLoader/CardLoader';
import Spinner from 'react-spinner';

class LandingPage extends Component {
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
            }
        };
    }

    componentWillMount() {
        const { stores } = this.context;
        this.props.modal.addModal('share');
        if (
            this.props.params.location &&
            this.props.params.location !=
                stores.SearchStateStore.getItem('searchLocationName')
        ) {
            stores.ParamStore.setParam(
                'location',
                this.toTitleCase(encodeURIComponent(this.props.params.location))
            );
            stores.SearchStateStore.setItem(
                'searchLocationName',
                this.toTitleCase(encodeURIComponent(this.props.params.location))
            );
            stores.ParamStore.setParam(
                'Common.UsageType',
                this.toTitleCase(this.props.params.usageType)
            );
            stores.ParamStore.setParam('radius', 1);
        }
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
    toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    componentWillReceiveProps(nextProps) {
        // Always collapse when tablet and smaller.
        const { isTabletLandscapeAndUp } = this.props.breakpoints;
        const gmaps = window.google && window.google.maps;
        const { stores } = this.context;

        const willBeTabletLandscapeAndUp =
            nextProps.breakpoints.isTabletLandscapeAndUp;

        const switched = isTabletLandscapeAndUp !== willBeTabletLandscapeAndUp;
        if (!willBeTabletLandscapeAndUp) {
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
        const cardCount = isMobile ? 1 : 5;

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
                lng: parseFloat(coordinates.lng)
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

    render() {
        const {
            error,
            propertiesHasLoadedOnce,
            isLoading,
            propertyCount,
            config: { siteType, imageOrientation },
            breakpoints,
            modal,
            favouritesIsActive,
            ...other
        } = this.props;

        let { groupedProperties, properties } = this.props;

        const { isMobile, isTabletAndUp, isTabletLandscapeAndUp } = breakpoints;

        const {
            activeTab,
            isListCollapsed,
            selectedItems,
            shouldTriggerScroll
        } = this.state;

        const { language, stores, spaPath } = this.context;

        const searchType = stores.SearchStateStore.getItem('searchType');
        const searchTypeString =
            searchType === 'isLetting'
                ? language['letSearchType']
                : language['saleSearchType'];
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
        const isFavourites = stores.SearchStateStore.getAll().isFavourites;
        const filtersDisabled =
            stores.FavouritesStore.isActive() || isFavourites ? true : false;

        let mapViewMarkup;
        let listViewMarkup;
        let sortByMarkup;
        let propertiesCountMarkup;
        let propertiesTruncatedString;
        let clearAllFavouritesButton;

        if (error) {
            mapViewMarkup = (
                <MapView
                    {...other}
                    properties={[]}
                    searchType={searchType}
                    setSelectedItems={this.setSelectedItems}
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
            listViewMarkup = (
                <ListView
                    renderAsCarousel={renderCarousel}
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
                sortByMarkup = (
                    <Filters
                        type="auto"
                        view="map-list"
                        className="Select__small"
                        placement="lm_sortFilter"
                        disabled={filtersDisabled}
                    />
                );
            }

            propertiesCountMarkup = (
                <TranslateString
                    className=""
                    propertyCount={propertyCount}
                    string="PropertiesFound"
                    searchType={searchTypeString}
                    component={'p'}
                    propertyTypePlural={propertyTypePlural}
                />
            );

            if (favouritesIsActive) {
                propertiesCountMarkup = (
                    <TranslateString
                        className="favourites-count"
                        propertyCount={propertyCount}
                        string="FavouritesCount"
                        component={'p'}
                    />
                );
            }

            if (propertyCount > searchResultLimit) {
                propertiesTruncatedString = (
                    <TranslateString
                        className="propertiesTruncated"
                        propertyCount={propertyCount}
                        searchResultLimit={searchResultLimit}
                        searchType={searchTypeString}
                        propertyTypePlural={propertyTypePlural}
                        string="PropertiesTruncated"
                        component={'span'}
                    />
                );
            }
        } else if (
            propertiesHasLoadedOnce &&
            properties &&
            properties.length === 0 &&
            !favouritesIsActive
        ) {
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

            if (isFavourites) {
                subtitle = <p>{language.FavouritesViewNoResults}</p>;
            }

            const button = (
                <TranslateString
                    component="a"
                    className="cbre_button cbre_button__primary cbre_button__large"
                    string="SearchAll"
                    href={
                        spaPath.path +
                        spaPath.subPath +
                        '?aspects=' +
                        stores.SearchStateStore.getItem('searchType')
                    }
                />
            );

            listViewMarkup = (
                <Jumbotron
                    heading={heading}
                    subtitle={subtitle}
                    button={button}
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

            propertiesCountMarkup = (
                <TranslateString
                    className=""
                    propertyCount={propertyCount}
                    string="PropertiesFound"
                    searchType={searchTypeString}
                    component={'p'}
                    propertyTypePlural={propertyTypePlural}
                />
            );
        } else if (
            propertiesHasLoadedOnce &&
            properties &&
            properties.length === 0 &&
            favouritesIsActive
        ) {
            mapViewMarkup = (
                <MapView
                    {...other}
                    properties={[]}
                    searchType={searchType}
                    setSelectedItems={this.setSelectedItems}
                />
            );

            listViewMarkup = (
                <div className="cbre_error cbre_error-api">
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
        const carouselClass = isMobile && activeTab === 'map' ? 'carousel' : '';
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
        return (
            <div className="main plp">
                <SearchBar
                    activeTab={activeTab}
                    setTabViewFunc={this.setTabState.bind(this)}
                    breakpoints={breakpoints}
                    onInitCallback={this.onInitCallback}
                    resetSearch={resetSearch}
                    disabled={filtersDisabled}
                />
                <div className="searchResults">
                    {mapViewMarkup}
                    <div
                        className={classNames(
                            'propertyResults',
                            sideBarClass,
                            carouselClass,
                            sideBarCollapsedClass
                        )}
                    >
                        <div
                            ref={this.getSortBarRef}
                            className={classNames(
                                'propertyResults_sortBar',
                                hideSortClass
                            )}
                        >
                            <h1 className="summary">
                                <span className="propertyCount">
                                    {!propertiesTruncatedString && propertiesCountMarkup}
                                    {propertiesTruncatedString}
                                </span>
                            </h1>

                            <PdfButton show={showPrintButton} />

                            <ShareButton modal={modal} />

                            <div>{sortByMarkup}</div>
                        </div>
                        {listViewMarkup}
                        {clearAllFavouritesButton}

                        <a
                            onClick={this.toggleCollapsingList}
                            className="cbre_sidebar_toggle"
                        />
                    </div>
                </div>
                <ShareModal
                    className="listmap-modal"
                    {...modal.getModal('share')}
                />
                <PageMetaData
                    searchType={searchType}
                    canonicalParams={['location']}
                />
            </div>
        );
    }
}

LandingPage.contextTypes = {
    actions: PropTypes.object,
    stores: PropTypes.object,
    language: PropTypes.object,
    spaPath: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object
};

LandingPage.propTypes = {
    config: PropTypes.object.isRequired,
    properties: PropTypes.array
};

export default propertiesContainer(
    responsiveContainer(modalContainer(LandingPage)),
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
    }
);

export const LandingPageTest = LandingPage;
