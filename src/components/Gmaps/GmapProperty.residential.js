var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col,
    AddressSummary = require('../Property/PropertyComponents/AddressSummary')
        .default,
    Bedrooms = require('../Property/PropertyComponents/Bedrooms').default,
    PriceLabel = require('../Property/PropertyComponents/PriceLabel').default,
    PropertyImage = require('../Property/PropertyComponents/PropertyImage')
        .default,
    PropertyLink = require('../Property/PropertyComponents/PropertyLink')
        .default;

var createReactClass = require('create-react-class');

var PropertyMapView = createReactClass({
    displayName: 'PropertyMapView',
    mixins: [
        StoresMixin,
        LanguageMixin,
        ApplicationActionsMixin,
        IsInArrayMixin,
        ComponentPathMixin
    ],

    propTypes: {
        index: PropTypes.number.isRequired,
        property: PropTypes.object.isRequired,
        searchResultsPage: PropTypes.string.isRequired,
        isImageRestricted: PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            isImageRestricted: false
        };
    },

    render: function() {
        var property = this.props.property,
            underOfferState =
                this.searchArray(property.Aspect, 'isUnderOffer') ||
                this.searchArray(property.aspect, 'isLetUnderOffer') ||
                false,
            primaryPhoto = property.PrimaryImage || null,
            breakpointMap = {
                small: 'small',
                medium: 'small',
                large: 'small'
            },
            language = this.context.language;

        return (
            <PropertyLink
                searchResultsPage={this.props.searchResultsPage}
                property={property}
                propertyIndex={this.props.index}
                className="property-details-image"
            >
                <PropertyImage
                    items={primaryPhoto ? primaryPhoto.resources : null}
                    breakpointMap={breakpointMap}
                    alt={
                        primaryPhoto
                            ? primaryPhoto.caption
                            : language.NoImageAvailable
                    }
                    container={true}
                    underOffer={underOfferState}
                    isImageRestricted={this.props.isImageRestricted}
                />

                <h5>
                    <AddressSummary address={property.ActualAddress} />
                </h5>

                <PriceLabel
                    property={property}
                    searchType={this.props.searchType}
                />

                <Row>
                    <Col xs={6}>
                        <Bedrooms bedrooms={property.NumberOfBedrooms || 0} />
                    </Col>
                    <Col xs={6}>
                        <p className="property-details-link">
                            {language.MoreDetailsLink}
                            <span className="cbre-icon cbre-chevron-right" />
                        </p>
                    </Col>
                </Row>
            </PropertyLink>
        );
    }
});

module.exports = PropertyMapView;
