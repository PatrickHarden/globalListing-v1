import PropTypes from 'prop-types';
import React from 'react';
import ContactForm from './index.js';
import { Modal } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import TranslateString from '../../utils/TranslateString';
import { Avatar } from '../../external-libraries/agency365-components/components';
import ContactModal from '../../r3/components/ContactModal/ContactModal';
import ContactModalR4 from '../../r4/components/ContactModal/ContactModal';
import { isIE } from '../../utils/browser';

class ContactFormModal extends React.Component {
    static propTypes = {
        closeHandler: PropTypes.func,
        isShown: PropTypes.bool,
        contact: PropTypes.object.isRequired,
        property: PropTypes.object.isRequired,
        labels: PropTypes.object,
        recaptchaKey: PropTypes.string.isRequired,
        apiUrl: PropTypes.string.isRequired,
        siteId: PropTypes.string.isRequired,
        showContactDetails: PropTypes.bool,
        classNames: PropTypes.string,
        requestType: PropTypes.string,
        source: PropTypes.string
    };

    static defaultProps = {
        isShown: true,
        contact: {},
        property: {},
        showContactDetails: false,
        recaptchaKey: '',
        apiUrl: '',
        siteId: ''
    };

    getModalBodyTopContent = contact => {
        var { stores } = this.context;
        if (this.props.showContactDetails) {
            return (
                <div>
                    {contact.telephone && (
                        <div className="formLegend">
                            {this.context.stores.ConfigStore.getFeatures().displayTelephoneHeaderText ?
                                <TranslateString string="ContactFormTelephoneHeaderLabel" /> :
                                <TranslateString string="ContactFormFieldTelephoneLabel" />}
                            :&nbsp;
                            <span className="cbre_h2">
                                <a href={'tel:' + contact.telephone}>
                                    {contact.telephone}
                                </a>
                            </span>
                        </div>
                    )}
                    {stores.ConfigStore.getFeatures()
                        .displayEmailInContactForm &&
                        contact.email && (
                            <div className="formLegend">
                                <TranslateString string="ContactFormEmailText" />:&nbsp;
                                <span className="cbre_h2">
                                    <a href={'mailto:' + contact.email}>
                                        {contact.email}
                                    </a>
                                </span>
                            </div>
                        )}
                </div>
            );
        }
    };

    getViewAllPropertiesByTranslationText = contact => {
        function getFirstName() {
            return contact.name ? contact.name.split(' ')[0] : '';
        }

        let translation = (
            <TranslateString
                string="viewAllPropertiesByBroker"
                name={getFirstName()}
            />
        );

        if (!translation) {
            translation = `View All Properties By ${getFirstName()}`; // Fallback
        }
        return translation;
    }

    getModalBodyTopContentR3 = contact => {
        if (!this.props.showContactDetails) {
            return (<div></div>);
        }

        return (
            <div className="modal-broker-contactinfo-container">
                <div className="modal-broker-contactinfo">
                    {this.getAvatarR3(contact)}
                    <div className="modal-broker-contact-details">
                        <div className="modal-broker-contact-details-name">
                            {contact.name}
                        </div>
                        {contact.telephone && (
                            <div className="modal-broker-contact-details-phone">
                                <a href={'tel:' + contact.telephone}>
                                    {contact.telephone}
                                </a>
                            </div>
                        )}
                        {this.context.stores.ConfigStore.getFeatures().displayEmailInContactForm && contact.email && (
                            <div className="modal-broker-contact-details-email">
                                <a href={'mailto:' + contact.email}>
                                    {contact.email}
                                </a>
                            </div>
                        )}
                        {this.context.stores.ConfigStore.getConfig().viewAllPropertiesByBrokerLink && contact.email && contact.name && (
                            <div style={{ fontSize: "16px", letterSpacing: "1px", marginTop: "5px" }}>
                                <a href={this.context.stores.ConfigStore.getConfig().viewAllPropertiesByBrokerLink + contact.email} target="_blank" rel="noopener noreferrer">
                                    {this.getViewAllPropertiesByTranslationText(contact)}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    getAvatarR3 = contact => {
        if (contact && contact.avatar && typeof contact.avatar != 'object') {
            return (
                <div className="contact-modal-avatar-header">
                    <img src={contact.avatar}></img>
                </div>
            );
        }

        let initials = "";
        if (contact.name) {
            initials = contact.name.match(/\b\w/g) || [];
            initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
        }

        return (
            <div className="contact-modal-avatar-header-initials-container">
                <div className="contact-modal-avatar-header-initials">
                    {initials}
                </div>
            </div>
        );
    };


    getContactFormAvatar = contact => {
        if (!this.props.showContactDetails || typeof contact === 'undefined') {
            return null;
        }

        if ((contact && contact.avatar) || contact.name) {
            if (typeof contact.avatar === 'object') {
                return contact.avatar;
            } else {
                return (
                    <Avatar
                        src={contact.avatar}
                        size={32}
                        altText={contact.name}
                    />
                );
            }
        }
    };

    getContactModalTitle = name => {
        let modalTitle;

        if (this.props.showContactDetails && name) {
            modalTitle = (
                <TranslateString
                    string="ContactFormHeaderWithName"
                    name={name}
                />
            );
        } else {
            modalTitle = <TranslateString string="ContactFormTitle" />;
        }

        return modalTitle;
    };

    render() {
        const modalContainer = document.getElementsByClassName(
            'cbre-react-spa-container'
        )[0];
        const language = this.props.intl.messages;
        const features = this.context.stores.ConfigStore.getFeatures();

        // TODO: push to contact form.

        const labels = {
            formTitle: language.ContactFormTitle,
            name: {
                label: language.ContactFormFieldNameLabel,
                errorMsg: language.ContactFormFieldNameErrorMsg,
                defaultValue: language.ContactFormFieldNameDefaultValue
            },
            email: {
                label: language.ContactFormFieldEmailLabel,
                errorMsg: language.ContactFormFieldEmailErrorMsg,
                defaultValue: language.ContactFormFieldEmailDefaultValue
            },
            telephone: {
                label: language.ContactFormFieldTelephoneLabel,
                errorMsg: language.ContactFormFieldTelephoneErrorMsg,
                defaultValue: language.ContactFormFieldTelephoneDefaultValue
            },
            message: {
                label: language.ContactFormFieldMessageLabel,
                defaultValue: language.ContactFormFieldMessageDefaultValue,
                messageToken: language.MessagePropertyDetailsString
            },
            verification: {
                label: language.ContactFormFieldCaptchaLabel,
                errorMsg: language.ContactFormFieldCaptchaErrorMsg
            },
            company: {
                label: language.ContactFormFieldCompanyLabel,
                errorMsg: language.ContactFormFieldCompanyErrorMsg,
                defaultValue: language.ContactFormFieldcompanyDefaultValue
            },
            disclaimer: {
                label: (
                    <TranslateString
                        string="ContactFormFieldDisclaimerLabel"
                        unsafe
                    />
                ),
                errorMsg: language.ContactFormFieldDisclaimerErrorMsg
            },
            buttonTxt: language.ContactFormButtonText,
            closeLinkTxt: language.ContactFormCloseLinkText,
            successMsg: language.ContactFormSuccessMessage,
            errorMsg: language.ContactFormErrorMessage
        };

        const { contact } = this.props;
        // let jobtitle;
        // if (
        //     this.context.stores &&
        //     this.context.stores.ConfigStore.getFeatures().displayAgentsTitle &&
        //     contact.agenttitle &&
        //     contact.agenttitle.content
        // ) {
        //     jobtitle = `${contact.agenttitle.content}`;
        // }


        if (features.enableContactModalReredesign && window.cbreSiteTheme === "commercialr3" && !isIE) {
            return (
                <ContactModal
                    isShown={this.props.isShown}
                    closeHandler={this.props.closeHandler}
                    labels={labels}
                    contact={this.props.contact}
                    title={this.getContactModalTitle(name)}
                    RecipientEmailAddress={this.props.contact.email}
                    PropertyAddress={this.props.property.ActualAddress}
                    PropertyId={this.props.property.PropertyId}
                    recaptchaKey={this.props.recaptchaKey}
                    onClose={this.props.closeHandler}
                    ApiUrl={this.props.apiUrl}
                    SiteID={this.props.siteId}
                    property={this.props.property}
                    stores={this.context.stores}
                    getViewAllPropertiesByTranslationText={this.getViewAllPropertiesByTranslationText}
                    hideContactInfoOnModal={features.hideContactInfoOnModal}
                    brochureText={language.PdpDownloadBrochureButtonText}
                    requestType={this.props.requestType}
                    source={this.props.source}
                />
            );
        } else if (window.cbreSiteTheme === "commercialr4") {
            return (
                <ContactModalR4
                    isShown={this.props.isShown}
                    closeHandler={this.props.closeHandler}
                    labels={labels}
                    contact={this.props.contact}
                    title={this.getContactModalTitle(name)}
                    RecipientEmailAddress={this.props.contact.email}
                    PropertyAddress={this.props.property.ActualAddress}
                    PropertyId={this.props.property.PropertyId}
                    recaptchaKey={this.props.recaptchaKey}
                    onClose={this.props.closeHandler}
                    ApiUrl={this.props.apiUrl}
                    SiteID={this.props.siteId}
                    property={this.props.property}
                    stores={this.context.stores}
                    getViewAllPropertiesByTranslationText={this.getViewAllPropertiesByTranslationText}
                    hideContactInfoOnModal={features.hideContactInfoOnModal}
                    brochureText={language.PdpDownloadBrochureButtonText}
                    requestType={this.props.requestType}
                    source={this.props.source}
                    context={this.context}
                    features={features}
                />
            );
        } else {
            return (
                <Modal
                    className={this.props.classNames}
                    show={this.props.isShown}
                    onHide={this.props.closeHandler}
                    container={modalContainer}
                >
                    {window.cbreSiteTheme === "commercialr3"
                        ? (
                            <div>
                                <Modal.Header closeButton>
                                    <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-contact-on.png" className="contact-modal-header-icon" />
                                    <Modal.Title>{this.getContactModalTitle(name)}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {this.getModalBodyTopContentR3(contact)}
                                    {this.props.contact.email && (
                                        <ContactForm
                                            RecipientEmailAddress={this.props.contact.email}
                                            PropertyAddress={this.props.property.ActualAddress}
                                            PropertyId={this.props.property.PropertyId}
                                            recaptchaKey={this.props.recaptchaKey}
                                            labels={labels}
                                            onClose={this.props.closeHandler}
                                            ApiUrl={this.props.apiUrl}
                                            SiteID={this.props.siteId}
                                            RequestType={this.props.requestType}
                                            property={this.props.property}
                                        />
                                    )}
                                </Modal.Body>
                            </div>
                        ) : (
                            <div>
                                <Modal.Header closeButton>
                                    {this.getContactFormAvatar(contact)}
                                    <Modal.Title>{this.getContactModalTitle(name)}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {this.getModalBodyTopContent(contact)}
                                    {this.props.contact.email &&
                                        this.props.showContactDetails && (
                                            <label>
                                                <TranslateString string="ContactFormFieldMessageLabel" />
                                            </label>
                                        )}
                                    {this.props.contact.email && (
                                        <ContactForm
                                            RecipientEmailAddress={this.props.contact.email}
                                            PropertyAddress={this.props.property.ActualAddress}
                                            PropertyId={this.props.property.PropertyId}
                                            recaptchaKey={this.props.recaptchaKey}
                                            labels={labels}
                                            onClose={this.props.closeHandler}
                                            ApiUrl={this.props.apiUrl}
                                            SiteID={this.props.siteId}
                                            RequestType={this.props.requestType}
                                            property={this.props.property}
                                        />
                                    )}
                                </Modal.Body>
                            </div>
                        )
                    }
                </Modal>
            );
        }
    }
}

ContactFormModal.contextTypes = {
    spaPath: PropTypes.object,
    stores: PropTypes.object
};

export default injectIntl(ContactFormModal);
