var PropTypes = require('prop-types');
var React = require('react'),
    IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col,
    PropertyImage = require('./PropertyComponents/PropertyImage').default,
    AddressSummary = require('./PropertyComponents/AddressSummary').default,
    PriceLabel = require('./PropertyComponents/PriceLabel').default,
    Bedrooms = require('./PropertyComponents/Bedrooms').default,
    Email = require('./PropertyComponents/Email').default,
    Telephone = require('./PropertyComponents/Telephone').default,
    PropertyLink = require('./PropertyComponents/PropertyLink').default,
    FeatureGrid = require('./PropertyComponents/FeatureGrid').default,
    Walkthrough = require('./PropertyComponents/Walkthrough').default;

var createReactClass = require('create-react-class');

var Property = createReactClass({
    mixins: [StoresMixin, ComponentPathMixin, IsInArrayMixin, LanguageMixin],
    displayName: 'ListView',
    propTypes: {
        searchType: PropTypes.string,
        index: PropTypes.number.isRequired,
        property: PropTypes.object.isRequired,
        searchResultsPage: PropTypes.string.isRequired
    },

    _renderTelephone: function (contactGroup) {
        if (!contactGroup || !contactGroup.contacts || !contactGroup.contacts.length || !contactGroup.contacts[0].telephone) {
            return;
        }

        var firstContact = contactGroup.contacts[0];

        return (
            <Col xs={6} className={'col--telephone'}>
                <Telephone
                    buttonType={'flyout'}
                    name={contactGroup.name || firstContact.name}
                    telephone={firstContact.telephone}
                    propertyId={this.props.property.PropertyId} />
            </Col>
        );
    },

    _renderEmail: function (contactGroup) {

        if (!contactGroup || !contactGroup.contacts || !contactGroup.contacts.length) {
            return;
        }

        return (
            <Col xs={6} className={'col--email'}>
                <Email property={this.props.property} RecipientEmailAddress={contactGroup.contacts[0].email} />
            </Col>
        );
    },

    render: function () {
        var property = this.props.property,
            underOfferState = (this.searchArray(property.Aspect, 'isUnderOffer') ||
                this.searchArray(property.Aspect, 'isLetUnderOffer')) || false,
            primaryPhoto = property.PrimaryImage || null,
            breakpointMap = {
                small: 'small',
                medium: 'small',
                large: 'small'
            },
            language = this.context.language,
            highlights = property.Highlights;

        if (highlights && highlights.length && highlights[0].hasOwnProperty('content')){
            highlights = [];
        }

        var noFeaturesElement = (
          <PropertyLink
              searchResultsPage={this.props.searchResultsPage}
              className={'feature-grid__link--no-features'}
              property={property}
              propertyIndex={this.props.index}
          >
              {this.context.language.MoreDetailsLink}
          </PropertyLink>
        );

        var moreDetailsLink =
                <PropertyLink
                    searchResultsPage={this.props.searchResultsPage}
                    property={property}
                    propertyIndex={this.props.index}>
                    {this.context.language.MoreDetailsLink}
                </PropertyLink>;

        return (
            <Row>
                <Col xs={12} className="col--property-details">

                    <div className='col--walkthough-wrapper'>
                        <PropertyLink
                            searchResultsPage={this.props.searchResultsPage}
                            property={property}
                            propertyIndex={this.props.index}
                            className="property-details-image">
                            <PropertyImage items={primaryPhoto ? primaryPhoto.resources : null} breakpointMap={breakpointMap} alt={primaryPhoto ? primaryPhoto.caption : language.NoImageAvailable} container={true} underOffer={underOfferState}/>
                            <Walkthrough url={property.Walkthrough} displayAsBadge={true} badgeText={language.WalkthroughBadgeText} propertyId={property.PropertyId} />
                        </PropertyLink>
                    </div>

                    <div className="property-details-wrapper">
                        <h2>
                            <PropertyLink
                                property={property}
                                propertyIndex={this.props.index}
                                searchResultsPage={this.props.searchResultsPage}>
                                <AddressSummary address={property.ActualAddress} />
                            </PropertyLink>
                        </h2>

                        <Row className="list-view-item_cta-block">
                            <Col xs={8} sm={9} className="col--price">
                                <h3>
                                    <PriceLabel property={property} displayLabel={false} searchType={this.props.searchType} />
                                </h3>
                            </Col>

                            <div className="hide-on-mobile col--icons">
                                {this._renderTelephone(property.ContactGroup)}
                                {this._renderEmail(property.ContactGroup)}
                            </div>

                            <Col xs={12} className="hide-on-mobile">
                                <hr />
                            </Col>

                            <Col xs={4} sm={12}>
                                <Bedrooms bedrooms={property.NumberOfBedrooms || 0} />
                            </Col>
                        </Row>

                        <FeatureGrid
                            emptyListElement={noFeaturesElement}
                            features={highlights}
                            moreDetailsLink={moreDetailsLink}
                            featureCount={6} />
                    </div>
                </Col>
            </Row>
        );
    }
});

module.exports = Property;