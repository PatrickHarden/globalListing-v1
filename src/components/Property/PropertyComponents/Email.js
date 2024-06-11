import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ContactFormModal from '../../ContactForm/ContactFormModal';
import trackingEvent from '../../../utils/trackingEvent';

export default class Email extends Component {
    static contextTypes = {
        stores: PropTypes.object,
        actions: PropTypes.object
    };

    static propTypes = {
        property: PropTypes.object.isRequired,
        RecipientEmailAddress: PropTypes.string
    };

    constructor(props, context) {
        super(props, context);
        var ConfigStore = this.context.stores.ConfigStore;

        this.state = {
            recaptchaKey: ConfigStore.getItem('recaptchaKey'),
            ApiUrl: ConfigStore.getItem('propertyContactApiUrl'),
            SiteID: ConfigStore.getItem('siteId'),
            RequestType: 'Enquiry',
            showModal: false
        };
    }

    componentDidMount() {
        this.context.stores.ApplicationStore.onChange(
            'CLOSED_MODAL',
            this.onClose
        );
    }

    componentWillUnmount() {
        this.context.stores.ApplicationStore.off('CLOSED_MODAL', this.onClose);
    }

    onClose = () => {
        this.setState({
            showModal: false
        });
    };

    handleClick = () => {
        trackingEvent(
            'launchContactUs',
            {
                propertyId: this.props.property.PropertyId
            },
            this.context.stores,
            this.context.actions
        );

        this.setState({
            showModal: true
        });
    };

    render() {
        return (
            <div>
                <Button
                    onClick={this.handleClick}
                    bsSize="large"
                    className={'cbre-icon cbre-mail email-contact'}
                />
                <ContactFormModal
                    classNames={'spa-listings-modal'}
                    isShown={this.state.showModal}
                    property={this.props.property}
                    contact={{ email: this.props.RecipientEmailAddress }}
                    recaptchaKey={this.state.recaptchaKey}
                    apiUrl={this.state.ApiUrl}
                    siteId={this.state.SiteID}
                    closeHandler={this.onClose}
                    showContactDetails
                />
            </div>
        );
    }
}
