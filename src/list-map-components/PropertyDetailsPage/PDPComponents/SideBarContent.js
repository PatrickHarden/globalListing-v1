import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontIcon, Button, List, CollapsibleBlock } from '../../../external-libraries/agency365-components/components';
import StampDutyCalculator from '@ryanshaug/globallistings-test-stamp-duty-calculator';
import _CollapsibleBlock from '../../CollapsibleBlock/CollapsibleBlock';
import ContactList from '../../ContactList/ContactList';
import trackingEvent from '../../../utils/trackingEvent';
import getFormattedString from '../../../utils/getFormattedString';
import classNames from 'classnames';
import getPath from 'getpath';
import { createDataTestAttribute } from '../../../utils/automationTesting';
var { isIE } = require('../../../utils/browser');

class SideBarContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideAvatar: false
        };
    }
    renderHighlights() {
        const { property, breakpoints, siteType } = this.props;

        if (
            siteType !== 'residential' ||
            !property.Highlights ||
            !property.Highlights.length
        ) {
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
        trackingEvent(
            'pdpLaunchStampDutyCalculator',
            {
                propertyId: this.props.property.PropertyId
            },
            this.context.stores,
            this.context.actions
        );

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
                <ContactList
                    property={property}
                    className="cbre_verticalList marginBottom-xs-1"
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
                            <FontIcon
                                className="cbre_icon"
                                iconName={'icon_clock'}
                            />
                            <span className="cbre_button_text">
                                {PdpArrangeButtonText}
                            </span>
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
                            siteTypeClass
                        )}
                        data-test={createDataTestAttribute(null, 'open-contact-form-button')}
                    >
                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                            <FontIcon
                                className="cbre_icon"
                                iconName={'icon_clock'}
                            />
                            <span className="cbre_button_text">
                                {PdpArrangeButtonText}
                            </span>
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
                        <Button
                            onClick={function (e) {
                                e.preventDefault();
                                this.handleCallToActionButtonOnClick(index);
                            }.bind(this)}
                            className={buttonClasses}
                            data-test={createDataTestAttribute('call-to-action-button', index)}
                        >
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <FontIcon
                                    className="cbre_icon"
                                    iconName={icon}
                                />
                                <span className="cbre_button_text">
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
                        <Button
                            link={assetUrl}
                            target="_blank"
                            rel="noopener"
                            className={buttonClasses}
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
                            data-test={createDataTestAttribute('button-other', buttonText)}
                        >
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                {icon && <FontIcon
                                    className="cbre_icon"
                                    iconName={icon}
                                />}
                                <span className={`cbre_button_text${className ? ` ${className}` : ''}`}>
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

        if (property.Brochures && property.Brochures.length > 0) {
            const viewBrochureButton = (
                <Button
                    className={
                        'cbre_button cbre_button__flat cbre_button__secondary row'
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
                        <FontIcon
                            className="cbre_icon"
                            iconName="icon_documents"
                        />
                        <span className="cbre_button_text">
                            {language.PdpDownloadBrochureButtonText}
                        </span>
                    </div>
                </Button>
            );

            const componentProps = {
                title: viewBrochureButton,
                className: 'collapsableBlock',
                bodyClassName: 'collapsableBlock_body',
                innerClassName: 'collapsableBlock_body_inner paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            return (
                <li>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {property.Brochures.map(function (
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

    render3dFloorplanLink(buttonText) {
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

        if (walkThroughArray.length == 1) {

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
                    <Button
                        className={
                            'cbre_button cbre_button__flat cbre_button__secondary row'
                        }
                        onClick={() => {
                            trackingEvent(
                                'detailsViewWalkthrough',
                                {
                                    propertyId: this.props.property.PropertyId
                                },
                                this.context.stores,
                                this.context.actions
                            );
                            window.open(walkThroughArray[0]);
                        }}
                        data-test={createDataTestAttribute(null, 'walkthrough-button')}
                    >
                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                            <FontIcon
                                className="cbre_icon"
                                iconName="icon_documents"
                            />
                            <span className="cbre_button_text">
                                {walkthroughTitle}
                            </span>
                        </div>
                    </Button>
                </li>
            );
        } else {
            let walkthroughTitle = buttonText ? buttonText : decodeURI(
                walkThroughArray[0]
                    .split('/')
                    .pop()
                    .split('#')[0]
                    .split('?')[0]
            );

            const viewWalkthroughButton = (
                <Button
                    className={
                        'cbre_button cbre_button__flat cbre_button__secondary row'
                    }
                    onClick={() => {
                        trackingEvent(
                            'detailsViewWalkthrough',
                            {
                                propertyId: this.props.property.PropertyId
                            },
                            this.context.stores,
                            this.context.actions
                        );
                    }}
                    data-test={createDataTestAttribute(null, 'walkthrough-button')}
                >
                    <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                        <FontIcon
                            className="cbre_icon"
                            iconName="icon_documents"
                        />
                        <span className="cbre_button_text">
                            {walkthroughTitle}
                        </span>
                    </div>
                </Button>

            );

            const componentProps = {
                title: viewWalkthroughButton,
                className: 'collapsableBlock',
                bodyClassName: '',
                innerClassName: 'paddingX-xs-1',
                titleClassName: 'cbre_title'
            };
            
            return (
                <li>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {walkThroughArray.map((walkthrough, i) => {
                                        walkthroughTitle = buttonText ? buttonText : decodeURI(
                                            walkthrough
                                                .split('/')
                                                .pop()
                                                .split('#')[0]
                                                .split('?')[0]
                                        );

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

    renderWebsiteLinks(buttonText) {
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
                    <Button
                        className={
                            'cbre_button cbre_button__flat cbre_button__secondary row'
                        }
                        onClick={() => {
                            trackingEvent(
                                'detailsViewWebsiteClick',
                                {
                                    propertyId: this.props.property.PropertyId
                                },
                                this.context.stores,
                                this.context.actions
                            );
                            window.open(websiteArray[0]);
                        }}
                        data-test={createDataTestAttribute(null, 'website-button')}
                    >
                        <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                            <FontIcon
                                className="cbre_icon"
                                iconName="icon_arrow_right"
                            />
                            <span className="cbre_button_text">
                                {websiteTitle}
                            </span>
                        </div>
                    </Button>
                </li>
            );
        } else {
            let websiteTitle = buttonText ? buttonText : decodeURI(
                websiteArray[0]
                    .split('/')
                    .pop()
                    .split('#')[0]
                    .split('?')[0]
            );

            const button = (
                <Button
                    className={
                        'cbre_button cbre_button__flat cbre_button__secondary row'
                    }
                    onClick={() => {
                        trackingEvent(
                            'detailsViewWebsiteClick',
                            {
                                propertyId: this.props.property.PropertyId
                            },
                            this.context.stores,
                            this.context.actions
                        );
                    }}
                    data-test={createDataTestAttribute(null, 'website-button')}
                >
                    <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                        <FontIcon
                            className="cbre_icon"
                            iconName="icon_arrow_right"
                        />
                        <span className="cbre_button_text">
                            {websiteTitle}
                        </span>
                    </div>
                </Button>
            );

            const componentProps = {
                title: button,
                className: 'collapsableBlock',
                bodyClassName: '',
                innerClassName: 'paddingX-xs-1',
                titleClassName: 'cbre_title'
            };

            return (
                <li>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {websiteArray.map((website, i) => {
                                        websiteTitle = buttonText ? buttonText : decodeURI(
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
                                                    {websiteTitle}
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

        if (property.VideoLinks && property.VideoLinks.length == 1 && features.displaySingleVideoLink) {
            return (
                <Button
                    className={`cbre_button cbre_button__flat cbre_button__secondary row`}
                    onClick={() => { window.open(property.VideoLinks[0].uri); }}
                    data-test={createDataTestAttribute(null, 'video-button')}
                >
                    <div className=" col-xs-12 col-md-12 col-lg-12 center-block">
                        <FontIcon className="cbre_icon" iconName="icon_globe" />
                        <span className="cbre_button_text">
                            {language.PdpViewVideoLinksButtonTextSingular}
                        </span>
                    </div>
                </Button>
            );
        }

        if (property.VideoLinks && property.VideoLinks.length > 0) {
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
                        <FontIcon className="cbre_icon" iconName="icon_globe" />
                        <span className="cbre_button_text">
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

            return (
                <li>
                    <CollapsibleBlock {...componentProps}>
                        <div className="row">
                            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                <ul className="cbre_verticalList cbre_verticalList__lineSeparated">
                                    {property.VideoLinks.map(function (
                                        videoLink,
                                        i
                                    ) {
                                        const videoLinkTitle =
                                            videoLink.videoName ||
                                            (features.displayGenericVideoName
                                                ? language.GenericVideoLinkName +
                                                ' ' +
                                                (i + 1)
                                                : decodeURI(
                                                    videoLink.uri
                                                        .split('/')
                                                        .pop()
                                                        .split('#')[0]
                                                        .split('?')[0]
                                                ));
                                        return (
                                            <li key={`videoLink_${i + 1}`}>
                                                <Button
                                                    className="cbre_blockLink"
                                                    link={videoLink.uri}
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

        const {
            ContactGroup: { contacts }
        } = property;
        showContactForm(e, contacts[0] || {});
    };

    showContactFormListing = e => {
        const { showContactForm, property } = this.props;

        const {
            ContactGroup: { arrangeViewingContacts }
        } = property;
        showContactForm(e, arrangeViewingContacts[0] || {});
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

    render() {
        const { property, breakpoints, disableCarouselWalkthrough } = this.props;

        const {
            FloorPlans,
            Website,
            ContactGroup: { avatar },
            InteractivePlan
        } = property;

        let floorplanUrl;

        try {
            floorplanUrl = getPath(FloorPlans, '[0].resources[0].uri');
        }
        catch(err) { floorplanUrl = null; }

        let EPCUrl = property.EnergyPerformanceData
            ? property.EnergyPerformanceData.ukuri
            : null;
        const websiteUrl = Website || '';

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
                        {this.renderArrangeViewing(
                            sharedButtonClasses,
                            'cbre_button__secondary'
                        )}
                        {this.renderJumpToChildProperties(
                            sharedButtonClasses,
                            'cbre_button__secondary'
                        )}
                        {/* {this.renderStampDutyCalculator()} */}
                        {disableCarouselWalkthrough && property.Walkthrough &&
                            this.render3dFloorplanLink(language.PdpViewInteractiveplanButtonText)
                        }
                        {!breakpoints.isMobile &&
                            !isIE &&
                            this.renderCallToAction(
                                InteractivePlan,
                                language.PdpViewInteractiveplanButtonText,
                                secondaryButtonClasses,
                                'icon_layers',
                                'floored'
                            )}
                        {this.renderCallToAction(
                            floorplanUrl,
                            FloorPlans.length > 1
                                ? language.PdpViewFloorplanPluralButtonText
                                : language.PdpViewFloorplanButtonText,
                            secondaryButtonClasses,
                            'icon_layers',
                            'floorplan'
                        )}
                        {this.renderPropertyBrochure()}

                        {this.renderVideoLinks()}
                        {this.renderWebsiteLinks(language.PdpViewViewPropertyWebsiteText)}
                        {this.renderCallToAction(
                            EPCUrl,
                            language.PdpViewEPCGraphButtonText,
                            secondaryButtonClasses,
                            'icon_graph',
                            'epc'
                        )}
                        {relatedListing_mobile}
                    </ul>
                </div>
                {relatedListing}
                <div className={'pdp-inserted-content'} />
            </div>
        );
    }
}

SideBarContent.propTypes = {
    property: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    showContactForm: PropTypes.func.isRequired,
    breakpoints: PropTypes.object,
    openLightboxFunc: PropTypes.func.isRequired,
    openStampDutyTaxCalculatorFunc: PropTypes.func
};

SideBarContent.contextTypes = {
    actions: PropTypes.object,
    language: PropTypes.object,
    stores: PropTypes.object
};

export default SideBarContent;
