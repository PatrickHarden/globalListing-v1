const PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    DefaultValues = require('../../constants/DefaultValues'),
    Marker = require('react-google-maps').Marker,
    getSvgMarker = require('../../utils/getSvgMarker');

var createReactClass = require('create-react-class');

var GmapMarker = createReactClass({
    displayName: 'GmapMarker',
    mixins: [StoresMixin, ComponentPathMixin],

    propTypes: {
        active: PropTypes.bool,
        groupSize: PropTypes.number,
        bounce: PropTypes.bool,
        exact: PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            exact: true
        };
    },

    componentWillMount: function() {
        this.icons =
            this.getConfigStore().getConfig()['icons'] || DefaultValues.icons;
    },

    _getMarkerIcon(text, active, _groupItemKey, isGroup = true) {
        let iconData;

        if (isGroup) {
            iconData = this.icons.mapGroupIcons[_groupItemKey];
        } else {
            iconData = active
                ? this.icons['mapMarkerIcon']
                : this.icons['mapMarkerIconInactive'];
        }


        iconData.text = text || '';

        const svg = getSvgMarker(iconData);
        const offsetW = iconData.offset ? iconData.offset[0] : 0;
        const offsetH = iconData.offset ? iconData.offset[1] : 0;

        return {
            url: isGroup
                ? 'data:image/svg+xml;base64,' + window.btoa(svg)
                : iconData.url,
            size: new google.maps.Size(iconData.width, iconData.height),
            scaledSize: isGroup
                ? new google.maps.Size(iconData.width, iconData.height)
                : null,
            anchor: new google.maps.Point(
                iconData.width / 2 + offsetW,
                iconData.height + offsetH
            )
            
        };
    },

    _getGroupStyles: function() {
        const { groupSize = 1 } = this.props;

        var _groupItemKey = groupSize < 100 ? 0 : groupSize < 1000 ? 1 : 2,
            _styles = {
                icon: this._getMarkerIcon(groupSize, true, _groupItemKey),
                // Pass in a count to clustering calculator.
                // We need to set this style so text is not visible over svg.
                label: {
                    text: `${groupSize}`,
                    size: '0px',
                    color: 'transparent'
                }
            };

        return _styles;
    },

    render: function() {
        const { groupSize, active, bounce, exact } = this.props;

        const { developmentClustering } = this.getConfigStore().getFeatures();

        const animation = {
            animation: bounce ? google.maps.Animation.BOUNCE : null
        };

        var _styles = {
            icon: this._getMarkerIcon(null, active, null, false)
        };

        if ((groupSize && developmentClustering) || !exact) {
            _styles = this._getGroupStyles();
        }

        return <Marker {...animation} {...this.props} {..._styles} />;
    }
});

module.exports = GmapMarker;
