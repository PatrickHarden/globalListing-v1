import React, { Component } from 'react';
import PropTypes from 'prop-types';
import trackingEvent from '../../../utils/trackingEvent';
import Breadcrumb from '../../../list-map-components/Breadcrumb/Breadcrumb';
import paramMap from '../../../utils/paramMap';
import Places from '../../../utils/Places';
import getFormattedString from '../../../utils/getFormattedString';
import createQueryString from '../../../utils/createQueryString';
import Spinner from 'react-spinner';
import EventButton from '../../../components/EventButton';
import CachedPlaces from '../../../utils/cachedPlaces';
import _ from 'lodash';

export default class PropertyNavigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchContext: null,
            loading: true
        };

        this.mounted = false;

        this.fireTrackingEvent = this.fireTrackingEvent.bind(this);
        this.backToSearch = this.backToSearch.bind(this);
        this.buildHref = this.buildHref.bind(this);
        this.createSearchContext = this.createSearchContext.bind(this);
        this.getPreviousProperty = this.getPreviousProperty.bind(this);
        this.getNextProperty = this.getNextProperty.bind(this);
        this.getAdjacentProperty = this.getAdjacentProperty.bind(this);
        this.renderNavButton = this.renderNavButton.bind(this);
    }

    componentDidMount() {
        this.mounted = true;

        const features = this.context.stores.ConfigStore.getFeatures();

        const searchMode = this.context.stores.ConfigStore.getItem(
                'searchMode'
            ),
            // Lookup on preferred address segment if we do not have a stored search context
            // We need to do this immediately as it defined the text for the nav link
            _isContext = this.context.stores.ParamStore.getSearchContext(),
            _strings = this.context.language,
            _addressSegments = {
                Line1: this.props.address.line1,
                Line2: this.props.address.line2 || this.props.address.line3,
                Line3: this.props.address.line2
                    ? this.props.address.line4
                    : this.props.address.line3,
                Line4: this.props.address.line4,
                Locality: this.props.address.locality,
                Region: this.props.address.region,
                Country: this.props.address.country,
                PostCode: this.props.address.postcode
            };

        var _cb = function(result) {
            if (this.mounted) {
                this.setState({
                    btnText: getFormattedString(
                        _addressSegments,
                        _strings.TokenReplaceStrings
                            .BackToResultsButtonTextNoContext
                    ),
                    searchContext: this.createSearchContext(
                        this.props.location,
                        result || null
                    ),
                    loading: false
                });
            }
        }.bind(this);

        if (
            !_isContext &&
            (searchMode === 'pin' || searchMode === 'bounding') &&
            !this.props.useBreadcrumb
        ) {
            var _searchStringFormat =
                    this.context.stores.ConfigStore.getItem(
                        'placesAddressLookupStringFormat'
                    ) || '%(PostCode)s, %(Country)s',
                _searchString = getFormattedString(
                    _addressSegments,
                    _searchStringFormat
                );

            
            if(features.useCachedPlaces && features.useCachedPlaces.enabled && features.useCachedPlaces.enabled == true) {
                CachedPlaces.lookup({ address: _searchString, endpoint: features.useCachedPlaces.addressEndpoint + "?address=" + _searchString }, _cb, _cb);
            } else {
                Places.lookup({ address: _searchString }, _cb, _cb);
            }
        } else if (this.props.useBreadcrumb) {
            var searchStringFormat =
                    this.context.stores.ConfigStore.getItem(
                        'placesAddressLookupStringFormat'
                    ) || '%(PostCode)s, %(Country)s',
                searchString = getFormattedString(
                    _addressSegments,
                    searchStringFormat
                );
            if(features.useCachedPlaces && features.useCachedPlaces.enabled && features.useCachedPlaces.enabled == true) {
                CachedPlaces.lookup({ address: searchString, endpoint: features.useCachedPlaces.addressEndpoint + "?address=" + searchString }, _cb, _cb);
            } else {
                Places.lookup({ address: searchString }, _cb, _cb);
            }
            this.setState({
                searchResultText: _strings.SearchResultsButtonText,
                postcodeText: !_isContext
                    ? getFormattedString(
                          _addressSegments,
                          _strings.TokenReplaceStrings.PostCodeText
                      )
                    : null,
                homeBtnText: _strings.BackToHomepage,
                backBtnText: _strings.BackToResultsButtonText,
                backToFavsText: _strings.BackToFavourites,
                loading: false
            });
        } else {
            this.setState({
                btnText: !_isContext
                    ? _strings.BackToAllPropertiesButtonText
                    : _strings.BackToResultsButtonText,
                loading: false
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    fireTrackingEvent(type, data) {
        trackingEvent(type, data, this.context.stores, this.context.actions);
    }

    backToSearch(e) {
        this.fireTrackingEvent('propertyNavBack');
        // If we don't have a stored context
        if (this.context.stores.ParamStore.getSearchContext()) {
            const path = this.context.stores.ParamStore.getSearchContext();
            // Else return to stored search context
            this.context.router.push({
                pathname: path.path,
                query: path.query
            });
            e.preventDefault();
        }
    }

    buildHref() {
        let _href;
        const searchMode = this.context.stores.ConfigStore.getItem(
            'searchMode'
        );
        if (!this.context.stores.ParamStore.getSearchContext()) {
            var searchConfig =
                    this.context.stores.ConfigStore.getItem('searchConfig') ||
                    {},
                _searchResultsPage = searchConfig.searchResultsPage;

            _href = _searchResultsPage;

            if (searchMode === 'pin' || searchMode === 'bounding') {
                _href = _href + (this.state.searchContext || '');
            }
        } else {
            var path = this.context.stores.ParamStore.getSearchContext();
            _href =
                path.path +
                (!_.isEmpty(path.query) ? createQueryString(path.query) : '');
        }

        return encodeURI(_href);
    }

    buildParentHref(ParentPropertyId) {
        let _href;
        const aspect = this.context.stores.ParamStore.getParam('aspects');
        let path = '/details/' + ParentPropertyId + '?view=' + aspect;
        _href = this.context.spaPath.path + path;

        return _href;
    }

    createSearchContext(route, place) {
        let searchContext = null;
        const radius = this.context.stores.ConfigStore.getBackToSearchRadius();
        const sort = this.context.stores.ConfigStore.getItem("params").Sort || 'asc(_distance)' ;
        // If our google lookup was successful then we can build our search context
        if (
            place &&
            place.gmaps &&
            place.gmaps.hasOwnProperty('formatted_address')
        ) {
            const encodedLocation = encodeURIComponent(
                place.gmaps.formatted_address
            )
                .replace(/\'/g, '')
                .replace(/%20/g, '+');
            searchContext = `?location=${encodedLocation}&radius=${radius}&Sort=${sort}`;

            if (route && route.query && route.query.view && route.query.view.length > 0) {
                searchContext += '&aspects=' + route.query.view;
            }
        }

        return searchContext;
    }

    getPreviousProperty(backToContext) {
        this.fireTrackingEvent('propertyNavPrev');
        let index = this.context.stores.PropertyStore.getCurrentPropertyIndex();
        if (!backToContext) {
            index -= 1;
        }
        this.getAdjacentProperty(index);
    }

    getNextProperty() {
        this.fireTrackingEvent('propertyNavNext');
        this.getAdjacentProperty(
            this.context.stores.PropertyStore.getCurrentPropertyIndex() + 1
        );
    }

    getAdjacentProperty(index) {
        let newParams = _.clone(this.context.stores.ParamStore.getParams(true));

        newParams[paramMap.getMappedParam('pagesize')] = 1;
        newParams[paramMap.getMappedParam('page')] = index;

        this.context.actions.getAdjacentProperty(newParams, index);
    }

    renderNavButton(type) {
        const { PropertyStore, FavouritesStore } = this.context.stores;

        if (FavouritesStore.isActive()) {
            return this.renderFavNav(type);
        }

        const renderPrev = PropertyStore.getCurrentPropertyIndex() > 1;
        const renderNext =
            PropertyStore.getCurrentPropertyIndex() <
            PropertyStore.getTotalResults();
        const outSideContext = PropertyStore.isOutOfContext();

        switch (type) {
            case 'prev':
                if (renderPrev || outSideContext) {
                    const noNextClass = !renderNext ? ' no-border' : '';
                    return (
                        <EventButton
                            className={`${this.props.btnClass} ${
                                this.props.btnPrevClass
                            } ${noNextClass}`}
                            listenFor="CURRENT_PROPERTY_UPDATED"
                            store={PropertyStore}
                            onClick={() => {
                                this.getPreviousProperty(outSideContext);
                            }}
                        >
                            {this.props.btnPrevContent}
                        </EventButton>
                    );
                }
                break;
            case 'next':
                if (renderNext && !outSideContext) {
                    return (
                        <EventButton
                            className={`${this.props.btnClass} ${
                                this.props.btnNextClass
                            }`}
                            listenFor="CURRENT_PROPERTY_UPDATED"
                            store={PropertyStore}
                            onClick={this.getNextProperty}
                        >
                            {this.props.btnNextContent}
                        </EventButton>
                    );
                }
                break;
        }
    }

    getListMapBackMarkup = navButtons => {
        let spaPath = { path: '/' };
        const {
            address,
            homeUri,
            parentPropertyId,
            subdivisionName
        } = this.props;

        if (homeUri) {
            spaPath.path = homeUri;
        } else if (this.context.spaPath) {
            spaPath = this.context.spaPath;
        }

        const isFavouritesMode = this.context.stores.FavouritesStore.isActive();

        const features = this.context.stores.ConfigStore.getFeatures();
        const enableChildListings =
            features.childListings &&
            features.childListings.enableChildListings;

        return isFavouritesMode ? (
            <div>
                <a
                    onClick={this.backToSearch}
                    href={this.buildHref()}
                    className="leftLink"
                >
                    {this.state.backToFavsText}
                </a>
                {navButtons}
            </div>
        ) : (
            <div>
                <a href={this.buildHref()} className="leftLink hide-md">
                    {this.state.backBtnText}
                </a>
                <Breadcrumb
                    address={address}
                    appRoot={spaPath.path}
                    backToSearch={this.backToSearch}
                    parentPropertyUrl={
                        enableChildListings &&
                        parentPropertyId &&
                        this.buildParentHref(parentPropertyId)
                    }
                    searchContext={this.state.searchContext}
                    searchPostcode={this.state.postcodeText}
                    subdivisionName={subdivisionName}
                />
                {navButtons}
            </div>
        );
    };

    renderFavNav = type => {
        const { FavouritesStore } = this.context.stores;

        const index = FavouritesStore.getCurrentIndex();
        const count = FavouritesStore.getCount();
        const renderPrev = index > 0;
        const renderNext = index < count - 1;

        if (type === 'prev' && renderPrev) {
            const noNextClass = !renderNext ? ' no-border' : '';
            return (
                <a
                    className={`${this.props.btnClass} ${
                        this.props.btnPrevClass
                    } ${noNextClass}`}
                    onClick={FavouritesStore.prevProperty}
                >
                    {this.props.btnPrevContent}
                </a>
            );
        }

        if (type === 'next' && renderNext) {
            return (
                <a
                    className={`${this.props.btnClass} ${
                        this.props.btnNextClass
                    }`}
                    onClick={FavouritesStore.nextProperty}
                >
                    {this.props.btnNextContent}
                </a>
            );
        }
    };

    render() {
        const _navButtons = this.context.stores.ParamStore.getSearchContext() ? (
            <div className={this.props.btnContainerClass}>
                {this.renderNavButton('prev')}
                {this.renderNavButton('next')}
            </div>
        ) : null;
        let _componentMarkup;

        // Wait untill places lookup has completed before rendering the component
        // If we're still in a loading state render a spinner
        if (this.state.loading) {
            _componentMarkup = (
                <div className="container">
                    <Spinner />
                </div>
            );
        } else if (this.props.useBreadcrumb) {
            // this is basically the listmap PDP
            _componentMarkup = this.getListMapBackMarkup(_navButtons);
        } else {
            // When loading is complete create component markup depending on the state of the component
            // Return to default listings widget with a search QS if we've been able to construct one

            _componentMarkup = (
                <div className="container">
                    <a
                        className="btn btn--pdp-back btn--chevron"
                        onClick={this.backToSearch}
                        href={this.buildHref()}
                    >
                        <span className="cbre-icon cbre-double-chevron-left" />
                        {this.state.btnText}
                    </a>

                    {_navButtons}
                </div>
            );
        }

        return <div className={this.props.className}>{_componentMarkup}</div>;
    }
}

PropertyNavigation.contextTypes = {
    actions: PropTypes.object,
    router: PropTypes.object,
    spaPath: PropTypes.object,
    stores: PropTypes.object,
    language: PropTypes.object
};

PropertyNavigation.propTypes = {
    location: PropTypes.object.isRequired,
    address: PropTypes.object.isRequired,
    className: PropTypes.string,
    btnContainerClass: PropTypes.string,
    btnClass: PropTypes.string,
    btnPrevClass: PropTypes.string,
    btnPrevContent: PropTypes.node,
    btnNextClass: PropTypes.string,
    btnNextContent: PropTypes.node,
    useBreadcrumb: PropTypes.bool,
    homeUri: PropTypes.string,
    breadcrumbPrefix: PropTypes.arrayOf(PropTypes.object)
};

PropertyNavigation.defaultProps = {
    location: {},
    address: {},
    breadcrumbPrefix: []
};
