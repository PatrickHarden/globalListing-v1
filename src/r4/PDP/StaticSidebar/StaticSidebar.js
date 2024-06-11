import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Sticky } from 'react-sticky';
import IconButton from '@mui/material/IconButton';
import { Avatar } from '../../../external-libraries/agency365-components/components';
import Affiliates from '../Affiliates/Affiliates';

export const StaticSidebar = (props) => {

    const { property, showContactForm, features, language, context, stickyOffset, isMobile, affiliates } = props;

    const { ContactGroup } = property;

    const [offSet, setOffSet] = useState(false);

    const [displayNumber, setDisplayNumber] = useState(false);

    const handleStickyChange = () => {
        setOffSet(!offSet)
    }

    const sideBarCodeBlock = (
        <StaticSidebarContainer className="staticSidebar" key={"staticSidebar"} stickyOffset={stickyOffset}>
            <SidebarHeader>{language.ContactFormTitle ? language.ContactFormTitle : 'Get in touch'}</SidebarHeader>
            <div>
                {ContactGroup.contacts.map(contact => (
                    <ContactContainer onClick={features.showMobileNumber?()=>{} : (e) => { showContactForm(e, contact || {}, "Arrange a Viewing") }}>
                        <div className="singleContact">
                            <ContactName>
                                {contact.name}
                            </ContactName>
                            {(features.showBrokerTitle && contact.agenttitle.content != '') &&
                                <ContactTitle>
                                    {contact.agenttitle.content}
                                </ContactTitle>
                            }
                            {contact.license &&

                                <License>
                                    {context.stores.ConfigStore.getItem('i18n').LicenseNumberPrefix ? context.stores.ConfigStore.getItem('i18n').LicenseNumberPrefix : "Lic."} {contact.license}
                                </License>
                            }
                            <Icons>
                                <IconContainer>
                                    <IconLink onClick={features.showMobileNumber?()=>setDisplayNumber(true) : ()=>{}}>
                                        <IconButton href={displayNumber && features.showMobileNumber ? 'tel:' + contact.telephone : null}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 15.6V2C3 0.9 3.9 0 5 0H15C16.1 0 17 0.9 17 2V15.6H3ZM3 18C3 19.1 3.9 20 5 20H15C16.1 20 17 19.1 17 18V17.6H3V18Z" fill="#003F2D" />
                                            </svg>
                                            {(!displayNumber) ?
                                                <div>{context.stores.ConfigStore.getItem('i18n').PDPMobile || 'Mobile'}</div> :
                                                <ContactNumber >{contact.telephone}</ContactNumber>
                                            }
                                        </IconButton>
                                    </IconLink>
                                </IconContainer>
                                <IconContainer>
                                    <IconLink onClick={(e) => { showContactForm(e, contact || {}, "Arrange a Viewing") }}>
                                        <IconButton>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.9348 11.2544L0 5C0 3.9 0.9 3 2 3H18C19.1 3 20 3.9 20 5L11.0652 11.2544C10.5076 11.6444 9.4924 11.6444 8.9348 11.2544ZM10 13.544C9.204 13.544 8.4084 13.3272 7.788 12.8932L0 7.4412V15C0 16.1 0.9 17 2 17H18C19.1 17 20 16.1 20 15V7.4412L12.212 12.8928C11.5916 13.3268 10.796 13.544 10 13.544Z" fill="#003F2D" />
                                            </svg>
                                            {context.stores.ConfigStore.getItem('i18n').PDPEmail || 'Email'}
                                        </IconButton>
                                    </IconLink>
                                </IconContainer>
                            </Icons>

                        </div>
                        {
                            useMemo(() =>
                                <Avatar
                                    key={contact.avatar}
                                    src={contact.avatar}
                                    altText={contact.name}
                                    cssClass={'cbre_avatar_r4'}
                                />
                                , [])
                        }
                    </ContactContainer>
                ))}
            </div >
            <ContactButton onClick={(e) => { showContactForm(e, ContactGroup.contacts[0] || {}, "Arrange a Viewing") }}>{language.PdpArrangeViewingButtonText ? language.PdpArrangeViewingButtonText : 'Contact For Details'}</ContactButton>
            <Affiliates  {...props} />
        </StaticSidebarContainer>
    )

    if (ContactGroup && ContactGroup.contacts && ContactGroup.contacts.length > 0) {
        return (
            <React.Fragment>
                {isMobile ?
                    <MobileSidebar>
                        {sideBarCodeBlock}
                    </MobileSidebar>
                    :
                    <StyledSticky topOffset={stickyOffset} offSet={offSet} stickyOffset={stickyOffset} onStickyStateChange={handleStickyChange} isSticky={false}>
                        {sideBarCodeBlock}
                    </StyledSticky>
                }
            </React.Fragment>

        );
    } else {
        return null;
    }
}


const MobileSidebar = styled.div`

`;


const ContactName = styled.div`
    margin: 16px 0px;
    font-family: 'Calibre' !important;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    color: #012A2D;
    transition: .2s ease all;
    cursor: pointer;
    &:hover {
        opacity: .8;
    }
`;

const ContactNumber = styled.div`
   font-size: 12px;
`;

const License = styled.div`
    margin: 16px 0px;
    position: static;
    width: 206px;
    height: 22px;
    left: 0px;
    top: 102px;
    font-family: 'Calibre' !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 22px;
    color: #003F2D;
    display : block;
`;

const ContactTitle = styled.div`
    margin: 16px 0px;
    font-family: 'Calibre' !important;
    font-style: normal !important;
    font-weight: 400 !important;
    font-size: 16px !important;
    line-height: 22px;
    color: #435254;
    position: static;
    width: 206px;
    left: 0px;
    top: 42px;
    display : block;
`;

const StaticSidebarContainer = styled.div`
    background-color: #E6EAEA;
    min-height:200px;
    float:right;
    max-width:400px;
    width:100%;
    margin-top: 0px;
    margin-right:40px;
    margin-bttom: 30px;
    ${({ stickyOffset }) => (stickyOffset === -46) ? `margin-top:30px;` : `margin-top:0px;`}

    @media screen and (max-width: 767px){
        margin: 0 !important;
    }

    .MuiTooltip-tooltip {
        background: #538184 !important;
    }
`;

const IconLink = styled.a`
    color: #003F2D !important;
`;

const SidebarHeader = styled.h6`
    color: #003F2D !important;
    font-size: 32px !important;
    font-family: 'Financier Regular' !important;
    padding-left:20px;
    margin-top:20px !important;
    margin-bottom:20px !important;
`;

const ContactContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 25px;
    margin-bottom:20px;
    align-items: center;
    .singleContact {
        width: 60%;
        font-size:20px;
    }
`;

const IconContainer = styled.div`
    font-size:16px;
    display:flex;
    color: #003F2D !important;
    font-family: 'Calibre Regular';
    text-indent: 8px;
    margin-top:8px;
    svg {
        margin-right: 9px;
    }
`;

const Icons = styled.div`
    display:flex;
    justify-content: space-between;
    margin-top:-3px;
`;

const StyledSticky = styled(Sticky)`
   
`;

const ContactButton = styled.button`
    background: #003F2D;
    color: #fff !important;
    margin-left: 20px !important;
    width: 100%;
    max-width: 360px;
    padding: 5px;
    margin-bottom: 20px !important;
    font-size: 20px !important;
    margin-top: 8px !important;
    transition: .2s ease all;
    border: none !important;
    &:hover {
        background: #17E88F;
        color: #003F2D !important;
    }
`;

export default StaticSidebar;