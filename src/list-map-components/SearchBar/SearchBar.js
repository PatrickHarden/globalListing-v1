import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select, FontIcon, FormGroup, Button } from '../../external-libraries/agency365-components/components';
import trackingEvent from '../../utils/trackingEvent';
import TranslateString from '../../utils/TranslateString';
import Filters from '../../components/Filters';
import ReactSelect from 'react-select';
import { clone } from 'lodash';
import createQueryString from '../../utils/createQueryString';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.toggleFilterArea = this.toggleFilterArea.bind(this);
        this.closeFilterAreaWhenOpen = this.closeFilterAreaWhenOpen.bind(this);
        this.clickOutSideHandler = this.clickOutSideHandler.bind(this);
        this.setClickOutsideHandler = this.setClickOutsideHandler.bind(this);

        this.state = {
            isFilterAreaCollapsed: true,
            favouritesActive: false,
            favouritesCount: 0,
            hideThirdFilter: false,
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

        if(features.clearFilterPropTypeNav) {
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

        this.setState({
            favouritesCount: FavouritesStore.getCount(),
            favouritesActive: FavouritesStore.isActive()
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
            actions.toggleFavourites(true, routing);
        } else {
            event = 'exitedFavourites';
            actions.toggleFavourites(false, routing);
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

        if (features && features.enableFavourites) {
            let favouritesButtonText = (
                <span className="inactiveText">
                    {language.ViewFavourites}
                    <span className="cbre_count_container">
                        (<span className="cbre_count">{favouritesCount}</span>)
                    </span>
                </span>
            );
            let favouritesActiveClass;
            if (favouritesActive) {
                favouritesButtonText = (
                    <span className="activeText">{language.BackToSearch}</span>
                );
                favouritesActiveClass = favouritesActive ? 'is_selected' : '';
            }
            const isHighlitedClass =
                favouritesCount > 0 ? 'is_highlighted' : '';
            const mobileCount =
                favouritesCount > 0 && !isDesktop ? favouritesCount : null;

            if (!omitFilters) {
                favouritesButton = (
                    <li className="ribbon_item ribbon_item__favourite">
                        <a
                            href="#"
                            onClick={this.toggleFavourites}
                            className={classNames(
                                'cbre_button',
                                'cbre_button__favourite',
                                'ribbon_item_link',
                                favouritesActiveClass,
                                isHighlitedClass
                            )}
                        >
                            <span className="cbre_iconCount">
                                {mobileCount}
                            </span>
                            <span className="cbre_button_text hide-lg-down">
                                {favouritesButtonText}
                            </span>
                        </a>
                    </li>
                );
            }
        }

        // hide-sm-down
        if (!isMobile) {
            if (!isNonGeo) {
                lmLocationFilter = (
                    <div className="ribbon_item">
                        <Filters
                            type="auto"
                            view="map-list"
                            placement="lm_locationFilter"
                            showLabel={false}
                            disabled={disabled}
                        />
                    </div>
                );
            }

            verticalSelector = showPathSelector && (
                <div className="ribbon_item">
                    <ReactSelect
                        id="path-selector"
                        name="path-selector"
                        ref={ref => {
                            this.selectPath = ref;
                        }}
                        className="path-selector"
                        searchable={false}
                        clearable={false}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        simpleValue
                        options={paths}
                        value={searchPage}
                        onChange={this.updateSearchPathValue}
                    />
                </div>
            );

            lmPrimaryFilter = (
                <li className="ribbon_item">
                    <Filters
                        type="auto"
                        view="map-list"
                        placement="lm_primaryFilter"
                        showLabel={false}
                        disabled={disabled}
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
                    <Filters
                        type="auto"
                        view="map-list"
                        placement="lm_locationFilter"
                        isFormGroup
                        disabled={disabled}
                    />
                );

                verticalSelector_dropped = showPathSelector && (
                    <FormGroup
                        legend={language.searchPathSelectorLabel}
                        key="path-selector-group"
                    >
                        <Select
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
                            sortAlphabetical={features && features.searchPathSortAlphabetical}
                        />
                    </FormGroup>
                );
            }

            lmPrimaryFilter_dropped = (
                /* Price filter*/
                <Filters
                    type="auto"
                    view="map-list"
                    placement="lm_primaryFilter"
                    isFormGroup
                    disabled={disabled}
                />
            );
        }

        let tabs = [];
        let lmSortFilter_dropped;
        // hide-md
        if (!isTabletAndUp) {
            let key = 'listTab';
            let ribbonItemClass = 'ribbon_item__list';
            let ribbonItemLinkClass = 'ribbon_item_link__list';
            let expectedActiveTab = 'list';

            if (activeTab === 'list') {
                key = 'mapTab';
                ribbonItemClass = 'ribbon_item__map';
                ribbonItemLinkClass = 'ribbon_item_link__map';
                expectedActiveTab = 'map';
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
                            activeTab === expectedActiveTab
                                ? 'is_not_selected'
                                : 'is_selected'
                        )}
                        onClick={() => setTabViewFunc(expectedActiveTab)}
                    />
                </li>
            );

            lmSortFilter_dropped = favouritesActive ? null: (
                /* Sort filter*/
                <Filters
                    type="auto"
                    view="map-list"
                    placement="lm_sortFilter"
                    isFormGroup
                    disabled={disabled}
                />
            );
        }

        const searchField = stores.SearchStateStore.getAll().isFavourites ? (
            (() => {
                onInitCallback(true);
                return (
                    <div className="cbre_favourites-title">
                        {language.FavouritesViewTitle}
                    </div>
                );
            })()
        ) : (
            <Filters
                renderSearch={true}
                breakpoints={this.props.breakpoints}
                onInitCallback={onInitCallback}
                view="map-list"
                disabled={disabled}
            />
        );

        let lmSecondaryFilter;
        let lmSecondaryFilter_dropped;
        // hide-md-down
        if (isTabletLandscapeAndUp) {
            lmSecondaryFilter = (
                <li className="ribbon_item">
                    <Filters
                        type="auto"
                        view="map-list"
                        placement="lm_secondaryFilter"
                        showLabel={false}
                        disabled={disabled}
                    />
                </li>
            );
        } else {
            lmSecondaryFilter_dropped = (
                /* Bedrooms filter*/
                <Filters
                    type="auto"
                    view="map-list"
                    placement="lm_secondaryFilter"
                    isFormGroup
                    disabled={disabled}
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
                        <Filters
                            type="auto"
                            view="map-list"
                            placement="lm_tertiaryFilters"
                            isFormGroup
                            disabled={disabled}
                        />

                        {/* Group filters */}
                        <Filters
                            type="auto"
                            view="map-list"
                            placement="lm_groupFilters"
                            isFormGroup
                            isCollapsible
                            disabled={disabled}
                        />
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

        return (
            <div className="searchBar">
                <ul className="searchBar_ribbon">
                    {!omitSearch && (
                    <li className="ribbon_itemGroup">
                        <div className="ribbon_item ribbon_item__location">
                            { searchField }
                        </div>
                            { lmLocationFilter }
                            { verticalSelector }
                    </li>
                    )}

                    {!omitFilters && (
                        <div className="ribbon_item">
                            {tabs}
                            {lmPrimaryFilter}
                            {lmSecondaryFilter}
                            {!this.state.hideThirdFilter && (                            
                                <li className="ribbon_item ribbon_item__filters">
                                    <a
                                        href=""
                                        onClick={e => this.toggleFilterArea(e)}
                                        className={classNames(
                                            'ribbon_item_link cbre_dropdown_link cbre_button__toggle_filter_area',
                                            !this.state.isFilterAreaCollapsed
                                                ? 'is_selected'
                                                : '',
                                            disabled ? 'is-disabled' : ''
                                        )}
                                    >
                                        {filtersButtonLabel}
                                        <FontIcon
                                            className="cbre_icon"
                                            iconName="icon_filter"
                                        />
                                    </a>
                                </li>
                            )}
                            {favouritesButton}
                        </div>
                    )}
                </ul>

                {!omitFilters && 
                    (<div>
                        { dropdownMarkup }
                    </div>)
                }

            </div>
        );
    }
}

SearchBar.propTypes = {
    setTabViewFunc: PropTypes.func.isRequired,
    activeTab: PropTypes.string.isRequired,
    breakpoints: PropTypes.object,
    disabled: PropTypes.bool
};

SearchBar.defaultProps = {
    onInitCallback: () => {}
};

SearchBar.contextTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object,
    router: PropTypes.object,
    location: PropTypes.object,
    language: PropTypes.object
};

export default SearchBar;
