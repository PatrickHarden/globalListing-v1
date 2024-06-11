import PropTypes from 'prop-types';
import React, { Component, useMemo } from 'react';
import PropertyNavigation_R4 from '../PropertyNavigation/PropertyNavigation.r4';
import Walkthrough from '../../../components/Property/PropertyComponents/Walkthrough';
import PropertyImage from '../../../components/Property/PropertyComponents/PropertyImage';
import Gmap from '../../../components/Gmaps/index';
import ContactFormWrapper from '../../../list-map-components/ContactFormWrapper/ContactFormWrapper';
import ShareModal from '../../../list-map-components/ShareModal/ShareModal';
import SideBarContent_R3 from '../SidebarContent/SideBarContent.r3';
import StaticSidebar from '../StaticSidebar/StaticSidebar';
import SideBarHeader_R4 from '../PDPHeader/SideBarHeader.Commercial.r4';
import Carousel from '../../../list-map-components/Carousel/Carousel';
import PropertyPhotoGrid from '../../../list-map-components/PropertyDetailsPage/PDPComponents/PropertyPhotoGrid';
import PointsOfInterest from '../../../list-map-components/PropertyDetailsPage/PDPComponents/PointsOfInterest';
import Specification from '../../../list-map-components/PropertyDetailsPage/PDPComponents/Specification';
import { PhotoSwipe } from 'react-photoswipe';
import ExpandableText from '../../../list-map-components/ExpandableText/ExpandableText';
import CollapsibleBlock from '../../../list-map-components/CollapsibleBlock/CollapsibleBlock';
import { responsiveContainer } from '../../../external-libraries/agency365-components/components';
import FloorsAndUnits from '../../../list-map-components/PropertyDetailsPage/PDPComponents/FloorsAndUnits';
import FlexSpace from '../../../list-map-components/PropertyDetailsPage/PDPComponents/FlexSpace';
import Parking from '../../../list-map-components/PropertyDetailsPage/PDPComponents/Parking';
import LeaseAndCharges from '../../../list-map-components/PropertyDetailsPage/PDPComponents/LeaseAndCharges';
import EnergyPerformance from '../../../list-map-components/PropertyDetailsPage/PDPComponents/EnergyPerformance';
import SizesAndMeasurements from '../../../list-map-components/PropertyDetailsPage/PDPComponents/SizesAndMeasurements';
import ExternalEnergyRating from '../../../list-map-components/PropertyDetailsPage/PDPComponents/ExternalEnergyRating';
import RelatedProperties from '../../../list-map-components/RelatedProperties/RelatedProperties';
import StickySideBar_R3 from '../StickySidebar/StickySideBar.r4';
import { StickyContainer } from 'react-sticky';
import getPath from 'getpath';
import TranslateString from '../../../utils/TranslateString';
import moment from 'moment/min/moment-with-locales.min';
import jQuery from 'jquery';
import MultiUsageStrapline from '../../../list-map-components/MiscFeatures/MultiUsageStrapline';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import OperatorStrapline from '../../../list-map-components/MiscFeatures/OperatorStrapline';
import LazyLoad from 'react-lazyload';
import PointsOfInterestR4 from '../PointsOfInterest/PointsOfInterest';
import TransportationR4 from '../Transportation/Transportation';
import Notification from '../../../r3/components/Notification/Notification';
import { containsFloorplanImage } from '../../../utils/containsFloorplanImage';
import styled, { createGlobalStyle } from 'styled-components';
import SpaceLevelDisplay from '../../../components/SpaceLevelDisplay/SpaceLevelDisplay';
import { onCbreUS } from '../../../utils/determineDomain';
import CollateralBar from '../../../components/CollateralBar/CollateralBar.jsx';
import { generateCollateralBarButtons } from '../../../components/CollateralBar/utils/generateCollateralBarButtons';
import { fireAnalyticsTracking } from '../../../ga4-analytics/send-event';
import { eventTypes } from '../../../ga4-analytics/event-types';
import { ConvertPropertyDataForPDPPageView } from '../../../ga4-analytics/converters/pdp-pageview';
import { PDPCreateInteractionModelUsingCollateralBarAsset } from '../../../ga4-analytics/converters/interaction';
import ChildPropertiesR4 from '../ChildProperties/ChildPropertiesR4';
import Affiliates from '../Affiliates/Affiliates';
import BuildingStatusInformation from '../../../list-map-components/PropertyDetailsPage/PDPComponents/BuildingStatusInformation.jsx';
import _ from 'lodash';

class DetailViewCommercial extends Component {
    constructor(props, context) {
        super(props);
        this.state = {
            isOpen: false,
            showContactButton: false,
            index: 0,
            features: context.stores.ConfigStore.getFeatures(),
            floorsAndUnitsConfig: context.stores.ConfigStore.getFloorsAndUnits(),
            spaceLevelDisplayContent: '',
            spaceLevelDisplayApiUrl:
                '/property-api/spaceleveldisplay/getr4?site='
        };
    }

    componentDidMount() {

        const moreData = {};    // if we have any data to pass outside of the property data, define it here
        fireAnalyticsTracking(this.state.features, this.context, eventTypes.PDP_PAGE_VIEW, ConvertPropertyDataForPDPPageView(this.props.property, moreData, true));

        if (
            this.state.features.spaceLevelDisplay &&
            !this.state.features.useSpaceLevelDisplayComponent
        ) {
            jQuery.ajax({
                url: `${this.state.spaceLevelDisplayApiUrl
                    }${context.stores.ConfigStore.getItem('siteId')}&propertyId=${this.props.property.PropertyId
                    }&language=${context.stores.ConfigStore.getItem('language')}`,
                type: 'get',
                contentType: 'application/json',
                success: function (data) {
                    this.setState({
                        spaceLevelDisplayContent: data
                    });

                    // Mount javascript inside script tags
                    var regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
                    var script;
                    while ((script = regex.exec(data))) {
                        window.eval(script[1]);
                    }

                    if (window.location.hash != '#displaySpaces') {
                        if (
                            this.state.features.spaceLevelDisplayCollasped &&
                            typeof toggleSpaceLevelDisplay !== 'undefined'
                        ) {
                            toggleSpaceLevelDisplay();
                        }
                    }

                    // Mount external javascript files
                    regex = /<script\b[^>]*src=([\s\S]*?)><\/script>/gim;
                    while ((script = regex.exec(data))) {
                        var head = document.head;
                        var link = document.createElement('script');
                        link.src = script[1].replace(/"([^"]+(?="))"/g, '$1');
                        link.type = 'text/javascript';
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

    // more analytics goodness
    dispatchCollateralBarAnalytics = (asset) => {
        fireAnalyticsTracking(this.state.features, this.context, eventTypes.INTERACTION, PDPCreateInteractionModelUsingCollateralBarAsset(asset, this.props.property), false);
    };

    showContactForm = (e, contact = {}, requestType = null) => {
        const { modal, property } = this.props;
        modal
            .getModal('contact')
            .show(property, contact, e, 'PDP', requestType);
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
                    address={property.ActualAddress}
                />
            );
        }
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
            <div className={className} style={{ display: 'flex' }}>
                <PropertyNavigation_R4
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
                    breadcrumbPrefix={this.context.stores.ConfigStore.getItem(
                        'breadcrumbPrefix'
                    )}
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
            ActualAddress,
            breakpoints: { isMobile }
        } = this.props;

        const { FloorPlans } = property;

        const { language } = this.context;

        const hasFloorplanImages = containsFloorplanImage(FloorPlans);

        if (hasFloorplanImages) {
            return (
                <React.Fragment>
                    <div id="pdp-floorplans-bookmark">&nbsp;</div>
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
                            address={property.ActualAddress}
                            offset={1200}
                        />
                    </CollapsibleBlock>
                </React.Fragment>
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
        const { language, stores } = this.context;

        const { displayBuildingAvailableDate } = features;

        const {
            breakpoints: { isMobile }
        } = this.props;

        const isFlex = property.UsageType === 'FlexOffice';
        const FloorsComponent = isFlex ? FlexSpace : FloorsAndUnits;

        if (features.spaceLevelDisplay) {
            if (!features.useSpaceLevelDisplayComponent) {
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: this.state.spaceLevelDisplayContent
                        }}
                    />
                );
            } else {
                return (
                    <SpaceLevelDisplay
                        property={property}
                        culture={stores.ConfigStore.getItem('language')}
                        theme="r4"
                        hideSpaceDetails={
                            features.spaceLevelDisplayCollasped
                        }
                    ></SpaceLevelDisplay>
                );
            }
        } else {
            if (
                !this.state.floorsAndUnitsConfig.hideFloorsAndUnits &&
                property.FloorsAndUnits &&
                property.FloorsAndUnits.length
            ) {
                return (
                    <CollapsibleBlock
                        title={
                            isFlex
                                ? language.SpaceAvailable
                                : language.FloorsAvailable
                        }
                        isCollapsible={isMobile}
                        startExpanded={!isMobile}
                        headerClassName="collapsableBlock_header__noUnderline"
                        innerClassName="padding-md-1 paddingBottom-md-1"
                        className="floorBlock"
                    >
                        <FloorsComponent
                            floors={property.FloorsAndUnits}
                            displayBuildingAvailableDate={
                                displayBuildingAvailableDate
                            }
                        />
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
                        culture={stores.ConfigStore.getItem('language')}
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


    renderExternalEnergyRating = property => {
        const { language, stores } = this.context;
        const { breakpoints } = this.props;

        if (property.EnergyPerformanceData && property.EnergyPerformanceData.ExternalRatings && property.EnergyPerformanceData.ExternalRatings.length > 0) {
            return (
                <CollapsibleBlock
                    title={language['PdpEnergyRatingTitle']}
                    isCollapsible={breakpoints.isMobile}
                    startExpanded={!breakpoints.isMobile}
                    innerClassName="padding-xs-1"
                    className="sizesBlock"
                >
                    <ExternalEnergyRating property={property} />
                </CollapsibleBlock>
            );
        }
        else {
            return null;
        }
    };

    renderSizesAndMeasurements = property => {
        const { language, stores } = this.context;
        const { breakpoints } = this.props;
        let hideSizesAndMeasurementsSection = false;

        if (
            stores.ConfigStore.getFeatures().hideSizesAndMeasurementsOnParent &&
            this.props.property.IsParent
        ) {
            return null;
        }

        if (!(property.LoadingDocks && property.LoadingDocksUnit && property.LoadingDoors && property.DriveInDoors && property.InternalParkingSpaces
            && property.ExternalParkingSpaces) && (!property.Sizes || property.Sizes.length === 0)) {
            return null;
        }
        else if (property.Sizes && property.Sizes.length > 0) {
            hideSizesAndMeasurementsSection = _.every(property.Sizes, function (size) {
                return size.dimensions.area === null || size.dimensions.area === 0;
            })
        }
        if (!hideSizesAndMeasurementsSection) {
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
        }
        else {
            return null;
        }
    };

    renderLocationDescription = () => {
        const { property, breakpoints } = this.props;

        const { language } = this.context;

        if (
            property.LocationDescription &&
            property.LocationDescription.content &&
            property.LocationDescription.content.trim().length > 0
        ) {
            return (
                <LocationDescriptionWrapper>
                    <CollapsibleBlock
                        title={language.LocationDescriptionTitle}
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={!breakpoints.isMobile}
                        innerClassName="padding-xs-1"
                        className="locationBlock"
                    >
                        <span
                            data-test={createDataTestAttribute(
                                'pdp',
                                'location-description'
                            )}
                        >
                            {property.LocationDescription.content.trim()}
                        </span>
                    </CollapsibleBlock>
                </LocationDescriptionWrapper>
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
                    dataTestName="pdp-property-comments-header"
                >
                    <span
                        data-test={createDataTestAttribute(
                            'pdp',
                            'property-comments'
                        )}
                    >
                        {property.Comments.content.trim()}
                    </span>
                </ExpandableText>
            );
        }
    };

    getAvailabilityText = (
        Availability,
        displayBuildingAvailableDate,
        currentLanguage,
        language
    ) => {
        if (!Availability.date || !displayBuildingAvailableDate) {
            return undefined; //if date or displayBuildingAvailableDate not available or false, short circuit
        }

        // date is in the future, so we will use the date
        if (new Date(Availability.date).getTime() > new Date().getTime()) {
            const availableDate = new moment(Availability.date)
                .locale(currentLanguage)
                .format('MMMM YYYY');
            return (
                <TranslateString
                    string="detailsStraplineAvailableFrom"
                    date={availableDate}
                />
            );
        } else {
            // date is not in the future, so create an "Available Immediately" text string
            const availableText =
                language['Available'] !== undefined &&
                    language['AvailableFromNow'] !== undefined
                    ? language['Available'] + ' ' + language['AvailableFromNow']
                    : undefined;
            return availableText;
        }
    };

    renderStraplines = (currentLanguage, features) => {
        const { property, breakpoints } = this.props;

        let { searchType } = this.props;

        const { language } = this.context;

        const { Availability, UsageType } = property;

        const {
            displayBuildingAvailableDate,
            displayBuildingUsageType
        } = features;

        var _usageType = language[`PDPPropertyType${UsageType}`];

        const { Aspect } = property;

        searchType = Aspect.includes(searchType)
            ? searchType
            : Aspect.filter(x => x != searchType)[0];

        if (!_usageType) {
            _usageType = language['Property'];
        }

        const isBoth =
            Aspect.includes('isSale') && Aspect.includes('isLetting');

        const usage = isBoth ? (
            displayBuildingUsageType && UsageType && searchType ? (
                <TranslateString
                    string="detailsStraplineType"
                    usageType={`${_usageType}`}
                    transactionType={`${language['detailsStrapline_isBoth']}`}
                />
            ) : (
                undefined
            )
        ) : displayBuildingUsageType && UsageType && searchType ? (
            <TranslateString
                string="detailsStraplineType"
                usageType={`${_usageType}`}
                transactionType={`${language[`detailsStrapline_${searchType}`]
                    }`}
            />
        ) : (
            undefined
        );
        const available = this.getAvailabilityText(
            Availability,
            displayBuildingAvailableDate,
            currentLanguage,
            language
        );

        const detailsStrapline =
            usage || available ? (
                <div
                    className="propertyDetailsStrapline"
                    data-test={createDataTestAttribute(
                        'pdp',
                        'property-details-strapline'
                    )}
                >
                    {usage}
                    {!!usage && !!available && ' - '}
                    {available}
                </div>
            ) : (
                undefined
            );

        var matchingProperties = this.context.stores.PropertyStore.getMatchingProperties();
        var getQueryForMatchingPropertiesCompleted = this.context.stores.PropertyStore.getQueryForMatchingPropertiesCompleted();

        const multiUsageStrapline = this.state.features
            .displayMultiUsageStrapline ? (
            <MultiUsageStrapline
                aspects={property.Aspect}
                matchingProperties={matchingProperties}
                usageType={UsageType}
                propertyId={this.props.property.PropertyId}
                siteId={context.stores.ConfigStore.getItem('siteId')}
                language={language}
                api={context.stores.ConfigStore.getItem('api')}
            />
        ) : (
            detailsStrapline
        );

        const operatorStrapline = this.state.features
            .displayOperatorStrapline ? (
            <OperatorStrapline operator={this.props.property.Operator} />
        ) : (
            undefined
        );

        // wait until query has completed, then come back
        if (
            this.state.features.displayMultiUsageStrapline &&
            !getQueryForMatchingPropertiesCompleted
        )
            return null;

        return (
            (property.StrapLine || multiUsageStrapline) &&
            (breakpoints.isMobile ? (
                <OverviewBlock className="propertyDescription overviewBlock">
                    {multiUsageStrapline}
                    {operatorStrapline}
                    {property.StrapLine && (
                        <h2
                            className="cbre_h2 r3_propertyStrapline"
                            data-test="pdp-property-description-header"
                        >
                            {property.StrapLine}
                        </h2>
                    )
                    }
                </OverviewBlock>
            ) : (
                <div className="propertyDescription">
                    <CollapsibleBlock
                        title=""
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={true}
                        className="overviewBlock"
                    >
                        {multiUsageStrapline}
                        {operatorStrapline}
                        {property.StrapLine && (
                            <h2
                                className="cbre_h2 r3_propertyStrapline"
                                data-test="pdp-property-description-header"
                            >
                                {property.StrapLine}
                            </h2>
                        )}
                    </CollapsibleBlock>
                </div>
            ))
        );
    };

    renderOverview = () => {
        const { property, breakpoints } = this.props;
        const { language } = this.context;

        if (
            !property.LongDescription ||
            property.LongDescription.trim().length === 0
        ) {
            return <span></span>;
        }

        return (
            property.LongDescription &&
            property.LongDescription &&
            (breakpoints.isMobile ? (
                <OverviewTitleWrapper>
                    <div className="propertyDescription">
                        <CollapsibleBlock
                            title={language.OverviewTitle}
                            isCollapsible={breakpoints.isMobile}
                            startExpanded={true}
                            className="overviewBlock"
                            style={{
                                paddingBottom: '0px',
                                marginBottom: '-10px'
                            }}
                        >
                            <ExpandableText
                                title=""
                                startExpanded={!breakpoints.isMobile}
                                lineHeight={1.5}
                            >
                                <OverviewTextWrapper>
                                    <span
                                        data-test={createDataTestAttribute(
                                            'pdp',
                                            'property-long-description'
                                        )}
                                    >
                                        {property.LongDescription.trim()}
                                    </span>
                                </OverviewTextWrapper>
                            </ExpandableText>
                        </CollapsibleBlock>
                    </div>
                </OverviewTitleWrapper>
            ) : (
                <OverviewTitleWrapper>
                    <div className="propertyDescription">
                        <CollapsibleBlock
                            title={language.OverviewTitle}
                            isCollapsible={breakpoints.isMobile}
                            startExpanded={true}
                            className="overviewBlock"
                        >
                            <ExpandableText
                                title=""
                                startExpanded={!breakpoints.isMobile}
                                lineHeight={1.5}
                            >
                                <OverviewTextWrapper>
                                    <span
                                        data-test={createDataTestAttribute(
                                            'pdp',
                                            'property-long-description'
                                        )}
                                    >
                                        {property.LongDescription.trim()}
                                    </span>
                                </OverviewTextWrapper>
                            </ExpandableText>
                        </CollapsibleBlock>
                    </div>
                </OverviewTitleWrapper>
            ))
        );
    };

    renderSinglePropertyImage = (property, disableCarouselWalkthrough) => {
        const { Photos, Walkthrough } = property;
        if (
            Photos.length !== 1 ||
            (!disableCarouselWalkthrough && Walkthrough)
        ) {
            return;
        }

        return (
            <PropertyImage
                className="pdp__single_image"
                onClick={this.handleOpenImageInLightbox}
                items={Photos[0].resources}
                alt={Photos[0].caption}
                address={property.ActualAddress}
            />
        );
    };


    renderBuildingStatusInformation = (property, features) => {
        const { language } = this.context;
        const { breakpoints } = this.props;

        
        if(features.showStoriesInBuildingStatus && !property.PropertyStatus && !property.YearBuilt && !property.NumberOfStoreys) {
            return null;
        }
        
        if (!features.showStoriesInBuildingStatus && !property.PropertyStatus && !property.YearBuilt) {
            return null;
        }

        return (
            <CollapsibleBlock
                title={language['PdpBuildingStatusTitle']}
                isCollapsible={breakpoints.isMobile}
                startExpanded={!breakpoints.isMobile}
                innerClassName="padding-xs-1"
                className="sizesBlock"
            >
                <BuildingStatusInformation property={property} context={this.context} />
            </CollapsibleBlock>
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

        const { language, stores } = this.context;

        const features = stores.ConfigStore.getItem('features');
        const currentLanguage = stores.ConfigStore.getItem('language');
        const affiliates = stores.ConfigStore.getItem('affiliates') || false;
        const isSingleImageVariant = property.Photos.length === 1;
        const siteId = stores.ConfigStore.getItem('siteId');

        // let sidebar know if are disabling walkthrough from taking over image carousel
        let disableCarouselWalkthrough = false;
        if (
            features.disableCarouselWalkthrough ||
            Array.isArray(property.Walkthrough)
        ) {
            disableCarouselWalkthrough = true;
        }

        let displayAffiliateLogos = false;
        if (features.displayAffiliateOfficeLogos) {
            displayAffiliateLogos = true;
        }

        const sidebarProps = {
            modal,
            property,
            siteType,
            affiliates,
            siteId,
            searchType,
            language,
            showContactForm: this.showContactForm,
            breakpoints,
            openLightboxFunc: this.handleOpenFloorplanInLightbox,
            disableCarouselWalkthrough: disableCarouselWalkthrough
        };

        const { ActualAddress, Aspect } = property;

        const sideBar = breakpoints.isTabletLandscapeAndUp ? (features.newContactModal ?
            (
                    <StaticSidebar
                        marginBottom={40}
                        stickyOffset={
                            property.Photos.length && !isSingleImageVariant ? -46 : 0
                        }
                        displayAffiliateLogos={displayAffiliateLogos}
                        propertyId={property.PropertyId}
                        key="theStaticSidebar"
                        features={features}
                        context={this.context}
                        {...sidebarProps}
                    />
            ) :
            <StickySideBar_R3
                marginBottom={40}
                stickyOffset={
                    property.Photos.length && !isSingleImageVariant ? -46 : 0
                }
                displayAffiliateLogos={displayAffiliateLogos}
                propertyId={property.PropertyId}
                {...sidebarProps}
            />
        ) : null;

        const sideBarContent_mobile = !breakpoints.isTabletLandscapeAndUp ? (
            <div className="cbre_sidebar">
                {features.newContactModal ?
                    <React.Fragment>
                        <StaticSidebar features={features} context={this.context} isMobile={true} {...sidebarProps} />
                    </React.Fragment>
                    :
                    <SideBarContent_R3 {...sidebarProps} />
                }
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

        // construct propertyBannerText string
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
            <div className="cbre_container" style={{ marginTop: '-50px' }}>
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

        const defaultZoom = this.context.stores.ConfigStore.getItem('mapZoom').detailsMapInitialZoom || 9;
        const maxZoom = this.context.stores.ConfigStore.getItem('mapZoom').detailsMapMaxZoom || 17;

        const mapState = {
            zoom: defaultZoom,
            maxZoom: maxZoom
        }

        // Re-ordering child properties if the original properties and the child properties are not in same order.
        const tempChildProperties = [];

        if (childProperties && childProperties.properties && childProperties.properties.length > 0 && !property.ParentPropertyId) {
            property.FloorsAndUnits.forEach((floor) => {
                childProperties.properties.forEach((childProp) => {
                    if (childProp && childProp.FloorsAndUnits && childProp.FloorsAndUnits[0] && childProp.FloorsAndUnits[0].subdivisionName && floor.subdivisionName) {
                        if (childProp.FloorsAndUnits[0].subdivisionName === floor.subdivisionName) {
                            tempChildProperties.push(childProp);
                        }
                    }
                })
            })

            childProperties.properties = tempChildProperties.length > 0 ? tempChildProperties : childProperties.properties;
        }

        return (
            <div className="wrapper pdp">
                {
                    onCbreUS && <R4_US_Styling />
                }
                {features && features.notification && (
                    <Notification
                        isShown={true}
                        config={features.notification}
                    />
                )}
                <div className="main">

                    {this.renderPropertyNavigation(
                        ActualAddress,
                        location,
                        language,
                        'subnav',
                        property.ParentPropertyId
                    )}

                    <div className="cbre_container">
                        <SideBarHeader_R4
                            {...sidebarProps}
                            showShareIcons={features.enableShareOption || !breakpoints.isTabletLandscapeAndUp}
                            bannerText={
                                isUnderOffer ? propertyBannerText : undefined
                            }
                            breakpoints={breakpoints}
                        />
                    </div>

                    <div className="cbre_body">
                        <div className={'cbre_imageCarousel'}>
                            {this.renderWalkthoughOrCarousel(
                                property,
                                disableCarouselWalkthrough
                            )}
                        </div>

                        <StickyContainer className="cbre_container">
                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <RowWrapper>
                                    <div className="row">
                                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                            {this.renderSinglePropertyImage(
                                                property,
                                                disableCarouselWalkthrough
                                            )}

                                            <CollateralBar handleOpenFloorplanInLightbox={this.handleOpenFloorplanInLightbox} assets={generateCollateralBarButtons(property, language)} analyticsCallback={this.dispatchCollateralBarAnalytics} />

                                            {/* {childPropertiesComponent} */}
                                            {childProperties && childProperties.properties && childProperties.properties.length > 0 && !property.ParentPropertyId &&
                                                <ChildPropertiesR4
                                                    cardProps={childCardProps}
                                                    childProperties={childProperties}
                                                    breakpoints={breakpoints}
                                                    spaPath={spaPath}
                                                    language={language}
                                                    context={this.context}
                                                />}
                                            {this.renderStraplines(
                                                currentLanguage,
                                                features
                                            )}

                                            <Specification
                                                property={property}
                                                breakpoints={breakpoints}
                                                collapsibleBlock
                                            />

                                            {this.renderOverview(
                                                currentLanguage,
                                                features
                                            )}

                                            {breakpoints.isMobile && (
                                                <div
                                                    className="line_R3"
                                                    style={{
                                                        marginBottom: '1px'
                                                    }}
                                                />
                                            )}

                                            {sideBarContent_mobile}

                                            {this.renderLocationDescription()}

                                            {features.displayBuildingStatusInfo &&
                                                this.renderBuildingStatusInformation(property, features)}

                                            {this.renderComments()}
                                            
                                            {this.renderExternalEnergyRating(property)}
                                               
                                            {this.renderSizesAndMeasurements(
                                                property
                                            )}

                                            {this.renderFloorsAndUnits(
                                                property,
                                                features
                                            )}

                                            {this.renderParking(property)}

                                            {this.renderLeaseAndCharges(
                                                property
                                            )}

                                            {this.renderEnergyPerformance(
                                                property
                                            )}
                                        </div>
                                    </div>
                                </RowWrapper>
                            </div>

                            <React.Fragment>
                                {sideBar}
                            </React.Fragment>

                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <RowWrapper>
                                    <div className="row">
                                        <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                            {!features.newPointsOfInterest && (
                                                <PointsOfInterest
                                                    property={property}
                                                    breakpoints={breakpoints}
                                                    collapsibleBlock
                                                />
                                            )}

                                            {features.newPointsOfInterest && (
                                                <PointsOfInterestR4
                                                    pointsOfInterest={
                                                        property.PointsOfInterest &&
                                                            features.combinePOI
                                                            ? property.PointsOfInterest
                                                            : []
                                                    }
                                                    pointsOfInterests={
                                                        property.PointsOfInterests
                                                            ? property.PointsOfInterests
                                                            : []
                                                    }
                                                    breakpoints={breakpoints}
                                                    context={this.context}
                                                    collapsibleBlock
                                                />
                                            )}

                                            {property.TransportationsType &&
                                                Array.isArray(
                                                    property.TransportationsType
                                                ) && (
                                                    <TransportationR4
                                                        transportationsType={
                                                            property.TransportationsType
                                                        }
                                                        breakpoints={
                                                            breakpoints
                                                        }
                                                        context={this.context}
                                                        collapsibleBlock
                                                    />
                                                )}

                                            {this.renderFloorplan()}

                                            {/* this.renderPropertyImages() */}
                                        </div>
                                    </div>
                                </RowWrapper>
                            </div>
                        </StickyContainer>

                        <div id="pdp-map-bookmark">&nbsp;</div>

                        <LazyLoad
                            offset={450}
                            height={450}
                            once={true}
                            placeholder={
                                <div
                                    className={'cbre_map'}
                                    style={{ height: '450px' }}
                                ></div>
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
                            'subnav graySubnav',
                            property.ParentPropertyId
                        )}

                        {relatedProperties &&
                            relatedProperties.properties &&
                            relatedProperties.properties.length > 0 &&
                            relatedProperties.status && (
                                <CarouselWrapper>
                                    {relatedPropertiesComponent}
                                </CarouselWrapper>
                            )}
                    </div>

                    <ContactFormWrapper
                        className={'listmap-modal'}
                        modal={modal.getModal('contact')}
                        source={'PDP'}
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

const R4_US_Styling = createGlobalStyle`
    .content-section__landing-teaser {
        display: none;
    }
    .cbre_contentBySidebar {
        > div {
            position: relative;
            z-index: 1;
        }
    }
`;

const OverviewTextWrapper = styled.div`
    font-family: "Calibre Regular";
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: #435254;
`;

const OverviewTitleWrapper = styled.div`
    > .propertyDescription > div > div > div > div > a.external-libraries-expandable-content-showHideLink.showHideToggle.has_arrow.cbre_smallText {
        background-color: transparent;
    }
`;

const LocationDescriptionWrapper = styled.div`
    > div > div > div > span {
        font-family: "Calibre Regular";
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 30px;
        color: #435254;
    }
`;

const RowWrapper = styled.div`
    // Sticky Container CSS

    width: 768px;

    // @media screen and (max-width: 1650px) {
    //     margin-left: 120px;
    // }

    @media screen and (max-width: 1450px) {
        margin-left: 20px;
    }

    @media screen and (max-width: 1250px) {
        margin-left: 0px;
        width: unset;
    }
`;

const OverviewBlock = styled.div`
    margin-top: 10px;
`;

const CarouselWrapper = styled.div`
    margin-bottom: -45px;
    .cbre_container {
        .row {
            .r4CarouselTitle {
                margin-top:20px;
                margin-bottom:-70px;
                margin-left: 0;
                > h2 {
                    color: #003f2d !important;
                    font-size: 64px !important;
                    font-weight: 400 !important;
                    font-family: Financier Regular !important;
                    letter-spacing: .92px !important;
                    line-height: 21px !important;
                    -webkit-font-smoothing: antialiased !important;
                    margin-top: 35px !important;
                }
            }
        }
    }
`;

DetailViewCommercial.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object,
    spaPath: PropTypes.object,
    analytics: PropTypes.object
};

DetailViewCommercial.propTypes = {
    relatedProperties: PropTypes.object,
    childProperties: PropTypes.object,
    carouselCardProps: PropTypes.object
};

export default responsiveContainer(DetailViewCommercial);
export const DetailViewCommercialR4 = DetailViewCommercial;
