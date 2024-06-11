import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormGroup, Button } from '../../../external-libraries/agency365-components/components';
import Select_R3 from '../../external/agency365-components/Select/Select.r3';
import trackingEvent from '../../../utils/trackingEvent';
import TranslateString from '../../../utils/TranslateString';
import Filters_R3 from '../Filters/index';
import { clone } from 'lodash';
import createQueryString from '../../../utils/createQueryString';
import ListControlBar from '../../../list-map-components/PaginatedListMap/components/ControlBar.jsx';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.toggleFilterArea = this.toggleFilterArea.bind(this);
        this.closeFilterAreaWhenOpen = this.closeFilterAreaWhenOpen.bind(this);
        this.clickOutSideHandler = this.clickOutSideHandler.bind(this);
        this.setClickOutsideHandler = this.setClickOutsideHandler.bind(this);
        this.fullScreenSticky = props.fullScreenSticky;

        this.state = {
            isFilterAreaCollapsed: true,
            favouritesActive: false,
            favouritesCount: 0,
            hideThirdFilter: false,
            subNavStickyTop: null
        };
    }

    componentDidMount() {
        this.setClickOutsideHandler(true);
        this.context.stores.FavouritesStore.onChange(
            'FAVOURITES_UPDATED',
            this.updateFavourites
        );
        this.context.stores.FavouritesStore.onChange(
            'TOGGLE_FAVOURITES',
            this.updateFavourites
        );

        const features = this.context.stores.ConfigStore.getItem('features');
        if (features && features.enableFavourites) {
            this.context.actions.updateFavourites();
        }

        if (features && features.hideThirdFilter) {
            this.setState({ hideThirdFilter: true });
        }
    }

    componentWillMount() {
        if (this.fullScreenSticky) {
            const { stores } = this.context;  
            const features = stores.ConfigStore.getItem('features');
            if (features.dynamicStickySearchBar) {
                var doesNavExist = document.querySelector('main nav.secondary-nav');
                if (doesNavExist) {
                    this.setState({ subNavStickyTop: doesNavExist.offsetHeight + 'px' });
                } else {
                    this.setState({ subNavStickyTop: '0px' });
                }
            }
        }
    }

    componentWillUnmount() {
        this.setClickOutsideHandler(false);
        this.context.stores.FavouritesStore.off(
            'FAVOURITES_UPDATED',
            this.updateFavourites
        );
        this.context.stores.FavouritesStore.off(
            'TOGGLE_FAVOURITES',
            this.updateFavourites
        );
    }

    _getSearchUrl = type => {
        const { stores } = this.context;

        const features = stores.ConfigStore.getItem('features');

        var searchPage = stores.SearchStateStore.getItem('searchResultsPage'),
            params = clone(stores.ParamStore.getParams()),
            _sm = stores.ConfigStore.getItem('searchMode');

        // Add the search mode to the params object
        if (_sm) {
            params.searchMode = _sm;
        }

        // If this is a multicountry search remove lat, lon and radius and add polygons
        if (this.state.searchMode === 'polygon') {
            delete params.lat;
            delete params.lon;
            delete params.radius;
            params.polygons = JSON.stringify(this.selectedPolygons);
        }

        params.aspects = type;
        delete params.usageType;

        if (stores.ParamStore.getParam('searchRadius')) {
            params.radius = stores.ParamStore.getParam('searchRadius');
        }

        if (stores.SearchStateStore.getItem('currentPlaceId')) {
            params.placeId = stores.SearchStateStore.getItem('currentPlaceId');
        }

        if(features.resetAspects) {
            return searchPage;
        }

        if (features.clearFilterPropTypeNav) {
            const minimalParams = (({ aspects }) => ({ aspects }))(params);
            return searchPage + createQueryString(minimalParams);
        }

        return searchPage + createQueryString(params);
    };


    updateSearchPathValue = newPath => {
        const { stores, actions } = this.context;
        const path = typeof newPath === 'string' ? newPath : newPath.value;
        stores.SearchStateStore.setItem('searchResultsPage', path);
        let siteType = stores.SearchStateStore.getItem('searchType');

        trackingEvent('propertyTypeChange', {}, stores, actions);
        window.location.assign(this._getSearchUrl(siteType));
    };

    toggleFilterArea(e, forceClose) {
        e.preventDefault();

        if (this.props.disabled) {
            return;
        }

        const { isFilterAreaCollapsed } = this.state;

        this.setState({
            isFilterAreaCollapsed: forceClose || !isFilterAreaCollapsed
        });
    }

    closeFilterAreaWhenOpen = () => {
        if (!this.state.isFilterAreaCollapsed) {
            this.setState({
                isFilterAreaCollapsed: true
            });
        }
    };

    setClickOutsideHandler(enable) {
        if (enable) {
            document.addEventListener('click', this.clickOutSideHandler);
        } else {
            document.removeEventListener('click', this.clickOutSideHandler);
        }
    }

    clickOutSideHandler(e) {
        var array = [];

        for (var element = e.target; element; element = element.parentNode) {
            array.push(element.classList);
        }

        const clickedInside = !!array.find(
            classList => classList && classList.contains('cbre_dropdown')
        );
        const clickedFilterLink = !!array.find(
            classList =>
                classList &&
                classList.contains('ribbon_item_link') &&
                classList.contains('cbre_dropdown_link')
        );

        if (!clickedInside && !clickedFilterLink) {
            this.closeFilterAreaWhenOpen();
        }
    }

    updateFavourites = () => {
        const {
            stores: { FavouritesStore }
        } = this.context;

        const params = this.context.stores.ParamStore.getParams();

        this.setState({
            favouritesCount: FavouritesStore.getCount(),
            favouritesActive: (params.isFavourites && params.isFavourites === 'true') || params.isFavourites === true
        });
    };

    toggleFavourites = e => {
        e.preventDefault();

        const { actions, router, location, stores } = this.context;

        const { favouritesActive } = this.state;

        const searchParams = stores.ParamStore.getParams();

        const routing = {
            router,
            path: location.pathname,
            searchParams
        };

        let event = 'viewedFavourites';
        // Toggle favourites and search state.
        if (!favouritesActive) {
            stores.ParamStore.setParam('isFavourites', true);
            actions.toggleFavourites(true, routing);
        } else {
            actions.toggleFavourites(false, routing);
            if ( stores.ParamStore.getParam('isFavourites') === 'true') {
                stores.SearchStateStore.setItem('isFavourites',false);
                stores.ParamStore.setParam('propertyId',null);
            }         
            stores.ParamStore.deleteParam('isFavourites');
            actions.resetProperties();
        }

        trackingEvent(event, {}, stores, actions);
    };

    render() {
        const {
            activeTab,
            setTabViewFunc,
            resetSearch,
            onInitCallback,
            breakpoints: {
                isMobile,
                isTabletAndUp,
                isTabletLandscapeAndUp,
                isDesktop
            },
            disabled,
            omitFilters,
            omitSearch
        } = this.props;

        const { favouritesActive, favouritesCount } = this.state;

        const { stores, language } = this.context;

        let lmLocationFilter;
        let lmLocationFilter_dropped;
        let lmPrimaryFilter;
        let lmPrimaryFilter_dropped;
        let verticalSelector;
        let verticalSelector_dropped;

        const isNonGeo = stores.ParamStore.getParam('searchMode') === 'nonGeo';
        var searchPage = stores.SearchStateStore.getItem('searchResultsPage');
        let favouritesButton = null;
        let filtersButtonLabel;
        const features = stores.ConfigStore.getItem('features');
        let showPathSelector = false;
        var paths = stores.SearchStateStore.getItem('searchPathSelector');

        // Dont render filters markup if none are set in config.
        if (
            stores.SearchStateStore.getItem('useSearchPathSelector') &&
            typeof paths !== 'undefined' &&
            paths &&
            paths.length
        ) {
            showPathSelector = true;
        }

        let favouritesButtonText = (
            <div className="inactiveText">
                {language.ViewFavourites}
                <span className="cbre_count_container">
                    (<span className="cbre_count">{favouritesCount}</span>)
                </span>
            </div>
        );

        const r4 = window.cbreSiteTheme === 'commercialr4' ? true : false;
        const favImageMobileIcon = r4 ?
            'https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-favorite-icon-dark.png'
            :
            'https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-star-nav.png';
        const favImageDesktopIcon = r4 ? 
            'https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-favorite-icon-dark.png' 
            : 
            'https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-star-filterbar.png';

        // if favorites are allowed, but not selected by the user, create a favorites button
        if (features && features.enableFavourites && !favouritesActive) {

            const favoriteIconMobile = <img alt="Toggle Favorites" src={favImageMobileIcon} />;
            const favoriteIconDesktop = <img alt="Toggle Favorites" src={favImageDesktopIcon} />;

            if (!omitFilters) {
                favouritesButton = <li className="ribbon_item ribbon_item__favourite">
                    <a
                        href="#"
                        onClick={this.toggleFavourites}
                        className={classNames(
                            'cbre_button',
                            'cbre_button__favourite',
                            'ribbon_item_link',
                            'is_not_selected'
                        )}
                    >
                        <span className="favorite-icon-mobile">
                            {favoriteIconMobile}
                            {favouritesCount > 0 && <div className="mobile-favorites-circle"><span className="mobile-favorites-text">{favouritesCount}</span></div>}
                        </span>
                        <span className="favorite-icon-desktop">
                            {favoriteIconDesktop}
                        </span>
                        <span className="cbre_button_text hide-lg-down">
                            {favouritesButtonText}
                        </span>
                    </a>
                </li>;
            }
        }

        // favorites are selected, so we'll create a non clickable space instead of a clickable button
        if (favouritesActive) {

            const favoriteIcon = <img src='https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-star-nav.png' />;

            if (!omitFilters) {
                favouritesButton = <li className="ribbon_item ribbon_item__favourite">
                    <div className={classNames(
                        'cbre_button__favourite',
                        'ribbon_item_link',
                        'is_selected',
                        'mobile-tab-selected'
                    )}>
                        <span className="favorite-icon-mobile">
                            {favoriteIcon}
                        </span>
                        <span className="favorite-icon-desktop">
                            {favoriteIcon}
                        </span>
                        <span className="cbre_button_text hide-lg-down">
                            {favouritesButtonText}
                        </span>
                    </div>
                </li>;
            }
        }

        // hide-sm-down
        if (!isMobile) {
            if (!isNonGeo) {
                lmLocationFilter = (
                    <div className="ribbon_item ribbon_item_divider">
                        <Filters_R3
                            type="auto"
                            view="map-list"
                            placement="lm_locationFilter"
                            showLabel={false}
                            disabled={disabled}
                            filterChangeCallback={this.props.filterChangeCallback}
                        />
                    </div>
                );
            }

            verticalSelector = showPathSelector && (
                <div className="ribbon_item ribbon_item_divider">
                    <Select_R3
                        id="path-selector"
                        key="path-selector"
                        name="path-selector"
                        disabled={disabled}
                        ref={ref => {
                            this.selectPath = ref;
                        }}
                        className="Select Select--single"
                        value={paths.find(
                            path => path.value === searchPage
                        )}
                        placeholder={language.searchPathSelectorLabel}
                        onChange={this.updateSearchPathValue}
                        onMouseOverClass="is-focused"
                        optionsArray={paths}
                        optionClass="Select-value"
                        outerClass="Select-menu-outer"
                        placeholderClass="Select-placeholder"
                        selectArrowZoneClass="Select-arrow-zone"
                        selectArrowClass="Select-arrow"
                        selectValueClass="Select-value-label"
                        selectMenuClass="Select-menu"
                        selectOptionClass="Select-option"
                        selectControlClass="Select-control"
                        selectInputClass="Select-input"
                        showLabel={false}
                        sortAlphabetical={features && features.searchPathSortAlphabetical}
                    />
                </div>
            );

            lmPrimaryFilter = (
                <li className="ribbon_item ribbon_item_divider">
                    <Filters_R3
                        type="auto"
                        view="map-list"
                        placement="lm_primaryFilter"
                        showLabel={false}
                        disabled={disabled}
                        filterChangeCallback={this.props.filterChangeCallback}
                    />
                </li>
            );

            filtersButtonLabel = (
                <span>
                    <TranslateString string="LMfilterTabButtonText" />
                </span>
            );
        } else {
            if (!isNonGeo) {
                lmLocationFilter_dropped = (
                    /* Radius filter*/
                    <Filters_R3
                        type="auto"
                        view="map-list"
                        placement="lm_locationFilter"
                        isFormGroup
                        disabled={disabled}
                        filterChangeCallback={this.props.filterChangeCallback}
                    />
                );

                verticalSelector_dropped = showPathSelector && (
                    <FormGroup
                        legend={language.searchPathSelectorLabel}
                        key="path-selector-group"
                    >
                        <Select_R3
                            key="path-selector"
                            name="path-selector"
                            className="Select Select--single"
                            value={paths.find(
                                path => path.value === searchPage
                            )}
                            placeholder={language.searchPathSelectorLabel}
                            onChange={this.updateSearchPathValue}
                            onMouseOverClass="is-focused"
                            optionsArray={paths}
                            optionClass="Select-value"
                            outerClass="Select-menu-outer"
                            placeholderClass="Select-placeholder"
                            selectArrowZoneClass="Select-arrow-zone"
                            selectArrowClass="Select-arrow"
                            selectValueClass="Select-value-label"
                            selectMenuClass="Select-menu"
                            selectOptionClass="Select-option"
                            selectControlClass="Select-control"
                            selectInputClass="Select-input"
                            showLabel={false}
                        />
                    </FormGroup>
                );
            }

            lmPrimaryFilter_dropped = (
                /* Price filter*/
                <Filters_R3
                    type="auto"
                    view="map-list"
                    placement="lm_primaryFilter"
                    isFormGroup
                    disabled={disabled}
                    filterChangeCallback={this.props.filterChangeCallback}
                />
            );
        }

        let tabs = [];
        let lmSortFilter_dropped;
        // hide-md
        if (!isTabletAndUp) {
            let key = 'listTab';
            let ribbonItemClass = 'ribbon_item__list ribbon_item_divider';
            let ribbonItemLinkClass = 'ribbon_item_link__list';
            let expectedActiveTab = 'list';
            let mobileViewIcon = <img alt="List" src='https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-list.png' />;

            if (activeTab === 'list') {
                key = 'mapTab';
                ribbonItemClass = 'ribbon_item__map ribbon_item_divider';
                ribbonItemLinkClass = 'ribbon_item_link__map';
                expectedActiveTab = 'map';
                mobileViewIcon = <img alt="Map" src='https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-map.png' />;
            }

            tabs.push(
                <li
                    key={key}
                    className={classNames('ribbon_item', ribbonItemClass)}
                >
                    <div
                        className={classNames(
                            'ribbon_item_link',
                            ribbonItemLinkClass,
                            activeTab === expectedActiveTab || !this.state.isFilterAreaCollapsed || favouritesActive
                                ? 'is_not_selected'
                                : 'is_selected mobile-tab-selected',
                            disabled ? 'is-disabled :disabled' : ''
                        )}
                        onClick={() => setTabViewFunc(expectedActiveTab)}
                    >
                        {mobileViewIcon}
                    </div>
                </li>
            );

            lmSortFilter_dropped = favouritesActive ? null : (
                /* Sort filter*/
                <Filters_R3
                    type="auto"
                    view="map-list"
                    placement="lm_sortFilter"
                    isFormGroup
                    disabled={disabled}
                    filterChangeCallback={this.props.filterChangeCallback}
                />
            );
        }

        const searchField = favouritesActive ? (
            (() => {
                onInitCallback(true);
                return (
                    <div className="cbre_favourites-title">
                        {language.FavouritesViewTitle}
                    </div>
                );
            })()
        ) : (
                <Filters_R3
                    renderSearch={true}
                    breakpoints={this.props.breakpoints}
                    onInitCallback={onInitCallback}
                    view="map-list"
                    disabled={disabled}
                    filterChangeCallback={this.props.filterChangeCallback}
                />
            );

        let lmSecondaryFilter;
        let lmSecondaryFilter_dropped;
        // hide-md-down
        if (isTabletLandscapeAndUp) {
            lmSecondaryFilter = (
                <li className="ribbon_item ribbon_item_divider">
                    <Filters_R3
                        type="auto"
                        view="map-list"
                        placement="lm_secondaryFilter"
                        showLabel={false}
                        disabled={disabled}
                        filterChangeCallback={this.props.filterChangeCallback}
                    />
                </li>
            );
        } else {
            lmSecondaryFilter_dropped = (
                /* Bedrooms filter*/
                <Filters_R3
                    type="auto"
                    view="map-list"
                    placement="lm_secondaryFilter"
                    isFormGroup
                    disabled={disabled}
                    filterChangeCallback={this.props.filterChangeCallback}
                />
            );
        }

        const dropdownMarkup = this.state.isFilterAreaCollapsed ? null : (
            <div className={"cbre_dropdown is_open" + (isMobile ? '' : ' is_fullWidth')}>
                <div className="cbre_dropdown_body">
                    <div className="cbre_container">
                        {verticalSelector_dropped}

                        {lmLocationFilter_dropped}

                        {lmPrimaryFilter_dropped}

                        {lmSecondaryFilter_dropped}

                        {lmSortFilter_dropped}

                        {/* Additional filter */}
                        <Filters_R3
                            type="auto"
                            view="map-list"
                            placement="lm_tertiaryFilters"
                            isFormGroup
                            disabled={disabled}
                            filterChangeCallback={this.props.filterChangeCallback}
                        />

                        {/* Group filters */}

                        {!this.state.hideThirdFilter &&
                            <Filters_R3
                                type="auto"
                                view="map-list"
                                placement="lm_groupFilters"
                                isFormGroup
                                isCollapsible
                                disabled={disabled}
                                filterChangeCallback={this.props.filterChangeCallback}
                            />
                        }
                    </div>
                </div>
                <div className="cbre_dropdown_footer">
                    <div className="cbre_container">
                        <div className="row">
                            <div className="col-xs-6 col-sm-2 pull-right">
                                <Button
                                    onClick={e => this.toggleFilterArea(e)}
                                    className="cbre_button cbre_button__primary cbre_button__small"
                                >
                                    <TranslateString string="LMDoneFilterButtonText" />
                                </Button>
                            </div>
                            <div className="col-xs-6 col-sm-2 pull-right">
                                <Button
                                    className="cbre_button cbre_button__secondary cbre_button__small"
                                    onClick={resetSearch}
                                >
                                    <TranslateString string="LMClearFilterButtonText" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        const searchBarMarkup =
            favouritesActive ? (
                <ul className="searchBar_ribbon">
                    <li className="ribbon_itemGroup">
                        <div className="ribbon_item">
                            <a
                                href="#"
                                onClick={this.toggleFavourites}
                                className={classNames(
                                    'cbre_button',
                                    'cbre_button__favourite',
                                    'favorites_return_to_results',
                                    'ribbon_item_link',
                                    'favorites-back-text'
                                )}
                            >
                                <span className="favorites-back-icon">
                                    <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-arrow-left.png" />
                                </span>
                                <span className="cbre_button_text">
                                    <TranslateString string="SearchResultsButtonText" />
                                </span>
                            </a>
                        </div>
                    </li>
                    <li className="ribbon_item">
                        {favouritesButton}
                    </li>
                </ul>
            )
                :
                (
                    <ul className="searchBar_ribbon">
                        {!omitSearch && (
                            <li className="ribbon_itemGroup">
                                <div className={classNames('ribbon_item ribbon_item__location ribbon_item_divider',
                                    disabled ? 'is-disabled :disabled' : ''
                                )}>
                                    <span className="search-icon-mobile">
                                        <img alt="Search This Location" src='https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-search.png' />
                                    </span>
                                    <span className="search-icon-desktop">
                                        <img alt="Search This Location" src={r4 ? 'https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-search-icon.png' 
                                            : 'https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-search.png'} />
                                    </span>
                                    {searchField}
                                </div>
                                { lmLocationFilter}
                                { verticalSelector}
                            </li>
                        )}

                        {!omitFilters && (
                            <div className="ribbon_item">
                                {tabs}
                                {lmPrimaryFilter}
                                {lmSecondaryFilter}
                                <li className={classNames('ribbon_item ribbon_item__filters', this.state.hideThirdFilter ? 'hide-third-filter' : '')}>
                                    <a
                                        href=""
                                        onClick={e => this.toggleFilterArea(e)}
                                        className={classNames(
                                            'ribbon_item_link cbre_dropdown_link ribbon_item_divider cbre_button__toggle_filter_area',
                                            !this.state.isFilterAreaCollapsed
                                                ? 'is_selected mobile-tab-selected'
                                                : 'is_not_selected',
                                            disabled ? 'is-disabled :disabled' : ''
                                        )}
                                    >
                                        {filtersButtonLabel}
                                        <span className="filter_icon_mobile">
                                            <img alt="Filters" src='https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/m-icon-filter.png' />
                                        </span>
                                    </a>
                                </li>
                                {favouritesButton}
                            </div>
                        )}
                    </ul>
                );

        return (
            <div className='searchBar' style={this.state.subNavStickyTop ? { top: this.state.subNavStickyTop } : {}}>
                { searchBarMarkup}
                {!omitFilters &&
                    (<div>
                        { dropdownMarkup}
                    </div>)
                }
                { this.props.includeControlBar && 
                    <ListControlBar 
                        context={this.context} 
                        language={this.props.language} 
                        listMapVariables={this.props.listMapVariables} 
                        share={true} sort={true} 
                        view={true} 
                        modal={this.props.modal} 
                        includePagingControls={true}
                        sortChangeCallback={this.props.sortChangeCallback} />
                }
            </div>
        );
    }
}

SearchBar.propTypes = {
    setTabViewFunc: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    breakpoints: PropTypes.object,
    disabled: PropTypes.bool,
    favoritesCount: PropTypes.number,
    fullScreenSticky: PropTypes.bool,
    includeControlBar: PropTypes.bool,
    listMapVariables: PropTypes.object,
    modal: PropTypes.object,
    filterChangeCallback: PropTypes.func,
    sortChangeCallback: PropTypes.func,
    language: PropTypes.object
};

SearchBar.defaultProps = {
    onInitCallback: () => { }
};

SearchBar.contextTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object,
    router: PropTypes.object,
    location: PropTypes.object,
    language: PropTypes.object
};

export default SearchBar;
