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
    Size = require('./PropertyComponents/Size').default,
    PriceLabel = require('./PropertyComponents/PriceLabel').default,
    PropertyLink = require('./PropertyComponents/PropertyLink').default,
    FeatureGrid = require('./PropertyComponents/FeatureGrid').default,
    Contacts = require('./PropertyComponents/Contacts').default,
    Walkthrough = require('./PropertyComponents/Walkthrough').default;

var createReactClass = require('create-react-class');

var PropertyCommercial = createReactClass({
    displayName: 'PropertyCommercial',
    mixins: [StoresMixin, LanguageMixin, ComponentPathMixin, IsInArrayMixin],

    propTypes: {
        searchType: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        property: PropTypes.object.isRequired,
        searchResultsPage: PropTypes.string.isRequired
    },

    render: function() {
        var property = this.props.property,
            underOfferState =
                this.searchArray(property.Aspect, 'isUnderOffer') ||
                this.searchArray(property.Aspect, 'isLetUnderOffer') ||
                false,
            primaryPhoto = property.PrimaryImage || null,
            language = this.context.language,
            breakpointMap = {
                small: 'small',
                medium: 'small',
                large: 'small'
            },
            highlights = property.Highlights;

        if (
            highlights &&
            highlights.length &&
            highlights[0].hasOwnProperty('content')
        ) {
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

        return (
            <Row>
                <Col xs={12} className="col--property-details">
                    <div className="col--walkthough-wrapper">
                        <PropertyLink
                            searchResultsPage={this.props.searchResultsPage}
                            property={property}
                            propertyIndex={this.props.index}
                            className="property-details-image"
                        >
                            <PropertyImage
                                items={
                                    primaryPhoto ? primaryPhoto.resources : null
                                }
                                breakpointMap={breakpointMap}
                                alt={
                                    primaryPhoto
                                        ? primaryPhoto.caption
                                        : language.NoImageAvailable
                                }
                                container={true}
                                underOffer={underOfferState}
                            />
                            <Walkthrough
                                url={property.Walkthrough}
                                displayAsBadge={true}
                                badgeText={language.WalkthroughBadgeText}
                                propertyId={property.PropertyId}
                            />
                        </PropertyLink>
                    </div>

                    <div className="property-details-wrapper">
                        <h2>
                            <PropertyLink
                                searchResultsPage={this.props.searchResultsPage}
                                property={property}
                                propertyIndex={this.props.index}
                            >
                                <AddressSummary
                                    address={property.ActualAddress}
                                />
                            </PropertyLink>
                        </h2>

                        <div className="list-view-item_cta-block">
                            <div className="col--price">
                                <h3>
                                    <PriceLabel
                                        property={property}
                                        displayLabel={false}
                                        searchType={this.props.searchType}
                                    />
                                    <br />
                                    <Size
                                        property={property}
                                        displayLabel={true}
                                    />
                                </h3>
                            </div>

                            <div className="col--details-link">
                                <PropertyLink
                                    searchResultsPage={
                                        this.props.searchResultsPage
                                    }
                                    property={property}
                                    propertyIndex={this.props.index}
                                >
                                    <span className={'text'}>
                                        {' '}
                                        {language.FullDetailsLink}
                                    </span>
                                    <span
                                        className={
                                            'cbre-icon cbre-chevron-right'
                                        }
                                    />
                                </PropertyLink>
                            </div>

                            <Col xs={12} className="hide-on-mobile col--divide">
                                <hr />
                            </Col>
                        </div>

                        <FeatureGrid
                            emptyListElement={noFeaturesElement}
                            features={highlights}
                            featureCount={6}
                            hideMoreDetailsLink={true}
                        />

                        <Row>
                            <Col className="hide-on-mobile">
                                <Contacts
                                    property={property}
                                    contactClass={'col-xs-6'}
                                />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
});

module.exports = PropertyCommercial;
