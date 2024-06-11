import React, { Component } from 'react';

import PropTypes from 'prop-types';
export default class UnderOfferBanner extends Component {
    static propTypes = {
        displayText: PropTypes.string,
        underOffer: PropTypes.bool,
        wrapperClass: PropTypes.string
    };

    static defaultProps = {
        wrapperClass: 'flag flag__text'
    };

    render() {
        if (!this.props.underOffer) {
            return null;
        }

        return (
            <div className={this.props.wrapperClass}>
                {this.props.displayText}
            </div>
        );
    }
}
