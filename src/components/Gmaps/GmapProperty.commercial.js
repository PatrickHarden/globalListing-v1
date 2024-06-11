var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    AddressSummary = require('../Property/PropertyComponents/AddressSummary')
        .default,
    Size = require('../Property/PropertyComponents/Size').default,
    PriceLabel = require('../Property/PropertyComponents/PriceLabel').default,
    PropertyImage = require('../Property/PropertyComponents/PropertyImage')
        .default,
    PropertyLink = require('../Property/PropertyComponents/PropertyLink')
        .default;

var createReactClass = require('create-react-class');

var PropertyMapViewCommercial = createReactClass({
    displayName: 'PropertyMapViewCommercial',
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

                <p>
                    <PriceLabel
                        property={property}
                        searchType={this.props.searchType}
                    />
                    <br />
                    <Size property={property} displayLabel={true} />
                </p>

                <p className="property-details-link">
                    {language.MoreDetailsLink}
                    <span className="cbre-icon cbre-chevron-right" />
                </p>
            </PropertyLink>
        );
    }
});

module.exports = PropertyMapViewCommercial;
