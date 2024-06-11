import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PropertyNavigation from '../../components/Property/PropertyComponents/PropertyNavigation';
import Walkthrough from '../../components/Property/PropertyComponents/Walkthrough';
import PropertyImage from '../../components/Property/PropertyComponents/PropertyImage';
import Gmap from '../../components/Gmaps/index';
import ContactFormWrapper from '../ContactFormWrapper/ContactFormWrapper';
import ShareModal from '../ShareModal/ShareModal';
import CommercialSideBarHeader from './PDPComponents/SideBarHeader.Commercialv2';
import SideBarContent from './PDPComponents/SideBarContent';
import Carousel from '../Carousel/Carousel';
import PropertyPhotoGrid from './PDPComponents/PropertyPhotoGrid';
import PointsOfInterest from './PDPComponents/PointsOfInterest';
import Specification from './PDPComponents/Specification';
import { PhotoSwipe } from 'react-photoswipe';
import ExpandableText from '../ExpandableText/ExpandableText';
import CollapsibleBlock from '../CollapsibleBlock/CollapsibleBlock';
import { responsiveContainer } from '../../external-libraries/agency365-components/components';
import FloorsAndUnits from './PDPComponents/FloorsAndUnits';
import FlexSpace from './PDPComponents/FlexSpace';
import Parking from './PDPComponents/Parking';
import LeaseAndCharges from './PDPComponents/LeaseAndCharges';
import EnergyPerformance from './PDPComponents/EnergyPerformance';
import SizesAndMeasurements from './PDPComponents/SizesAndMeasurements';
import RelatedProperties from '../RelatedProperties/RelatedProperties';
import ChildProperties from '../ChildProperties/ChildProperties';
import StickySideBar from './PDPComponents/StickySideBar';
import { StickyContainer } from 'react-sticky';
import getPath from 'getpath';
import TranslateString from '../../utils/TranslateString';
import moment from 'moment/min/moment-with-locales.min';
import jQuery from 'jquery';
import MultiUsageStrapline from '../MiscFeatures/MultiUsageStrapline';
import OperatorStrapline from '../MiscFeatures/OperatorStrapline'
import { createDataTestAttribute } from '../../utils/automationTesting';
import LazyLoad from 'react-lazyload';

class DetailViewCommercial extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isOpen: false,
            index: 0,
            features: context.stores.ConfigStore.getFeatures(),
            floorsAndUnitsConfig: context.stores.ConfigStore.getFloorsAndUnits(),
            spaceLevelDisplayContent: "",
            spaceLevelDisplayApiUrl: context.stores.ConfigStore.getItem('spaceLevelDisplayApiUrl'),
        };
    }

    componentDidMount() {

        if (this.state.features.spaceLevelDisplay) {
            jQuery.ajax({
                url: `${this.state.spaceLevelDisplayApiUrl}${context.stores.ConfigStore.getItem('siteId')}&propertyId=${this.props.property.PropertyId}&language=${context.stores.ConfigStore.getItem('language')}`,
                type: 'get',
                contentType: 'application/json',
                success: function (data) {
                    this.setState({
                        spaceLevelDisplayContent: data
                    });

                    // Mount javascript inside script tags
                    var regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gmi;
                    var script;
                    while (script = regex.exec(data)) {
                        window.eval(script[1]);
                    }

                    // Mount external javascript files
                    regex = /<script\b[^>]*src=([\s\S]*?)><\/script>/gmi;
                    while (script = regex.exec(data)) {
                        var head = document.head;
                        var link = document.createElement("script");
                        link.src = script[1].replace(/"([^"]+(?="))"/g, '$1');
                        link.type = "text/javascript"
                        head.appendChild(link);
                    }
                }.bind(this)
            });
        }
    }

    componentWillMount() {
        this.props.modal.addModal('contact');
        this.props.modal.addModal('share');
    }

    showContactForm = (e, contact = {}) => {
        const { modal, property } = this.props;

        modal.getModal('contact').show(property, contact, e, 'PDP');
    };

    renderWalkthoughOrCarousel = (property, disableCarouselWalkthrough) => {
        const { Photos } = property;

        if (property.Walkthrough && !disableCarouselWalkthrough) {
            return (
                <Walkthrough
                    url={property.Walkthrough}
                    propertyId={property.PropertyId}
                    wrapperClass={'cbre_iframeWrap'}
                />
            );
        } else if (Photos.length !== 1) {
            const images = Photos.length ? Photos : [];

            return (
                <Carousel
                    className="cbre_imageCarousel_items"
                    openLightboxFunc={this.handleOpenImageInLightbox}
                    items={images}
                    slidesToShow={3}
                />
            );
        }
    };

    renderSinglePropertyImage = (property, disableCarouselWalkthrough) => {
        const { Photos, Walkthrough } = property;
        if (Photos.length !== 1 || (!disableCarouselWalkthrough && Walkthrough)) {
            return;
        }
        return (
            <PropertyImage
                className="pdp__single_image"
                onClick={this.handleOpenImageInLightbox}
                items={Photos[0].resources}
            />
        );
    };

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
                    breadcrumbPrefix={this.context.stores.ConfigStore.getItem('breadcrumbPrefix')}
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

    imageDimensionCheck = (lightbox, index) => {
        const item = lightbox.getItemAt(index);
        if (item.w < 1 || item.h < 1) {
            var img = new Image();
            img.onload = function () {
                item.w = this.width;
                item.h = this.height;
                lightbox.invalidateCurrItems();
                lightbox.updateSize(true);
            };
            img.src = item.src;
        }
    }

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
                gettingData={this.imageDimensionCheck}
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
    renderFloorsAndUnits = (property, features) => {
        const { language } = this.context;
        const { displayBuildingAvailableDate } = features;

        const {
            breakpoints: { isMobile }
        } = this.props;

        const isFlex = property.UsageType === 'FlexOffice';
        const FloorsComponent = isFlex ? FlexSpace : FloorsAndUnits;

        if (this.state.features.spaceLevelDisplay) {
            return (<div dangerouslySetInnerHTML={{ __html: this.state.spaceLevelDisplayContent }} />);
        } else {
            if (
                !this.state.floorsAndUnitsConfig.hideFloorsAndUnits &&
                property.FloorsAndUnits &&
                property.FloorsAndUnits.length
            ) {
                return (
                    <CollapsibleBlock
                        title={isFlex ? language.SpaceAvailable : language.FloorsAvailable}
                        isCollapsible={isMobile}
                        startExpanded={!isMobile}
                        headerClassName="collapsableBlock_header__noUnderline"
                        innerClassName="padding-md-1 paddingBottom-md-1"
                        className="floorBlock"
                    >
                        <FloorsComponent floors={property.FloorsAndUnits} displayBuildingAvailableDate={displayBuildingAvailableDate} />
                    </CollapsibleBlock>
                );
            }
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
                    <span data-test={createDataTestAttribute('pdp', 'location-description')}>{property.LocationDescription.content.trim()}</span>
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
                    dataTestName='pdp-property-comments-header'
                >
                    <span data-test={createDataTestAttribute('pdp', 'property-comments')}>{property.Comments.content.trim()}</span>
                </ExpandableText>
            );
        }
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



    renderOverview = (currentLanguage, features) => {
        const { property, breakpoints } = this.props;

        let { searchType } = this.props;

        const { language } = this.context;

        const { Availability, UsageType } = property;
        const {
            displayBuildingAvailableDate,
            displayBuildingUsageType
        } = features;

        var _usageType = language[`PDPPropertyType${UsageType}`];

        const { ActualAddress, Aspect } = property;

        searchType = Aspect.includes(searchType) ? searchType : Aspect.filter(x => x != searchType)[0];

        if (!_usageType) {
            _usageType = language[`Property`];
        }

        const usage = (displayBuildingUsageType && UsageType && searchType) ? <TranslateString
            string="detailsStraplineType"
            usageType={`${_usageType}`}
            transactionType={`${language[`detailsStrapline_${searchType}`]}`}
        /> : undefined;

        const available = this.getAvailabilityText(Availability, displayBuildingAvailableDate, currentLanguage, language);

        const detailsStrapline = usage || available ? <div className="propertyDetailsStrapline" data-test={createDataTestAttribute('pdp', 'property-details-strapline')}>
            {usage}
            {!!usage && !!available && ' - '}
            {available}
        </div> : undefined;

        var matchingProperties = this.context.stores.PropertyStore.getMatchingProperties();
        var getQueryForMatchingPropertiesCompleted = this.context.stores.PropertyStore.getQueryForMatchingPropertiesCompleted();

        const multiUsageStrapline = this.state.features.displayMultiUsageStrapline ?
            <MultiUsageStrapline
                aspects={property.Aspect}
                matchingProperties={matchingProperties}
                usageType={UsageType}
                propertyId={this.props.property.PropertyId}
                siteId={context.stores.ConfigStore.getItem('siteId')}
                language={language}
                api={context.stores.ConfigStore.getItem('api')}
            />
            : detailsStrapline;


        const operatorStrapline = this.state.features.displayOperatorStrapline ?
            <OperatorStrapline
                operator={this.props.property.Operator}
            />
            : undefined;

        // wait until query has completed, then come back
        if (this.state.features.displayMultiUsageStrapline && !getQueryForMatchingPropertiesCompleted)
            return null;

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
                        {multiUsageStrapline}
                        {operatorStrapline}
                        <ExpandableText
                            title={property.StrapLine}
                            startExpanded={!breakpoints.isMobile}
                            lineHeight={1.5}
                            dataTestName='pdp-property-description-header'
                        >
                            <span data-test={createDataTestAttribute('pdp', 'property-long-description')}>{property.LongDescription.trim()}</span>
                        </ExpandableText>
                    </CollapsibleBlock>
                </div>
            ) : (
                <div className="propertyDescription marginTop-lg-1">
                    <CollapsibleBlock
                        title={language.OverviewTitle}
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={true}
                        className="overviewBlock"
                    >
                        {multiUsageStrapline}
                        {operatorStrapline}
                        <ExpandableText
                            title={property.StrapLine}
                            startExpanded={!breakpoints.isMobile}
                            lineHeight={1.5}
                            dataTestName='pdp-property-description-header'
                        >
                            <span data-test={createDataTestAttribute('pdp', 'property-long-description')}>{property.LongDescription.trim()}</span>
                        </ExpandableText>
                    </CollapsibleBlock>
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
        const currentLanguage = stores.ConfigStore.getItem('language');

        // let sidebar know if are disabling walkthrough from taking over image carousel
        let disableCarouselWalkthrough = false;
        if (features.disableCarouselWalkthrough || Array.isArray(property.Walkthrough)) {
            disableCarouselWalkthrough = true;
        }

        const sidebarProps = {
            modal,
            property,
            siteType,
            searchType,
            showContactForm: this.showContactForm,
            breakpoints,
            openLightboxFunc: this.handleOpenFloorplanInLightbox,
            disableCarouselWalkthrough: disableCarouselWalkthrough
        };

        const isSingleImageVariant = property.Photos.length === 1;

        const sideBar = breakpoints.isTabletLandscapeAndUp ? (
            <StickySideBar
                marginBottom={40}
                stickyOffset={
                    property.Photos.length && !isSingleImageVariant ? -46 : 0
                }
                propertyId={property.PropertyId}
                {...sidebarProps}
            />
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
                    <div className="col-xs-12 col-md-12 col-lg-12 center-block">
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

        const defaultZoom = this.context.stores.ConfigStore.getItem('mapZoom').detailsMapInitialZoom || 9;
        const maxZoom = this.context.stores.ConfigStore.getItem('mapZoom').detailsMapMaxZoom || 17;

        const mapState = {
            zoom: defaultZoom,
            maxZoom: maxZoom
        }

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
                    <div className="cbre_container">
                        <CommercialSideBarHeader
                            {...sidebarProps}
                            showShareIcons={!breakpoints.isTabletLandscapeAndUp}
                            bannerText={isUnderOffer ? propertyBannerText : undefined}
                            breakpoints={breakpoints}
                        />
                    </div>

                    <div className="cbre_body">
                        <div className={'cbre_imageCarousel'}>
                            {this.renderWalkthoughOrCarousel(property, disableCarouselWalkthrough)}
                        </div>
                        <StickyContainer className="cbre_container">
                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                        {this.renderSinglePropertyImage(property, disableCarouselWalkthrough)}

                                        {childPropertiesComponent}

                                        {this.renderOverview(currentLanguage, features)}

                                        {sideBarContent_mobile}

                                        {this.renderLocationDescription()}

                                        {this.renderComments()}

                                        {this.renderSizesAndMeasurements(
                                            property
                                        )}

                                        {this.renderFloorsAndUnits(property, features)}

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
                            {sideBar}
                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-lg-12 center-block">
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

                        <LazyLoad
                            offset={450}
                            height={450}
                            once={true}
                            placeholder={
                                <div className={'cbre_map'}
                                    style={{ height: '450px' }}>
                                </div>
                            }
                            children={
                                <div className="cbre_map">
                                    <Gmap
                                        properties={[property]}
                                        mapViewType={'detailView'}
                                        mapState={mapState}
                                    />
                                </div>
                            }
                        />

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
