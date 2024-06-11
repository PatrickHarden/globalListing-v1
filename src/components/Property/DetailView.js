var React = require('react'),
    StoresMixin = require('../../mixins/StoresMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
    ScrollToTopMixin = require('../../mixins/ScrollToTop'),
    PdpSharedComponentsMixin = require('../../mixins/PdpSharedComponentsMixin'),
    DefaultValues = require('../../constants/DefaultValues'),
    ReactBootstrap = require('react-bootstrap'),
    PropertyNavigation = require('./PropertyComponents/PropertyNavigation').default,
    Bedrooms = require('./PropertyComponents/Bedrooms').default,
    ListBlock = require('./PropertyComponents/ListBlock').default,
    AddressSummary = require('./PropertyComponents/AddressSummary').default,
    UnderOfferBanner = require('./PropertyComponents/UnderOfferBanner').default,
    Walkthrough = require('./PropertyComponents/Walkthrough').default,
    Carousel = require('./PropertyComponents/Carousel').default,
    ImageGrid = require('./PropertyComponents/ImageGrid').default,
    PriceLabel = require('./PropertyComponents/PriceLabel').default,
    PdpCallToActions = require('./PropertyComponents/PdpCallToActions').default,
    Gmap = require('../Gmaps'),
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col;
var createReactClass = require('create-react-class');
import {PhotoSwipe} from 'react-photoswipe';

var DetailView = createReactClass({
    displayName: 'DetailView',
    mixins: [ PdpSharedComponentsMixin, StoresMixin, LanguageMixin, ComponentPathMixin, IsInArrayMixin, TrackingEventMixin, ApplicationActionsMixin, ScrollToTopMixin ],

    getInitialState: function() {
        return {
            defaultPropertyView: this.getSearchStateStore().getItem('searchType') || DefaultValues.cbreSiteType,
            showDescription: false,
            socialSharingConfig: this.getConfigStore().getItem('socialSharing')
        };
    },

    componentWillUpdate: function() {
        // Reset lightbox data for each property.
        this.getPropertyStore().setPropertyLightboxData();
    },

    _renderHero: function(){
        var property = this.props.property,
            lightboxData = this.getPropertyStore().getPropertyLightboxData();

        if(property.Walkthrough){
            return (
                <Walkthrough url={property.Walkthrough} propertyId={property.PropertyId} />
            );
        } else {
            return (
                <div>
                    <Carousel
                      openLightboxFunc={this.handleOpenImageInLightbox}
                      className={'pdp-carousel'}
                      items={property.Photos}
                    />
                    <PhotoSwipe
                      ref='lightbox'
                      isOpen={this.state.isOpen}
                      items={lightboxData}
                      options={{
                          index: this.state.index,
                          closeOnScroll: false,
                          history: false
                      }}
                      onClose={this._closeLightbox}
                    />
                </div>
            );
        }
    },

    render: function () {
        var property = this.props.property,
            language = this.context.language,
            underOfferState = (this.searchArray(property.Aspect, 'isUnderOffer') ||
                this.searchArray(property.Aspect, 'isLetUnderOffer')) || false,
            descriptionClassName = (this.state.showDescription ? 'pdp-long-description--showAll' : ''),
            toggleButton = (this.state.showDescription ? '' : <a className="pdp-show-more"
                                                                 onClick={this._showDescriptionToggle}>{this.context.language.ReadMoreText}</a>),
            highlights = property.Highlights,
            features = this.getConfigStore().getItem('features'),
            showNav = features && features.propertyNavigation;

        if (highlights && highlights.length && highlights[0].hasOwnProperty('content')){
            highlights = [];
        }

        return (
            <div className={'pdp'}>
                {!showNav ? null : (
                    <div className={'pdp-navigation-top'}>
                        <PropertyNavigation
                            address={property.ActualAddress}
                            location={this.props.location}
                            className="property-navigation"
                            btnContainerClass="pdp-prev-next btn--chevron"
                            btnClass="btn--chevron"
                            btnPrevClass="btn--pdp-prev"
                            btnPrevContent={(
                                <div>
                                    <span className="cbre-icon cbre-chevron-left"></span>
                                    {this.context.language.PreviousPropertyButtonText}
                                </div>
                            )}
                            btnNextClass="btn--pdp-next"
                            btnNextContent={(
                                <div>
                                    {this.context.language.NextPropertyButtonText}
                                    <span className="cbre-icon cbre-chevron-right"></span>
                                </div>
                            )}
                            useBreadcrumb={false}
                        />
                    </div>
                )}

                <div className={'pdp-top'}>
                    {this._renderHero()}
                    <div className={'container'}>
                        <div className={'pdp-leader-info'}>
                            <h1><AddressSummary address={property.ActualAddress}/></h1>
                            <h2><PriceLabel property={property} searchType={this.props.searchType} /></h2>
                            <div className={'pdp-bedrooms'}><Bedrooms bedrooms={property.NumberOfBedrooms}/></div>
                            <UnderOfferBanner displayText={language.UnderOfferText} underOffer={underOfferState}/>
                        </div>
                    </div>
                </div>

                <div className={'container'}>
                    <Row>
                        <Col xs={12} sm={8}>
                            <div className="pdp-strapline"><h2>{property.StrapLine}</h2></div>
                            <div className={'pdp-long-description ' + descriptionClassName}>{property.LongDescription.trim()}</div>
                            {toggleButton}
                        </Col>
                        <Col xs={12} sm={4} className={'pdp-callout'}>

                            <ListBlock blockTitle={language.PdpFeaturesTitle} listClass={'list-group'}
                                       listItemClass={'list-group-item'}
                                       listData={highlights}/>

                            <PdpCallToActions
                                openLightboxFunc={this.handleOpenFloorplanInLightbox}
                                property={property}
                                language={language}
                                showTenantFees={true}
                                searchType={this.props.searchType} />

                            <div className={'pdp-inserted-content'} />

                            {this.renderSocialSharing(property)}
                        </Col>
                        <Col xs={12}>
                            <ImageGrid openLightboxFunc={this.handleOpenImageInLightbox} items={property.Photos}/>
                        </Col>
                    </Row>
                </div>

                <div className="cbre-spa--map-container">
                    <Gmap properties={[property]} mapViewType={'detailView'} />
                </div>

                {this._renderCarousel()}

                {!showNav ? null : (
                    <div className={'pdp-navigation-bottom'}>
                        <PropertyNavigation
                            address={property.ActualAddress}
                            location={this.props.location}
                            className="property-navigation"
                            btnContainerClass="pdp-prev-next btn--chevron"
                            btnClass="btn--chevron"
                            btnPrevClass="btn--pdp-prev"
                            btnPrevContent={(
                                <div>
                                    <span className="cbre-icon cbre-chevron-left"></span>
                                    {this.context.language.PreviousPropertyButtonText}
                                </div>
                            )}
                            btnNextClass="btn--pdp-next"
                            btnNextContent={(
                                <div>
                                    {this.context.language.NextPropertyButtonText}
                                    <span className="cbre-icon cbre-chevron-right"></span>
                                </div>
                            )}
                            useBreadcrumb={false}
                        />
                    </div>
                )}
            </div>
        );
    }
});

module.exports = DetailView;
