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
import { PhotoSwipe } from 'react-photoswipe';
import ExpandableText from '../ExpandableText/ExpandableText';
import CollapsibleBlock from '../CollapsibleBlock/CollapsibleBlock';
import RelatedProperties from '../RelatedProperties/RelatedProperties';
import { StickyContainer } from 'react-sticky';
import StickySideBar from './PDPComponents/StickySideBar';

class DetailViewResidential extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            isOpen: false,
            index: 0,
            features: context.stores.ConfigStore.getFeatures(),
            stampDutyTaxCalculatorOpen: false
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
        } else {
            const images = Photos.length ? Photos : [];

            if (images.length === 1) {
                return (
                    <PropertyImage
                        onClick={this.handleOpenImageInLightbox}
                        items={images[0].resources}
                    />
                )
            } else if (images.length > 1) {
                return (
                    <div className="cbre_heroWrap">
                        <Carousel
                            className="cbre_imageCarousel_items"
                            openLightboxFunc={this.handleOpenImageInLightbox}
                            items={images}
                            slidesToShow={3}
                        />
                    </div>
                );
            }
        }
    };

    renderPropertyNavigation(ActualAddress, location, language, className) {
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
                    location={location}
                    className="cbre_container paddingX-lg-1"
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

    componentWillUpdate() {
        // Reset lightbox data for each property.
        this.context.stores.PropertyStore.setPropertyLightboxData();
    }

    _openLightbox = index => {
        this.setState({
            isOpen: true,
            index: index
        });
    };

    _closeLightbox = () => {
        this.setState({
            isOpen: false,
            index: 0
        });
    };

    handleOpenImageInLightbox = index => {
        this.props.lightboxFunctions.fireOpenLightboxEvent('image');
        this._openLightbox(index);
    };

    handleOpenFloorplanInLightbox = index => {
        this.props.lightboxFunctions.fireOpenLightboxEvent('floorplan');
        this._openLightbox(index);
    };

    handleOpenStampDutyTaxCalculator = () => {
        // has to be within timeout to fire after the calculator accordian has finished it's business

        setTimeout(() => {
            this.setState({
                stampDutyTaxCalculatorOpen: !this.state
                    .stampDutyTaxCalculatorOpen
            });
        }, 300);
    };

    _renderPropertyImages = () => {
        const { property, siteType, breakpoints } = this.props;

        const { language, stores } = this.context;

        const { isOpen, index } = this.state;

        if (property.Photos.length > 0) {
            const lightboxData = stores.PropertyStore.getPropertyLightboxData();

            return (
                <CollapsibleBlock
                    title={language.PdpImagesTitle}
                    isCollapsible={breakpoints.isMobile}
                    startExpanded={!breakpoints.isMobile}
                    headerClassName="collapsableBlock_header__noUnderline"
                    innerClassName="paddingX-md-1 paddingBottom-md-1"
                >
                    <PropertyPhotoGrid
                        property={property}
                        siteType={siteType}
                        items={property.Photos}
                        openLightboxFunc={this.handleOpenImageInLightbox}
                    />

                    <PhotoSwipe
                        ref="lightbox"
                        isOpen={isOpen}
                        items={lightboxData}
                        options={{
                            index,
                            closeOnScroll: false,
                            history: false
                        }}
                        onClose={this._closeLightbox}
                    />
                </CollapsibleBlock>
            );
        }
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
            relatedProperties = {}
        } = this.props;

        const { ActualAddress, Aspect } = property;

        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');

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
            openStampDutyTaxCalculatorFunc: this
                .handleOpenStampDutyTaxCalculator,
            stampDutyTaxCalculatorOpen: this.state.stampDutyTaxCalculatorOpen,
            disableCarouselWalkthrough: disableCarouselWalkthrough
        };

        const sideBar = breakpoints.isTabletLandscapeAndUp ? (
            <StickySideBar
                marginBottom={40}
                stickyOffset={-148}
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

        return (
            <div className="wrapper pdp">
                <div className="main">
                    {this.renderPropertyNavigation(
                        ActualAddress,
                        location,
                        language,
                        'subnav'
                    )}

                    <div className="cbre_body">
                        <div className={'cbre_imageCarousel'}>
                            {this.renderWalkthoughOrCarousel(property, disableCarouselWalkthrough)}
                            <UnderOfferBanner
                                displayText={propertyBannerText}
                                underOffer={isUnderOffer}
                            />
                        </div>

                        <StickyContainer className="cbre_container">
                            {sideBarHeader_mobile}

                            <div className="cbre_contentBySidebar propertyDescription">
                                <div className="row marginTop-lg-1">
                                    <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                        <ExpandableText
                                            title={property.StrapLine}
                                            startExpanded={
                                                !breakpoints.isMobile
                                            }
                                        >
                                            {property.LongDescription.trim()}
                                        </ExpandableText>
                                    </div>
                                </div>
                            </div>

                            {sideBar}

                            {sideBarContent_mobile}

                            <div className="cbre_contentBySidebar marginTop-md-1 marginTop-lg-0">
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                                        {this._renderPropertyImages()}
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
                            'subnav marginBottom-md-1'
                        )}

                        {relatedPropertiesComponent}
                    </div>
                </div>
                <ContactFormWrapper
                    className={'listmap-modal'}
                    modal={modal.getModal('contact')}
                />
                <ShareModal
                    className={'listmap-modal'}
                    {...modal.getModal('share')}
                />
            </div>
        );
    }
}

DetailViewResidential.contextTypes = {
    actions: PropTypes.object,
    language: PropTypes.object,
    stores: PropTypes.object,
    spaPath: PropTypes.object
};

DetailViewResidential.propTypes = {
    relatedProperties: PropTypes.object,
    carouselCardProps: PropTypes.object
};

export default DetailViewResidential;
