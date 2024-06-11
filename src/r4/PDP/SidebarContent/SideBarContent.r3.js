import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, Button, List, CollapsibleBlock } from '../../../external-libraries/agency365-components/components';
import StampDutyCalculator from '@ryanshaug/globallistings-test-stamp-duty-calculator';
import _CollapsibleBlock from '../../../list-map-components/CollapsibleBlock/CollapsibleBlock';
import ContactList_R3 from '../ContactList/ContactList.r3';
import trackingEvent from '../../../utils/trackingEvent';
import getFormattedString from '../../../utils/getFormattedString';
import classNames from 'classnames';
import getPath from 'getpath';
import { createDataTestAttribute } from '../../../utils/automationTesting';

class SideBarContent_R3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideAvatar: false
        };
    }


    renderHighlights() {
        const { property, breakpoints, siteType } = this.props;

        if (siteType !== 'residential' || !property.Highlights || !property.Highlights.length) {
            return null;
        }

        return (
            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                    <_CollapsibleBlock
                        title={this.context.language.PdpFeaturesTitle}
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={!breakpoints.isMobile}
                        innerClassName="padding-xs-1"
                    >
                        <List
                            columns={2}
                            className="cbre_bulletList textCol-xs-1 textCol-sm-2 textCol-md-1"
                        >
                            {property.Highlights.map(function (highlight, i) {
                                return (
                                    <li key={`highlight_${i}`}>{highlight}</li>
                                );
                            })}
                        </List>
                    </_CollapsibleBlock>
                </div>
            </div>
        );
    }


    handleStampDutyCalculator = () => {
        trackingEvent('pdpLaunchStampDutyCalculator', { propertyId: this.props.property.PropertyId }, this.context.stores, this.context.actions);

        if (this.props.openStampDutyTaxCalculatorFunc) {
            this.props.openStampDutyTaxCalculatorFunc();
        }
    };


    renderStampDutyCalculator = () => {
        const { siteType } = this.props;

        const enableSdc = this.context.stores.ConfigStore.getItem(
            'enableStampDutyCalculator'
        );

        const buttonClass =
            siteType === 'residential'
                ? 'cbre_button__secondary'
                : 'cbre_button__primary';


        if (this.props.searchType === 'isSale' && enableSdc) {
            const { language } = this.context;
            const SdcConfig = this.context.stores.ConfigStore.getItem(
                'stampDutyConfig'
            );
            const calculatorPrice = this.getCalculatorPropertyPrice();

            const stampDutyButton = (
                <Button
                    className={`cbre_button cbre_button__flat ${buttonClass} row`}
                    onClick={this.handleStampDutyCalculator}
                    data-test={createDataTestAttribute(null, 'stamp-duty-button')}
                >
                    <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                        <FontIcon
                            className="cbre_icon"
                            iconName="icon_calculator"
                        />
                        <span className="cbre_button_text">
                            {language.PdpStampDutyCalculatorButtonText}
                        </span>
                    </div>
                </Button>
            );

            const componentProps = {
                title: stampDutyButton,
                className: 'collapsableBlock',
                bodyClassName: 'collapsableBlock_body',
                innerClassName: 'collapsableBlock_body_inner',
                titleClassName: 'cbre_title'
            };

            return (
                <li>
                    <CollapsibleBlock {...componentProps}>
                        <StampDutyCalculator
                            propertyPrice={calculatorPrice}
                            config={SdcConfig}
                        />
                    </CollapsibleBlock>
                </li>
            );
        }
    };


    renderContacts = property => {
        const { siteType } = this.props;
        if (siteType !== 'residential') {
            return (
                <ContactList_R3
                    property={property}
                    className="cbre_verticalList contactList_block_R3"
                    limit={50}
                    showContactForm={this.props.showContactForm}
                />
            );
        } else {
            const { ContactGroup } = property;
            if (
                !ContactGroup ||
                !ContactGroup.contacts ||
                !ContactGroup.contacts.length ||
                !ContactGroup.contacts[0].telephone
            ) {
                return;
            }

            const firstContact = ContactGroup.contacts[0];

            return (
                <Button
                    link={`tel:${firstContact.telephone.replace(/ /g, '')}`}
                    className="cbre_button cbre_button__flat cbre_button__primary row"
                    data-test={createDataTestAttribute('contact-button', firstContact.name)}
                >
                    <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                        <span className="cbre_icon_phone_right cbre_icon" />
                        <span className="cbre_button_text">
                            <span>{ContactGroup.name}</span>
                            <span>{firstContact.telephone}</span>
                        </span>
                    </div>
                </Button>
            );
        }
    };


    renderArrangeViewing = (sharedButtonClasses, siteTypeClass) => {
        const { property } = this.props;

        const { language, stores } = this.context;

        const features = stores.ConfigStore.getItem('features');
        var PdpArrangeButtonText=
            features.useContactAgent && (this.props.property.Aspect[0]=="isSold" || this.props.property.Aspect[0]=="isLeased")?language.PdpContactAgentButtonText:language.PdpArrangeViewingButtonText;
        if (
            features.hideArrangeViewingOnParent &&
            features.childListings &&
            features.childListings.enableChildListings &&
            !property.ParentPropertyId
        ) {
            return null;
        } else if (
            features.childListings &&
            features.childListings.enableChildListings &&
            property.ParentPropertyId
        ) {
            return (
                <li>
                    <Button
                        onClick={this.showContactFormListing}
                        className={classNames(
                            sharedButtonClasses,
                            siteTypeClass
                        )}
                        data-test={createDataTestAttribute(null, 'arrange-viewing-button')}
                    >
                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                            <img alt="Contact for Details"
                                src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4_email.png"
                                className="arrange_viewing_icon_R3"
                            />
                            <span className="cbre_button_text text_R3" style={{fontSize: "16px"}}>
                                {PdpArrangeButtonText}
                            </span>
                            <img alt="Contact for Details"
                                src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-arrow-long.png"
                                className="arrow_long_icon_R3"
                            />
                        </div>
                    </Button>
                </li>
            );
        } else {
            return (
                <li>
                    <Button
                        onClick={this.showContactForm}
                        className={classNames(
                            sharedButtonClasses,
                            siteTypeClass,
                            'text'
                        )}
                        data-test={createDataTestAttribute(null, 'open-contact-form-button')}
                    >
                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                            <img
                                src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4_email.png"
                                className="arrange_viewing_icon_R3"
                            />
                            <span className="cbre_button_text text_R3" style={{fontSize: "16px"}}>
                                {PdpArrangeButtonText}
                            </span>
                            <img
                                src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-arrow-long.png"
                                className="arrow_long_icon_R3"
                            />
                        </div>
                    </Button>
                </li>
            );
        }
    };


    renderJumpToChildProperties = (sharedButtonClasses, siteTypeClass) => {
        const { property } = this.props;

        const { language, stores } = this.context;

        const features = stores.ConfigStore.getItem('features');

        if (
            features.jumpToChildProperties &&
            features.childListings &&
            features.childListings.enableChildListings &&
            !property.ParentPropertyId
        ) {
            return (
                <li>
                    <Button
                        className={classNames(
                            sharedButtonClasses,
                            siteTypeClass
                        )}
                        link="#child-properties"
                    >
                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                            <FontIcon
                                className="cbre_icon"
                                iconName="icon_loupe"
                            />
                            <span className="cbre_button_text">
                                {language.PdpViewChildPropertiesText}
                            </span>
                        </div>
                    </Button>
                </li>
            );
        }
        return null;
    };


    getCalculatorPropertyPrice = () => {
        const property = this.props.property;

        const calculatorPrice = property.Charges.find(charges => {
            const { currencyCode, chargeType } = charges;
            return currencyCode === 'GBP' && chargeType === 'SalePrice';
        });

        return calculatorPrice ? calculatorPrice.amount : null;
    };


    getLightboxItemIndexFromDataType = lightboxDataType => {
        const { PropertyStore } = this.context.stores;

        const lightboxItems = PropertyStore.getPropertyLightboxData();

        return lightboxItems.findIndex(
            item => item.dataType === lightboxDataType
        );
    };


    handleCallToActionButtonOnClick = index => {
        this.props.openLightboxFunc(index);
    };


    renderAvatar = url => {
        const { ConfigStore } = this.context.stores;
        const cdnUrl = ConfigStore.getItem('cdnUrl');
        if (!url || this.state.hideAvatar) {
            return null;
        }

        let classes =
            'col-xs-12 col-md-12 col-lg-12 marginBottom-xs-1 center-block';
        if (this.props.siteType === 'residential') {
            classes += ' marginTop-xs-1';
        }

        return (
            <div className={classes}>
                <img
                    src={cdnUrl + url}
                    onError={() => this.setState({ hideAvatar: true })}
                    className="cbre_sidebar__logo"
                />
            </div>
        );
    };


    renderCallToAction = (url, buttonText, buttonClasses, icon, dataType, className) => {
        const { ConfigStore } = this.context.stores;

        if (url && url.length !== 0) {
            const cdnUrl = ConfigStore.getItem('cdnUrl');
            const assetUrl = cdnUrl ? cdnUrl + url : url;

            // Open in lighbox if asset is a JPEG, PNG or GIF image.
            if (
                dataType == 'floorplan' &&
                /\.(jpg|jpeg|png|gif)$/i.test(assetUrl)
            ) {
                const index = this.getLightboxItemIndexFromDataType(dataType);

                return (
                    <li>
                        <div className="line_R3" />
                        <Button
                            onClick={function (e) {
                                e.preventDefault();
                                this.handleCallToActionButtonOnClick(index);
                            }.bind(this)}
                            className={buttonClasses}
                            data-test={createDataTestAttribute('call-to-action-button', index)}
                        >
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <div
                                    className={dataType == 'website' ? 'view_property_website' : (dataType == 'floored') ? 'floorplan3d_icon_R3' : 'floorplan_icon_R3'}
                                />
                                <span className="cbre_button_text text_other_R3">
                                    {buttonText}
                                </span>
                            </div>
                        </Button>
                    </li>
                );
            } else {
                // Open in new tab for PDFs.
                let trackingId = 'pdpCallToAction';

                switch (dataType) {
                    case 'floorplan':
                        trackingId = 'floorplanPDF';
                        break;
                    case 'website':
                        trackingId = 'viewWebsite';
                        break;
                    case 'epc':
                        trackingId = 'detailsViewEPC';
                        break;
                    case 'floored':
                        trackingId = 'detailsViewFlooredLink';
                        break;
                    case 'related':
                        trackingId = 'relatedPropertyLink';
                        break;
                }

                return (
                    <li>
                        <div className="line_R3" />
                        <Button
                            link={assetUrl}
                            target="_blank"
                            rel="noopener"
                            className={buttonClasses}
                            data-test={createDataTestAttribute('button-other', buttonText)}
                            onClick={() => {
                                trackingEvent(
                                    trackingId,
                                    {
                                        propertyId: this.props.property
                                            .PropertyId
                                    },
                                    this.context.stores,
                                    this.context.actions
                                );
                                window.open(assetUrl);
                            }}
                        >
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                {icon && <div
                                    className={dataType == 'website' ? 'view_property_website' : (dataType == 'floored') ? 'floorplan3d_icon_R3' : 'floorplan_icon_R3'}
                                />}
                                <span className={`cbre_button_text${className ? ` ${className}` : ''} text_other_R3`}>
                                    {buttonText}
                                </span>
                            </div>
                        </Button>
                    </li>
                );
            }
        }
    };


    renderPropertyBrochure() {
        const { property } = this.props;
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        let brochureArray = []; // Array to hold both property.Brochures and Common.Links

        // Add Property.Brochures
        if (Array.isArray(property.Brochures)) {
            property.Brochures.forEach(b => {brochureArray.push(b)});
        } else {
            if (property.Brochures && property.Brochures != '' && property.Brochures != ' '){
                brochureArray.push(property.Brochures);
            }
        }

        // Add brochure links from Common.Links
        if (property.Links) {
            property.Links.forEach(link => {
                if (link.urlType && link.url) {
                    if (link.urlType == 'Brochure') {
                        brochureArray.push(link.url);
                    }
                }
            });
        }

        // Remove any duplicates
        brochureArray = [...new Set(brochureArray)];

        // Reduce down to unique uris
        let brochureArrayUniqueUris = [];
        brochureArray.forEach(t => {
            if (!brochureArrayUniqueUris.some(b => b.uri == t.uri)){
                brochureArrayUniqueUris.push(t);
            }
        });

        brochureArray = brochureArrayUniqueUris;

        if (brochureArray && brochureArray.length > 0) {
            const viewBrochureButton = (
                <div>
                    <div className="line_R3" />
                    <Button
                        className={
                            'cbre_button cbre_button__flat cbre_button__secondary row text_other_R3'
                        }
                        onClick={() => {
                            trackingEvent(
                                'detailsViewBrochure',
                                {
                                    propertyId: this.props.property.PropertyId
                                },
                                this.context.stores,
                                this.context.actions
                            );
                        }}
                        data-test={createDataTestAttribute(null, 'brochure-button')}
                    >

                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                            <div
                                className="pdf_icon_R3"
                            />
                            <span className="cbre_button_text text_other_R3">
                                {language.PdpDownloadBrochureButtonText}
                            </span>
                        </div>
                    </Button>
                </div>

            );

            const componentProps = {
                title: viewBrochureButton,
                className: 'collapsableBlock',
                bodyClassName: 'collapsableBlock_body',
                innerClassName: 'collapsableBlock_body_inner paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            return (
                <li style={{backgroundColor: "#E6EAEA"}}>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {brochureArray.map(function (
                                        brochure,
                                        i
                                    ) {
                                        const brochureTitle =
                                            brochure.brochureName ||
                                            (features.displayGenericBrochureName
                                                ? language.GenericBrochureName +
                                                ' ' +
                                                (i + 1)
                                                : decodeURI(
                                                    brochure.uri
                                                        .split('/')
                                                        .pop()
                                                        .split('#')[0]
                                                        .split('?')[0]
                                                ));
                                        return (
                                            <li key={`brochure_${i + 1}`}>
                                                <Button
                                                    className="cbre_blockLink"
                                                    link={brochure.uri}
                                                    target="_blank"
                                                    rel="noopener"
                                                >
                                                    {brochureTitle}
                                                    <span className="sr-only">
                                                        {
                                                            language.SrOnlyPdfButton
                                                        }
                                                    </span>
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </CollapsibleBlock>
                </li>
            );
        }
    }

    render3dFloorplanLink() {
        const { property } = this.props;
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        let walkThroughArray = [];

        if (Array.isArray(property.Walkthrough)) {
            walkThroughArray = walkThroughArray.concat(property.Walkthrough);
        } else {
            if (property.Walkthrough && property.Walkthrough != '' && property.Walkthrough != ' '){
                walkThroughArray.push(property.Walkthrough);
            }
        }

        if(features.combineWalkthroughAndFlooredURL){
            if (Array.isArray(property.FlooredURL)){
                walkThroughArray = walkThroughArray.concat(property.FlooredURL);
            }else{
                if (property.FlooredURL && property.FlooredURL != '' && property.FlooredURL != ' '){
                    walkThroughArray.push(property.FlooredURL);
                }
            } 
        }

        // Add Walkthroughs & FlooredUrls from Common.Links
        if (property.Links) {
            property.Links.forEach(link => {
                if (link.urlType && link.url) {
                    if (link.urlType == 'Walkthrough' || link.urlType == 'Floored') {
                        walkThroughArray.push(link.url);
                    }
                }
            });
        }

        // Remove any duplicates
        walkThroughArray = [...new Set(walkThroughArray)];

        // Remove Walkthrough from CTA if it's already in the carousel
        if (features && features.disableCarouselWalkthrough == false) {
            if (Array.isArray(property.Walkthrough)) {
                property.Walkthrough.forEach(i => {
                    walkThroughArray = walkThroughArray.filter(j => j !== i)
                });
            }else{
                walkThroughArray = walkThroughArray.filter(item => item !== property.Walkthrough)
            }
        }

        if (walkThroughArray.length == 0) {
            return;
        }

        if (walkThroughArray.length == 1) {
            const buttonText = language.PdpViewInteractiveplanButtonText;

            if (walkThroughArray[0] == '' || walkThroughArray[0] == ' ')
                return;

            const walkthroughTitle = buttonText ? buttonText : decodeURI(
                walkThroughArray[0]
                    .split('/')
                    .pop()
                    .split('#')[0]
                    .split('?')[0]
            );

            return (
                <li>
                    <div className="line_R3" />
                    <Button
                        link={walkThroughArray[0]}
                        className={'cbre_button cbre_button__flat cbre_button__secondary row'}
                        onClick={() => { window.open(walkThroughArray[0]); }}
                        data-test={createDataTestAttribute(null, 'walkthrough-button')}
                    >
                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block 3dFloorplan">
                            <div className="floorplan3d_icon_R3" />
                            <span className="cbre_button_text text_other_R3">
                                {walkthroughTitle}
                            </span>
                        </div>
                    </Button>
                </li>
            );
        } else {
            // use multiple link translation if it's available
            let buttonText = language.PdpViewInteractiveplanButtonTextMultiple ? language.PdpViewInteractiveplanButtonTextMultiple : language.PdpViewInteractiveplanButtonText;

            // fallback if no translation exists
            if (!buttonText){
                buttonText = decodeURI(
                    walkThroughArray[0]
                        .split('/')
                        .pop()
                        .split('#')[0]
                        .split('?')[0]
                );
            }

            const viewWalkthroughButton = (
                <li>
                    <Button
                        className={
                            'cbre_button cbre_button__flat cbre_button__secondary row text_other_R3'
                        }
                        onClick={() => {
                            trackingEvent(
                                'detailsViewBrochure',
                                {
                                    propertyId: this.props.property.PropertyId
                                },
                                this.context.stores,
                                this.context.actions
                            );
                        }}
                        data-test={createDataTestAttribute(null, 'walkthrough-button')}
                    >

                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block 3dFloorplan">
                            <div
                                className="floorplan3d_icon_R3"
                            />
                            <span className="cbre_button_text text_other_R3">
                                {buttonText}
                            </span>
                        </div>
                    </Button>
                </li>

            );

            const componentProps = {
                title: viewWalkthroughButton,
                className: 'collapsableBlock',
                bodyClassName: '',
                innerClassName: 'paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            return (
                <li style={{backgroundColor: "#E6EAEA"}}>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {walkThroughArray.map((walkthrough, i) => {
                                        let walkthroughTitle = buttonText ? buttonText : decodeURI(
                                            walkthrough
                                                .split('/')
                                                .pop()
                                                .split('#')[0]
                                                .split('?')[0]
                                        );
                                        
                                        if (language.PdpViewInteractiveplanButtonText1 && language.PdpViewInteractiveplanButtonText2){
                                            if (i == 0){
                                                walkthroughTitle = language.PdpViewInteractiveplanButtonText1;
                                            } else {
                                                walkthroughTitle = language.PdpViewInteractiveplanButtonText2;
                                            }
                                        }

                                        return (
                                            <li key={`brochure_${i + 1}`}>
                                                <Button
                                                    className="cbre_blockLink"
                                                    link={walkthrough}
                                                    target="_blank"
                                                    rel="noopener"
                                                    style={{ padding: '15px 0' }}
                                                >
                                                    {walkthroughTitle}
                                                    <span className="sr-only">
                                                        {
                                                            language.SrOnlyPdfButton
                                                        }
                                                    </span>
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </CollapsibleBlock>
                </li>
            );
        }
    }

    renderWebsiteLinks() {
        const { property } = this.props;
        const { language } = this.context;
        let websiteArray = [];

        if (property.Website){
            websiteArray.push(property.Website);
        }

        if (property.Links) {
            property.Links.forEach(link => {
                if (link.urlType && link.url) {
                    if (link.urlType == 'Website' || link.urlType == 'RainFallDataURL') {
                        websiteArray.push(link.url);
                    }
                }
            });
        }

        // Remove any duplicates
        websiteArray = [...new Set(websiteArray)];

        if (websiteArray.length == 0) { return; }

        // May want to use a plural/singlar translation in the future
        let buttonText = language.PdpViewViewPropertyWebsiteText;

        if (websiteArray.length == 1) {

            if (websiteArray[0] == '' || websiteArray[0] == ' ')
                return;

            const websiteTitle = buttonText ? buttonText : decodeURI(
                websiteArray[0]
                    .split('/')
                    .pop()
                    .split('#')[0]
                    .split('?')[0]
            );

            return (
                <li>
                    <div className="line_R3" />
                    <Button
                        link={websiteArray[0]}
                        className={'cbre_button cbre_button__flat cbre_button__secondary row'}
                        onClick={() => { window.open(websiteArray[0]); }}
                        data-test={createDataTestAttribute(null, 'walkthrough-button')}
                    >
                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block 3dFloorplan">
                            <div className="view_property_website" />
                            <span className="cbre_button_text text_other_R3">
                                {websiteTitle}
                            </span>
                        </div>
                    </Button>
                </li>
            );
        } else {
            // fallback if no translation exists
            if (!buttonText){
                buttonText = decodeURI(
                    websiteArray[0]
                        .split('/')
                        .pop()
                        .split('#')[0]
                        .split('?')[0]
                );
            }

            const viewButton = (
                <li>
                    <Button
                        className={
                            'cbre_button cbre_button__flat cbre_button__secondary row text_other_R3'
                        }
                        onClick={() => {
                            trackingEvent(
                                'detailsWebsite',
                                {
                                    propertyId: this.props.property.PropertyId
                                },
                                this.context.stores,
                                this.context.actions
                            );
                        }}
                        data-test={createDataTestAttribute(null, 'website-button')}
                    >
                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block 3dFloorplan">
                            <div
                                className="view_property_website"
                            />
                            <span className="cbre_button_text text_other_R3">
                                {buttonText}
                            </span>
                        </div>
                    </Button>
                </li>
            );

            const componentProps = {
                title: viewButton,
                className: 'collapsableBlock',
                bodyClassName: '',
                innerClassName: 'paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            return (
                <li style={{backgroundColor: "#E6EAEA"}}>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {websiteArray.map((website, i) => {
                                        let title = buttonText ? buttonText : decodeURI(
                                            website
                                                .split('/')
                                                .pop()
                                                .split('#')[0]
                                                .split('?')[0]
                                        );

                                        return (
                                            <li key={`brochure_${i + 1}`}>
                                                <Button
                                                    className="cbre_blockLink"
                                                    link={website}
                                                    target="_blank"
                                                    rel="noopener"
                                                    style={{ padding: '15px 0' }}
                                                >
                                                    {title}
                                                    <span className="sr-only">
                                                        {
                                                            language.SrOnlyPdfButton
                                                        }
                                                    </span>
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </CollapsibleBlock>
                </li>
            );
        }
    }

    renderVideoLinks() {
        const { property } = this.props;
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');

        let videoLinksArray = []; // Array to hold both property.VideoLinks and Common.Links

        // Add Property.VideoLinks
        if (Array.isArray(property.VideoLinks)) {
            property.VideoLinks.forEach(v => {
                if(v.uri && v.uri.trim().length>0){
                  videoLinksArray.push(v.uri)
                }
            });
        } else {
            if (property.VideoLinks && property.VideoLinks.trim().length > 0){
                videoLinksArray.push(property.VideoLinks);
            }
        }

        // Add video links from Common.Links
        if (property.Links) {
            property.Links.forEach(link => {
                if (link.urlType && link.url) {
                    if (link.urlType == 'Video') {
                        videoLinksArray.push(link.url);
                    }
                }
            });
        }

        // Remove any duplicates
        videoLinksArray = [...new Set(videoLinksArray)];

        if (videoLinksArray && videoLinksArray.length == 1 && features.displaySingleVideoLink) {
            return (
                <span>
                    <div className="line_R3" />
                    <Button
                        className={'cbre_button cbre_button__flat cbre_button__secondary row'}
                        onClick={() => { window.open(videoLinksArray); }}
                        data-test={createDataTestAttribute(null, 'video-button')}
                    >
                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                            <div className="video-icon" />
                            <span className="cbre_button_text text_other_R3">
                                {language.PdpViewVideoLinksButtonTextSingular}
                            </span>
                        </div>
                    </Button>
                </span>
            );
        }

        if (videoLinksArray && videoLinksArray.length > 0) {
            const viewVideoLinksButton = (
                <Button
                    className={
                        'cbre_button cbre_button__flat cbre_button__secondary row'
                    }
                    onClick={() => {
                        trackingEvent(
                            'detailsViewVideoLinks',
                            {
                                propertyId: this.props.property.PropertyId
                            },
                            this.context.stores,
                            this.context.actions
                        );
                    }}
                    data-test={createDataTestAttribute(null, 'video-link-button')}
                >
                    <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                        <div className="video-icon" />
                        <span className="cbre_button_text text_other_R3">
                            {language.PdpViewVideoLinksButtonText}
                        </span>
                    </div>
                </Button>
            );

            const componentProps = {
                title: viewVideoLinksButton,
                className: 'collapsableBlock',
                bodyClassName: 'collapsableBlock_body',
                innerClassName: 'collapsableBlock_body_inner paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            let genericVideoLinkName = language.GenericVideoLinkName ? language.GenericVideoLinkName : ''; // replace null w/ empty quotes
            if (!genericVideoLinkName.includes('%(i)s')) genericVideoLinkName = genericVideoLinkName + ' %(i)s';

            return (
                <li style={{backgroundColor: "#E6EAEA"}}>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {videoLinksArray.map(function (
                                        videoLink,
                                        i
                                    ) {
                                        const videoLinkTitle =
                                            videoLink.videoName ||
                                            (features.displayGenericVideoName
                                                ? genericVideoLinkName.replace("%(i)s", i+1)
                                                : decodeURI(
                                                    videoLink
                                                        .split('/')
                                                        .pop()
                                                        .split('#')[0]
                                                        .split('?')[0]
                                                ));
                                        return (
                                            <li key={`videoLink_${i + 1}`}>
                                                <Button
                                                    className="cbre_blockLink"
                                                    link={videoLink}
                                                    target="_blank" rel="noopener"
                                                    data-test={createDataTestAttribute(null, 'generic-video-button')}
                                                >
                                                    {videoLinkTitle}
                                                    <span className="sr-only">
                                                        {
                                                            language.SrOnlyPdfButton
                                                        }
                                                    </span>
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </CollapsibleBlock>
                </li>
            );
        }
    }


    showContactForm = e => {
        const { showContactForm, property } = this.props;

        const { ContactGroup: { contacts } } = property;

        showContactForm(e, contacts[0] || {}, "Arrange a Viewing");
    };


    showContactFormListing = e => {
        const { showContactForm, property } = this.props;

        const { ContactGroup: { arrangeViewingContacts } } = property;

        showContactForm(e, arrangeViewingContacts[0] || {}, "Arrange a Viewing");
    };


    renderRelatedListingOffice = (isMobile, classes) => {
        const { property } = this.props;
        const { stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        const config = stores.ConfigStore.getItem('relatedListing');

        if (!property.RelatedListingOffice || !features.displayRelatedListing) {
            return null;
        }

        const url = getFormattedString({ propertyId: property.RelatedListingOffice }, config.linkUrl);

        if (isMobile) {
            return this.renderCallToAction(
                url,
                config.mobileLinkText,
                classes,
                null,
                'related',
                'related-listing-office__mobile'
            );
        }

        return (
            <div className="related-listing-office">
                <h3>{config.titleText}</h3>
                <p>{config.bodyText}</p>
                <a href={url} title={config.linkText}>{config.linkText}</a>
            </div>
        );
    }

    findFloorplanURL = (FloorPlan) => {
        let floorplanUrl;
        try {
            floorplanUrl = getPath(FloorPlan, '.resources[0].uri');
        }
        catch(err) {
            // suppress error, but no real use for setting anything since floorplanURL will remain undefined
        }
        return floorplanUrl;
    }

    findLightboxIndex = (FloorPlan) => {
        const { PropertyStore } = this.context.stores;

        const lightboxItems = PropertyStore.getPropertyLightboxData();

        if(lightboxItems){
            return lightboxItems.findIndex(
                item => item.src === getPath(FloorPlan, '.resources[0].uri')
            );
        }
        return -1;
    }

    renderFloorplans = (FloorPlans, language, secondaryButtonClasses) => {
        
        if(FloorPlans && FloorPlans.length > 1){
            // render collapsible drawer component if we have more than one asset    
            const floorplansButton = (
                <Button
                    className={
                        'cbre_button cbre_button__flat cbre_button__secondary row'
                    }
                    onClick={() => {
                        trackingEvent(
                            'detailsViewFloorplansLinks',
                            {
                                propertyId: this.props.property.PropertyId
                            },
                            this.context.stores,
                            this.context.actions
                        );
                    }}
                    data-test={createDataTestAttribute(null, 'floorplans-link-button')}
                >
                    <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                        <div className="floorplan_icon_R3" />
                        <span className="cbre_button_text text_other_R3">
                            {language.PdpViewFloorplanPluralButtonText}
                        </span>
                    </div>
                </Button>
            );
    
            const componentProps = {
                title: floorplansButton,
                className: 'collapsableBlock',
                bodyClassName: 'collapsableBlock_body',
                innerClassName: 'collapsableBlock_body_inner paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            const that = this;

            return (
                <div style={{backgroundColor: "#E6EAEA"}}>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                {
                                    FloorPlans.map(function (Floorplan,i){
                                        const floorplanURL = that.findFloorplanURL(Floorplan);
                                        const buttonText = language.PdpViewFloorplanButtonText + ' ' + (i+1);
                                        const imageIndex = that.findLightboxIndex(Floorplan);
                                        
                                        // determine if the url is a pdf.  if so we handle the click differently than the image (which goes to light box)
                                        if(floorplanURL && floorplanURL.substring(floorplanURL.lastIndexOf('.') + 1) === 'pdf'){
                                            return (
                                                <React.Fragment>
                                                    <li key={`floorplanLink_${i + 1}`} style={{lineHeight: '16px'}}>
                                                        <Button
                                                            className="cbre_blockLink"
                                                            link={floorplanURL}
                                                            target="_blank" rel="noopener"
                                                            data-test={createDataTestAttribute(null, 'generic-floorplan-button')}
                                                        >
                                                            <span style={{fontSize: '16px'}}>
                                                                {buttonText}
                                                            </span>
                                                        </Button>
                                                    </li>
                                                </React.Fragment>
                                            );
                                        }else{
                                            return(
                                                <React.Fragment>
                                                    <li key={`floorplanLink_${i + 1}`} style={{lineHeight: '16px'}}>
                                                        <Button
                                                            onClick={function (e) {
                                                                e.preventDefault();
                                                                that.handleCallToActionButtonOnClick(imageIndex);
                                                            }.bind(this)}
                                                            className="cbre_blockLink"
                                                            data-test={createDataTestAttribute('call-to-action-button', i)}
                                                        >
                                                            <span style={{fontSize: '16px'}}>
                                                                {buttonText}
                                                            </span>
                                                        </Button>
                                                    </li>
                                                </React.Fragment>
                                            );
                                        }
                                    })
                                }
                                </ul>
                            </div>
                        </div>
                    </CollapsibleBlock>
            </div>
            );
        }else if(FloorPlans && FloorPlans.length === 1){
            // render single call to action (not a collapsible panel)
            const floorplanUrl = this.findFloorplanURL(FloorPlans[0]);
            if(floorplanUrl){
                return this.renderCallToAction(
                    floorplanUrl,
                    language.PdpViewFloorplanButtonText,
                    secondaryButtonClasses,
                    'icon_layers',
                    'floorplan'
                );
            }else{
                return <React.Fragment></React.Fragment>;
            }
        }else{
            return <React.Fragment></React.Fragment>;
        }
    }

    render() {
        const { property, breakpoints } = this.props;

        const { FloorPlans, ContactGroup: { avatar } } = property;

        let EPCUrl = property.EnergyPerformanceData
            ? property.EnergyPerformanceData.ukuri
            : null;

        const { language } = this.context;

        const sharedButtonClasses = classNames(
            'cbre_button',
            'cbre_button__flat',
            'row'
        );

        const secondaryButtonClasses = classNames(
            sharedButtonClasses,
            'cbre_button__secondary'
        );

        const relatedListing = breakpoints.isTabletLandscapeAndUp ? this.renderRelatedListingOffice() : null;
        const relatedListing_mobile = !breakpoints.isTabletLandscapeAndUp ? this.renderRelatedListingOffice(true, secondaryButtonClasses) : null;

        return (
            <div>
                <div className="cta-wrapper">
                    {this.renderHighlights()}
                    {this.renderContacts(property)}
                    {this.renderAvatar(avatar)}

                    <ul className="additional-ctas cbre_verticalList marginBottom-xs-1 marginBottom-lg-0">
                        {this.renderFloorplans(FloorPlans, language, secondaryButtonClasses)}
                        {this.renderJumpToChildProperties(
                            sharedButtonClasses,
                            'cbre_button__secondary'
                        )}
                        {this.renderStampDutyCalculator()}
                        {this.render3dFloorplanLink()}
                        {this.renderVideoLinks()}
                        {this.renderPropertyBrochure()}
                        {this.renderWebsiteLinks()}
                        {this.renderCallToAction(
                            EPCUrl,
                            language.PdpViewEPCGraphButtonText,
                            secondaryButtonClasses,
                            'icon_graph',
                            'epc'
                        )}
                        <div className="arrange_viewing_row_R3">
                            {this.renderArrangeViewing(
                                sharedButtonClasses,
                            )}
                        </div>
                        {relatedListing_mobile}
                    </ul>
                </div>
                {relatedListing}
                <div className={'pdp-inserted-content'} />
            </div>
        );
    }
}

SideBarContent_R3.propTypes = {
    property: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    showContactForm: PropTypes.func.isRequired,
    breakpoints: PropTypes.object,
    openLightboxFunc: PropTypes.func.isRequired,
    openStampDutyTaxCalculatorFunc: PropTypes.func
};

SideBarContent_R3.contextTypes = {
    actions: PropTypes.object,
    language: PropTypes.object,
    stores: PropTypes.object
};

export default SideBarContent_R3;
