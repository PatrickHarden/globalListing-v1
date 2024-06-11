import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Truncate from 'react-truncate';
import {
    Avatar,
    Card,
    CardBody,
    CardMedia,
    Contact,
    FontIcon,
    List,
    MediaWrapper
} from '../../external-libraries/agency365-components/components';
import { Link } from 'react-router';
import PriceLabel from '../../components/Property/PropertyComponents/PriceLabel';
import Size from '../../components/Property/PropertyComponents/Size';
import TranslateString from '../../utils/TranslateString';
import createQueryString from '../../utils/createQueryString';
import defaultValues from '../../constants/DefaultValues';
import AddressSummary from '../../components/Property/PropertyComponents/AddressSummary';
import classNames from 'classnames';
import Favourite from '../Favourite/Favourite';
import ListingCount from '../ListingCount/ListingCount';
import { isWebkit, isPrerender } from '../../utils/browser';
import letterFromIndex from '../../utils/letterFromIndex';
import LazyLoader from '../../list-map-components/LazyLoader';
import $ from 'jquery';

import { Cell } from '../Table/Table';
import getAvailability from '../../utils/getAvailability';
import getEnergyRating from '../../utils/getEnergyRating';

class PropertyCard extends Component {
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

    renderFloorProp(property) {
        {
            const floorArray = this.getFloorProps(property);
            if (floorArray.length <= 0) {
                return;
            }
            let floorOutput = floorArray.map(function (details, key) {
                return (
                    <Cell key={`floorProp-${key || details.value}`} widthXs={4}>
                        <h4 className="cbre_h6">{details.title}</h4>
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
            searchResultsPage = carouselConfig
                ? carouselConfig.searchResultsPage
                : null;
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
            if (searchResultsPage.endsWith('/')) {
                searchResultsPage = searchResultsPage.replace(/\/$/, '');
            }
            // Set a hard link to the default search page.
            path = searchResultsPage + path;
            useHardLink = true;
        } else {
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
        const viewType = { view: searchType };

        const detailsLink = this.buildDetailsPagePath(
            spaPath.path,
            property,
            urlAddress,
            stores
        );
        const LinkType = detailsLink.useHardLink ? 'a' : Link;

        let linkProps = {
            to: { pathname: detailsLink.path, query: viewType || null }
        };

        if (detailsLink.useHardLink) {
            linkProps = {
                href: detailsLink.path + createQueryString(viewType)
            };
        }

        return (
            <span onClick={() => this.redirect(linkProps, Coordinates, propertyIndex, propertyId, ParentPropertyId)} key={`${className + (linkProps.href) ? linkProps.href : propertyIndex}_link`}>
                <LinkType
                    key={`${className}_link`}
                    {...linkProps}
                    className={className}
                >
                    {Component}
                </LinkType>
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
            )
        }
        if ($('.cbre-spa--v2carousel').length > 0) {
            setTimeout(() => { this.checkRedirect(url, currentUrl) }, 200)
        }
    }

    checkRedirect(url, currentUrl) {
        if (url && url.href && (currentUrl === window.location)) {
            if (url.href.substr(0, 1) == '/' || window.location.origin.substr(-1) == '/'){
                window.location.href = encodeURI(window.location.origin + url.href)              
            } else {
                window.location.href = encodeURI(window.location.origin + '/' + url.href) 
            } 
        }
    }

    getContactsMarkup(contactsArray, siteType, ContactGroup) {
        let contactOutput;
        const contactClasses = `contact cbre_button cbre_button__avatar cbre_button__small ${
            siteType !== 'residential' ? 'commercial_contact' : ''
            }`;

        switch (siteType) {
            case 'residential':
                if (contactsArray.length) {
                    contactsArray[0].name = ContactGroup.name;
                    contactOutput = (
                        <Contact
                            {...contactsArray[0]}
                            className={contactClasses}
                            key="contact_0"
                        />
                    );
                }
                break;

            default:
                contactOutput = contactsArray.map(function (contact, i) {
                    return (
                        <div
                            className={`col-xs-6 cbre_comm_card_${
                                contactsArray.length === 1 ? 'single' : 'multi'
                                }`}
                            key={`contact_${i}`}
                        >
                            <Contact className={contactClasses} {...contact} />
                        </div>
                    );
                });
                break;
        }

        return contactOutput;
    }

    render() {
        const {
            className,
            property,
            contactClickHandler,
            siteType,
            isPdf,
            propertyIndex,
            showFavourites,
            shouldLazyLoad,
            mouseEvents,
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
                <AddressSummary
                    address={ActualAddress}
                    isParent={_IsParent}
                    floorsAndUnits={FloorsAndUnits}
                />
            ),
            subtitle: (
                <PriceLabel
                    property={property}
                    displayLabel={false}
                    searchType={searchType}
                />
            )
        };

        if (!exact) {
            if (typeof features.displayFullAddressOnRequest === 'undefined' || features.displayFullAddressOnRequest === true) {
                info.inexactText = (
                    <div className="cbre_subh1 cbre_addressOnRequest">
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
                if (bedrooms && parseInt(bedrooms) === 1) {
                    info.body = (
                        <div>
                            <TranslateString
                                string="NumberOfBedroomsSingular"
                                bedroomCount={bedrooms}
                            />
                            {features &&
                                features.displaySizeInSideHeader &&
                                (property.TotalSize.area ||
                                    property.MinimumSize.area) && (
                                    <span>
                                        &nbsp;/&nbsp;
                                        <Size
                                            property={property}
                                            displayLabel={false}
                                        />
                                    </span>
                                )}
                        </div>
                    );
                } else if (bedrooms && parseInt(bedrooms) > 1) {
                    info.body = (
                        <div>
                            <TranslateString
                                string="NumberOfBedroomsPlural"
                                bedroomCount={bedrooms}
                            />
                            {features &&
                                features.displaySizeInSideHeader &&
                                (property.TotalSize.area ||
                                    property.MinimumSize.area) && (
                                    <span>
                                        &nbsp;/&nbsp;
                                        <Size
                                            property={property}
                                            displayLabel={false}
                                        />
                                    </span>
                                )}
                        </div>
                    );
                } else {
                    info.body = (
                        <div>
                            <TranslateString string="Studio" />
                            {features &&
                                features.displaySizeInSideHeader &&
                                (property.TotalSize.area ||
                                    property.MinimumSize.area) && (
                                    <span>
                                        &nbsp;/&nbsp;
                                        <Size
                                            property={property}
                                            displayLabel={false}
                                        />
                                    </span>
                                )}
                        </div>
                    );
                }
                break;
            default:
                contactParentClass = 'horizontalList';
                truncateContacts = _contacts.splice(0, 2);
                info.body = (
                    <div>
                        <div><Size property={property} displayLabel={false} /></div>
                        {stores.ConfigStore.getFeatures().displayNumberOfBedrooms &&
                            <div>                      
                                <TranslateString
                                    string={numberOfBedroomsTranslationString}
                                    bedroomCount={bedrooms}
                                />
                            </div>
                        }
                    </div>
                );
                break;
        }

        const contactsArray = truncateContacts.map((contact, i) => {
            // Removing src until its added to API.
            let avatar = (
                <Avatar
                    src={contact.avatar}
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
            image.alt = alt;
        } else {
            console.warn(`no image available for ${propertyId}`); // eslint-disable-line
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
            this.renderFloorProp(property);

        let highlightsList = isPdf ? null : (
            <List columns={2} limit={4} className="bulletList textCol-xs-2">
                {highlights.map(function (highlight, i) {
                    return (
                        <li key={`${propertyId}_highlight_${i}`}>
                            {highlight}
                        </li>
                    );
                })}
            </List>
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

        let cardMedia = (
            <CardMedia
                bannerText={rating ? null : image.status}
                topLeftIcon={image.iconElementTopLeft}
                {...cardMediaClass}
            >
                <MediaWrapper fitHeight={fitHeight} fitWidth={fitWidth}>
                    <img
                        src={cdnUrl + image.src}
                        alt={image.alt}
                        onError={event =>
                            event.target.setAttribute(
                                'src',
                                isPrerender
                                    ? cdnUrl + image.src
                                    : cdnUrl + placeholderImage
                            )
                        }
                    />
                </MediaWrapper>
            </CardMedia>
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
                    <Truncate ref="truncate" lines={2}>
                        {info.title}
                    </Truncate>
                </h3>
            </div>
        ) : (
                <h3
                    className={`cbre_h3 ${
                        isWebkit ? 'cbre_h3__truncate' : 'cbre_h3__truncate-fix'
                        }`}
                >
                    {info.title}
                </h3>
            );

        let cardContent = (
            <div {...cardContentClass}>
                {cardContentAddress}
                {info.inexactText}
                <div className="flex-two-column">
                    <div className="cbre_subh1">{info.subtitle}</div>
                    <div className="cbre_subh2">
                        <span className="sizeIcon" />
                        {info.body}
                    </div>
                </div>
                {cardAvailability}
                {highlightsList}
            </div>
        );
        cardContent = isPdf
            ? cardContent
            : this.wrapInLink(cardContent, 'card_content');
        let cardListingsCount =
            features &&
                features.childListings &&
                features.childListings.enableChildListings &&
                property.IsParent ? (
                    <div className="card_listings_count">
                        <ListingCount propertyId={propertyId} />
                    </div>
                ) : null;

        let cardContacts = isPdf ? null : (
            <div className={classNames('contacts', contactParentClass)}>
                {this.getContactsMarkup(contactsArray, siteType, ContactGroup)}
            </div>
        );

        const favourite = showFavourites ? (
            <Favourite propertyId={propertyId} />
        ) : null;

        return (
            <Card className={classNames(classes) + ' ' + propertyId} {...other}>
                <LazyLoader
                    key={`${propertyId}_propertycard`}
                    offset={500}
                    height={300}
                    scroll={this.props.isFullScreen? true : false}
                    overflow={this.props.isFullScreen ? false : true}
                    disable={isPrerender || !shouldLazyLoad}
                >
                    <span style={{ width: '100%' }} {...mouseEvents}>
                        {cardMedia}
                        {rating}
                        {cardPin}
                        <CardBody
                            className={isPdf ? 'detailsWrap' : 'card_body'}
                        >
                            {favourite}
                            {cardContent}
                            {cardContacts}
                            {cardListingsCount}
                        </CardBody>
                    </span>
                </LazyLoader>
            </Card>
        );
    }
}

PropertyCard.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

PropertyCard.propTypes = {
    className: PropTypes.string,
    property: PropTypes.object.isRequired,
    isFullScreen: PropTypes.bool,
    contactClickHandler: PropTypes.func,
    spaPath: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    propertyLinkClickHandler: PropTypes.func,
    isPdf: PropTypes.bool,
    propertyIndex: PropTypes.number,
    shouldLazyLoad: PropTypes.bool,
    showFavourites: PropTypes.bool,
    useHardLink: PropTypes.bool,
    mouseEvents: PropTypes.object
};

PropertyCard.defaultProps = {
    contactClickHandler: () => { },
    showFavourites: true,
    useHardLink: false,
    property: {},
    shouldLazyLoad: true,
    spaPath: {},
    siteType: ''
};

export default PropertyCard;