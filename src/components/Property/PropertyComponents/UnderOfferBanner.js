import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class UnderOfferBanner extends Component {
    static propTypes = {
        displayText: PropTypes.string,
        underOffer: PropTypes.bool
    };

    render() {
        if (!this.props.underOffer) {
            return null;
        }

        return (
            <div className="under-offer">
                <div className="under-offer-text">{this.props.displayText}</div>
            </div>
        );
    }
}
