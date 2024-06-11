const PropTypes = require('prop-types');
var React = require('react'),
    StoresMixin = require('../../../mixins/StoresMixin'),
    LanguageMixin = require('../../../mixins/LanguageMixin'),
    ComponentPathMixin = require('../../../mixins/ComponentPathMixin')(__dirname),
    ApplicationActionsMixin = require('../../../mixins/ApplicationActionsMixin'),
    TrackingEventMixin = require('../../../mixins/TrackingEventMixin'),
    searchRegions = require('../../../utils/searchRegions'),
    paramMap = require('../../../utils/paramMap'),
    checkConditional = require('../../../utils/checkConditional'),
    $ = require('jQuery'),
    EventButton = require('../../../components/EventButton'),
    Spinner = require('react-spinner'),
    _ = require('lodash'),
    MapSearch = require('../../../components/Filters/MapSearch'),
    Select_R4 = require('../../external/agency365-components/Select/Select.r4'),
    RangeFilter = require('../../../components/Filters/Range'),
    Input = require('../../../components/Filters/Input'),
    //Toggle = require('./Toggle'),
    MultiSelect = require('../../../components/Filters/MultiSelect'),
    isExtendedPolygonReady = require('../../../utils/isExtendedPolygonReady');
var createReactClass = require('create-react-class');
var MapSearchMixin = require('../../../mixins/MapSearchMixin');
import ToggleFilter from '../../../components/Filters/Toggle';
import createQueryString from '../../../utils/createQueryString';
import Filter_R4 from '../Filter/Filter.r4';
import PolygonSearch from '../../../list-map-components/PolygonSearch/PolygonSearch';
import trackingEvent from '../../../utils/trackingEvent';
import normalizeSearchType from '../../../utils/normalizeSearchType';
import normalizeSearchTypeExtended from '../../../utils/normalizeSearchTypeExtended';

var FiltersR4 = createReactClass({
    displayName: 'FiltersR4',

    mixins: [
        StoresMixin,
        LanguageMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        TrackingEventMixin,
        MapSearchMixin
    ],

    propTypes: {
        placement: PropTypes.string,
        renderSearch: PropTypes.bool,
        type: PropTypes.string,
        submitBtn: PropTypes.bool,
        isStandalone: PropTypes.bool,
        view: PropTypes.string,
        isFormGroup: PropTypes.bool,
        isCollapsible: PropTypes.bool,
        showLabel: PropTypes.bool,
        disabled: PropTypes.bool,
        filterChangeCallback: PropTypes.func,
        onSuggestSelect: PropTypes.func,
        onInputChange: PropTypes.func
    },

    contextTypes: {
        router: PropTypes.object,
        spaPath: PropTypes.object,
        location: PropTypes.object
    },

    getInitialState: function() {
        return {
            loading: !this.getParamStore().getParamsState(),
            params: this.getParamStore().getParams()
        };
    },

    componentDidMount: function() {
        this.getParamStore().onChange('PARAMS_UPDATED', this._updateFilters);
        // Required to listen and wait for Google to give an initial autocomplete
        // recommendation and update the SearchStore.
        // This allows us to force an update on the filters state and then remove this listener
        // (as seen in this._mapSearchInitialRenderReady).
        if (this.getSearchStateStore().getItem('searchLocationName')) {
            this.getSearchStateStore().onChange(
                'SEARCH_STATE_UPDATED',
                this._mapSearchInitialRenderReady
            );
        }
    },

    componentWillUnmount: function() {
        this.getParamStore().off('PARAMS_UPDATED', this._updateFilters);
    },

    _mapSearchInitialRenderReady: function() {
        this.getSearchStateStore().off(
            'SEARCH_STATE_UPDATED',
            this._mapSearchInitialRenderReady
        );
        this._updateFilters();
    },

    _updateFilters: function() {
        //if (this.isMounted()) {
        var newState = {
            params: this.getParamStore().getParams(),
            loading: false
        };

        _.extend(newState, this.getMapSearchState());

        this.setState(newState);
        //}
    },

    _filterChanged: function(event, type, operator) {
        var tmpState = _.clone(this.state),
            mappedParam;
        if (event.target.dataset && event.target.dataset.primary) {

            for (var key in event.target.dataset) {
                if (
                    event.target.dataset.hasOwnProperty(key) &&
                    key !== 'reactid'
                ) {
                    var selected =
                        event.target.options[event.target.selectedIndex];
                        trackingEvent(
                            'filterChange',
                            {
                                filter: event.target.name,
                                filterValue: selected.dataset[key]
                            },
                            this.context.stores,
                            this.context.actions
                        );
                    mappedParam =
                        paramMap.hasParam(
                            tmpState.params,
                            event.target.dataset[key]
                        ) || event.target.dataset[key];
                    if (selected.dataset[key] !== undefined) {
                        tmpState.params[mappedParam] = selected.dataset[key];
                    } else {
                        delete tmpState.params[mappedParam];
                    }
                }
            }
        } else {
            switch (type) {
                case 'toggle':
                    mappedParam =
                        paramMap.hasParam(tmpState.params, event.target.name) ||
                        event.target.name;
                    // Get matching param from existing param store state or null if it doesn't exist
                    var param = tmpState.params[mappedParam] || null,
                        // If the param exists split it into an array or return an empty array
                        a = param ? param.split(operator) : [],
                        // Check if the filter value contains multiple items and if so convert to array
                        b =
                            event.target.value.search('\\'.concat(operator)) ===
                            -1
                                ? event.target.value
                                : event.target.value.split(operator),
                        newArray;

                    // If the previous step returned an array loop through and toggle each item otherwise toggle single item
                    if (Array.isArray(b)) {
                        b.forEach(function(e, i) {
                            a =
                                _.indexOf(a, b[i]) == -1
                                    ? _.union(a, [b[i]])
                                    : _.without(a, b[i]);
                        });
                        newArray = a;
                    } else {
                        newArray =
                            _.indexOf(a, b) == -1
                                ? _.union(a, [b])
                                : _.without(a, b);
                    }

                    // If the resulting array has exactly 1 item set string to that item, otherwise convert entire array to string
                    var newString =
                        newArray.length === 1
                            ? newArray[0]
                            : newArray.join(operator);

                    // If the final string is empty then delete the param entirely otherwise set the param value
                    tmpState.params[mappedParam] = newString || '';

                    trackingEvent(
                        'filterChange',
                        {
                            filter: event.target.name,
                            filterValue: tmpState.params[mappedParam]
                        },
                        this.context.stores,
                        this.context.actions
                    );
                    break;
                case 'bool':
                    mappedParam =
                        paramMap.hasParam(tmpState.params, event.target.name) ||
                        event.target.name;
                    if (tmpState.params[mappedParam] === event.target.value) {
                        if (event.target.checkAction === 'SWITCH') {
                            tmpState.params[mappedParam] =
                                event.target.uncheckedValue;
                        } else {
                            tmpState.params[mappedParam] = '';
                        }
                    } else {
                        tmpState.params[mappedParam] = event.target.value;
                    }
                    trackingEvent(
                        'filterChange',
                        {
                            filter: event.target.name,
                            filterValue: tmpState.params[mappedParam]
                        },
                        this.context.stores,
                        this.context.actions
                    );
                    break;
                default:
                        var _context = this.context;
                    if (_.isArray(event.target)) {
                        // multiple vals from one filter
                        _.each(event.target, function(p) {
                            mappedParam =
                                paramMap.hasParam(tmpState.params, p.name) ||
                                p.name;
                            if (p.value === '') {
                                delete tmpState.params[mappedParam];
                            } else {
                                tmpState.params[mappedParam] = p.value;
                            }
                            trackingEvent(
                                'filterChange',
                                {
                                    filter: p.name,
                                    filterValue: tmpState.params[mappedParam]
                                },
                                _context.stores,
                                _context.actions
                            );
                        });
                    } else {
                        mappedParam =
                            paramMap.hasParam(
                                tmpState.params,
                                event.target.name
                            ) || event.target.name;
                        tmpState.params[mappedParam] = event.target.value;

                        trackingEvent(
                            'filterChange',
                            {
                                filter: event.target.name,
                                filterValue: tmpState.params[mappedParam]
                            },
                            _context.stores,
                            _context.actions
                        );
                    }
            }
        }

        var isBoundingMode =
            this.getParamStore().getParam('searchMode') === 'bounding';
        var isRadiusZero = tmpState.params.radius === '0';

        // Retrieve location polygon if we're in bounding mode and the radius is moved from the search
        if (isBoundingMode && !isExtendedPolygonReady(tmpState.params)) {
            if (!isRadiusZero) {
                delete tmpState.params.radius;
            }

            tmpState.params.polygons =
                '[[' +
                this.getSearchStateStore().getItem('searchLocationPolygon')
                    .polygon +
                ']]';
        }

        this.setState(tmpState, function() {
            if (this.props.type === 'auto') {
                this._updateSearch();
            }
        });
    },

    _regionsSelected: function(regions) {
        var tmpState = _.clone(this.state);
        tmpState.params.polygons = JSON.stringify(searchRegions.parse(regions));

        this.setState(tmpState, function() {
            if (this.props.type === 'auto' || this.props.view === 'map-list') {
                this._updateSearch();
            }
        });
    },

    _updateSearch: function() {
        var searchResultsPage = this.getSearchStateStore().getItem(
                'searchResultsPage'
            ),
            remainOnCurrentListing = this.getSearchStateStore().getItem(
                'remainOnCurrentListing'
            ),
            spaPath = this.context.spaPath || {};

        this._fireEvent('searchPerformed', {
            searchParams: this.state.params
        });

        // If we're not on the sites default listings page redirect there
        if (
            !remainOnCurrentListing &&
            searchResultsPage &&
            searchResultsPage !== '/' &&
            spaPath.path.toLowerCase() !== searchResultsPage.toLowerCase()
        ) {
            delete this.state.params.searchMode;
            window.location.assign(
                searchResultsPage + createQueryString(this.state.params)
            );
        } else {
            this.getActions().setSearchStateItem('extendedSearch', false);
            this.getActions().setSearchStateItem('mapState', {});

            var params = Object.assign(
                {},
                this.getParamStore().getParams(),
                this.state.params
            );

            const newSearchType = normalizeSearchType(params['aspects']);
            if (newSearchType) {
                this.getActions().setSearchStateItem('searchType', newSearchType);
            }

            const newSearchTypeExtended = normalizeSearchTypeExtended(params['aspects']);
            if (newSearchTypeExtended) {
                this.getActions().setSearchStateItem('searchTypeExtended', newSearchTypeExtended);
            }

            if(this.props.filterChangeCallback){
                this.getActions().updateParams(this.context.location.pathname, params, this.context.router);
                this.props.filterChangeCallback(params);
            }else{
                this.getActions().updateProperties(
                    params,
                    this.getPropertyStore().isFetchAllMode(),
                    this.getPropertyStore().getPropertiesMap(),
                    this.context.location.pathname,
                    this.context.router
                );
            }
        }
    },

    _renderFilters: function(pl) {
        let _props = Object.assign({}, this.props);
        const { placement, view, disabled } = _props;

        delete _props.renderSearch;

        var i = 0, // Filter index
            ni = 0, // New (map-list) filter index
            _placement = pl || placement;

        var filters = this.getConfigStore().getItem('filters') || [];

        return filters.map(
            function(filter) {
                var filterNodes = [];
                if (view === 'map-list') {
                    const { params } = this.state;
                    const param =
                        params[filter.name] ||
                        params[filter.name.toLowerCase()] ||
                        null;
                    ni++;

                    filterNodes.push(
                        <Filter_R4
                            filter={filter}
                            currentValue={param}
                            filterIndex={ni}
                            onFilterChanged={this._filterChanged}
                            showLabel={false}
                            {..._props}
                            disabled={disabled}
                        />
                    );
                } else if (filter.placement === _placement) {
                    i++;

                    if (filter.type === 'group') {
                        if (!checkConditional(filter, this.state.params)) {
                            return;
                        }

                        var groupNodes = [];
                        for (
                            var count = 0;
                            count < filter.children.length;
                            count++
                        ) {
                            groupNodes.push(
                                this._renderFilter(
                                    filter.children[count],
                                    i + count
                                )
                            );
                        }

                        var label = null;

                        if (filter.label) {
                            label = (
                                <h5 className={'control-label'}>
                                    {filter.label}
                                </h5>
                            );
                        }

                        filterNodes.push(
                            <div className="cbre-filter-group">
                                {label}
                                {groupNodes}
                            </div>
                        );
                    } else {
                        filterNodes.push(this._renderFilter(filter, i));
                    }
                }

                return filterNodes;
            }.bind(this)
        );
    },

    _renderFilter: function(filter, i) {
        if (!checkConditional(filter, this.state.params)) {
            return;
        }

        var opts = {
                key: this.props.placement + '-filter-' + i,
                filter: filter,
                searchParams: this.state.params,
                handleFilterChange: this._filterChanged,
                disabled: this.props.disabled
            },
            filterComponent;

        switch (filter.type) {
            
            case 'range':
                filterComponent = <RangeFilter {...opts} />;
                break;
            case 'select':
                filterComponent = <Select_R4 {...opts} />;
                break;
            case 'toggle':
                filterComponent = <ToggleFilter {...opts} />;
                break;
            default:
                filterComponent = <Input {...opts} />;
        }

        return filterComponent;
    },

    _renderSearchComponent: function(_searchMode, searchLocationName) {
        const { view, disabled } = this.props;

        var polygons = this.getSearchStateStore().getItem('polygons'),
            paramPolygons = this.state.params.polygons || null,
            _jsx = [];

        // If we're in polygon search mode and polygons have been defined
        if (
            view !== 'map-list' &&
            (polygons && !$.isEmptyObject(polygons)) &&
            _searchMode === 'polygon'
        ) {
            let multiSelectFilter = searchRegions.get(polygons, paramPolygons);
            multiSelectFilter.label = this.context.language.PolygonSearchPlaceholder;
            multiSelectFilter.noResultsText = this.context.language.PolygonSearchNoResults;

            _jsx.push(
                <MultiSelect
                    handleFilterChange={this._regionsSelected}
                    filter={multiSelectFilter}
                    key="polygon-search-filter"
                    {...this.props}
                />
            );

            // If we're in nonGeo search mode and in map-list view
        } else if (_searchMode === 'nonGeo') {
            if (view === 'map-list' && searchLocationName) {
                _jsx = (
                    <p className="searchBar_location-placeholder">
                        {searchLocationName}
                    </p>
                );
            }
        } else {
            if (view === 'map-list') {
                if (_searchMode === 'polygon') {
                    let multiSelectFilter = searchRegions.get(
                        polygons,
                        paramPolygons
                    );
                    multiSelectFilter.label = this.context.language.PolygonSearchPlaceholder;
                    multiSelectFilter.noResultsText = this.context.language.PolygonSearchNoResults;

                    _jsx = (
                        <PolygonSearch
                            handleFilterChange={this._regionsSelected}
                            filter={multiSelectFilter}
                            key="polygon-search-filter"
                            disabled={disabled}
                            onInitCallback={this.props.onInitCallback}
                        />
                    );
                } else {
                    _jsx = (
                        <Filter_R4
                            onFilterUpdated={s => this._suggestionSelected(s)}
                            {...this.props}
                            onFilterChanged={s =>
                                this._suggestionSelected(s, true)
                            }
                            disabled={disabled}
                        />
                    );
                }
            } else {
                _jsx.push(
                    <MapSearch
                        key="gmaps-search-filter"
                        onSuggestSelect={(s) => {this._suggestionSelected(s, false); this.props.onSuggestSelect(s);}}
                        handleFilterChange={this._suggestionSelected}
                        locationBias={this.state.locationBias}
                        biasRadius={this.state.biasRadius}
                        restrictToCountry={this.state.restrictToCountry}
                        searchPlaceTypes={this.state.searchPlaceTypes}
                        locationTypeDefinitions={
                            this.state.locationTypeDefinitions
                        }
                        onInputChange={this.props.onInputChange}
                    />
                );
            }
        }

        if (view !== 'map-list') {
            _jsx.push(this._renderFilters('search_' + _searchMode));
        }

        return _jsx;
    },

    _renderSubmit: function() {
        if (this.props.submitBtn === true && this.props.placement) {
            return (
                <EventButton
                    bsSize="large"
                    block
                    listenFor="PROPERTIES_UPDATED"
                    store={this.getPropertyStore()}
                    className="btn-primary btn--submitButton"
                    onClick={this._updateSearch}
                >
                    {this.context.language.UpdateSearchButtonText}
                </EventButton>
            );
        }
    },

    render: function() {
        const { view, renderSearch } = this.props;

        if (this.state.loading) {
            return <Spinner />;
        }

        var _searchMode = this.getParamStore().getParam('searchMode');
        let searchLocationName = '';
        if (_searchMode === 'nonGeo') {
            searchLocationName = this.getParamStore().getParam('location');
        }
        // for other modes or if none was passed in for nonGeo
        if (!searchLocationName) {
            searchLocationName = this.getSearchStateStore().getItem(
                'searchLocationName'
            );
        }

        if (view === 'map-list') {
            if (renderSearch) {
                return this._renderSearchComponent(
                    _searchMode,
                    searchLocationName
                );
            }
        }

        var searchComponent = renderSearch
            ? this._renderSearchComponent(_searchMode, searchLocationName)
            : null;

        return (
            <div className="filter-wrap-container">
                {searchComponent}

                {this._renderFilters()}

                {this._renderSubmit()}
            </div>
        );
    }
});

module.exports = FiltersR4;
