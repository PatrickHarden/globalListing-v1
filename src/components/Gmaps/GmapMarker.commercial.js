const PropTypes = require('prop-types');

var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    Marker = require('react-google-maps').Marker,
    getSvgMarker = require('../../utils/getSvgMarker');

var createReactClass = require('create-react-class');

var baseMarkerPin = require('../../../src/public/map/marker.png');

const icons = {
    mapMarkerIcon: {
        textColor: '#00a657',
        textSize: 10,
        height: 35,
        width: 29,
        svg:
            '<image id="map-marker" x="0" y="0" width="29" height="35" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9Ik1pc2MvTWFwL1BpbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwLjAwMDAwMCwgLTYuMDAwMDAwKSIgZmlsbD0iIzAwNkE0RCI+ICAgICAgICAgICAgPHBhdGggZD0iTTMyLDU5IEMxNy4zMzMzMzMzLDQ2LjQzMzUwOTcgMTAsMzYuMTAwMTc2MyAxMCwyOCBDMTAsMTUuODQ5NzM1NSAxOS44NDk3MzU1LDYgMzIsNiBDNDQuMTUwMjY0NSw2IDU0LDE1Ljg0OTczNTUgNTQsMjggQzU0LDM2LjEwMDE3NjMgNDYuNjY2NjY2Nyw0Ni40MzM1MDk3IDMyLDU5IFogTTMyLDM5IEMzOC4wNzUxMzIyLDM5IDQzLDM0LjA3NTEzMjIgNDMsMjggQzQzLDIxLjkyNDg2NzggMzguMDc1MTMyMiwxNyAzMiwxNyBDMjUuOTI0ODY3OCwxNyAyMSwyMS45MjQ4Njc4IDIxLDI4IEMyMSwzNC4wNzUxMzIyIDI1LjkyNDg2NzgsMzkgMzIsMzkgWiIgaWQ9Im1hcC1waW4iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
        anchorText: [-20, 0],
        offset: [0, -5],
        backgroundPosition: '0 -14px'
    },
    mapMarkerIconInactive: {
        textColor: '#00a657',
        textSize: 10,
        height: 35,
        width: 29,
        svg:
            '<image id="map-marker" x="0" y="0" width="29" height="35" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9Ik1pc2MvTWFwL1BpbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwLjAwMDAwMCwgLTYuMDAwMDAwKSIgZmlsbD0iIzAwNkE0RCI+ICAgICAgICAgICAgPHBhdGggZD0iTTMyLDU5IEMxNy4zMzMzMzMzLDQ2LjQzMzUwOTcgMTAsMzYuMTAwMTc2MyAxMCwyOCBDMTAsMTUuODQ5NzM1NSAxOS44NDk3MzU1LDYgMzIsNiBDNDQuMTUwMjY0NSw2IDU0LDE1Ljg0OTczNTUgNTQsMjggQzU0LDM2LjEwMDE3NjMgNDYuNjY2NjY2Nyw0Ni40MzM1MDk3IDMyLDU5IFogTTMyLDM5IEMzOC4wNzUxMzIyLDM5IDQzLDM0LjA3NTEzMjIgNDMsMjggQzQzLDIxLjkyNDg2NzggMzguMDc1MTMyMiwxNyAzMiwxNyBDMjUuOTI0ODY3OCwxNyAyMSwyMS45MjQ4Njc4IDIxLDI4IEMyMSwzNC4wNzUxMzIyIDI1LjkyNDg2NzgsMzkgMzIsMzkgWiIgaWQ9Im1hcC1waW4iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
        anchorText: [-20, 0],
        offset: [0, -5],
        backgroundPosition: '0 -14px'
    },
    mapGroupIcons: [
        {
            textColor: '#69411E',
            textSize: 12,
            height: 40,
            width: 33,
            svg:
                '<image id="map-groupIcon-density1" x="0" y="0" width="33" height="40" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iTWlzYy9NYXAvUGluLShCdWlsZGluZykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIsNTMgQzM2LjY2NjY2NjcsNDAuNDMzNTA5NyA0NCwzMC4xMDAxNzYzIDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzAuMTAwMTc2MyA3LjMzMzMzMzMzLDQwLjQzMzUwOTcgMjIsNTMgWiIgaWQ9Im1hcC1waW4iIGZpbGw9IiM2OTQxMUUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIiIGN5PSIyMiIgcj0iMTYiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
            svgColor: '#69411E',
            offset: [0, -5],
            topOffset: 0.5,
            anchorText: [19, 19]
        },
        {
            textColor: '#69411E',
            textSize: 14,
            height: 50,
            width: 41,
            svg:
                '<image id="map-groupIcon-density2" x="0" y="0" width="41" height="50" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iTWlzYy9NYXAvUGluLShCdWlsZGluZykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIsNTMgQzM2LjY2NjY2NjcsNDAuNDMzNTA5NyA0NCwzMC4xMDAxNzYzIDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzAuMTAwMTc2MyA3LjMzMzMzMzMzLDQwLjQzMzUwOTcgMjIsNTMgWiIgaWQ9Im1hcC1waW4iIGZpbGw9IiM2OTQxMUUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIiIGN5PSIyMiIgcj0iMTYiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
            svgColor: '#69411E',
            offset: [0, -6],
            topOffset: 0.5,
            anchorText: [19, 19]
        },
        {
            textColor: '#69411E',
            textSize: 14,
            height: 60,
            width: 50,
            svg:
                '<image id="map-groupIcon-density3" x="0" y="0" width="50" height="60" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iTWlzYy9NYXAvUGluLShCdWlsZGluZykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIsNTMgQzM2LjY2NjY2NjcsNDAuNDMzNTA5NyA0NCwzMC4xMDAxNzYzIDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzAuMTAwMTc2MyA3LjMzMzMzMzMzLDQwLjQzMzUwOTcgMjIsNTMgWiIgaWQ9Im1hcC1waW4iIGZpbGw9IiM2OTQxMUUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIiIGN5PSIyMiIgcj0iMTYiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
            svgColor: '#69411E',
            offset: [0, -7],
            topOffset: 0.5,
            anchorText: [19, 19]
        }
    ]
};

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

    _getMarkerIcon(text, active, _groupItemKey, isGroup = true) {
        let iconData;

        if (isGroup) {
            iconData = icons.mapGroupIcons[_groupItemKey];
        } else {
            return baseMarkerPin;   // return a static PNG
            /*
            iconData = active
                ? icons['mapMarkerIcon']
                : icons['mapMarkerIconInactive'];
            */
        }

        
        let markerUrl = '';

        if (iconData.url){
            markerUrl = iconData.url;
        }
        else{
            iconData.text = text || '';
            markerUrl = 'data:image/svg+xml;base64,' + window.btoa(getSvgMarker(iconData));
        }

        const offsetW = iconData.offset ? iconData.offset[0] : 0;
        const offsetH = iconData.offset ? iconData.offset[1] : 0;

        return {
            url: markerUrl,
            size: new google.maps.Size(iconData.width, iconData.height),
            scaledSize: isGroup
                ? new google.maps.Size(iconData.width, iconData.height)
                : new google.maps.Size(iconData.width, iconData.height),
            anchor: new google.maps.Point(
                iconData.width / 2 + offsetW,
                iconData.height + offsetH
            )
        };
    },

    _getGroupStyles: function() {
        const { groupSize = 1 } = this.props;

        var _groupItemKey = groupSize < 10 ? 0 : groupSize < 50 ? 1 : 2,
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
