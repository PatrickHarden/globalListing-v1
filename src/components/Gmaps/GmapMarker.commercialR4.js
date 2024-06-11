const PropTypes = require('prop-types');

var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    Marker = require('react-google-maps').Marker,
    getSvgMarker = require('../../utils/getSvgMarker');

var createReactClass = require('create-react-class');

const mapMarkerIcon = {
    textColor: '#FFFFFF',
    textSize: 12,
    height: 44,
    width: 56
};

const markerRef = React.createRef();

var GmapMarker = createReactClass({
    displayName: 'GmapMarker',
    mixins: [StoresMixin, ComponentPathMixin],

    propTypes: {
        active: PropTypes.bool,
        groupSize: PropTypes.number,
        bounce: PropTypes.bool,
        exact: PropTypes.bool
    },

    componentWillMount : function(){
        this.setState({opacity: 1});
    },

    getDefaultProps: function() {
        return {
            exact: true
        };
    },

    _getMarkerIcon(text, active, _groupItemKey, isGroup = true) {
        let iconData = mapMarkerIcon;

        const offsetW = iconData.offset ? iconData.offset[0] : 0;
        const offsetH = iconData.offset ? iconData.offset[1] : 0;

        const svgMarker = {
            path: 'M35 19C35 20.6964 34.2122 23.1156 32.907 25.9C31.6195 28.6467 29.8938 31.6156 28.1549 34.3649C26.4181 37.1108 24.6796 39.6195 23.3744 41.4427C22.8296 42.2037 22.3609 42.8445 22 43.3324C21.6391 42.8445 21.1704 42.2037 20.6256 41.4427C19.3204 39.6195 17.5819 37.1108 15.8451 34.3649C14.1062 31.6156 12.3805 28.6467 11.093 25.9C9.78776 23.1156 9 20.6964 9 19C9 11.8203 14.8203 6 22 6C29.1797 6 35 11.8203 35 19Z',
            fillColor: '#137bc5',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff',
            rotation: 0,
            labelOrigin: new google.maps.Point(22, 22),
            size: new google.maps.Size(44, 56),
            scaledSize: new google.maps.Size(44, 56),
            anchor: new google.maps.Point(
                iconData.width / 2 + offsetW,
                iconData.height + offsetH
            )
          };
        return svgMarker;
    },

    _getGroupStyles: function() {
        const { groupSize = 1 } = this.props;

        var _groupItemKey = groupSize < 10 ? 0 : groupSize < 50 ? 1 : 2,
            _styles = {
                icon: this._getMarkerIcon(groupSize, true, _groupItemKey),
                label: {
                    'text': `${groupSize}`,
                    'size': '12px',
                    'color': '#ffffff'
                }
            };

        return _styles;
    },

    mouseOver: function(){
        this.setState({opacity: .5});
        if(this.props.onMouseOver){
            this.props.onMouseOver();
        }
    },

    mouseOut: function(){
        this.setState({opacity: 1});
        if(this.props.onMouseOut){
            this.props.onMouseOut();
        }
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

        return <Marker ref={markerRef} {...animation} {...this.props} {..._styles} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} opacity={this.state.opacity} />;
    }
});

module.exports = GmapMarker;
