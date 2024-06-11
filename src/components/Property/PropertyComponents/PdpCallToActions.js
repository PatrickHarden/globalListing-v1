import React, { Component } from 'react';
import PropTypes from 'prop-types';
import trackingEvent from '../../../utils/trackingEvent';
import Telephone from './Telephone';
import { Modal, Button } from 'react-bootstrap';
import StampDutyCalculator from '@ryanshaug/globallistings-test-stamp-duty-calculator';
import _ from 'lodash';
import ContactFormModal from '../../ContactForm/ContactFormModal';

export default class PdpCallToActions extends Component {
    componentDidMount() {
        this.context.stores.ApplicationStore.onChange(
            'CLOSED_MODAL',
            this.onClose
        );
    }

    componentWillUnmount() {
        this.context.stores.ApplicationStore.off('CLOSED_MODAL', this.onClose);
    }

    componentWillReceiveProps() {
        this.setState({
            showContactModal: false,
            showCalculatorModal: false
        });
    }

    _fireTrackingEvent = type => {
        trackingEvent(
            type,
            {
                propertyId: this.props.property.PropertyId
            },
            this.context.stores,
            this.context.actions
        );
    };

    _handleContactModalClick = () => {
        this._fireTrackingEvent('pdpLaunchContactUs');
        this.setState({
            showContactModal: true
        });
    };

    _handleCalculatorModalClick = () => {
        trackingEvent(
            'pdpLaunchStampDutyCalculator',
            {
                propertyId: this.props.property.PropertyId,
                siteId: this.context.stores.ConfigStore.getItem('siteId')
            },
            this.context.stores,
            this.context.actions
        );
        this.setState({
            showCalculatorModal: true
        });
    };

    getLightboxItemIndexFromDataType = lightboxDataType => {
        const lightboxItems = this.context.stores.PropertyStore.getPropertyLightboxData();
        return _.findIndex(lightboxItems, ['dataType', lightboxDataType]);
    };

    handleCallToActionButtonOnClick = index => {
        this.props.openLightboxFunc(index);
    };

    _renderCallToActionButton = (
        url,
        buttonText,
        buttonIcon,
        dataType,
        lightboxDataType
    ) => {
        if (typeof url !== 'undefined' && url !== null && url.length !== 0) {
            const cdnUrl = this.state.cdnUrl;
            const assetUrl = url ? cdnUrl + url : undefined;

            // Fire lightboxing if enabled and asset is a JPEG, PNG or GIF image.
            if (lightboxDataType && /\.(jpg|jpeg|png|gif)$/i.test(assetUrl)) {
                const index = this.getLightboxItemIndexFromDataType(
                    lightboxDataType
                );
                return (
                    <Button
                        onClick={function(e) {
                            e.preventDefault();
                            this.handleCallToActionButtonOnClick(index);
                        }.bind(this)}
                        bsSize="large"
                        className={
                            'btn-block btn-block--pdp-actions btn--cbre-icon'
                        }
                    >
                        <span className={'cbre-icon ' + buttonIcon} />
                        <span className={'text'}>{buttonText}</span>
                    </Button>
                );
            } else {
                // Open in new tab.
                return (
                    <Button
                        href={assetUrl || ''}
                        target="_blank"
                        rel="noopener"
                        bsSize="large"
                        className={
                            'btn-block btn-block--pdp-actions btn--cbre-icon'
                        }
                        onClick={this._fireTrackingEvent.bind(
                            null,
                            'detailsView' + dataType
                        )}
                    >
                        <span className={'cbre-icon ' + buttonIcon} />
                        <span className={'text'}>{buttonText}</span>
                    </Button>
                );
            }
        }
    };

    _renderTelephone = contactGroup => {
        if (
            !contactGroup ||
            !contactGroup.contacts ||
            !contactGroup.contacts.length ||
            !contactGroup.contacts[0].telephone ||
            this.props.excludeContacts
        ) {
            return;
        }

        const firstContact = contactGroup.contacts[0];

        return (
            <Telephone
                buttonType={'large'}
                telephone={firstContact.telephone}
                name={contactGroup.name || firstContact.name}
                propertyId={this.props.property.PropertyId}
            />
        );
    };

    _renderTenantFees = () => {
        const language = this.context.language;

        if (this.props.searchType === 'isLetting') {
            return (
                <Button
                    href={this.state.tenantFeesUrl}
                    target="_blank"
                    rel="noopener"
                    bsSize="large"
                    block
                    className={'btn-block--pdp-actions btn--cbre-icon'}
                >
                    <span className={'cbre-icon cbre-document-inspect'} />
                    <span className={'text'}>
                        {language.PdpTenantFeesLinkText}
                    </span>
                </Button>
            );
        }
    };

    _renderStampDutyCalculator = () => {
        const enableSDC = this.context.stores.ConfigStore.getItem(
            'enableStampDutyCalculator'
        );
        if (this.props.searchType === 'isSale' && enableSDC) {
            const language = this.context.language,
                SDCConfigUrl = this.context.stores.ConfigStore.getItem(
                    'stampDutyCalculatorConfigUrl'
                ),
                container = document.getElementsByClassName(
                    'cbre-react-spa-container'
                )[0],
                calculatorPrice = this._getCalculatorPropertyPrice();

            return (
                <div>
                    <Button
                        bsSize="large"
                        className={
                            'btn-block btn-block--pdp-actions btn--cbre-icon'
                        }
                        onClick={this._handleCalculatorModalClick}
                    >
                        <span className={'cbre-icon cbre-calculator-icon'} />
                        <span className={'text'}>
                            {language.PdpStampDutyCalculatorButtonText}
                        </span>
                    </Button>
                    <Modal
                        container={container}
                        show={this.state.showCalculatorModal}
                        onHide={this.onClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {language.PdpStampDutyCalculatorButtonText}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <StampDutyCalculator
                                propertyPrice={calculatorPrice}
                                configUrl={SDCConfigUrl}
                            />
                        </Modal.Body>
                    </Modal>
                </div>
            );
        }
    };

    _getCalculatorPropertyPrice = () => {
        const property = this.props.property;

        const calculatorPrice = _.find(property.Charges, {
            currencyCode: 'GBP',
            chargeType: 'SalePrice'
        });

        return calculatorPrice ? calculatorPrice.amount : null;
    };

    onClose = () => {
        this.setState({
            showContactModal: false,
            showCalculatorModal: false
        });
    };

    state = {
        showContactModal: false,
        showCalculatorModal: false,
        tenantFeesUrl: this.context.stores.ConfigStore.getItem(
            'tenantFeesLinkUrl'
        ),
        cdnUrl: this.context.stores.ConfigStore.getItem('cdnUrl'),
        isOpen: false,
        options: {}
    };

    render() {
        const property = this.props.property;
        const language = this.context.language;
        const recaptchaKey = this.context.stores.ConfigStore.getItem(
            'recaptchaKey'
        );
        const ApiUrl = this.context.stores.ConfigStore.getItem(
            'propertyContactApiUrl'
        );
        const SiteID = this.context.stores.ConfigStore.getItem('siteId');
        const brochureUrl =
            property.Brochures && !_.isEmpty(property.Brochures)
                ? property.Brochures.uri
                : null;
        const floorplanUrl =
            property.FloorPlans &&
            property.FloorPlans.length &&
            property.FloorPlans[0].resources &&
            property.FloorPlans[0].resources.length
                ? property.FloorPlans[0].resources[0].uri
                : null;
        const tenantFeesCTA = this.props.showTenantFees
            ? this._renderTenantFees()
            : null;
        const EPCUrl =
            property.EPC && !_.isEmpty(property.EPC) ? property.EPC.uri : null;
        const StampDutyCalculator = this.props.searchType
            ? this._renderStampDutyCalculator()
            : null;
        const contactAvailable =
            property.ContactGroup &&
            property.ContactGroup.contacts &&
            property.ContactGroup.contacts.length &&
            property.ContactGroup.contacts[0].email;

        let contact;
        if (contactAvailable) {
            contact = property.ContactGroup.contacts[0];
            contact.avatar = {
                src: '',
                size: 40,
                name: contact.name
            };
        }
        var PdpArrangeButtonText=
          features.useContactAgent && (this.props.property.Aspect[0]=="isSold" || this.props.property.Aspect[0]=="isLeased")?language.PdpContactAgentButtonText:language.PdpArrangeViewingButtonText;
        return (
            <ul className={'list-unstyled list--pdp-actions'}>
                {tenantFeesCTA}

                {contactAvailable ? (
                    <span>
                        <Button
                            bsSize="large"
                            className={
                                'btn-block btn-block--pdp-actions btn--cbre-icon'
                            }
                            onClick={this._handleContactModalClick}
                        >
                            <span className={'cbre-icon cbre-clock'} />
                            <span className={'text'}>
                                {PdpArrangeButtonText}
                            </span>
                        </Button>

                        <ContactFormModal
                            classNames={'listmap-modal'}
                            isShown={this.state.showContactModal}
                            property={property}
                            apiUrl={ApiUrl}
                            siteId={SiteID}
                            recaptchaKey={recaptchaKey}
                            contact={contact}
                            requestType={this.props.requestType}
                            closeHandler={this.onClose}
                            source={'PDP'}
                            showContactDetails
                        />
                    </span>
                ) : null}

                {StampDutyCalculator}

                {this._renderCallToActionButton(
                    brochureUrl,
                    language.PdpDownloadBrochureButtonText,
                    'cbre-documents',
                    'Brochure'
                )}
                {this._renderCallToActionButton(
                    floorplanUrl,
                    language.PdpViewFloorplanButtonText,
                    'cbre-floorplan',
                    'floorplan',
                    'floorplan'
                )}
                {this._renderCallToActionButton(
                    EPCUrl,
                    language.PdpViewEPCGraphButtonText,
                    'cbre-EPC-graph',
                    'EPC'
                )}
                {this._renderCallToActionButton(
                    property.Website,
                    language.PdpViewViewPropertyWebsiteText,
                    'cbre-double-chevron-right',
                    'Website'
                )}
                {this._renderTelephone(property.ContactGroup)}
            </ul>
        );
    }
}

PdpCallToActions.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object,
    actions: PropTypes.object
};

PdpCallToActions.propTypes = {
    searchType: PropTypes.string.isRequired,
    propertyPrice: PropTypes.number,
    excludeAgency: PropTypes.bool,
    excludeContacts: PropTypes.bool,
    openLightboxFunc: PropTypes.func,
    showTenantFees: PropTypes.bool
};
