var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    IsInArrayMixin = require('../../mixins/IsInArrayMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col,
    AddressSummary = require('./PropertyComponents/AddressSummary').default,
    Size = require('./PropertyComponents/Size').default,
    PriceLabel = require('./PropertyComponents/PriceLabel').default,
    PropertyImage = require('./PropertyComponents/PropertyImage').default,
    PropertyLink = require('./PropertyComponents/PropertyLink').default,
    Walkthrough = require('./PropertyComponents/Walkthrough').default;

var createReactClass = require('create-react-class');

var CarouselView = createReactClass({
    displayName: 'CarouselView',
    mixins: [
        StoresMixin,
        LanguageMixin,
        IsInArrayMixin,
        ComponentPathMixin,
        ApplicationActionsMixin,
        TrackingEventMixin
    ],

    propTypes: {
        searchType: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        property: PropTypes.object.isRequired,
        searchResultsPage: PropTypes.string.isRequired,
        hardLinkProperty: PropTypes.bool,
        isImageRestricted: PropTypes.bool,
        componentContext: PropTypes.string
    },

    getDefaultProps: function() {
        return {
            isImageRestricted: false,
            componentContext: 'commercial'
        };
    },

    shouldComponentUpdate: function(a) {
        return a !== this.props;
    },

    _fireTrackingEvent: function() {
        this._fireEvent('carouselPropertyLink', {
            propertyId: this.props.property.PropertyId
        });
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

        // TODO: CBRE3-569
        // Remove hardLinkProperty prop after PDP refactor
        return (
            <div {...this.props}>
                <div className="cbre-spa--carousel__slide-content">
                    <PropertyLink
                        hardLinkProperty={this.props.hardLinkProperty || null}
                        searchResultsPage={this.props.searchResultsPage}
                        property={property}
                        propertyIndex={this.props.index}
                        searchType={this.props.searchType}
                        fireEvent={this._fireTrackingEvent}
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
                        <Walkthrough
                            url={property.Walkthrough}
                            displayAsBadge={true}
                            badgeText={language.WalkthroughBadgeText}
                            propertyId={property.PropertyId}
                        />
                    </PropertyLink>
                    <PropertyLink
                        hardLinkProperty={this.props.hardLinkProperty || null}
                        searchResultsPage={this.props.searchResultsPage}
                        property={property}
                        className="cbre-spa--carousel__slide-link"
                        propertyIndex={this.props.index}
                        searchType={this.props.searchType}
                        fireEvent={this._fireTrackingEvent}
                    >
                        <h5>
                            <AddressSummary address={property.ActualAddress} />
                        </h5>
                        <span className="cbre-icon cbre-chevron-right" />
                    </PropertyLink>

                    <Row>
                        <Col xs={12}>
                            <Size property={property} displayLabel={true} />
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            <PriceLabel
                                property={property}
                                displayLabel={false}
                                searchType={this.props.searchType}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
});

module.exports = CarouselView;
