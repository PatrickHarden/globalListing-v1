var PropTypes = require('prop-types');
var React = require('react'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname), // eslint-disable-line no-undef
    { isIE } = require('../../utils/browser'),
    InfoBox = require('@react-google-maps/infobox'),
    InfoWindow = require('react-google-maps').InfoWindow,
    PropertyMapView = require('./GmapProperty'),
    PropertyCarousel = require('../PropertyCarousel'),
    classNames = require('classnames'),
    ApplyAppContext = require('../ApplyAppContext');

var createReactClass = require('create-react-class');

var GmapInfoWindowOld = createReactClass({
    displayName: 'GmapInfoWindow',
    mixins: [
        ComponentPathMixin,
        LanguageMixin,
        StoresMixin,
        ApplicationActionsMixin
    ],

    contextTypes: {
        router: PropTypes.object,
        location: PropTypes.object,
        spaPath: PropTypes.object
    },

    propTypes: {
        searchType: PropTypes.string.isRequired,
        carouselWindow: PropTypes.bool,
        itemIndex: PropTypes.number,
        properties: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
            .isRequired,
        searchResultsPage: PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            windowReady: false
        };
    },

    _renderInfoWindowContent: function() {
        var component = null,
            developmentClustering = this.getConfigStore().getFeatures()
                .developmentClustering,
            props = this.props,
            childProps = {
                searchResultsPage: this.props.searchResultsPage,
                searchType: props.searchType
            },
            properties = props.properties,
            itemIndex = props.itemIndex,
            childContext = this.context;

        if (properties.length && developmentClustering) {
            component = (
                <ApplyAppContext passContext={childContext}>
                    <PropertyCarousel
                        {...childProps}
                        slidesToShow={1}
                        properties={properties}
                        loading={!this.state.windowReady}
                        isImageRestricted={true}
                    />
                </ApplyAppContext>
            );
        } else {
            if (properties.length) {
                itemIndex = properties[0].itemIndex;
                properties = properties[0].property;
            }

            component = (
                <ApplyAppContext passContext={childContext}>
                    <PropertyMapView
                        {...childProps}
                        property={properties}
                        index={itemIndex}
                        isImageRestricted={true}
                    />
                </ApplyAppContext>
            );
        }

        return component;
    },

    _windowReady: function() {
        this.setState({
            windowReady: true
        });
    },

    render: function() {
        // TODO: In future we need to hook this in with a gmaps loader component, like we do on the GMaps/index.js component. This will allow us to guarantee that 'google' is defined (rather than trying to keep our code safe by testing for undefined), and it will reduce our dependency on the CMS (particularly important with the sitecore integration coming down the line)
        var gmaps = google && google.maps,
            properties = this.props.properties,
            property = properties.length ? properties[0].property : properties,
            latLng = new gmaps.LatLng(
                property.Coordinates.lat,
                property.Coordinates.lon
            ),
            options = {
                closeBoxMargin: '-1px 0 0 0',
                closeBoxURL:
                    'https://www.google.com/intl/en_us/mapfiles/close.gif',
                alignBottom: true,
                enableEventPropagation: true
            };
        var carouselClasses = ['cbre-spa--map-info-window'];

        if (this.props.carouselWindow) {
            carouselClasses.push('cbre-spa--map-info-window--carousel');
        }

        var infoWindow,
            props = {
                options: options,
                defaultPosition: latLng,
                onDomready: this._windowReady
            },
            infoWindowContent = (
                <div className={classNames(carouselClasses)}>
                    {this._renderInfoWindowContent()}
                </div>
            );

        if (isIE) {
            infoWindow = React.createElement(
                InfoWindow,
                Object.assign({}, this.props, props),
                infoWindowContent
            );
        } else {
            props.options.infoBoxClearance = new gmaps.Size(30, 30);
            props.options.pixelOffset = new gmaps.Size(10, -20);
            infoWindow = React.createElement(
                InfoBox,
                Object.assign({}, this.props, props),
                infoWindowContent
            );
        }

        return infoWindow;
    }
});

module.exports = GmapInfoWindowOld;
