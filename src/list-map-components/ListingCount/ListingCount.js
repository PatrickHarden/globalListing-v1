import React, { Component } from 'react';

import PropTypes from 'prop-types';
import TranslateString from '../../utils/TranslateString';

class ListingCount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listingCount: {
                count: undefined,
                status: false
            }
        };
    }
    componentDidMount() {
        this.context.stores.PropertyStore.onChange(
            'LISTING_COUNT_UPDATED',
            this.updateListingCount
        );

        this.context.actions.fetchListingCount(this.props.propertyId);
    }

    componentWillUnmount() {
        this.context.stores.PropertyStore.off(
            'LISTING_COUNT_UPDATED',
            this.updateListingCount
        );
    }

    updateListingCount = () => {
        const listingCount = this.context.stores.PropertyStore.getListingCount(
            this.props.propertyId
        );
        this.setState({
            propertyId: this.props.propertyId,
            listingCount: listingCount.filter(
                item => item.propertyId === this.props.propertyId
            )[0] || { count: 0, status: true }
        });
    };

    returnListingCountTokenString = ListingCount => {
        return parseInt(ListingCount) === 0 || parseInt(ListingCount) > 1
            ? 'ListingCountPlural'
            : 'ListingCountSingular';
    };

    render() {
        const callComplete = this.state.listingCount.status;
        const callFailed =
            this.state.listingCount.count === 0 &&
            this.state.listingCount.status;

        if (!callComplete) {
            return (
                <div>
                    <TranslateString string="EventButtonLoadingText" />
                </div>
            );
        }

        if (callFailed) {
            return (
                <div>
                    <TranslateString string="ErrorText" />
                </div>
            );
        }

        const tokenString = this.returnListingCountTokenString(
            this.state.listingCount.count
        );
        return (
            <div>
                <TranslateString
                    string={tokenString}
                    count={this.state.listingCount.count}
                />
            </div>
        );
    }
}

ListingCount.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object,
    actions: PropTypes.object
};

ListingCount.propTypes = {
    className: PropTypes.string,
    breakpoints: PropTypes.object,
    cardProps: PropTypes.object
};

export default ListingCount;
