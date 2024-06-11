import React from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import ContactForm from '../../../components/ContactForm/index';
import ContactAvatar from '../../../r3/components/ContactAvatar/ContactAvatar';
import AddressSummary_R3 from '../../../r3/components/AddressSummary/AddressSummary.r3';
import { fireAnalyticsTracking } from '../../../ga4-analytics/send-event';
import { eventTypes } from '../../../ga4-analytics/event-types';
import { CreateBasicInteraction } from '../../../ga4-analytics/converters/interaction';


export const ContactModalR4 = (props) => {

    const { isShown, closeHandler, property, stores, recaptchaKey, ApiUrl, SiteID, labels, contact, hideContactInfoOnModal, brochureText, requestType, source, context, features } = props;

    const modalContainer = document.getElementsByClassName('cbre-react-spa-container')[0];

    const emailExists = (contact && contact.email) ? true : false;

    const language = stores.ConfigStore.getItem('i18n');

    let margin = 0;
    if (emailExists && (window.innerWidth < 768)) {
        margin = 0;
    }

    const sendInteractionGA4Event = (linkType, linkText, url) => {
        const interactionDetails = {
            source: 'ContactForm',
            interaction_type: 'click',
            interaction_target: linkType,
            cta_link_text: linkText,
            cta_link_destination: url,
            interaction_target_type: 'anchor', 
            interaction_id: null,
            is_cta: 'false'
        };
        fireAnalyticsTracking(features, context, eventTypes.INTERACTION, CreateBasicInteraction(property, interactionDetails));
    };

    const contactInfoDom = (
        <React.Fragment>
            {(SiteID !== 'in-comm') &&
                <ContactTelephone href={'tel:' + contact.telephone} onClick={() => sendInteractionGA4Event('phone', contact.telephone, 'tel:' + contact.telephone)}>
                    <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/gray-phone.png" />
                    {contact.telephone}
                </ContactTelephone>
            }
            {!features.hideEmailOnContactModal && 
                ((SiteID !== 'in-comm') ?
                <ContactEmail href={'mailto: ' + contact.email} onClick={() => sendInteractionGA4Event('email', contact.email, 'mailto: ' + contact.email)}>
                    <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/gray-mail.png" />
                    {contact.email}
                </ContactEmail>
                :
                <ContactEmail href={'mailto: gl_india_enquiries@cbre.com'} onClick={() => sendInteractionGA4Event('email', 'gl_india_enquiries@cbre.com', 'mailto: gl_india_enquiries@cbre.com')}>
                    <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/gray-mail.png" />
                    {'gl_india_enquiries@cbre.com'}
                </ContactEmail>)
            }
        </React.Fragment>
    );

    return (
        <Modal
            show={isShown}
            onHide={closeHandler}
            container={modalContainer}
            className={'contact-modal-r3'}
            style={{ overflowY: 'scroll' }}
        >
            <ModalContainer style={{ marginTop: margin + 'px' }}>
                <Modal.Header closeButton>
                    {/* <Modal.Title>{title}</Modal.Title> */}
                    {/* <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-contact-on.png" className="contact-modal-header-icon" /> */}
                </Modal.Header>
                <Modal.Body>
                    <ContactInfoSection style={emailExists ? { minHeight: '500px', minWidth: '450px' } : {}}>
                        {property && property.ActualAddress &&
                            <AddressSection>
                                <AddressSummary_R3
                                    address={property.ActualAddress}
                                    floorsAndUnits={
                                        property.FloorsAndUnits
                                    }
                                    isParent={(!property.ParentPropertyId)}
                                    propertyCount={1}
                                />
                                {property.Brochures && property.Brochures[0] &&
                                    <ContactBrochure href={property.Brochures[0].uri} target="_blank">
                                        <span>{brochureText ? brochureText : 'Download Brochure'}</span>
                                        <img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/right-green-arrow.png" alt="right green arrow" />
                                    </ContactBrochure>
                                }
                            </AddressSection>
                        }
                        {contact &&
                            <ContactInfo>
                                <ContactTitle>
                                    {!features.hideContactFormAssociatedContactLabel && (language["ContactFormAssociatedContactLabel"] || "Associated Contact")}
                                </ContactTitle>
                                <ContactContainer>
                                    <ContactAvatar name={contact.name} avatar={contact.avatar} dynamicImageSizing={stores.ConfigStore.getItem('features').dynamicImageSizing} />
                                    <ContactPersonalInfo>
                                        <ContactName>
                                            {contact.name}
                                        </ContactName>
                                        {
                                            contactInfoDom
                                        }
                                    </ContactPersonalInfo>
                                </ContactContainer>
                                {/* {stores.ConfigStore.getConfig().viewAllPropertiesByBrokerLink && contact.email && contact.name &&
                                    <ContactProperties href={stores.ConfigStore.getConfig().viewAllPropertiesByBrokerLink + contact.email} target="_blank">
                                        {contact.name &&
                                            <span>
                                                {getViewAllPropertiesByTranslationText(contact)}
                                                <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/right-green-arrow.png" alt="right green arrow" />
                                            </span>
                                        }
                                    </ContactProperties>
                                } */}
                            </ContactInfo>
                        }
                    </ContactInfoSection>
                    {emailExists &&
                        <ContactForm
                            RecipientEmailAddress={contact.email}
                            AgentOffice={property.Agents && property.Agents.length > 0 && property.Agents[0].office}
                            PropertyAddress={property.ActualAddress}
                            PropertyId={property.PropertyId}
                            recaptchaKey={recaptchaKey}
                            labels={labels}
                            onClose={closeHandler}
                            ApiUrl={ApiUrl}
                            SiteID={SiteID}
                            contact={contact}
                            hideContactInfoOnModal={hideContactInfoOnModal ? contactInfoDom : <React.Fragment></React.Fragment>}
                            RequestType={requestType}
                            property={property}
                            source={source}
                        />
                    }
                </Modal.Body>
            </ModalContainer>
        </Modal>
    );
};

export default ContactModalR4;


const ContactTitle = styled.div`
    color: ##003F2D;
    font-family: 'Financier Regular';
    font-weight: 500;
    font-size: 32px;
    margin-bottom:15px;
`;

const ContactContainer = styled.div`
    > div:nth-of-type(1) {
        margin-top:12px;
        display:flex !important;
    }
    > div {
        display: block !important;
        float:left !important;
    }
`

const ContactPersonalInfo = styled.div`
    margin-left:15px;
`;

const ModalContainer = styled.div`
    background:#fff;
    font-family: Calibre Medium;

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        flex-direction: row-reverse;
        margin-bottom: -10px;
        h4 {
            color: #fff;
        }
        .close {
            color: #333;
        }
        img {
            margin-left: 10px !important;
        }
        .modal-title {
            span {
                font-weight:500;
            }
        }
        button{
            transition:.2s ease all;
            font-size:24px !important;
            margin-top:0 !important;
            color: #333;
        }
        button:hover {
            opacity:.85 !important;
        }
    }

    .select-r3-container, #Company {
        width: calc(50% - 5px) !important;
        float: left !important;
    }

    .select-r3-container {max-height:46px; margin-right:5px;
        > .selectPlaceholder.show {
            > div {
                opacity: .6;
            }
        }
    }

    @media screen and (max-width:480x){
        .modal-body {
            padding: 0 !important;
        }
    }

    .modal-body {
        padding: 0 30px 40px !important;
        display:flex;



        .contact_button_wrapper {
            > button {
                background: #003F2D; !important;
                width: auto !important;
                color: #fff !important;
                font-family: 'Calibre Medium' !important;
                padding: 0 24px !important;
                margin-bottom: 5px;
            }
        }

        .ContactForm-message {
            min-width: 35vw !important;
            background: transparent !important;
        }

        form {
            input, .select-r3-container, textarea {
                border-top: none !important;
                border-left:none !important;
                border-right:none !important;
            }
            #disclaimer, #recaptchaDisclaimer {
                color: rgba(0,0,0,0.9) !important;
                > a {
                    color: #003F2D !important;
                }
            }
        }

        .form-control {
            color: rgba(0,0,0,0.65) !important;
        }

        div {
            > span {
                > a {
                    color: #003F2D !important;
                }
            }
        }

        > .ContactForm-message {
            > .cbre-spa--pre-line.failureMessage {
                margin-top:110px;
                min-width:230px;
            }
        }
        .ContactForm-form {
            font-family: 'Calibre Medium';
            width: 34vw !important;
            .select-r3-container {
                min-height: 44px;
                color: rgba(0,0,0,0.5);
                border: 1px solid #ccc;
                font-size: 18px;
                margin-bottom: 18px;
                align-items: center;
                text-indent: 15px;
                .selectControl {
                    cursor: pointer;
                }
                .selectPlaceholder {
                    opacity: .5;
                    margin-top:7px;
                }
                .selectOption {
                    padding-left:0 !important;
                }
                .selectMenuOuter {
                    position: absolute;
                    background: #fff;
                    min-width: 330px;
                }
                .selectValueLabel {
                    color: #333;
                    margin-top: 20px;
                    font-size:16px;
                    font-weight: normal !important;
                }
                .selectArrowZone {
                    float: right;
                    display: block;
                    position: relative;
                    top: -7px;
                    right: 12px;
                    .selectArrow {
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 9px solid rgba(0,0,0,0.4);
                    }
                }
            }
        }
        @media screen and (max-width:767px){
            .ContactForm-form {
                width: 100% !important;
            }
        }
    }

    .cbre-spa--pre-line {
        d:nth-of-type(1){
            margin-top:20px;
        }
        a:nth-of-type(1){
            margin: 14px 0 10px;
            display:block;
        }
    }

    @media (max-width:767px){
        .modal-title {
            span {
                margin-left:auto !important;
            }
        }
        .contact-form-container {
            margin: 15px 0 60px 0 !important;
        }
        .modal-body {
            display:flex;
            flex-direction:column;
        }
    }
`;

const ContactInfoSection = styled.div`


    @media (max-width:767px){
        min-height: auto !important;
        margin-right: -15px !important;
        margin-left: -15px !important;
        text-align:center;
        display: none !important;
        > div {
            margin-right: 0 !important;
            #addressLine1 {
      
                > span {
                    font-size: 32px !important;
                }
            }
        }
    }

`;

const AddressSection = styled.div`
    margin-right:35px;
    span {
        font-family: 'Financier Regular';
        font-style: normal;
        font-weight: normal;
        font-size: 56px !important;
        line-height: 52px;
        
        letter-spacing: -0.01em;
        
        color: #003F2D;
        #addressLine2 {
            > span {
                color: #262626 !important;
                font-size: 20px !important;
                position:relative;
                top: -15px;
            }
        }
    }
`;

const ContactBrochure = styled.a`
    display: flex;
    margin-top:0;
    transition:.2s ease all;
    align-items:center;

    &:hover {
        filter: brightness(0.8);
    }

    span {
        color: #006A4d !important;
        font-size:14px !important;
        font-family: 'Calibre Medium';
        font-weight:500 !important;
        text-transform: uppercase;
    }

    img {
        height:10px !important;
        width: auto !important;
        margin-left:5px;
        margin-top:4px;
    }

    @media (max-width:767px){
        display:flex;
        justify-content: center;
    }
`;

const ContactInfo = styled.div`
    margin-top:45px;
    padding-top:15px;
    background: #E6EAEA;
    display:block;
    float:left;
    width:90%;
    padding-left: 15px;
    padding-bottom: 30px;

    @media screen and (max-width:520px){
        display: none;
    }
`;

const ContactName = styled.div`
    font-size: 20px!important;
    color: #012A2D;
    font-family: 'Calibre Medium';
    font-weight: 500!important;
    margin-top:5px;
`;

const ContactTelephone = styled.a`
    color: rgb(102, 102, 102) !important;
    font-size:16px;
    font-family: 'Calibre Medium';
    transition: .2s ease all;
    display:flex !important;
    align-items:center;
    margin-top:8px;
    > img {
        max-height: 22px !important;
        width: 13px !important;
        margin-right: 11px;
        margin-left:3px;
        opacity: 0.75;
    }

    &:hover {
        filter:brightness(0.50);
    }
`;

const ContactEmail = styled.a`
    color: rgb(102, 102, 102) !important;
    font-size:16px;
    font-family: 'Calibre Medium';
    margin-top:3px;
    display:block;
    transition: .2s ease all;
    margin-top:8px;
    display:flex !important;
    align-items:center;
    > img {
        max-height: 16px !important;
        width: 20px !important;
        margin-right:8px;
        opacity: 0.75;
    }

    &:hover {
        filter:brightness(0.8);
    }
`;

const ContactProperties = styled.a`
    font-size:14px;
    font-weight:500;
    color: #006A4D !important;
    margin-top:15px;
    display: block;
    transition: .2s ease all;

    &:hover {
        filter:brightness(0.8);
    }

    > span {
        display: flex;
        span {
            text-transform: uppercase;
        }
         > img {
            width:auto !important;
            height: 10px !important;
            margin-left:5px;
            margin-top:4px;
        }
    }

    @media (max-width:767px){
        > span {
            justify-content: center;
        }
    }
`;
