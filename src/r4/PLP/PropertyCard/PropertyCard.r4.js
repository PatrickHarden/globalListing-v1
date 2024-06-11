import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Avatar, Card, CardBody, CardMedia, Contact, FontIcon, List, MediaWrapper } from '../../../external-libraries/agency365-components/components';
import { Link } from 'react-router';
import PriceLabel from '../../../components/Property/PropertyComponents/PriceLabel';
import Size from '../../../components/Property/PropertyComponents/Size';
import createQueryString from '../../../utils/createQueryString';
import TranslateString from '../../../utils/TranslateString';
import defaultValues from '../../../constants/DefaultValues';
import AddressSummary_R3 from '../../../r3/components/AddressSummary/AddressSummary.r3';
import classNames from 'classnames';
import Favourite_R4 from '../FavouriteStar/Favourite.r4';
import ListingCount from '../../../list-map-components/ListingCount/ListingCount';
import { isPrerender } from '../../../utils/browser';
import letterFromIndex from '../../../utils/letterFromIndex';
import Truncate from 'react-truncate';
import $ from 'jquery';
import styled from 'styled-components';

import { Cell } from '../../../list-map-components/Table/Table';
import getAvailability from '../../../utils/getAvailability';
import getEnergyRating from '../../../utils/getEnergyRating';
import { checkIfPriceRangeExists, salePriceExists } from '../../../r3/PDP/PDPHeader/SideBarHeader.Commercial.r3';
import PriceRange_R3 from '../../../r3/components/PriceRange/PriceRange.r3';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import InfoWindowContent from '../../../r3/PLP/ListMap/InfoWindowContent.jsx';
import setImageTag from '../../../utils/setImageTag';
import DynamicImage, { DynamicImageContactAvatar } from '../../../components/DynamicImage/DynamicImage';
import { checkRentPriceExists } from '../../../r4/PDP/PDPHeader/SideBarHeader.Commercial.r4';

class PropertyCard_R4 extends Component {
    constructor(props) {
        super(props);
        this.resizeDuration = 500;
        this.rotateDelay = 1000;
    }

    componentDidUpdate(prevProps) {
        const classChanged = this.props.className !== prevProps.className;

        if (classChanged && this.refs.truncate) {
            setTimeout(this.updateTruncate, this.resizeDuration);
        }
    }

    componentDidMount() {
        if (this.refs.truncate) {
            setTimeout(() => {
                this.updateTruncate();
            }, this.resizeDuration);
        }

        window.addEventListener(
            'orientationchange',
            this.updateTruncateDelayed
        );
    }

    shouldComponentUpdate(nextProps) {
        const propertyChanged =
            this.props.property.PropertyId !== nextProps.property.PropertyId;
        const classChanged = this.props.className !== nextProps.className;
        const statusChanged = this.props.isHidden !== nextProps.isHidden;

        return !!(propertyChanged || classChanged || statusChanged);
    }

    componentWillUnmount() {
        window.removeEventListener(
            'orientationchange',
            this.updateTruncateDelayed
        );
    }

    updateTruncate = () => {
        if (this.refs.truncate) {
            this.refs.truncate.onResize();
        }
    };

    updateTruncateDelayed = () => {
        setTimeout(() => {
            this.updateTruncate();
        }, this.rotateDelay);
    };

    getFloorProps = property => {
        const { language, stores } = this.context;
        const config = stores.ConfigStore.getFeatures();
        const { FloorsAndUnits } = property;
        const newFloorProps = [];

        if (!FloorsAndUnits[0]) {
            return newFloorProps;
        }
        if (FloorsAndUnits[0].use) {
            newFloorProps.push({
                title: language['Details'],
                value:
                    language['UnitUse' + FloorsAndUnits[0].use] ||
                    FloorsAndUnits[0].use
            });
        }

        if (FloorsAndUnits[0].status) {
            newFloorProps.push({
                title: language['Status'],
                value:
                    language[FloorsAndUnits[0].status] ||
                    FloorsAndUnits[0].status
            });
        }

        if (
            config.usePropertyAvailabilityRatherThanFloorAvailability &&
            property.Availability
        ) {
            newFloorProps.push(getAvailability(property, this.context));
        } else if (
            FloorsAndUnits[0].availableFrom ||
            FloorsAndUnits[0].availability
        ) {
            newFloorProps.push(
                getAvailability(FloorsAndUnits[0], this.context)
            );
        }

        return newFloorProps;
    };

    getAvailabilityText = (Availability, displayBuildingAvailableDate, currentLanguage, language) => {
        if (!Availability.date || !displayBuildingAvailableDate) {
            return undefined;   //if date or displayBuildingAvailableDate not available or false, short circuit
        }
        // date is in the future, so we will use the date
        if (new Date(Availability.date).getTime() > new Date().getTime()) {
            const availableDate = new moment(Availability.date).locale(currentLanguage).format('MMMM YYYY');
            return <TranslateString string="detailsStraplineAvailableFrom" date={availableDate} />;
        } else {
            // date is not in the future, so create an "Available Immediately" text string
            const availableText = language['Available'] !== undefined && language['AvailableFromNow'] !== undefined
                ? language['Available'] + ' ' + language['AvailableFromNow'] : undefined;
            return availableText;
        }
    }

    renderFloorProp(property, dataTestIndex) {
        {
            const floorArray = this.getFloorProps(property);
            if (floorArray.length <= 0) {
                return;
            }
            let floorOutput = floorArray.map(function (details, key) {
                return (
                    <Cell key={`floorProp-${key || details.value}`} widthXs={4}>
                        <h4 className="cbre_h6" data-test={createDataTestAttribute('availability', dataTestIndex)}>{details.title}</h4>
                        {details.value}
                    </Cell>
                );
            });
            return <div className="clearfix">{floorOutput}</div>;
        }
    }

    buildDetailsPagePath(basePath, property, addressSummary, stores) {
        const config = stores.ConfigStore.getItem('searchConfig');
        const carouselConfig = stores.ConfigStore.getItem('carouselConfig');
        let searchResultsPage = config ? config.searchResultsPage : null;
        if (!searchResultsPage) {
            if (carouselConfig && carouselConfig.detailPages) {
                searchResultsPage = carouselConfig.detailPages[property.UsageType.toLowerCase()];
            }
            if (!searchResultsPage) {
                searchResultsPage = carouselConfig
                    ? carouselConfig.searchResultsPage
                    : null;
            }
        }
        let path = '/details/' + property.PropertyId + '/' + addressSummary;
        let useHardLink = false;

        // Check if we're not on the default searchResultsPage.
        if (
            (searchResultsPage &&
                searchResultsPage !== '/' &&
                basePath !== searchResultsPage) ||
            this.props.useHardLink
        ) {
            // Remove trailing '/' from searchResultsPage.
            if (searchResultsPage && searchResultsPage.endsWith('/')) {
                searchResultsPage = searchResultsPage.replace(/\/$/, '');
            }
            // Set a hard link to the default search page.
            path = searchResultsPage + path;
            useHardLink = true;
        }
        else if (stores.ConfigStore.getItem('features').redirectostandardpage) {
            let listing = stores.PropertyStore.getPrimaryListing();

            if (Object.keys(listing).length == 0) {
                listing = this.props.property;
            }

            if (!listing) return null;

            const { searchType } = this.props;

            try {
                const siteMapsConfig = context.stores.ConfigStore.getItem('siteMapsConfig');
                const siteId = listing.HomeSite.toLowerCase(); // Use siteid from listing data instead of the config (this will correct canoncials where the listing homesite doesn't match the config's siteid)
                const usageType = listing.UsageType.toLowerCase();
                const siteMapUsageType = siteMapsConfig[siteId][listing.UsageType] || siteMapsConfig[siteId][usageType];
                const language = context.stores.ConfigStore.getItem('language').toLowerCase();
                const aspect = listing.Aspect[0];

                // try the entire locale, then fall back to just the language segment
                let fallbackLanguage = Object.keys(siteMapUsageType).filter(x => (x == language || language.split('-').splice(0, 1))).reduce(x => x);

                let searchPath = siteMapUsageType[language] ? siteMapUsageType[language] : siteMapUsageType[fallbackLanguage];
                path = searchPath.replace('{0}', `${listing.PropertyId}/${addressSummary}`).replace('{1}', aspect);
                useHardLink = true;
            } catch (err) {
                path = basePath + path;
                useHardLink = false;
            }

        }

        else {
            path = basePath + path;
        }

        return {
            useHardLink,
            path
        };
    }

    wrapInLink = (Component, className) => {
        const { stores } = this.context;

        const { property, spaPath } = this.props;

        const {
            PropertyId: propertyId,
            ActualAddress: { urlAddress },
            Coordinates,
            arrIndex: propertyIndex,
            ParentPropertyId
        } = property;

        const searchType = stores.SearchStateStore.getItem('searchType');
        const features = this.context.stores.ConfigStore.getItem('features');
        const viewType = { view: searchType };

        const detailsLink = this.buildDetailsPagePath(
            spaPath.path,
            property,
            urlAddress,
            stores
        );
        const LinkType = (detailsLink.useHardLink && features.disableHardLink !== true) ? 'a' : Link;

        let linkProps = {
            to: { pathname: detailsLink.path, query: viewType || null }
        };

        if (detailsLink.useHardLink && features.disableHardLink !== true) {
            if (detailsLink.path.includes("view")) {
                linkProps = {
                    href: detailsLink.path
                };
            } else {
                linkProps = {
                    href: detailsLink.path + createQueryString(viewType)
                };
            }
        }

        return (
            <span onClick={() => this.redirect(linkProps, Coordinates, propertyIndex, propertyId, ParentPropertyId)} key={`${className + (linkProps.href) ? linkProps.href : propertyIndex}_link`}>
                {
                    <LinkType
                        key={`${className}_link`}
                        {...linkProps}
                    >
                        <div className={className}>
                            {Component}
                        </div>
                    </LinkType>
                }
            </span>
        );
    };

    redirect(url, Coordinates, propertyIndex, propertyId, ParentPropertyId) {
        const currentUrl = window.location;
        if (this.props.propertyLinkClickHandler) {
            this.props.propertyLinkClickHandler(
                Coordinates,
                propertyIndex,
                propertyId,
                ParentPropertyId
            );
        }
        if ($('.cbre-spa--v2carousel').length > 0) {
            setTimeout(() => { this.checkRedirect(url, currentUrl) }, 200)
        }
    }

    checkRedirect(url, currentUrl) {
        if (url && url.href && (currentUrl === window.location)) {
            if (url.href.substr(0, 1) == '/' || window.location.origin.substr(-1) == '/') {
                window.location.href = encodeURI(window.location.origin + url.href)
            } else {
                window.location.href = encodeURI(window.location.origin + '/' + url.href)
            }
        }
    }

    getContactsMarkup(contactsArray, siteType, ContactGroup, dataTestIndex, showExtraIcons, extraHoverIcon) {
        let contactOutput;
        const contactClasses = `contact cbre_button cbre_button__avatar cbre_button__small ${siteType !== 'residential' ? 'commercial_contact' : ''
            }`;
        const { stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        
        switch (siteType) {
            case 'residential':
                if (contactsArray.length) {
                    contactsArray[0].name = ContactGroup.name;
                    contactOutput = (
                        <Contact
                            {...contactsArray[0]}
                            className={contactClasses}
                            key="contact_0"
                            features={features}
                        />
                    );
                }
                break;

            default:
                contactOutput = contactsArray.map(function (contact, i) {
                    return (
                        <div
                            className={`col-xs-6 ${showExtraIcons ? 'showExtraIcons' : ''} ${extraHoverIcon ? 'extraHoverIcon' : ''} cbre_comm_card_${contactsArray.length === 1 ? 'single' : 'multi'
                                }`}
                            key={`contact_${i}`}
                            data-test={createDataTestAttribute('property-card-contact', dataTestIndex + '-' + i)}
                        >
                            <Contact className={contactClasses} {...contact} features={features} />
                            {showExtraIcons && (window.cbreSiteTheme !== "commercialr4") &&
                                <div className="extraIconsContainer">
                                    {contact.telephone && contact.telephone != '' && contactsArray.length === 1 &&
                                        <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-phone.png" class="phone_R3 FontIcon_icon_phone_r3" alt="phone icon" />
                                    }
                                    {contact.email && contact.email != '' &&
                                        <img src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-email.png" class="email_R3 FontIcon_icon_mail_r3" alt="email icon" />
                                    }
                                </div>
                            }
                        </div>
                    );
                });
                break;
        }

        return contactOutput;
    }

    // generate pricing information. propertycards only display one price based on the url aspect
    generatePricing = (priceAspect) => {
        if (!priceAspect) {
            return;
        }

        const { property } = this.props;
        const { stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        const contactBrokerTranslation = stores.ConfigStore.getItem('i18n').PriceOnApplication || 'Contact Broker For Pricing';


        // Default to the contact broker translation if the user selects dataEntry's "Contact Broker" checkbox, or if the charges array is empty, or if there isn't a salePrice while the aspect is isSale
        if (priceAspect === 'isSale' && (this.priceOnApplicationExists() || property.Charges.length === 0 || !salePriceExists(property.Charges))) {
            property.showContactBrokerText = true;
            return (
                <span>{contactBrokerTranslation}</span>
            );
        } else if (priceAspect === 'isLetting' && !property.showContactBrokerText && (this.priceOnApplicationExists() || !checkRentPriceExists(property.Charges))) { // if the sale and lease price both doesn't exist then the "Contact Broker for Pricing" should appear only once
            return (
                <span>{contactBrokerTranslation}</span>
            );
        } else if (!features.useNetRent && priceAspect === 'isLetting' && checkIfPriceRangeExists(property.Charges)) {
            // if the plp aspect is isLetting, and price range exists, render priceRange
            return (<PriceRange_R3 charges={property.Charges} stores={stores} priceRangeCheck={checkIfPriceRangeExists} displayLabel={true} notLeaseAndCharge={true} />
            );
        } else if (property.Charges.length > 0 && !this.priceOnApplicationExists()) {
            return (
                <PriceLabel
                    property={property}
                    displayLabel={false}
                    searchType={priceAspect}
                />
            );
        }
    };

    // see if price on application exists, if so, don't display pricelabel
    priceOnApplicationExists = () => {
        const features = this.context.stores.ConfigStore.getItem('features');

        if (features && features.dontDefaultToContactBrokerOnApplicationExists) {
            return false;
        }

        const { property } = this.props;

        let result = false;
        property.Charges.map(charge => {
            if (charge.OnApplication) {
                result = true;
            }
        });
        return result;
    };

    render() {
        const {
            className,
            property,
            contactClickHandler,
            siteType,
            isPdf,
            propertyIndex,
            dataTestIndex,
            showFavourites,
            shouldLazyLoad,
            mouseEvents,
            carousel,
            ...other
        } = this.props;

        const {
            Aspect,
            IsParent,
            ActualAddress,
            ContactGroup,
            Walkthrough,
            PropertyId: propertyId,
            Highlights: highlights,
            PrimaryImage: { caption: alt, resources },
            NumberOfBedrooms: bedrooms,
            GeoLocation: { exact },
            FloorsAndUnits
        } = property;

        const { stores, language } = this.context;

        const classes = [className];

        const searchType = stores.SearchStateStore.getItem('searchType');


        let image = {};

        let _IsParent = IsParent === '' ? false : IsParent;

        const features = stores.ConfigStore.getItem('features');

        const info = {
            title: (
                <AddressSummary_R3
                    propertyCount={null}
                    address={ActualAddress}
                    isParent={_IsParent}
                    floorsAndUnits={FloorsAndUnits}
                    featuredRedesignCarousel={this.props.featuredRedesignCarousel}
                    dataTestIndex={dataTestIndex}
                    pdpLocationCard={this.props.pdpLocationCard}
                    r4={true}
                />
            ),
            subtitle: (

                this.generatePricing(property.Aspect.length > 0 ? property.Aspect[0] : searchType)
            )
        };


        if (!exact) {
            if (typeof features.displayFullAddressOnRequest === 'undefined' || features.displayFullAddressOnRequest === true) {
                info.inexactText = (
                    <div className="cbre_subh1 cbre_addressOnRequest" data-test={createDataTestAttribute(null, 'full-address-on-request')}>
                        {language.FullAddressOnRequest}
                    </div>
                );
            }
        }

        if (Walkthrough && !isPdf) {
            image.iconElementTopLeft = (
                <FontIcon className="cbre_icon" iconName="icon_walkthrough" />
            );
        }
        const showBanners = features && features.propertyBanners;
        if (
            Aspect.includes('isSold') &&
            showBanners &&
            features.propertyBanners.showSoldBanner
        ) {
            image.status = <TranslateString string="SoldBannerText" />;
        } else if (
            Aspect.includes('isSaleAgreed') &&
            showBanners &&
            features.propertyBanners.showSaleAgreedBanner
        ) {
            image.status = <TranslateString string="SaleAgreedBannerText" />;
        } else if (
            Aspect.includes('isLeased') &&
            showBanners &&
            features.propertyBanners.showLeasedBanner
        ) {
            image.status = <TranslateString string="LeasedBannerText" />;
        } else if (
            Aspect.includes('isLetUnderOffer') &&
            showBanners &&
            features.propertyBanners.showLetUnderOfferBanner
        ) {
            image.status = <TranslateString string="UnderOfferText" />;
        } else if (
            Aspect.includes('isUnderOffer') &&
            showBanners &&
            features.propertyBanners.showUnderOfferBanner
        ) {
            image.status = <TranslateString string="UnderOfferText" />;
        }
        const _contacts = [...ContactGroup.contacts];
        let truncateContacts = [];
        let contactParentClass = '';
        const numberOfBedroomsTranslationString = parseInt(bedrooms) === 1 ? "NumberOfBedroomsSingular" : "NumberOfBedroomsPlural";
        switch (siteType) {
            case 'residential':
                truncateContacts = _contacts.splice(0, 1);
                if (bedrooms && parseInt(bedrooms) === 1 && !this.propsfeaturedRedesignCarousel) {
                    info.body = (
                        <InfoBody>
                            <TranslateString
                                string="NumberOfBedroomsSingular"
                                bedroomCount={bedrooms}
                            />
                            {features &&
                                features.displaySizeInSideHeader &&
                                (property.TotalSize.area ||
                                    property.MinimumSize.area) && (
                                    <span data-test={createDataTestAttribute('property-size', dataTestIndex)}>
                                        {/* &nbsp;/&nbsp; */}
                                        <SizeStyled
                                            property={property}
                                            displayLabel={false}
                                        />
                                    </span>
                                )}
                        </InfoBody>
                    );
                } else if (bedrooms && parseInt(bedrooms) > 1 && !this.propsfeaturedRedesignCarousel) {
                    info.body = (
                        <InfoBody>
                            <TranslateString
                                string="NumberOfBedroomsPlural"
                                bedroomCount={bedrooms}
                            />
                            {features &&
                                features.displaySizeInSideHeader &&
                                (property.TotalSize.area ||
                                    property.MinimumSize.area) && (
                                    <span data-test={createDataTestAttribute('property-size', dataTestIndex)}>
                                        &nbsp;/&nbsp;
                                        <SizeStyled
                                            property={property}
                                            displayLabel={false}
                                        />
                                    </span>
                                )}
                        </InfoBody>
                    );
                } else {
                    info.body = (
                        <InfoBody>
                            <TranslateString string="Studio" />
                            {features &&
                                features.displaySizeInSideHeader &&
                                (property.TotalSize.area ||
                                    property.MinimumSize.area) && (
                                    <span data-test={createDataTestAttribute('property-size', dataTestIndex)}>
                                        &nbsp;/&nbsp;
                                        <SizeStyled
                                            property={property}
                                            displayLabel={false}
                                        />
                                    </span>
                                )}
                        </InfoBody>
                    );
                }
                break;
            default:
                contactParentClass = 'horizontalList';
                truncateContacts = _contacts.splice(0, 2);
                info.body = (
                    <InfoBody>
                        <div><SizeStyled property={property} displayLabel={false} /></div>
                        {stores.ConfigStore.getFeatures().displayNumberOfBedrooms &&
                            <div>
                                <TranslateString
                                    string={numberOfBedroomsTranslationString}
                                    bedroomCount={bedrooms}
                                />
                            </div>
                        }
                    </InfoBody>
                );
                break;
        }

        const contactsArray = truncateContacts.map((contact, i) => {
            const dynamicAvatarProps = {
                src: contact.avatar,
                featureFlag: this.context.stores.ConfigStore.getItem('features').dynamicImageSizing,
                sizeKey: 'smallAvatar'
            };

            let avatar = (
                <Avatar
                    src={DynamicImageContactAvatar(dynamicAvatarProps)}
                    size={32}
                    altText={contact.name || ContactGroup.name}
                    key={`avatar_${i}`}
                />
            );

            const icons = [];
            if (contact.telephone) {
                icons.push(
                    <FontIcon
                        className="cbre_icon"
                        iconName="icon_phone"
                        key="iconPhone"
                    />
                );
            }
            if (contact.email) {
                icons.push(
                    <FontIcon
                        className="cbre_icon"
                        iconName="icon_mail"
                        key="iconMail"
                    />
                );
            }

            let c = Object.assign({}, contact, { avatar }, { icons });

            return Object.assign(c, {
                onClick: e => {
                    contactClickHandler(property, c, e);
                }
            });
        });

        let placeholderImage =
            '/resources/fileassets/propertyListingPlaceholder_small.png';

        if (resources.length > 0) {
            const { uri: src, width, height } = resources.filter(obj => {
                return obj.breakpoint === 'small';
            })[0];
            image.width = width;
            image.height = height;
            image.src = src;
            image.alt = setImageTag(alt, ActualAddress, 0);
        } else {
            // console.warn(`no image available for ${propertyId}`); // eslint-disable-line
            image.src = placeholderImage;
        }

        let fitWidth;
        let fitHeight;
        const imageOrientation =
            stores.ConfigStore.getItem('imageOrientation') ||
            defaultValues.imageOrientation;
        if (image.width < image.height || imageOrientation === 'landscape') {
            fitWidth = true;
        }
        if (image.width > image.height || imageOrientation === 'portrait') {
            fitHeight = true;
        }
        //const placeholderImage = defaultValues.loadingImage.src;

        const cardAvailability =
            features &&
            features.childListings &&
            features.childListings.enableChildListings &&
            !property.IsParent &&
            this.renderFloorProp(property, dataTestIndex);

        let availability = getAvailability(property, this.context);
        availability.title = language['PDPAvailableFrom'];

        let highlightsList = isPdf ? null : (
            <StyledHighlights columns={2} limit={4} className="bulletList textCol-xs-2">
                {highlights.map(function (highlight, i) {
                    return (
                        <li key={`${propertyId}_highlight_${i}`} className="highlight" data-test={createDataTestAttribute('property-highlight', dataTestIndex + '-' + i)}>
                            <Truncate ref="truncate" lines={1} trimWhitespace={true} children={highlight} />
                        </li>
                    );
                })}
            </StyledHighlights>
        );
        const cdnUrl = stores.ConfigStore.getItem('cdnUrl');
        const cardMediaClass = isPdf
            ? { className: 'staticListings_Item_image' }
            : {};

        const ratingIcon = getEnergyRating(features, property.Highlights);
        const rating = ratingIcon ? (
            <div className="energy-rating">
                <img src={ratingIcon} />
            </div>
        ) : null;

        const dynamicImageSizing = stores.ConfigStore.getItem('features').dynamicImageSizing;

        let cardMedia = (
            <StyledCardMedia
                bannerText={rating ? null : image.status}
                topLeftIcon={false}
                {...cardMediaClass}
            >
                {features && features.enableFavourites &&
                    <Favourite_R4 propertyId={propertyId} />
                }
                {(Walkthrough && !isPdf) &&
                    <StyledWalkthroughImage highlights={highlights ? highlights : []} src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/360.png" alt="360 Walkthrough" />
                }
                <MediaWrapper fitHeight={fitHeight} fitWidth={fitWidth}>
                    <DynamicImage src={cdnUrl + image.src}
                        alt={image.alt}
                        baseWidth={image.width}
                        baseHeight={image.height}
                        featureFlag={dynamicImageSizing}
                        sizeKey={this.props.dynamicImageSizeKey}
                        fitImage={true}
                        testId={createDataTestAttribute('property-cover-image', dataTestIndex)}
                        onError={event =>
                            event.target.setAttribute(
                                'src',
                                isPrerender
                                    ? cdnUrl + image.src
                                    : cdnUrl + placeholderImage
                            )}
                    />
                </MediaWrapper>
            </StyledCardMedia>
        );
        cardMedia = isPdf
            ? cardMedia
            : this.wrapInLink(cardMedia, 'card_image');

        let cardPin = isPdf ? (
            <div className="cbre_icon cbre_icon_pin">
                <span className="cbre_iconCount">
                    {letterFromIndex(propertyIndex)}
                </span>
            </div>
        ) : null;

        const cardContentClass = isPdf ? { className: 'detailsWrap' } : {};
        const cardContentAddress = isPdf ? (
            <div className="addressWrap">
                <h3 className="cbre_h4">
                    {/* <Truncate ref="truncate" lines={2}> */}
                    {info.title}
                    {/* </Truncate> */}
                </h3>
            </div>
        ) : (
            <h3>
                {info.title}
            </h3>
        );

        const getTransactionType = () => {
            const saleTranslation = stores.ConfigStore.getItem('i18n').saleSearchType || 'sale';
            const leaseTranslation = stores.ConfigStore.getItem('i18n').letSearchType || 'lease';
            const aspect = this.props.property.Aspect;

            if (aspect.includes('isLetting') && aspect.includes('isSale')) {
                return leaseTranslation + ' or ' + saleTranslation;
            } else if (aspect.includes('isLetting') && !aspect.includes('isSale')) {
                return leaseTranslation;
            } else if (!aspect.includes('isLetting') && aspect.includes('isSale')) {
                return saleTranslation;
            }
            return undefined;
        };

        const getPropertyType = () => {
            return property['UsageType'] ? property['UsageType'] : undefined;
        };

        // set up description and images used in featured carousel if it's enabled
        let aspectDescription = null;
        let pricingImg = null;
        if (this.props.description) {
            aspectDescription = getTransactionType();
        }

        // setup featured carousel pricing image based on aspect
        const generatePricingImg = (aspect) => {
            // get aspect type images from config store, if image for aspect type exist return it else send deafult images
            const aspectTypeImages = stores.ConfigStore.getItem('aspectTypeImages');
            pricingImg = aspectTypeImages ? aspectTypeImages[aspect] : null;

            if (pricingImg) {
                return pricingImg;
            }

            if (aspect == 'isLetting') {
                pricingImg = 'https://www-spaceleveldisplay.azurewebsites.net/images/lease.png';
            } else if (aspect == 'isSale') {
                pricingImg = 'https://www-spaceleveldisplay.azurewebsites.net/images/sale.png';
            }
            return pricingImg;
        };

        let cardListingsCount =
            features &&
                features.childListings &&
                features.childListings.enableChildListings &&
                property.IsParent ? (
                <div className="card_listings_count">
                    <ListingCount propertyId={propertyId} />
                </div>
            ) : null;


        const showExtraIcons = features.showExtraPropertyCardIcons ? features.showExtraPropertyCardIcons : false;
        const extraHoverIcon = features.extraDefaultAvatarOnHover ? features.extraDefaultAvatarOnHover : false;

        let cardContacts = isPdf ? null : (
            <CardContacts className={classNames('contacts', contactParentClass, (showExtraIcons ? 'extraIcons' : ''))}>
                {this.getContactsMarkup(contactsArray, siteType, ContactGroup, dataTestIndex, showExtraIcons, extraHoverIcon)}
            </CardContacts>
        );

        const favourite = showFavourites ? (
            <Favourite_R4 propertyId={propertyId} />
        ) : null;

        let pType = this.props.property.UsageType || stores.ConfigStore.getItem('params')['Common.UsageType'];
        pType = language[pType] || pType;

        const aspect = (property.Aspect
            && property.Aspect.length > 0
            && (property.Aspect.includes('isSale') ? 'isSale'
                : property.Aspect.includes('isLetting') ? 'isLetting' : property.Aspect[0]))
            || stores.ConfigStore.getItem('params')['Common.Aspects']
            || stores.ConfigStore.getItem('params')['aspects'];

        let cardContent = (
            this.props.featuredRedesignCarousel ?
                <CardContent {...cardContentClass} style={{ marginBottom: '5px', marginTop: '2px' }} className="featuredCarouselCard" data-test={createDataTestAttribute('property-card', dataTestIndex)} carousel={this.props.carousel}>
                    {!this.props.carousel &&
                        <PropertyTypeLabel>
                            <TranslateString
                                string="detailsStraplineType"
                                usageType={`${pType}`}
                                transactionType={`${language[`detailsStrapline_${aspect}`] || ''}`}
                            />
                        </PropertyTypeLabel>
                    }
                    {this.props.description && this.props.description != '' &&
                        <h2 className="featuredCardDescription">
                            {(this.props.property.StrapLine && this.props.property.StrapLine !== '') ?
                                (this.props.property.StrapLine)
                                :
                                (this.props.description + (aspectDescription ? ' ' + aspectDescription : ''))
                            }
                        </h2>
                    }
                    {cardContentAddress}
                    {info.inexactText}
                    <div style={{ width: '100%', float: 'left', marginBottom: '15px' }}>
                        <div className="flex-two-column" style={{ width: '50%', float: 'left' }}>
                            {/* <div className="cbre_subh1">{info.subtitle}</div> */}
                            <div className="Sizes" data-test={createDataTestAttribute('property-card-info-body', dataTestIndex)}>
                                <span className="sizeIcon" />
                                {info.body}
                            </div>
                        </div>
                        <div className="onApplication" data-test={createDataTestAttribute("on-application", dataTestIndex)}>
                            {property.Aspect.length > 0 && property.Aspect.map((propertyAspect, index) => {
                                if (propertyAspect.includes('isSale') || propertyAspect.includes('isLetting')) {
                                    return (
                                        <div key={'featureCarouselCard' + index} className="featuredCarouselPrice">
                                            {propertyAspect && this.generatePricing(propertyAspect)}
                                            {generatePricingImg(propertyAspect) &&
                                                <img className="carouselImg" src={generatePricingImg(propertyAspect)} />}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </CardContent>
                :
                (this.props.pdpLocationCard) ?
                    <div {...cardContentClass}>
                        <div className="cardRow">
                            {cardContentAddress}
                            {info.body}
                            {info.subtitle}
                        </div>
                        {cardAvailability}
                        {highlightsList}
                    </div>
                    :
                    <CardContent style={(showExtraIcons && window.screen.width > 520) ? { marginBottom: '5px', marginTop: '2px', minHeight: '146px' } : { marginBottom: '5px', marginTop: '2px' }} carousel={this.props.carousel}>
                        <InfoRow>
                            <PropertyTypeLabel>
                                {(this.props.property.Aspect.includes('isSale') && this.props.property.Aspect.includes('isLetting'))
                                    ?
                                    <span>{pType} {language[`detailsStrapline_isSaleIsLetting`] ? language[`detailsStrapline_isSaleIsLetting`] : 'for Sale/Lease'} </span>
                                    :
                                    <React.Fragment>
                                        {!this.props.carousel &&
                                            <TranslateString
                                                string="detailsStraplineType"
                                                usageType={`${pType}`}
                                                transactionType={`${language[`detailsStrapline_${aspect}`] || ''}`}
                                            />
                                        }
                                    </React.Fragment>
                                }
                            </PropertyTypeLabel>
                            {availability && availability.value && features.displayPropertyCardAvailability &&
                                <AvailabilityStyle>{language['Available']} {availability.value}</AvailabilityStyle>
                            }
                        </InfoRow>
                        {cardContentAddress}
                        {info.inexactText}
                        <StyledAdditionalInformartion>
                            <div className="flex-two-column">
                                <div className="cbre_subh2 customh2">
                                    <span className="sizeIcon" />
                                    {/* <InfoBody><span>Total Building</span></InfoBody> */}
                                    {info.body}
                                </div>
                            </div>
                            <InfoBody>
                                {(this.props.property.Aspect.includes('isSale') && this.props.property.Aspect.includes('isLetting'))
                                    ?
                                    <React.Fragment>
                                        {this.generatePricing('isSale')}
                                        <br></br>
                                        {this.generatePricing('isLetting')}
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {this.generatePricing(this.props.property.Aspect.length > 0 ? property.Aspect[0] : searchType)}
                                    </React.Fragment>
                                }
                            </InfoBody>
                        </StyledAdditionalInformartion>
                        {cardAvailability}
                    </CardContent>
        );


        cardContent = isPdf
            ? cardContent
            : this.wrapInLink(cardContent, this.props.carousel ? '' : 'card_content');

        return (
            this.props.infoWindow ? this.wrapInLink(<InfoWindowContent
                property={property}
                primaryImage={cdnUrl + image.src}
                transactionType={getTransactionType()}
                propertyType={getPropertyType()}
                address={info.title}
                showFavorites={showFavourites}
                price={info.subtitle}
                size={info.body}
            />, 'gl-info-window-link-wrap')
                :
                <StyledCard
                    r4={true}
                    className={classNames(classes) + ' ' + propertyId + ' r4PropertyCard' + (this.props.featuredRedesignCarousel ? ' featuredCarouselCard' : '') + (this.props.pdpLocationCard ? ' pdpLocationCard' : '')}
                    key={classNames(classes) + ' ' + propertyId + ' r4PropertyCard' + (this.props.featuredRedesignCarousel ? ' featuredCarouselCard' : '') + (this.props.pdpLocationCard ? ' pdpLocationCard' : '')}
                    carousel={this.props.carousel}
                    {...other}
                >
                    <span {...mouseEvents}>
                        {this.props.carousel &&
                            <div className="carouselTitle">
                                <PropertyTypeLabel>
                                    <span style={{ marginRight: '10px' }}>{this.props.index + 1}/{this.props.carouselLength}</span>
                                    <TranslateString
                                        string="detailsStraplineType"
                                        usageType={`${pType}`}
                                        transactionType={`${language[`detailsStrapline_${aspect}`] || ''}`}
                                    />
                                </PropertyTypeLabel>
                            </div>
                        }
                        {cardMedia}
                        {rating}
                        {cardPin}
                        <StyledCardBody
                            className={isPdf ? 'detailsWrap' : 'card_body'}
                        >
                            {/* {favourite} */}
                            {cardContent}
                            {cardContacts}
                            {cardListingsCount}
                        </StyledCardBody>
                    </span>
                    {(highlights.length > 0) && highlightsList}
                </StyledCard>
        );
    }
}





PropertyCard_R4.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

PropertyCard_R4.propTypes = {
    className: PropTypes.string,
    propertyCount: PropTypes.number,
    property: PropTypes.object.isRequired,
    isFullScreen: PropTypes.bool,
    contactClickHandler: PropTypes.func,
    spaPath: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    propertyLinkClickHandler: PropTypes.func,
    isPdf: PropTypes.bool,
    propertyIndex: PropTypes.number,
    showFavourites: PropTypes.bool,
    useHardLink: PropTypes.bool,
    mouseEvents: PropTypes.object,
    dataTestIndex: PropTypes.number,
    description: PropTypes.any,
    featuredRedesignCarousel: PropTypes.bool,
    infoWindow: PropTypes.bool,
    dynamicImageSizeKey: PropTypes.string,
    carousel: PropTypes.bool,
    index: PropTypes.number,
    carouselLength: PropTypes.number
};

PropertyCard_R4.defaultProps = {
    contactClickHandler: () => { },
    showFavourites: true,
    useHardLink: false,
    property: {},
    spaPath: {},
    siteType: '',
    description: null,
    featuredRedesignCarousel: false,
    pdpLocationCard: false
};

const StyledCardMedia = styled(CardMedia)`
    > a {
        width:31px !important;
        height:31px !important;
        position:absolute;
        cursor: pointer;
        right: 6px;
        top: 6px;
        z-index: 1;
    }
`

const InfoBody = styled.div`
    span {
        font-family: Calibre !important;
        font-style: normal;
        font-weight: normal;
        font-size: 20px !important;
        line-height: 32px;
        color: #435254 !important;
    }
`;

const StyledCardBody = styled(CardBody)``;

const CardContacts = styled.div`
    .cbre_button_text {
        > p {
            font-family: Calibre Regular !important;
            font-weight: normal !important;
            color: #435254 !important;
            font-style: normal;
            font-weight: normal;
            font-size: 16px !important;
        }
    }
    .FontIcon_icon_phone, .FontIcon_icon_mail {
        display: none !important;
    }
`;

const CardContent = styled.div`
    padding-top:7px;
    padding-left:7px;

    ${props => props.carousel && `
        padding-left: 0px;
        padding-right: 0px;
    `}

    #addressLine2 {
        margin-top:8px;
        margin-bottom:5px;
    }

`;

const AvailabilityStyle = styled.p`
    font-size:16px !important;
    background:#538184;
    color: #fff;
    font-family: Calibre Regular !important;
    padding: 0 5px;
`

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom:18px;
    align-items:center;
`

const PropertyTypeLabel = styled.p`
    margin-bottom: 0 !important;
    font-family: "Calibre Regular" !important;
    font-style: normal;
    font-weight: normal;
    font-size: 16px !important;
    line-height: 22px !important;
    color: #435254;
`

const StyledCard = styled(Card)`
    ${({ carousel })  => carousel && `
    min-height: 380px !important;
    margin-left:30px !important;
    overflow:visible !important;
    span {
        > .carouselTitle{
            margin-left: -30px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
            margin-bottom: 10px;
        }
    }
    `}
    ${({ r4 }) => r4 &&
        `
            border: none !important;
            box-shadow: none !important;
            #addressLine1, #addressLine1 > span {
                transition: .5s;
            }
            #addressLine1 > span {
                text-decoration: underline;
                text-decoration-color: transparent;
            }
            &:hover {
                .external-libraries-media-wrapper-container > div {
                    transform: scale(1.1);
                }
                #addressLine1 {
                    > span {
                        text-decoration-color: #003F2D;
                    }
                }
            }
            flex-direction: column !important;
            .card_image {
                max-height:350px;
            }
            @media screen and (max-width:520px){
                margin-left: -21px !important;
                margin-right: -21px !important;
                .card_image {
                    width: 100% !important;
                    max-height: 150px !important;
                }
                .card_body {
                    padding-left: 0 !important;
                    margin-top: 153px !important;
                    .horizontalList {
                        display:flex !important;
                        > div {
                            padding: 0 !important;
                        }
                    }
                }
                .contacts {
                    .cbre_comm_card_single {
                        width: 100%;
                    }
                }
            }
            @media screen and (min-width: 520px) and (max-width:1024px){
                margin-left: 0 !important;
                margin-right: 0 !important;
                .card_image {
                    width: 100% !important;
                    max-height: 200px !important;
                }
                .card_body {
                    padding-left: 0 !important;
                    margin-top: 153px !important;
                    margin-bottom: -110px !important;
                }
            }
        `
    }
`;

const SizeStyled = styled(Size)`

`;

const StyledWalkthroughImage = styled.img`
    position: absolute;
    left: 5px;
    width:65px !important;
    z-index: 1;
    ${props => props.highlights.length > 0 ? `
            bottom: 75px;
        ` :
        `   bottom: 15px;`
    }
`;

const StyledHighlights = styled(List)`
    position: relative;
    bottom:0;
    left:0;
    right:0;
    background: #fff;
    font-family: "Calibre" !important;
    margin-top: 0 !important;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 26px;
    padding: 5px 0 !important;
    padding-left:20px !important;
    padding-right:10px !important;
    color: #435254 !important;
    li {
        font-family: "Calibre" !important;
        font-style: normal;
        font-weight: normal;
        font-size: 16px !important;
        line-height: 26px;
        margin-bottom:3px !important;
        -webkit-line-clamp: 1 !important;
        white-space: nowrap !important;
        max-width: 48% !important;
    }
    li:nth-of-type(odd){
        margin-right: 2% !important;
    }
    li:before {
        background: #538184 !important;
        top: 10px !important;
    }
    
`;

const StyledAdditionalInformartion = styled.div`
    margin-top: 6px;
    width: 100%;
    float: left;
    margin-bottom: 16px;
`;

export default PropertyCard_R4;