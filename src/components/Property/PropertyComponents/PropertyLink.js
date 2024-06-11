import React, { Component } from 'react';
import PropTypes from 'prop-types';
import trackingEvent from '../../../utils/trackingEvent';
import DefaultValues from '../../../constants/DefaultValues';
import DispatchCustomEvent from '../../../utils/dispatchCustomEvent';
import { Link } from 'react-router';

export default class PropertyLink extends Component {
    getType = typeParam => {
        const sale = typeParam.search('isSale') !== -1;
        const letting = typeParam.search('isLetting') !== -1;
        let type;

        if (sale && !letting) {
            type = 'isSale';
        } else if (letting && !sale) {
            type = 'isLetting';
        } else {
            type = null;
        }

        return type;
    };

    getTypeParam = () => {
        let typeParam;
        let type;

        if (
            this.props.params &&
            (typeParam = this.props.params.hasOwnProperty('aspects'))
        ) {
            type = this.getType(typeParam);
        }

        if (
            !type &&
            (typeParam = this.context.stores.ParamStore.getParam('aspects'))
        ) {
            type = this.getType(typeParam);
        }

        return type ? this.formatTypeAsObject(type) : null;
    };

    formatTypeAsObject = type => {
        return { view: type };
    };

    fireTrackingEvent = () => {
        if (this.props.fireEvent) {
            this.props.fireEvent();
        } else {
            trackingEvent(
                'viewPropertyDetails',
                {
                    propertyId: this.props.property.PropertyId
                },
                this.context.stores,
                this.context.actions
            );
        }
    };

    handleClick = e => {
        e.stopPropagation();

        this.fireTrackingEvent();

        var propertyIndex =
            this.state.page * this.state.pageSize -
            this.state.pageSize +
            (this.props.propertyIndex + 1);

        this.context.actions.setPropertyIndex(propertyIndex);

        this.context.actions.setSearchContext({
            path: this.context.location.pathname,
            query: this.context.location.query
        });
    };

    state = {
        page:
            this.context.stores.ParamStore.getParam('page') ||
            DefaultValues.page,
        pageSize:
            this.context.stores.ParamStore.getParam('pagesize') ||
            DefaultValues.pageSize,
        dispatchCustomEvent: new DispatchCustomEvent()
    };

    render() {
        const property = this.props.property;
        const addressSummary = property.ActualAddress.urlAddress;
        let searchResultsPage = this.props.searchResultsPage;
        let searchType = this.props.searchType;

        if (searchType) {
            searchType = this.formatTypeAsObject(searchType);
        } else {
            searchType = this.getTypeParam();
        }

        const searchTypeQuery =
            searchType && searchType.view ? '?view=' + searchType.view : null;
        const spaPath = this.context.spaPath || {};

        // TODO: CBRE3-569
        // Remove hardLinkProperty prop after PDP refactor

        // If we're not on the sites default listings page redirect there
        if (
            (searchResultsPage &&
                searchResultsPage !== '/' &&
                spaPath.path !== searchResultsPage) ||
            this.props.hardLinkProperty ||
            !this.context.history
        ) {
            if (searchResultsPage.substr(-1) === '/') {
                searchResultsPage = searchResultsPage.substr(
                    0,
                    searchResultsPage.length - 1
                );
            }
            var linkPath =
                searchResultsPage +
                '/details/' +
                property.PropertyId +
                '/' +
                addressSummary +
                searchTypeQuery;
            return (
                <a
                    href={linkPath}
                    className={this.props.className}
                    onClick={() => {
                        this.fireTrackingEvent();
                        window.location = linkPath;
                    }}
                >
                    {this.props.children}
                </a>
            );
        }
        var path =
            (spaPath.path === '/' ? '' : spaPath.path) +
            '/details/' +
            property.PropertyId +
            '/' +
            addressSummary;

        // Otherwise navigate within SPA
        return (
            <Link
                to={{ pathname: path, query: searchType }}
                onClick={this.handleClick}
                className={this.props.className}
            >
                {this.props.children}
            </Link>
        );
    }
}

PropertyLink.contextTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object,
    location: PropTypes.object,
    spaPath: PropTypes.object,
    history: PropTypes.object // bring this in, just to check if ReactRouter is active today
};

PropertyLink.propTypes = {
    property: PropTypes.object.isRequired,
    propertyIndex: PropTypes.number.isRequired,
    fireEvent: PropTypes.func,
    className: PropTypes.string,
    searchResultsPage: PropTypes.string.isRequired,
    hardLinkProperty: PropTypes.bool
};
