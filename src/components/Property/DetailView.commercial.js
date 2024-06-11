var React = require('react'),
  StoresMixin = require('../../mixins/StoresMixin'),
  LanguageMixin = require('../../mixins/LanguageMixin'),
  ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
  IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
  TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
  ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
  ScrollToTopMixin = require('../../mixins/ScrollToTop'),
  PdpSharedComponentsMixin = require('../../mixins/PdpSharedComponentsMixin'),
  ReactBootstrap = require('react-bootstrap'),
  PropertyNavigation = require('./PropertyComponents/PropertyNavigation')
    .default,
  AddressSummary = require('./PropertyComponents/AddressSummary').default,
  UnderOfferBanner = require('./PropertyComponents/UnderOfferBanner').default,
  Walkthrough = require('./PropertyComponents/Walkthrough').default,
  FloorsAndUnits = require('./PropertyComponents/FloorsAndUnits').default,
  PriceLabel = require('./PropertyComponents/PriceLabel').default,
  Charge = require('./PropertyComponents/Charge').default,
  PdpCallToActions = require('./PropertyComponents/PdpCallToActions').default,
  ListBlock = require('./PropertyComponents/ListBlock').default,
  Size = require('./PropertyComponents/Size').default,
  Gmap = require('../Gmaps'),
  Row = ReactBootstrap.Row,
  Col = ReactBootstrap.Col,
  _ = require('lodash'),
  Contacts = require('./PropertyComponents/Contacts').default,
  PropertyImage = require('./PropertyComponents/PropertyImage').default,
  getAvailability = require('../../utils/getAvailability');
var createReactClass = require('create-react-class');
import { PhotoSwipe } from 'react-photoswipe';

var DetailViewCommercial = createReactClass({
  displayName: 'DetailViewCommercial',

  mixins: [
    PdpSharedComponentsMixin,
    StoresMixin,
    LanguageMixin,
    ComponentPathMixin,
    IsInArrayMixin,
    TrackingEventMixin,
    ApplicationActionsMixin,
    ScrollToTopMixin
  ],

  getInitialState: function() {
    return {
      showDescription: false,
      socialSharingConfig: this.getConfigStore().getItem('socialSharing')
    };
  },

  componentWillUpdate: function() {
    // Reset lightbox data for each property.
    this.getPropertyStore().setPropertyLightboxData();
  },

  _buildLeasesAndCharges: function(property) {
    var language = this.context.language,
      leaseInformationAndCharges = [];

    if (property.LeaseType) {
      leaseInformationAndCharges.push(
        language['PDPLeaseType'] +
          ': ' +
          language['PDPLeaseType' + property.LeaseType]
      );
    }

    if (property.AvailableFrom || property.Availability) {
      let availability = getAvailability(property, this.context);
      availability.title = language['PDPAvailableFrom'];
      leaseInformationAndCharges.push(availability);
    }

    if (property.VATPayable) {
      leaseInformationAndCharges.push(language['VATPayable']);
    }

    leaseInformationAndCharges.push(
      <PriceLabel property={property} searchType={this.props.searchType} />
    );

    var remainingCharges = _(property.Charges)
      .chain()
      .reject({ chargeType: 'SalePrice' })
      .reject({ chargeType: 'Rent' })
      .value();

    remainingCharges.forEach(function(charge) {
      leaseInformationAndCharges.push(<Charge charge={charge} />);
    });

    return leaseInformationAndCharges;
  },

  render: function() {
    var property = this.props.property,
      language = this.context.language,
      underOfferState =
        this.searchArray(property.Aspect, 'isUnderOffer') ||
        this.searchArray(property.Aspect, 'isLetUnderOffer') ||
        false,
      descriptionClassName = this.state.showDescription
        ? 'pdp-long-description--showAll'
        : '',
      toggleButton = this.state.showDescription
        ? ''
        : <a className="pdp-show-more" onClick={this._showDescriptionToggle}>
            {language.ReadMoreText}
          </a>,
      lightboxItems = this.getPropertyStore().getPropertyLightboxData(),
      underOfferClass = underOfferState ? ' pdp-leader-info--under-offer' : '',
      features = this.getConfigStore().getItem('features'),
      floorsAndUnitsConfig = this.getConfigStore().getItem('floorsAndUnits');
    let showNav = features && features.propertyNavigation;

    property.LeaseInformationAndCharges = this._buildLeasesAndCharges(property);

    return (
      <div className={'pdp'}>
        {!showNav
          ? null
          : <div className={'pdp-navigation-top'}>
              <PropertyNavigation
                address={property.ActualAddress}
                location={this.props.location}
                className="property-navigation"
                btnContainerClass="pdp-prev-next btn--chevron"
                btnClass="btn--chevron"
                btnPrevClass="btn--pdp-prev"
                btnPrevContent={
                  <div>
                    <span className="cbre-icon cbre-chevron-left" />
                    {this.context.language.PreviousPropertyButtonText}
                  </div>
                }
                btnNextClass="btn--pdp-next"
                btnNextContent={
                  <div>
                    {this.context.language.NextPropertyButtonText}
                    <span className="cbre-icon cbre-chevron-right" />
                  </div>
                }
                useBreadcrumb={false}
              />
            </div>}

        <div className={'pdp-top'}>
          <Walkthrough
            url={property.Walkthrough}
            propertyId={property.PropertyId}
          />
        </div>

        <div className={'container'}>
          <Row>
            <Col xs={12} sm={8}>
              <div className={'pdp-leader-info' + underOfferClass}>
                <h1>
                  <AddressSummary address={property.ActualAddress} />
                </h1>
                <UnderOfferBanner
                  displayText={language.UnderOfferText}
                  underOffer={underOfferState}
                />
                <h2>
                  {language.Size}: <Size property={property} />
                </h2>
              </div>

              <div className="pdp-strapline">
                <h2>
                  {property.StrapLine}
                </h2>
              </div>

              <div className={'pdp-long-description ' + descriptionClassName}>
                {property.LongDescription.trim()}
              </div>
              {toggleButton}

              {floorsAndUnitsConfig &&
                !floorsAndUnitsConfig.hideFloorsAndUnits &&
                <FloorsAndUnits floors={property.FloorsAndUnits} />}

              <ListBlock
                blockTitle={language.PdpLeaseInformationAndChargesTitle}
                wrapperClass={'collapsable-block pdp-specification'}
                listClass={'list-unstyled collapsable-content'}
                listItemClass={'list-item--border-top'}
                listData={property.LeaseInformationAndCharges}
              />

              <ListBlock
                blockTitle={language.PdpSpecificationTitle}
                wrapperClass={'collapsable-block pdp-specification'}
                listClass={'list-unstyled collapsable-content'}
                listItemClass={'list-item--border-top'}
                listData={property.Highlights}
              />
            </Col>
            <Col xs={12} sm={4} className={'pdp-callout'}>
              <div
                className="pdp-lighbox-cta"
                onClick={this.handleOpenImageInLightbox}
              >
                <PropertyImage
                  items={
                    property.Photos.length && property.Photos[0].resources
                      ? property.Photos[0].resources
                      : null
                  }
                />
                <div className="pdp-lighbox-cta__item-count">
                  {language.Image} 1 {language.PdpCarouselSlideIndexOfText}{' '}
                  {lightboxItems.length}
                </div>
              </div>

              <PhotoSwipe
                isOpen={this.state.isOpen}
                items={lightboxItems}
                options={{
                  index: this.state.index,
                  closeOnScroll: false,
                  history: false
                }}
                onClose={this._closeLightbox}
              />

              <div className={'pdp-contacts'}>
                <h3>
                  {language.PdpInterestedInThisPropertyText}
                </h3>
                <h4>
                  {language.PdpContactTheAgentText}
                </h4>
                <Contacts
                  property={property}
                  contactsClass={'pdp-contact col-xs-12'}
                />
              </div>

              <PdpCallToActions
                openLightboxFunc={this.handleOpenFloorplanInLightbox}
                property={property}
                language={language}
                searchType={this.props.searchType}
                excludeContacts={true}
                stampDutyConfig={this.props.stampDutyConfig}
              />

              <div className="pdp-inserted-content" />

              {this.renderSocialSharing(property)}
            </Col>
          </Row>
        </div>

        <div className="cbre-spa--map-container">
          <Gmap properties={[property]} mapViewType={'detailView'} />
        </div>

        {this._renderCarousel()}

        {!showNav
          ? null
          : <div className={'pdp-navigation-bottom'}>
              <PropertyNavigation
                address={property.ActualAddress}
                location={this.props.location}
                className="property-navigation"
                btnContainerClass="pdp-prev-next btn--chevron"
                btnClass="btn--chevron"
                btnPrevClass="btn--pdp-prev"
                btnPrevContent={
                  <div>
                    <span className="cbre-icon cbre-chevron-left" />
                    {this.context.language.PreviousPropertyButtonText}
                  </div>
                }
                btnNextClass="btn--pdp-next"
                btnNextContent={
                  <div>
                    {this.context.language.NextPropertyButtonText}
                    <span className="cbre-icon cbre-chevron-right" />
                  </div>
                }
                useBreadcrumb={false}
              />
            </div>}
      </div>
    );
  }
});

module.exports = DetailViewCommercial;
