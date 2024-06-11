import React from 'react';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';
import ContactForm from '../../../components/ContactForm/index';
import ContactAvatar from '../ContactAvatar/ContactAvatar';
import AddressSummary_R3 from '../AddressSummary/AddressSummary.r3';


export const ContactModal = (props) => {

    const { isShown, closeHandler, property, stores, recaptchaKey, ApiUrl, SiteID, labels, contact, title, getViewAllPropertiesByTranslationText, hideContactInfoOnModal, brochureText, requestType } = props;

    const modalContainer = document.getElementsByClassName('cbre-react-spa-container')[0];

    const emailExists = (contact && contact.email) ? true : false;

    let margin = 0;
    if (emailExists && (window.innerWidth < 768)) {
        margin = 415;
    }

    const contactInfoDom = (
        <React.Fragment>
            <ContactTelephone href={'tel:' + contact.telephone}>
                {contact.telephone}
            </ContactTelephone>
            <ContactEmail href={'mailto: ' + contact.email}>
                {contact.email}
            </ContactEmail>
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
                    <Modal.Title>{title}</Modal.Title>
                    <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-contact-on.png" className="contact-modal-header-icon" />
                </Modal.Header>
                <Modal.Body>
                    <ContactInfoSection style={emailExists ? { minHeight: '500px' } : {}}>
                        {property && property.ActualAddress &&
                            <AddressSection>
                                <AddressSummary_R3
                                    address={property.ActualAddress}
                                    floorsAndUnits={
                                        property.FloorsAndUnits
                                    }
                                    isParent={false}
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
                                <ContactAvatar name={contact.name} avatar={contact.avatar} dynamicImageSizing={stores.ConfigStore.getItem('features').dynamicImageSizing}/>
                                <ContactName>
                                    {contact.name}
                                </ContactName>
                                {!hideContactInfoOnModal &&
                                    contactInfoDom
                                }
                                {stores.ConfigStore.getConfig().viewAllPropertiesByBrokerLink && contact.email && contact.name &&
                                    <ContactProperties href={stores.ConfigStore.getConfig().viewAllPropertiesByBrokerLink + contact.email} target="_blank">
                                        {contact.name &&
                                            <span>
                                                {getViewAllPropertiesByTranslationText(contact)}
                                                <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/right-green-arrow.png" alt="right green arrow" />
                                            </span>
                                        }
                                    </ContactProperties>
                                }
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
                        />
                    }
                </Modal.Body>
            </ModalContainer>
        </Modal>
    );
};

export default ContactModal;





const ModalContainer = styled.div`
    background:#fff;
    font-family: futura-pt;

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #006b4c;
        flex-direction: row-reverse;
        margin-bottom: -10px;
        h4, .close {
            color: #fff;
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
        }
        button:hover {
            color:#fff !important;
            opacity:.85 !important;
        }
    }

    .modal-body {
        padding: 0 30px 15px !important;
        display:flex;

        > .ContactForm-message {
            > .cbre-spa--pre-line.failureMessage {
                margin-top:110px;
                min-width:230px;
            }
        }
        .ContactForm-form {
            font-family: futura-pt;
            width: 330px !important;
            .select-r3-container {
                min-height: 44px;
                color: #333;
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
                        border-top: 9px solid #69BE28;
                    }
                }
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
    font-size:16px;
    color:#333;
    margin-right:60px;
    min-width:241px;

    @media (max-width:767px){
        min-height: auto !important;
        margin-right:0;
        text-align:center;
    }
`;

const AddressSection = styled.div`
    margin-top:37px;
    span {
        font-size: 21px!important;
        color: #333;
        font-family: futura-pt;
        font-weight: 700!important;
    }
`;

const ContactBrochure = styled.a`
    display: flex;
    margin-top:15px;
    transition:.2s ease all;

    &:hover {
        filter: brightness(0.8);
    }

    span {
        color: #006A4d !important;
        font-size:14px !important;
        font-family: futura-pt;
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
    border-top:1px solid rgba(102, 102, 102, 0.7);
    margin-top:30px;
    padding-top:30px;
    margin-bottom:30px;
`;

const ContactName = styled.div`
    font-size: 21px!important;
    color: #333;
    font-family: futura-pt;
    font-weight: 700!important;
    margin-top:15px;
`;

const ContactTelephone = styled.a`
    color: #666 !important;
    font-size:18px;
    font-family: futura-pt;
    font-weight:500;
    transition: .2s ease all;

    &:hover {
        filter:brightness(0.50);
    }
`;

const ContactEmail = styled.a`
    color: #00A657;
    font-size:16px;
    font-weight:500;
    margin-top:3px;
    display:block;
    transition: .2s ease all;

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
