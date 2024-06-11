import React, { Component } from 'react';
import PropTypes from 'prop-types';
import trackingEvent from '../../../utils/trackingEvent';

export default class Walkthrough extends Component {
    _renderAsIframe = () => {
        trackingEvent(
            'viewWalkthrough',
            {
                propertyId: this.props.propertyId
            },
            this.context.stores,
            this.context.actions
        );
        return (
            <div className={this.props.wrapperClass}>
                <iframe src={this.props.url} frameBorder="0" scrolling="no" />
            </div>
        );
    };

    _renderAsBadge = () => {
        return (
            <div className="walkthrough-badge">
                <div className="text">{this.props.badgeText}</div>
            </div>
        );
    };

    render() {
        if (!this.props.url) {
            return null;
        }

        if (this.props.displayAsBadge) {
            return this._renderAsBadge();
        } else {
            return this._renderAsIframe();
        }
    }
}

Walkthrough.propTypes = {
    url: PropTypes.string,
    displayAsBadge: PropTypes.bool,
    badgeText: PropTypes.string,
    propertyId: PropTypes.string,
    wrapperClass: PropTypes.string
};

Walkthrough.defaultProps = {
    wrapperClass: 'walkthrough-details'
};

Walkthrough.contextTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object
};
