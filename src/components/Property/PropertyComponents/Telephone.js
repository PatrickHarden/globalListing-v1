import React, { Component } from 'react';
import PropTypes from 'prop-types';
import trackingEvent from '../../../utils/trackingEvent';
import { Button } from 'react-bootstrap';

export default class Telephone extends Component {
    state = {
        displayNumber: false
    };

    handleClick = e => {
        this.setState({ displayNumber: !this.state.displayNumber });

        trackingEvent(
            'viewPhoneNumber',
            {
                propertyId: this.props.propertyId
            },
            this.context.stores,
            this.context.actions
        );

        e.preventDefault();
    };

    handleCallClick = e => {
        window.location = 'tel:' + this.props.telephone.replace(/ /g, '');
        e.stopPropagation();
    };

    displayNumber = () => {
        if (this.state.displayNumber) {
            return (
                <a
                    className="btn btn-lg btn-block btn--flyout"
                    role="button"
                    onClick={this.handleCallClick}
                >
                    <div className={'btn--name'}>{this.props.name}</div>
                    <div className={'btn--number'}>{this.props.telephone}</div>
                </a>
            );
        }
    };

    getButtonType = () => {
        var buttonType;

        switch (this.props.buttonType) {
            case 'flyout':
                buttonType = this.renderFlyoutButton();
                break;

            case 'large':
                buttonType = this.renderLargeButton();
                break;
        }

        return buttonType;
    };

    renderFlyoutButton = () => {
        var openClass = this.state.displayNumber ? 'flyout-open' : '';

        return (
            <Button
                bsSize="large"
                block
                className={
                    'cbre-icon cbre-phone btn--with-flyout telephone-contact ' +
                    openClass
                }
                onClick={this.handleClick}
            >
                <span>call</span>
                {this.displayNumber()}
            </Button>
        );
    };

    renderLargeButton = () => {
        return (
            <Button
                onClick={this.handleCallClick}
                bsSize="large"
                className={
                    'btn-block btn--telephone btn-block--pdp-actions btn--cbre-icon btn--colors-inverted'
                }
            >
                <span className={'cbre-icon cbre-phone'} />
                <span className={'btn--name text'}>{this.props.name}:</span>
                <span className={'btn--number text'}>
                    {this.props.telephone}
                </span>
            </Button>
        );
    };

    render() {
        return this.getButtonType();
    }
}

Telephone.propTypes = {
    telephone: PropTypes.any.isRequired,
    name: PropTypes.string,
    buttonType: PropTypes.string.isRequired,
    propertyId: PropTypes.string.isRequired
};

Telephone.contextTypes = {
    stores: PropTypes.object,
    actions: PropTypes.object
};
