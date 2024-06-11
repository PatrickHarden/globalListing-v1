var PropTypes = require('prop-types');
var React = require('react'),
    Spinner = require('react-spinner'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
    CarouselView = require('../Property/CarouselView'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col;
import Slider from 'react-slick';
var createReactClass = require('create-react-class');

var PropertyCarousel = createReactClass({
    displayName: 'PropertyCarousel',

    mixins: [
        StoresMixin,
        LanguageMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        TrackingEventMixin
    ],

    propTypes: {
        searchType: PropTypes.string.isRequired,
        properties: PropTypes.array.isRequired,
        searchResultsPage: PropTypes.string.isRequired,
        standAlone: PropTypes.bool,
        hideCounter: PropTypes.bool,
        slidesToShow: PropTypes.number,
        variableWidth: PropTypes.bool,
        loading: PropTypes.bool,
        hardLinkProperty: PropTypes.bool,
        isImageRestricted: PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            isImageRestricted: false
        };
    },

    getInitialState: function() {
        return {
            breakpoints: this.getConfigStore().getAllBreakpointValues() || {
                small: '768',
                medium: '992',
                large: '1200'
            },
            slideNumber: 1
        };
    },

    _afterChange: function(opts) {
        this.setState(
            {
                slideNumber: opts + 1
            },
            this._fireEvent.bind(null, 'carouselScroll')
        );
    },

    _getSettings: function() {
        var breakpoints = this.state.breakpoints,
            props = this.props,
            slidesToShow = props.slidesToShow || 3,
            isInfinite = true,
            showArrows = true;

        if (this.props.properties.length <= slidesToShow) {
            isInfinite = false;
            showArrows = false;
        }

        var carouselPrev = this.context.language.carouselPrev,
            carouselNext = this.context.language.carouselNext,
            settings = {
                arrows: showArrows,
                prevArrow: (
                    <button
                        type="button"
                        className="slick-prev"
                        onClick={this.props.onClick}
                    >
                        {carouselPrev}
                    </button>
                ),
                nextArrow: (
                    <button
                        type="button"
                        className="slick-next"
                        onClick={this.props.onClick}
                    >
                        {carouselNext}
                    </button>
                ),
                infinite: isInfinite,
                speed: 500,
                slidesToShow: slidesToShow,
                slidesToScroll: slidesToShow,
                swipeToSlide: true,
                afterChange: this._afterChange,
                variableWidth: props.variableWidth || false
            };

        settings.responsive = [
            {
                breakpoint: parseInt(breakpoints.small) - 1,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ];

        return settings;
    },

    _renderHeader: function() {
        var config = this.getConfigStore().getConfig();
        if (this.props.standAlone) {
            return (
                <Row>
                    <Col xs={6} className="cbre-spa--carousel_title">
                        <h2>{config.title}</h2>
                    </Col>
                    <Col xs={6} className="cbre-spa--carousel_cta">
                        {this._renderCta()}
                    </Col>
                </Row>
            );
        }
    },

    _renderFooter: function() {
        if (this.props.standAlone) {
            return <hr className="cbre-spa--carousel_underline" />;
        }
    },

    _renderSlideCount: function() {
        if (!this.props.hideCounter) {
            return (
                <div className="cbre-spa--carousel_slide-count">
                    {this.state.slideNumber} / {this.props.properties.length}
                </div>
            );
        }
    },

    _renderCta: function(classname) {
        var config = this.getConfigStore().getConfig();

        if (
            config.carouselConfig &&
            config.carouselConfig.callToActionLinkTitle &&
            config.carouselConfig.callToActionLink
        ) {
            var attr = {
                href: config.carouselConfig.callToActionLink,
                className: classname
            };

            if (config.carouselConfig.callToActionTarget) {
                attr.target = config.carouselConfig.callToActionTarget;
            }

            return (
                <a {...attr}>{config.carouselConfig.callToActionLinkTitle}</a>
            );
        }
    },

    _renderSlides: function() {
        var _properties = this.props.properties || {};
        return _properties.map(
            function(property, index) {
                // TODO: CBRE3-569
                // Remove hardLinkProperty prop after PDP refactor
                return (
                    <CarouselView
                        key={'carousel-slide_' + index}
                        index={index}
                        searchResultsPage={this.props.searchResultsPage}
                        property={
                            property.hasOwnProperty('property')
                                ? property.property
                                : property
                        }
                        hardLinkProperty={this.props.hardLinkProperty || null}
                        searchType={this.props.searchType}
                        isImageRestricted={this.props.isImageRestricted}
                    />
                );
            }.bind(this)
        );
    },

    render: function() {
        if (this.props.loading) {
            return <Spinner />;
        }

        if (!this.props.properties.length) {
            return null;
        }

        return (
            <div>
                {this._renderHeader()}

                <div className="cbre-spa--carousel">
                    <Slider {...this._getSettings()}>
                        {this._renderSlides()}
                    </Slider>

                    {this._renderCta()}
                </div>

                {this._renderSlideCount()}

                {this._renderFooter()}
            </div>
        );
    }
});

module.exports = PropertyCarousel;
