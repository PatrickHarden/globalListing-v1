import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PropertyNavigation from '../../components/Property/PropertyComponents/PropertyNavigation';
import Walkthrough from '../../components/Property/PropertyComponents/Walkthrough';
import PropertyImage from '../../components/Property/PropertyComponents/PropertyImage';
import Gmap from '../../components/Gmaps/index';
import ContactFormWrapper from '../ContactFormWrapper/ContactFormWrapper';
import ShareModal from '../ShareModal/ShareModal';
import SideBarHeader from './PDPComponents/SideBarHeader';
import SideBarContent from './PDPComponents/SideBarContent';
import Carousel from '../Carousel/Carousel';
import UnderOfferBanner from '../UnderOfferBanner/UnderOfferBanner';
import PropertyPhotoGrid from './PDPComponents/PropertyPhotoGrid';
import PointsOfInterest from './PDPComponents/PointsOfInterest';
import Specification from './PDPComponents/Specification';
import { PhotoSwipe } from 'react-photoswipe';
import ExpandableText from '../ExpandableText/ExpandableText';
import CollapsibleBlock from '../CollapsibleBlock/CollapsibleBlock';
import { responsiveContainer } from '../../external-libraries/agency365-components/components';
import FloorsAndUnits from './PDPComponents/FloorsAndUnits';
import Parking from './PDPComponents/Parking';
import LeaseAndCharges from './PDPComponents/LeaseAndCharges';
import EnergyPerformance from './PDPComponents/EnergyPerformance';
import SizesAndMeasurements from './PDPComponents/SizesAndMeasurements';
import RelatedProperties from '../RelatedProperties/RelatedProperties';
import ChildProperties from '../ChildProperties/ChildProperties';
import StickySideBar from './PDPComponents/StickySideBar';
import { StickyContainer } from 'react-sticky';
import getPath from 'getpath';

class DetailViewCommercial extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isOpen: false,
            index: 0,
            features: context.stores.ConfigStore.getFeatures(),
            floorsAndUnitsConfig: context.stores.ConfigStore.getFloorsAndUnits()
        };
    }

    componentWillMount() {
        this.props.modal.addModal('contact');
        this.props.modal.addModal('share');
    }

    showContactForm = (e, contact = {}) => {
        const { modal, property } = this.props;

        modal.getModal('contact').show(property, contact, e, 'PDP');
    };

    renderCarouselOrImage() {
        const { property } = this.props;

        const { Photos, Walkthrough } = property;

        if (Walkthrough) {
            return;
        }

        const images = Photos.length ? Photos : [];
        // Render static image or carousel.
        if (images.length === 1) {
            return (
                <PropertyImage
                    onClick={this.handleOpenImageInLightbox}
                    items={images[0].resources}
                />
            );
        } else if (images.length > 1) {
            return (
                <Carousel
                    className="cbre_imageCarousel_items"
                    openLightboxFunc={this.handleOpenImageInLightbox}
                    items={images}
                />
            );
        }
    }

    renderPropertyNavigation(
        ActualAddress,
        location,
        language,
        className,
        parentPropertyId
    ) {
        const enabled = this.context.stores.ConfigStore.getItem('features')
            .propertyNavigation;
        if (!enabled) {
            return null;
        }

        let locale = '';

        if (this.context.spaPath && this.context.spaPath.path) {
            const localeParts = this.context.spaPath.path.split('/');

            if (localeParts.length > 1) {
                locale = localeParts[1];
            }
        }

        return (
            <div className={className}>
                <PropertyNavigation
                    address={ActualAddress}
                    parentPropertyId={parentPropertyId}
                    subdivisionName={
                        this.props.property.FloorsAndUnits &&
                        this.props.property.FloorsAndUnits.length > 0 &&
                        this.props.property.FloorsAndUnits[0].subdivisionName
                            ? this.props.property.FloorsAndUnits[0]
                                  .subdivisionName
                            : null
                    }
                    location={location}
                    className="cbre_container paddingX-lg-1 navBlock"
                    btnContainerClass="subnav_links"
                    btnClass="subnav_link"
                    btnPrevClass="subnav_link__prev"
                    btnPrevContent={language.PreviousPropertyButtonText}
                    btnNextClass="subnav_link__next"
                    btnNextContent={language.NextPropertyButtonText}
                    useBreadcrumb={true}
                    homeUri={`/${locale}`}
                />
            </div>
        );
    }

    componentWillUpdate = () => {
        // Reset lightbox data for each property.
        this.context.stores.PropertyStore.setPropertyLightboxData();
    };

    openLightbox = index => {
        this.setState({
            isOpen: true,
            index: index
        });
    };

    closeLightbox = () => {
        this.setState({
            isOpen: false,
            index: 0
        });
    };

    handleOpenImageInLightbox = index => {
        this.props.lightboxFunctions.fireOpenLightboxEvent('image');
        this.openLightbox(index);
    };

    handleOpenFloorplanInLightbox = index => {
        this.props.lightboxFunctions.fireOpenLightboxEvent('floorplan');
        this.openLightbox(index);
    };

    renderFloorplan = () => {
        const {
            property,
            siteType,
            breakpoints: { isMobile }
        } = this.props;

        const { FloorPlans } = property;

        const { language } = this.context;

        const floorplanUrl = getPath(FloorPlans, '[0].resources[0].uri');

        if (floorplanUrl) {
            return (
                <CollapsibleBlock
                    title={language.Floorplan}
                    isCollapsible={isMobile}
                    startExpanded={!isMobile}
                    headerClassName="collapsableBlock_header__noUnderline"
                    innerClassName="paddingX-md-1 paddingBottom-md-1 pdp_floorplan"
                    className="floorBlock"
                >
                    <PropertyPhotoGrid
                        property={property}
                        siteType={siteType}
                        imageType="FloorPlans"
                        openLightboxFunc={this.handleOpenImageInLightbox}
                    />
                </CollapsibleBlock>
            );
        }
    };

    openFloorplanInLightbox = floorplanIndex => {
        const { stores } = this.context;
        const lightboxItems = stores.PropertyStore.getPropertyLightboxData();
        const selectedFloorplan = lightboxItems.findIndex(
            item => item.dataType === 'floorplan'
        );
        const selectedFloorplanIndex = selectedFloorplan + floorplanIndex;
        this.handleOpenImageInLightbox(selectedFloorplanIndex);
    };

    renderPropertyImages = () => {
        const {
            property,
            siteType,
            breakpoints: { isMobile }
        } = this.props;

        const { language } = this.context;

        if (property.Photos.length > 0) {
            return (
                <CollapsibleBlock
                    title={language.PdpImagesTitle}
                    isCollapsible={isMobile}
                    startExpanded={!isMobile}
                    headerClassName="collapsableBlock_header__noUnderline"
                    innerClassName="paddingX-md-1 paddingBottom-md-1"
                    className="imagesBlock"
                >
                    <PropertyPhotoGrid
                        property={property}
                        siteType={siteType}
                        imageType="Images"
                        openLightboxFunc={this.handleOpenImageInLightbox}
                    />
                </CollapsibleBlock>
            );
        }
    };

    renderLightbox = () => {
        const { isOpen, index } = this.state;

        const { stores } = this.context;

        const lightboxData = stores.PropertyStore.getPropertyLightboxData();

        return (
            <PhotoSwipe
                ref="lightbox"
                isOpen={isOpen}
                items={lightboxData}
                options={{
                    index,
                    closeOnScroll: false,
                    history: false
                }}
                onClose={this.closeLightbox}
            />
        );
    };
    renderParking = property => {
        const { language } = this.context;

        const {
            breakpoints: { isMobile }
        } = this.props;
        if (
            property.Parking &&
            (property.Parking.ratio || property.Parking.details.length !== 0)
        ) {
            return (
                <CollapsibleBlock
                    title={language.ParkingTitle}
                    isCollapsible={isMobile}
                    startExpanded={!isMobile}
                    headerClassName="collapsableBlock_header__noUnderline"
                    innerClassName="padding-md-1 paddingBottom-md-1"
                    className="parkingBlock"
                >
                    <Parking parking={property.Parking} />
                </CollapsibleBlock>
            );
        }
    };
    renderFloorsAndUnits = property => {
        const { language } = this.context;

        const {
            breakpoints: { isMobile }
        } = this.props;
        if (
            !this.state.floorsAndUnitsConfig.hideFloorsAndUnits &&
            property.FloorsAndUnits &&
            property.FloorsAndUnits.length
        ) {
            return (
                <CollapsibleBlock
                    title={language.FloorsAvailable}
                    isCollapsible={isMobile}
                    startExpanded={!isMobile}
                    headerClassName="collapsableBlock_header__noUnderline"
                    innerClassName="padding-md-1 paddingBottom-md-1"
                    className="floorBlock"
                >
                    <FloorsAndUnits floors={property.FloorsAndUnits} />
                </CollapsibleBlock>
            );
        }
    };

    renderLeaseAndCharges = property => {
        const { stores } = this.context;
        if (
            stores.ConfigStore.getFeatures().hideLeaseAndChargesOnParent &&
            this.props.property.IsParent
        ) {
            return null;
        }
        const hidden = stores.ConfigStore.getLeasesAndCharges()
            .hideLeaseSection;
        if (!hidden) {
            const { language } = this.context;
            const { breakpoints, searchType } = this.props;
            return (
                <CollapsibleBlock
                    title={language['PdpLeaseInformationAndChargesTitle']}
                    isCollapsible={breakpoints.isMobile}
                    startExpanded={!breakpoints.isMobile}
                    innerClassName="padding-xs-1"
                    className="leasesBlock"
                >
                    <LeaseAndCharges
                        property={property}
                        searchType={searchType}
                    />
                </CollapsibleBlock>
            );
        }
    };

    renderEnergyPerformance = property => {
        const { language } = this.context;
        const { breakpoints } = this.props;
        const epd = property.EnergyPerformanceData;

        // Don't display this section where only UK EPC data is specified
        // "type" is a compulsory field in Germany so check if present
        if (epd && epd.type) {
            return (
                <CollapsibleBlock
                    title={language['PdpEnergyPerformanceTitle']}
                    isCollapsible={breakpoints.isMobile}
                    startExpanded={!breakpoints.isMobile}
                    innerClassName="padding-xs-1"
                    className="energyBlock"
                >
                    <EnergyPerformance data={epd} />
                </CollapsibleBlock>
            );
        }
    };

    renderSizesAndMeasurements = property => {
        const { language, stores } = this.context;
        const { breakpoints } = this.props;
        if (
            stores.ConfigStore.getFeatures().hideSizesAndMeasurementsOnParent &&
            this.props.property.IsParent
        ) {
            return null;
        }
        if (!property.Sizes || property.Sizes.length === 0) {
            return null;
        }

        return (
            <CollapsibleBlock
                title={language['PdpSizeAndMeasurementsTitle']}
                isCollapsible={breakpoints.isMobile}
                startExpanded={!breakpoints.isMobile}
                innerClassName="padding-xs-1"
                className="sizesBlock"
            >
                <SizesAndMeasurements property={property} />
            </CollapsibleBlock>
        );
    };

    renderLocationDescription = () => {
        const { property, breakpoints } = this.props;

        const { language } = this.context;

        if (
            property.LocationDescription &&
            property.LocationDescription.content
        ) {
            return (
                <CollapsibleBlock
                    title={language.LocationDescriptionTitle}
                    isCollapsible={breakpoints.isMobile}
                    startExpanded={!breakpoints.isMobile}
                    innerClassName="padding-xs-1"
                    className="locationBlock"
                >
                    {property.LocationDescription.content.trim()}
                </CollapsibleBlock>
            );
        }
    };

    renderComments = () => {
        const { property, breakpoints } = this.props;

        const { language } = this.context;

        if (property.Comments && property.Comments.content) {
            return (
                <ExpandableText
                    title={
                        <h2 className="cbre_h2_underlined">
                            {language.CommentsTitle}
                        </h2>
                    }
                    startExpanded={!breakpoints.isMobile}
                >
                    {property.Comments.content.trim()}
                </ExpandableText>
            );
        }
    };

    renderOverview = () => {
        const { property, breakpoints } = this.props;
        const { language } = this.context;
        return (
            (property.StrapLine || property.LongDescription) &&
            (breakpoints.isMobile ? (
                <div className="propertyDescription marginTop-lg-1">
                    <CollapsibleBlock
                        title={language.OverviewTitle}
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={true}
                        className="overviewBlock"
                    >
                        <ExpandableText
                            title={property.StrapLine}
                            startExpanded={breakpoints.isMobile}
                        >
                            {property.LongDescription.trim()}
                        </ExpandableText>
                    </CollapsibleBlock>
                </div>
            ) : (
                <div className="propertyDescription marginTop-lg-1">
                    <ExpandableText
                        title={property.StrapLine}
                        startExpanded={!breakpoints.isMobile}
                    >
                        {property.LongDescription.trim()}
                    </ExpandableText>
                </div>
            ))
        );
    };

    render() {
        const {
            property,
            siteType,
            searchType,
            modal,
            breakpoints,
            location,
            carouselCardProps,
            childCardProps,
            relatedProperties = {},
            childProperties = {},
            spaPath
        } = this.props;

        const { ActualAddress, Aspect } = property;

        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        const sidebarProps = {
            modal,
            property,
            siteType,
            searchType,
            showContactForm: this.showContactForm,
            breakpoints,
            openLightboxFunc: this.handleOpenFloorplanInLightbox
        };

        const sideBar = breakpoints.isTabletLandscapeAndUp ? (
            <StickySideBar
                marginBottom={40}
                stickyOffset={0}
                {...sidebarProps}
            />
        ) : null;

        const sideBarHeader_mobile = !breakpoints.isTabletLandscapeAndUp ? (
            <div className="cbre_sidebar">
                <SideBarHeader {...sidebarProps} />
            </div>
        ) : null;

        const sideBarContent_mobile = !breakpoints.isTabletLandscapeAndUp ? (
            <div className="cbre_sidebar">
                <SideBarContent {...sidebarProps} />
            </div>
        ) : null;
        const showBanners = features && features.propertyBanners;
        const isUnderOffer =
            Aspect.includes('isLetUnderOffer') ||
            Aspect.includes('isUnderOffer') ||
            Aspect.includes('isSold') ||
            Aspect.includes('isSaleAgreed') ||
            Aspect.includes('isLeased') ||
            false;
        let propertyBannerText = '';

        if (
            Aspect.includes('isSold') &&
            showBanners &&
            features.propertyBanners.showSoldBanner
        ) {
            propertyBannerText = language.SoldBannerText;
        } else if (
            Aspect.includes('isSaleAgreed') &&
            showBanners &&
            features.propertyBanners.showSaleAgreedBanner
        ) {
            propertyBannerText = language.SaleAgreedBannerText;
        } else if (
            Aspect.includes('isLeased') &&
            showBanners &&
            features.propertyBanners.showLeasedBanner
        ) {
            propertyBannerText = language.LeasedBannerText;
        } else if (
            Aspect.includes('isLetUnderOffer') &&
            showBanners &&
            features.propertyBanners.showLetUnderOfferBanner
        ) {
            propertyBannerText = language.UnderOfferText;
        } else if (
            Aspect.includes('isUnderOffer') &&
            showBanners &&
            features.propertyBanners.showUnderOfferBanner
        ) {
            propertyBannerText = language.UnderOfferText;
        }

        const relatedPropertiesComponent = this.state.features
            .relatedProperties ? (
            <div className="cbre_container">
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-lg-12 center-block">
                        <RelatedProperties
                            cardProps={carouselCardProps}
                            relatedProperties={relatedProperties}
                            breakpoints={breakpoints}
                        />
                    </div>
                </div>
            </div>
        ) : null;

        const childPropertiesComponent =
            this.state.features.childListings &&
            this.state.features.childListings.enableChildListings &&
            !property.ParentPropertyId ? (
                <div className="location-properties">
                    <ChildProperties
                        cardProps={childCardProps}
                        childProperties={childProperties}
                        breakpoints={breakpoints}
                        spaPath={spaPath}
                    />
                </div>
            ) : null;

        return (
            <div className="wrapper pdp">
                <div className="main">
                    {this.renderPropertyNavigation(
                        ActualAddress,
                        location,
                        language,
                        'subnav',
                        property.ParentPropertyId
                    )}

                    <div>
                        <Walkthrough
                            url={property.Walkthrough}
                            propertyId={property.PropertyId}
                            wrapperClass={'cbre_iframeWrap'}
                        />

                        <StickyContainer className="cbre_container">
                            <div className="cbre_contentBySidebar">
                                <div className="paddingX-lg-1">
                                    <div className={'cbre_imageCarousel'}>
                                        {this.renderCarouselOrImage()}
                                        <UnderOfferBanner
                                            displayText={propertyBannerText}
                                            underOffer={isUnderOffer}
                                        />
                                    </div>
                                </div>
                            </div>
                            {sideBarHeader_mobile}
                            {sideBar}

                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <div className="row">
                                    <div className="col-xs-12 col-md-10 col-lg-12 center-block">
                                        {childPropertiesComponent}
                                        {this.renderOverview()}
                                        {this.renderLocationDescription()}
                                        {this.renderComments()}

                                        {this.renderSizesAndMeasurements(
                                            property
                                        )}

                                        {this.renderFloorsAndUnits(property)}
                                        {this.renderParking(property)}

                                        {this.renderLeaseAndCharges(property)}

                                        <Specification
                                            property={property}
                                            breakpoints={breakpoints}
                                            collapsibleBlock
                                        />

                                        {this.renderEnergyPerformance(property)}
                                    </div>
                                </div>
                            </div>
                            {sideBarContent_mobile}
                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <div className="row">
                                    <div className="col-xs-12 col-md-10 col-lg-12 center-block">
                                        <PointsOfInterest
                                            property={property}
                                            breakpoints={breakpoints}
                                            collapsibleBlock
                                        />

                                        {this.renderFloorplan()}

                                        {this.renderPropertyImages()}
                                    </div>
                                </div>
                            </div>
                        </StickyContainer>

                        <div className="cbre_map">
                            <Gmap
                                properties={[property]}
                                mapViewType={'detailView'}
                            />
                        </div>

                        {this.renderPropertyNavigation(
                            ActualAddress,
                            location,
                            language,
                            'subnav marginBottom-md-1',
                            property.ParentPropertyId
                        )}

                        {relatedPropertiesComponent}
                    </div>
                    <ContactFormWrapper
                        className={'listmap-modal'}
                        modal={modal.getModal('contact')}
                    />
                    <ShareModal
                        className="listmap-modal"
                        {...modal.getModal('share')}
                    />
                </div>

                {this.renderLightbox()}
            </div>
        );
    }
}

DetailViewCommercial.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object,
    spaPath: PropTypes.object
};

DetailViewCommercial.propTypes = {
    relatedProperties: PropTypes.object,
    childProperties: PropTypes.object,
    carouselCardProps: PropTypes.object
};

export default responsiveContainer(DetailViewCommercial);
export const DetailViewCommercialTest = DetailViewCommercial;
