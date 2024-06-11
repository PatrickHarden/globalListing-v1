import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
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
import { isPrerender } from '../../utils/browser';
import Nofication from '../../r3/components/Notification/Notification';

import DispatchCustomEvent from '../../utils/dispatchCustomEvent';

// Loaders
import CardLoader from '../CardLoader/CardLoader';
import Spinner from 'react-spinner';

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
            isGroupSlide: false
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

    componentWillMount() {
        this.props.modal.addModal('share');
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
        
        let searchLocationName = stores.SearchStateStore.getItem('searchLocationName') || '';
        searchLocationName = searchLocationName.includes(',') ? searchLocationName.substr(0, searchLocationName.lastIndexOf(",")) : searchLocationName; // Remove country

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
                <ListView
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
                    location={searchLocationName}
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
                        string="PropertiesTruncated"
                        searchType={searchTypeString}
                        propertyTypePlural={propertyTypePlural}
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

            propertiesCountMarkup = (
                <TranslateString
                    className=""
                    propertyCount={propertyCount}
                    string="PropertiesFound"
                    searchType={searchTypeString}
                    component={'p'}
                    propertyTypePlural={propertyTypePlural}
                    location={searchLocationName}
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
        const showBreadcrumb = breadcrumb && breadcrumb.length;
        
        const disableMetaData = this.context.stores.ConfigStore.getItem('disableMetaData');

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
                    <SearchBar
                        omitSearch={renderOmissions.Search}
                        omitFilters={renderOmissions.Filters}
                        activeTab={activeTab}
                        setTabViewFunc={this.setTabState.bind(this)}
                        breakpoints={breakpoints}
                        onInitCallback={this.onInitCallback}
                        resetSearch={resetSearch}
                        disabled={filtersDisabled}
                    />
                )}
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
                        style={isPrerender ? {display: 'block !important'} : {}}
                    >
                        <div
                            ref={this.getSortBarRef}
                            className={classNames(
                                'propertyResults_sortBar',
                                hideSortClass
                            )}
                        >
                            {disableMetaData 
                            ? (
                                <h2 className="summary">
                                    <span className="propertyCount">
                                        {!propertiesTruncatedString &&
                                            propertiesCountMarkup}
                                        {propertiesTruncatedString}
                                    </span>
                                </h2>
                            ) : (
                                <h1 className="summary">
                                    <span className="propertyCount">
                                        {!propertiesTruncatedString &&
                                            propertiesCountMarkup}
                                        {propertiesTruncatedString}
                                    </span>
                                </h1>
                            )}

                            <PdfButton show={showPrintButton} />

                            <ShareButton modal={modal} />

                            <div>{sortByMarkup}</div>
                        </div>

                        { this.fullScreenSticky && 
                            <a
                                onClick={this.toggleCollapsingList}
                                className="cbre_sidebar_toggle"
                            />
                        }

                        {listViewMarkup}

                        {isMobileMap && (
                            <div className="propertyResults_carouselCount">
                                <p>{`${this.state.slideNr} / ${
                                    properties.length
                                }`}</p>
                            </div>
                        )}

                        {clearAllFavouritesButton}

                        { !this.fullScreenSticky && 
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
    renderOmissions: PropTypes.object
};

ListMapPage.propTypes = {
    config: PropTypes.object.isRequired,
    properties: PropTypes.array
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
    }
);

export const ListMapPageTest = ListMapPage;
