import React from 'react';
import PropTypes from 'prop-types';

var ComponentPathMixin = require('../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../mixins/ApplicationActionsMixin'),
    BootstrapMixin = require('../mixins/BootstrapMixin'),
    TrackingEventMixin = require('../mixins/TrackingEventMixin'),
    searchRegions = require('../utils/searchRegions'),
    defaultValues = require('../constants/DefaultValues'),
    MultiSelect = require('./Filters/MultiSelect'),
    ErrorView = require('./ErrorView'),
    SearchButton = require('./SearchButton');

import CaptureError from '../utils/captureError';
//import 'chosen-js';
import { Grid, Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import Spinner from 'react-spinner';
import $ from 'jquery';
import Filters from './Filters';
import { clone } from 'lodash';
var createReactClass = require('create-react-class');
import Select from 'react-select';

import createQueryString from '../utils/createQueryString';
import SearchR4 from './SearchR4';

var Search = createReactClass({
    displayName: 'Search',
    mixins: [
        StoresMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        BootstrapMixin,
        TrackingEventMixin
    ],

    contextTypes: {
        router: PropTypes.object
    },

    childContextTypes: {
        language: PropTypes.object,
        spaPath: PropTypes.object
    },

    getInitialState: function() {
        return {
            loadingState: true,
            searchFieldValue: ''
        };
    },
    updateSearchPathValue(newValue) {
        this.setState({
            searchPath: newValue
        });
    },
    componentDidMount: function() {
        // Handle changes.
        this.getApplicationStore().onChange(
            'BOOTSTRAP_COMPLETE',
            this._searchStateChange
        );
        // Add body class
        $('body').addClass('cbre-react-search');
    },
    componentDidUpdate: function() {
        if (!this.state.loading) {
            this.state.dispatchCustomEvent.preRender(this.getActions());
            var paths = this.getSearchStateStore().getItem(
                'searchPathSelector'
            );
            if (
                !this.state.searchPath &&
                this.getSearchStateStore().getItem('useSearchPathSelector') &&
                typeof paths !== 'undefined' &&
                paths &&
                paths.length
            ) {
                let newPathName = this.getSearchStateStore()
                    .getItem('searchPathSelector')
                    .find(value => value.default)
                    ? this.getSearchStateStore()
                          .getItem('searchPathSelector')
                          .find(value => value.default).value
                    : this.getSearchStateStore().getItem(
                          'searchPathSelector'
                      )[0].value;
                this.setState({
                    searchPath: newPathName
                });
            }
        }
    },

    componentWillUnmount: function() {
        this.getApplicationStore().off(
            'BOOTSTRAP_COMPLETE',
            this._searchStateChange
        );
        $('body').removeClass('cbre-react-search');
    },

    getChildContext: function() {
        return {
            language: this.state.language,
            spaPath: this.props.spaPath
        };
    },

    _getSearchUrl: function(type) {
        const { stores } = this.context;

        var searchPage = stores.SearchStateStore.getItem('searchResultsPage'),
            params = clone(stores.ParamStore.getParams()),
            _sm = stores.ConfigStore.getItem('searchMode');

        // Add the search mode to the params object
        if (_sm) {
            params.searchMode = _sm;
        }

        if (
            this.getSearchStateStore().getItem('useSearchPathSelector') &&
            this.selectPath
        ) {
            searchPage = this.state.searchPath.value;
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
        delete params.radius;

        if (stores.ParamStore.getParam('searchRadius')) {
            params.radius = stores.ParamStore.getParam('searchRadius');
        }

        if (stores.SearchStateStore.getItem('currentPlaceId')) {
            params.placeId = stores.SearchStateStore.getItem('currentPlaceId');
        }

        return encodeURI(searchPage + createQueryString(params));
    },

    _searchStateChange: function() {
        var _searchMode = this.getConfigStore().getItem('searchMode');

        if (_searchMode === 'polygon') {
            var paramPolygons =
                this.getParamStore().getParam('polygons') || null;
            this.selectedPlaceNames = '';
            this.selectedPolygons = [];
            this.multiSelectFilter = searchRegions.get(
                this.getSearchStateStore().getItem('polygons'),
                paramPolygons
            );
            this.multiSelectFilter.label = this.state.language.PolygonSearchPlaceholder;
            this.multiSelectFilter.noResultsText = this.state.language.PolygonSearchNoResults;

            // Force out of polygon mode if no polygons have been defined
            if (!this.multiSelectFilter.options.length) {
                _searchMode = defaultValues.searchMode;
            }
        }

        this.setState({
            defaultPlace: this.getSearchStateStore().getItem(
                'searchLocationName'
            ),
            searchMode: _searchMode,
            loadingState: false
        });
    },

    _regionsSelected: function(regions, placeNames) {
        this.selectedPolygons = searchRegions.parse(regions);
        this.selectedPlaceNames = placeNames;
    },

    _getPlaceName: function() {
        var placeName = '';
        if (this.selectedPlaceNames) {
            placeName = this.selectedPlaceNames.toString();
        } else {
            if (
                this.state.defaultPlace !==
                this.getSearchStateStore().getItem('searchLocationName')
            ) {
                placeName = this.getSearchStateStore().getItem(
                    'searchLocationName'
                );
            }
        }
        return placeName;
    },

    _submitSearch: function(type) {
        this._fireEvent('SearchWidgetSearch', {
            placeName: this._getPlaceName()
        });

        window.location.assign(this._getSearchUrl(type));
    },

    _renderSearchComponent: function() {
        var multiSelect = this.multiSelectFilter;
        // If we're in polygon search mode and polygons have been defined
        if (this.state.searchMode === 'polygon') {
            return (
                <MultiSelect
                    handleFilterChange={this._regionsSelected}
                    filter={multiSelect}
                />
            );
        }
        // Otherwise render standard search
        return <Filters renderSearch={true} isStandalone={true} />;
    },

    _renderSearchHeader: function() {
        const siteType = this.getConfigStore().getItem('siteType');
        const searchHeader =
            this.getSearchStateStore().getItem('searchHeader') || {};
        const title =
            searchHeader.searchHeaderTitleText ||
            this.state.language.SearchHeaderTitle;
        const linkText = searchHeader.searchHeaderLinkText;
        const linkUrl = searchHeader.searchHeaderLinkUrl;

        const linkMarkup =
            linkText && linkUrl ? <a href={linkUrl}>{linkText}</a> : null;

        // Only show on commercial site type.
        if (siteType === 'residential') {
            return;
        }

        return (
            <div className="cbre-spa--search-header">
                <h4>{title}</h4>
                {linkMarkup}
            </div>
        );
    },

    _renderSearchFilters: function() {
        var filters = this.getConfigStore().getItem('filters');

        // Dont render filters markup if none are set in config.
        if (typeof filters !== 'undefined' && filters && filters.length) {
            return (
                <div className="cbre-spa--search-filters">
                    <Grid fluid>
                        <Row>
                            <Col xs={6}>
                                <Filters placement="primary" />
                            </Col>
                            <Col xs={6}>
                                <Filters placement="secondary" />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
    },

    _renderSearchPathSelector: function() {
        var paths = this.getSearchStateStore().getItem('searchPathSelector');

        // Dont render filters markup if none are set in config.
        if (
            this.getSearchStateStore().getItem('useSearchPathSelector') &&
            typeof paths !== 'undefined' &&
            paths &&
            paths.length
        ) {
            return (
                <FormGroup
                    controlId="formControlsSelectPath"
                    className="path-selector"
                >
                    <ControlLabel className="sr-only">Select</ControlLabel>

                    <Select
                        id="path-selector"
                        name="path-selector"
                        ref={ref => {
                            this.selectPath = ref;
                        }}
                        searchable={false}
                        clearable={false}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        simpleValue
                        options={paths}
                        value={this.state.searchPath}
                        onChange={this.updateSearchPathValue}
                    />
                </FormGroup>
            );
        }
    },

    _handleKeyPress: function(e) {
        var enabled = this.getConfigStore().getFeatures().searchOnEnter,
            buyBtn = this.getSearchStateStore().getItem('hideSearchToBuy'),
            letBtn = this.getSearchStateStore().getItem('hideSearchToLet'),
            defaultSearchType =
                window.cbreSiteType !== 'residential' ||
                defaultValues.cbreSiteType !== 'residential'
                    ? 'isLetting'
                    : !letBtn && buyBtn
                        ? 'isLetting'
                        : 'isSale';

        if (e.key === 'Enter') {
            e.preventDefault();
            if (enabled) {
                this._submitSearch(defaultSearchType);
            }
        }
    },

    render: function() {
        const config = this.getConfigStore().getConfig();
        if (
            (this.state.loading || this.state.loadingState) &&
            !this.state.error &&
            !this.state.fatalError
        ) {
            return (
                <Grid>
                    <Spinner />
                </Grid>
            );
        }

        if (this.state.error) {
            CaptureError(
                'Component Error',
                {
                    component: 'Search',
                    errorType: 'Config Error',
                    config: config
                },
                { site: config.siteId }
            );
            return (
                <ErrorView className="config-error places-error container">
                    <h4>
                        {this.state.language
                            ? this.state.language.ErrorSubTitle
                            : 'We are sorry there has been an error.'}
                    </h4>
                    <p>
                        {this.state.language
                            ? this.state.language.ErrorText
                            : 'Please try again later.'}
                    </p>
                </ErrorView>
            );
        }

        if (this.state.fatalError) {
            CaptureError(
                'Fatal Error',
                {
                    component: 'Search',
                    errorType: 'Config Error'
                },
                {}
            );
            return (
                <ErrorView title="Sorry" className="config-error container">
                    <h4>We&apos;re sorry, there has been an error.</h4>

                    <p>Please try again later.</p>
                </ErrorView>
            );
        }

        if (window.cbreSiteTheme === 'commercialr4') {
            return (<SearchR4 context={this.context} />);
        }

        let buyBtn = this.getSearchStateStore().getItem('hideSearchToBuy');
        let letBtn = this.getSearchStateStore().getItem('hideSearchToLet');
        var paths = this.getSearchStateStore().getItem('searchPathSelector');
        let useSelector =
            this.getSearchStateStore().getItem('useSearchPathSelector') &&
            typeof paths !== 'undefined' &&
            paths &&
            paths.length;

        let additionalStyles = !letBtn && !buyBtn ? 'two-button ' : '';
        additionalStyles += useSelector ? 'with-selector ' : '';
        return (
            <div>
                {this._renderSearchHeader()}
                <form
                    onKeyPress={this._handleKeyPress}
                    className="cbre-spa--search"
                >
                    <Grid fluid>
                        <Row
                            className={
                                'cbre-spa--search_form ' + additionalStyles
                            }
                        >
                            {this._renderSearchPathSelector()}
                            <div className="search-input">
                                {this._renderSearchComponent()}
                            </div>

                            <div className="search-btn">
                                <SearchButton
                                    handleSubmit={this._submitSearch}
                                    lettingsLink={this._getSearchUrl(
                                        'isLetting'
                                    )}
                                    salesLink={this._getSearchUrl('isSale')}
                                />
                            </div>
                        </Row>
                    </Grid>
                </form>
                {this._renderSearchFilters()}
            </div>
        );
    }
});

Search.displayName = 'SEARCH';

export default Search;