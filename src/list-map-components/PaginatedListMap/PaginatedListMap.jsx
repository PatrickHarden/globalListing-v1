import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import groupObjects from '../../utils/groupObjects';
import trackingEvent from '../../utils/trackingEvent';
import { isPrerender } from '../../utils/browser';
import SearchBar_R3 from '../../r3/PLP/SearchBar/SearchBar.r3';
import SearchBar_R4 from '../../r4/PLP/SearchBar/SearchBar.r4';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentMarkers, setStoreViewableMarkerCount } from '../../redux/actions/map/markers/load-map-markers';
import { getListMapVariables } from './listMapVariables';
import modalContainer from '../../containers/modalContainer';
import ShareModal from '../ShareModal/ShareModal';
import RedirectModal from '../../r3/components/RedirectModal/RedirectModal';
import { responsiveContainer } from '../../external-libraries/agency365-components/components';
import { loadProperties, setPropertiesLoading } from '../../redux/actions/properties/load-properties';
import { currentPropertiesSelector } from '../../redux/selectors/properties/current-properties-selector';
import Map from './components/Map.jsx';
import List from './components/List.jsx';
import ListControlBar from './components/ControlBar.jsx';
import ListPageBar from './components/PageBar.jsx';
import PLPToggleButton from './components/PLPToggleButton.jsx';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { PLPContainer, ListMapContainer, SidebarContainer, GlobalOverflowYFix, GlobalSearchBarMaxWidth } from '../../r4/shared-styles/list-map.jsx';
import ContactFormWrapper from '../ContactFormWrapper/ContactFormWrapper';
import MobileContainer from './components/MobileContainer.jsx';
import MobileFilterView from './components/MobileFilterView.jsx';
import InfoWindowComponentR4 from '../../r4/PLP/ListMap/InfoWindow.jsx';
import { currentMapMarkersSelector } from '../../redux/selectors/map/markers/current-map-markers-selector';
import { fireAnalyticsTracking } from '../../ga4-analytics/send-event';
import { eventTypes } from '../../ga4-analytics/event-types';
import { CreateGLSearchEvent } from '../../ga4-analytics/converters/search-event';
import { get } from 'lodash';
import PageMetaData from '../../list-map-components/PageMetaData/PageMetaData';

const PaginatedListMap = props => {
    const { context, breakpoints, modal, language, options, ...other } = props;
    const isCookieBoxExists = document.querySelector('.cbre-message-cookie') !== null;

    const error = false;
    const dispatch = useDispatch();

    // refs
    const sortBarRef = useRef(null);

    // selectors
    const currentProperties = useSelector(currentPropertiesSelector);
    const currentMarkers = useSelector(currentMapMarkersSelector);

    // state
    const [activeTab, setActiveTab] = useState('map');
    const [listCollapsed, setListCollapsed] = useState(
        !breakpoints.isTabletLandscapeAndUp
    );
    const [spinAfterTransition, setSpinAfterTransition] = useState(false);
    const [shouldTriggerScroll, setShouldTriggerScroll] = useState(false);
    const [initialParams, setInitialParms] = useState(undefined);
    const [initialSearchState, setInitialSearchState] = useState(undefined);
    const [selectedItems, setSelectedItems] = useState({
        group: {},
        property: {},
        marker: null,
        scrollToProperty: null,
        disableScroll: false
    });
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [currentMobileView, setCurrentMobileView] = useState('map');
    const [disableFilters, setDisableFilters] = useState(false);
    const [lastMobileView, setLastMobileView] = useState('map');
    const [toggleButtonLabel, setToggleButtonLabel] = useState('List');
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mobileMapPopover, setMobileMapPopover] = useState(null);
    const [headerHeight, setHeaderHeight] = useState(isCookieBoxExists ?
                                                          context.stores.ConfigStore.getFeatures().headerHeight + 81 
                                                        : context.stores.ConfigStore.getFeatures().headerHeight || 75
                                                    );
    const refMarker = useRef(mobileMapPopover);

    const listMapVariables = getListMapVariables(
        context,
        breakpoints,
        activeTab,
        listCollapsed
    );

    const r4 = window.cbreSiteTheme === "commercialr4" ? true : false;
    
    const cookieButton = document.querySelector('button.message-btn--cookie');
    cookieButton && cookieButton.addEventListener('click', () => {
        setHeaderHeight(context.stores.ConfigStore.getFeatures().headerHeight || 75)
    });

    const searchType = context.stores.SearchStateStore.getItem('searchType');

    useEffect(() => {
        modal.addModal("share");
        modal.addModal("redirect");
    });

    // callback functions
    const resetSearch = () => {

        const params = Object.assign({}, initialParams);

        context.stores.ParamStore.setParams(params);

        dispatch(loadCurrentMarkers(context, params));
        
        setTimeout(() => {
            context.actions.setSearchState(initialSearchState);
        });
    };

    const setTab = tab => {
        context.actions.startLoading();
        setTimeout(() => {
            context.actions.stopLoading();
            setActiveTab(tab, () => {
                if (tab === "map") {
                    let markerId;
                    const groupedProperties = groupObjects(
                        currentProperties,
                        "Coordinates"
                    );
                    if (groupedProperties[0].hasOwnProperty("PropertyId")) {
                        markerId = `${groupedProperties[0].PropertyId}_marker`;
                    } else {
                        markerId = `${groupedProperties[0].key}_cluster`;
                    }
                    setSelectedItems({ marker: markerId });
                }
            });
        });
    };

    const setMarkerCount = (count) => {
        dispatch(setStoreViewableMarkerCount(count));
        // defaulted to map view to reduce load time and fix property count on list view 
        // let portrait = window.matchMedia("(orientation: landscape)");
        // if(breakpoints.isTabletAndDown && !mapLoaded || portrait.matches){
        //     mobileToggle();
        // }
    };

    const updatePropertiesLoading = (value) => {
        dispatch(setPropertiesLoading(value));
    };

    const displayMobileMapPopover = marker => {
        if (refMarker.current && marker && (refMarker.current.property.id === marker.property.id) && (refMarker.current.active === marker.active)){
            refMarker.current = null;
            setMobileMapPopover(null);
        } else {
            refMarker.current = marker;
            setMobileMapPopover(marker);
        }
    };

    useEffect(() => {
        if (!initialParams) {
            setInitialParms(
                Object.assign({}, context.stores.ParamStore.getParams())
            );
            setInitialSearchState(
                Object.assign({}, context.stores.SearchStateStore.getAll())
            );
        }
        // initial call
        dispatch(loadCurrentMarkers(context, context.stores.ParamStore.getParams()));
    }, []);


    /*
    const toggleCollapsingList = () => {
        
        setListCollapsed(!listCollapsed);
        setSpinAfterTransition(true);
        setShouldTriggerScroll(true);
        
        const gmaps = window.google && window.google.maps;

        setTimeout(() => {
            const mapState = context.stores.SearchStateStore.getItem('mapState') || {};
            if (mapState.ref) {
                gmaps.event.trigger(mapState.ref.props.map, 'resize');
                mapState.ref.fitBounds(mapState.bounds);
            }
            setShouldTriggerScroll(false);
            setSpinAfterTransition(false);
        }, 500);
    };
    */

    // set map state
    const mapStateHandler = state => {
        const currentState =
            context.stores.SearchStateStore.getItem("mapState") || {};
        const mapState = Object.assign({}, currentState, state);
        context.actions.setSearchStateItem("mapState", mapState);
    };
  
    const scrollDetect = e => {
        const newScrollTop =
            e && e.currentTarget && e.currentTarget.scrollTop
                ? e.currentTarget.scrollTop
                : 0;
        const searchBar = document.getElementsByClassName("searchBar")[0];
        const propertyResults = document.getElementsByClassName(
            "propertyResults"
        )[0];

        if (newScrollTop > lastScrollTop) {
            searchBar.style.display = "none";
            propertyResults.style.marginTop = "0";
        } else if (newScrollTop < lastScrollTop) {
            searchBar.style.display = "block";
            propertyResults.style.marginTop = "165px";
        }
        setLastScrollTop(newScrollTop);
    };

    const mobileToggle = () => {
        setToggleButtonLabel(currentMobileView === "list" ? "List" : "Map");
        setCurrentMobileView(currentMobileView === "list" ? "map" : "list");
        if (currentMobileView === "map" && !mapLoaded) {
            setMapLoaded(true);
            setCurrentMobileView("list");
            setToggleButtonLabel("Map");
        }
    };

    const toggleFilters = () => {
        if (currentMobileView === "filters") {
            setCurrentMobileView(lastMobileView);
        } else {
            setLastMobileView(currentMobileView);
            setCurrentMobileView("filters");
        }
    };

    // handle filter changes
    const filterChange = (params) => {
        // analytics (missing property type, search term, search url)
        const searchEvent = CreateGLSearchEvent('PLP',params,null,null,get(params,'aspects'),get(params,'location'),null);
        fireAnalyticsTracking(props.config.features, context, eventTypes.SEARCH, searchEvent, false);
        dispatch(loadCurrentMarkers(context, params));
    };

    const mobileFilterChange = (params) => {
        filterChange(params);
        toggleFilters();
    };

    const sortChange = (params) => {
        dispatch(loadProperties(context, undefined, undefined, undefined, params));
    };

    const toggleDisableFilters = () => {
        setDisableFilters(true);
    };

    useEffect(() => {
        if (isPrerender){
            dispatch(loadProperties(context, undefined, undefined, undefined, {}));
        }
    }, [])

    const SearchComponent = r4 ? SearchBar_R4 : SearchBar_R3;
    

    return (
        <MobileContainer heightReduction={breakpoints.isTabletAndDown ? headerHeight : headerHeight}>
            <GlobalOverflowYFix />
            {initialParams && initialParams.broker && initialParams.broker.length > 0 &&
                <GlobalSearchBarMaxWidth />
            }
            <PLPContainer
                className="main plp"
                includePagingControls={true}
                searchIncluded={!(options.renderOmissions.Search && options.renderOmissions.Filters)}
                onScroll={breakpoints.isTabletAndDown || breakpoints.i ? scrollDetect : undefined}
            >
                {!!listMapVariables.showBreadcrumb && (
                    <Breadcrumb appRoot={context.spaPath.path} />
                )}

                {/* only show search bar for list/map views */
                currentMobileView !== "filters" && !(
                    options.renderOmissions.Search &&
                    options.renderOmissions.Filters
                ) && (
                    <SearchComponent
                        key="listmap-search"
                        omitSearch={false}
                        omitFilters={false}
                        activeTab={activeTab}
                        setTabViewFunc={setTab}
                        breakpoints={breakpoints}
                        resetSearch={resetSearch}
                        disabled={disableFilters}
                        toggleDisableFilters={toggleDisableFilters}
                        fullScreenSticky={listMapVariables.fullScreenSticky}
                        includeControlBar={r4 ? false : true}
                        listMapVariables={listMapVariables}
                        language={language}
                        modal={modal}
                        openFilterCallback={toggleFilters}
                        filterChangeCallback={filterChange}
                        sortChangeCallback={sortChange}
                    />
                )}

                <ListMapContainer
                    className={
                        "searchResults" + r4
                            ? " r4-list-map-container"
                            : " r3-list-map-container"
                    }
                >
                    {(!r4 ||
                        !breakpoints.isTabletAndDown ||
                        currentMobileView === "map" ||
                        (mapLoaded && currentMobileView !== "filters")) && (
                        <Map
                            key="listmap-map"
                            context={context}
                            setMapState={mapStateHandler}
                            listMapVariables={listMapVariables}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            error={error}
                            breakpoints={breakpoints}
                            displayMobileMapPopover={displayMobileMapPopover}
                            setMarkerCount={setMarkerCount}
                            updatePropertiesLoading={updatePropertiesLoading}
                            currentMarkers={currentMarkers}
                            {...other}
                        />
                    )}
                    {(!r4 ||
                        !breakpoints.isTabletAndDown ||
                        currentMobileView === "list") && (
                        <SidebarContainer className={r4 ? "r4-sidebar" : ""}>
                            <ListContainer
                                className={classNames(
                                    "propertyResults",
                                    listMapVariables.sideBarClass,
                                    listMapVariables.carouselClass,
                                    listMapVariables.sideBarCollapsedClass
                                )}
                                style={
                                    isPrerender
                                        ? { display: "block !important" }
                                        : {}
                                }
                            >
                                <List
                                    key="listmap-list"
                                    context={context}
                                    setMapState={mapStateHandler}
                                    listCollapsed={listCollapsed}
                                    shouldTriggerScroll={shouldTriggerScroll}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                    sortBarRef={sortBarRef}
                                    modal={modal}
                                    error={error}
                                    language={language}
                                    sortChangeCallback={sortChange}
                                    spinAfterTransition={spinAfterTransition}
                                    listMapVariables={listMapVariables}
                                    r4={r4}
                                    {...other}
                                />
                                {r4 && !breakpoints.isTabletAndDown && (
                                    <ListPageBar
                                        context={context}
                                        r4={r4}
                                        includeRecordsPerPage={
                                            r4 ? true : false
                                        }
                                    />
                                )}
                            </ListContainer>
                        </SidebarContainer>
                    )}
                    {
                        (r4 && breakpoints.isTabletAndDown && currentMobileView === 'filters') && 
                            <MobileFilterView context={context} filterChangeCallback={mobileFilterChange} />
                    }
                    </ListMapContainer>
                <ContactFormWrapper
                    className={"listmap-modal"}
                    modal={modal.getModal("contact")}
                    source={'PLP'}
                />
                <ShareModal
                    className="listmap-modal"
                    {...modal.getModal("share")}
                />
                {document.body.classList.contains("redirect") && (
                    <RedirectModal
                        className="redirect-modal"
                        config={props.config}
                        isShown={
                            props.config.searchConfig.searchResultsPage &&
                            !props.config.features.redirect
                        }
                        {...modal.getModal("redirect")}
                    />
                )}
                
            </PLPContainer>
            {/********************** sticky content *************************************/}
            {r4 &&
                breakpoints.isTabletAndDown &&
                (currentMobileView === "list" ||
                    currentMobileView === "map") && (
                    <PLPToggleButton
                        buttonLabel={toggleButtonLabel}
                        clickHandler={mobileToggle}
                    />
            )}
            {mobileMapPopover && mobileMapPopover.active && (
                <MobileInfoWindow>
                    <InfoWindowComponentR4
                        marker={mobileMapPopover}
                        context={context}
                        handleClick={null}
                        handleMouseOver={null}
                        handleMouseOut={null}
                        spaPath={context.spaPath}
                        siteType={window.cbreSiteType}
                        isMobile={breakpoints.isTabletAndDown}
                    />
                </MobileInfoWindow>
            )}
            <PageMetaData
                searchType={searchType}
                canonicalParams={['location']}
            />
        </MobileContainer>
    );
};

const ListContainer = styled.div``;

const MobileInfoWindow = styled.div`
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: center;
    z-index: 11;
`;

export default responsiveContainer(modalContainer(PaginatedListMap));
