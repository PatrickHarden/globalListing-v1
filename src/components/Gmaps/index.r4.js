var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
    haversine = require('../../utils/haversine'),
    DefaultValues = require('../../constants/DefaultValues'),
    Marker = require('./GmapMarker'),
    InfoWindowOld = require('./GmapInfoWindow'),
    splitMarkers = require('../../utils/splitMarkerArray'),
    clusteringCalculator = require('../../utils/clusteringCalculator'),
    { debounce } = require('../../external-libraries/agency365-components/components');
import { MAP } from 'react-google-maps/lib/constants';
import createPolygonMap from '../../utils/createPolygonMap';
import queryParams from '../../utils/queryParams';

var siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;
var createReactClass = require('create-react-class');

const { InfoWindow } = require("react-google-maps");

import getMapStyles from '../../utils/getMapStyles';
import { isPrerender } from '../../utils/browser';
if (window.google) {
    var Polygon = require('react-google-maps').Polygon,
        Circle = require('react-google-maps').Circle,
        MarkerClusterer = require('react-google-maps/lib/components/addons/MarkerClusterer').MarkerClusterer;
}
import { GoogleMapContainer } from './GmapContainer';

import PropTypes from 'prop-types';

import { findDOMNode } from 'react-dom';
import _ from 'lodash';
import InfoWindowComponent from '../../r3/PLP/ListMap/InfoWindow.jsx';
import InfoWindowComponentR4 from '../../r4/PLP/ListMap/InfoWindow.jsx';

var mouseoverTimeoutId = null;
var GmapR4 = createReactClass({
    displayName: 'Gmap',

    mixins: [
        ComponentPathMixin,
        StoresMixin,
        ApplicationActionsMixin,
        TrackingEventMixin
    ],

    propTypes: {
        searchResultsPage: PropTypes.string,
        searchType: PropTypes.string,
        properties: PropTypes.array.isRequired,
        mapMarkers: PropTypes.array,
        mapState: PropTypes.object,
        setMapState: PropTypes.func,
        selectedItems: PropTypes.object,
        setSelectedItems: PropTypes.func,
        mapViewType: PropTypes.string,
        spaPath: PropTypes.object,
        overrides: PropTypes.object
    },

    contextTypes: {
        router: PropTypes.object,
        spaPath: PropTypes.object,
        location: PropTypes.object
    },

    getDefaultProps: function () {
        return {
            mapState: {},
            setMapState: () => { },
            selectedItems: {
                group: {},
                property: {},
                contact: {},
                marker: null
            }
        };
    },

    infoWindowVisible: false,

    getInitialState: function () {

        const mapStyles = getMapStyles(
            this.getConfigStore().getItem('mapStyle')
        );

        return {
            shouldGetPolygon: true,
            boundaryPolygons: [],
            polygons: this.getParamStore().getParams().polygons,
            mapOptions:
                this.props.mapViewType === 'detailView'
                    ? {
                        styles: mapStyles,
                        scrollwheel: false,
                        draggable: (window.cbreSiteTheme === 'commercialr4' ? true : false),
                        gestureHandling: 'greedy',
                        disableDoubleClickZoom: true,
                        maxZoom: this.getConfigStore().getItem('mapZoom')
                            .detailsMapMaxZoom,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.SMALL,
                            position: google.maps.ControlPosition.RIGHT_TOP
                        },
                        streetViewControlOptions: {
                            style: google.maps.ZoomControlStyle.SMALL,
                            position: google.maps.ControlPosition.RIGHT_TOP
                        }
                    }
                    : {
                        styles: mapStyles,
                        maxZoom: this.getConfigStore().getItem('mapZoom')
                            .listMapMaxZoom,
                        zoomControl: true,
                        draggable: true,
                        gestureHandling: 'greedy',
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.SMALL,
                            position: google.maps.ControlPosition.RIGHT_TOP
                        },
                        streetViewControlOptions: {
                            style: google.maps.ZoomControlStyle.SMALL,
                            position: google.maps.ControlPosition.RIGHT_TOP
                        },
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                            style:
                                google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                            mapTypeIds: ['roadmap', 'satellite']
                        }
                    },
            markers: [],
            initZoom: false,
            count: 0,
            location: this.getConfigStore().getItem('location') || {
                Lat: 0,
                Lng: 0
            }
        };
    },

    componentDidUpdate() {
        // Wait until cluster array has been populated on update
        let fail = 0;
        const int = setInterval(() => {
            const clusters = this.markerClusterer && this.markerClusterer.state && this.markerClusterer.state.markerClusterer
                ? this.markerClusterer.state.markerClusterer.clusters_
                : [];
            fail++;
            if (fail === 6) {
                clearInterval(int);
            }
            if (clusters.length) {
                this.bounceSelectedCluster(clusters);
                clearInterval(int);
            }
        }, 250);
    },

    componentDidMount: function () {

        this.getSearchStateStore().onChange(
            'SEARCH_STATE_UPDATED',
            this.setPolygonData
        );
    },

    componentWillUnmount: function () {
        this.getParamStore().off('SEARCH_STATE_UPDATED', this.setPolygonData);
    },

    componentWillReceiveProps: function (newProps) {
        if (this.props !== newProps) {
            this.setMapData(newProps.properties);
        }
    },

    componentWillMount: function () {
        this.setMapData(this.props.properties);
    },


    getMarkClusterIcons: function () {

        // old green cluster
        // let imgUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDlweCIgaGVpZ2h0PSI0OXB4IiB2aWV3Qm94PSIwIDAgNDkgNDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgIDxnIGlkPSJjbHVzdGVyIiBzdHJva2U9Im5vbmUiIGZpbGw9IiM2OUJFMjgiPiAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yLUNvcHkiIGZpbGwtb3BhY2l0eT0iMC42Mzk5OTk5ODYiIGN4PSIyNC41IiBjeT0iMjQuNSIgcj0iMjQuNSI+PC9jaXJjbGU+ICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTIiIGN4PSIyNC41IiBjeT0iMjQuNSIgcj0iMjAuNSI+PC9jaXJjbGU+ICAgIDwvZz48L3N2Zz4=';

        // blue cluster
        let imgUrl = 'data:image/svg+xml,%3csvg width=\"50\" height=\"50\" viewBox=\"0 0 50 50\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"%3e%3crect width=\"50\" height=\"50\" rx=\"25\" fill=\"%230976C3\" fill-opacity=\"0.35\"/%3e%3crect x=\"5\" y=\"5\" width=\"40\" height=\"40\" rx=\"20\" fill=\"%230976C3\" fill-opacity=\"0.35\"/%3e%3crect x=\"10\" y=\"10\" width=\"30\" height=\"30\" rx=\"15\" fill=\"%230976C3\" fill-opacity=\"0.9\"/%3e%3c/svg%3e';

        return [
            {
                textColor: '#FFFFFF',
                url: imgUrl,
                textSize: 12,
                width: 50,
                height: 50,
                anchorText: [0, 0],
                offset: [0, -5],
                backgroundPosition: '0 0'
            },
            {
                textColor: '#FFFFFF',
                url: imgUrl,
                textSize: 12,
                width: 50,
                height: 50,
                anchorText: [0, 0],
                offset: [0, -6],
                backgroundPosition: '0 0'
            },
            {
                textColor: '#FFFFFF',
                url: imgUrl,
                textSize: 12,
                width: 60,
                height: 60,
                anchorText: [0, 0],
                offset: [0, -7],
                backgroundPosition: '0 0'
            }
        ];
    },

    setPolygonData: function () {
        var _searchLocationPolygon = this.getSearchStateStore().getItem(
            'searchLocationPolygon'
        );
        var _polygon = _searchLocationPolygon
            ? '[[' + _searchLocationPolygon.polygon + ']]'
            : null;
        this._searchLocationPolygon = _polygon;
    },

    // ****************************************************************************************
    // below are mock methods only to generate a bunch of map markers for load testing
    // this is currently called (when active) in setMapData
    // ****************************************************************************************

    getRandomMapCoordinate: function (from, to, decimals) {
        return (Math.random() * (to - from) + from).toFixed(decimals) * 1;
    },

    randomKey: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    generateMockMarkers: function (gmaps, markers, properties, gen) {

        // for the test, these are the boundaries of the US (including Alaska)
        // us boundaries
        var ne = new gmaps.LatLng(
            64.85694,
            -161.75583
        );
        var sw = new gmaps.LatLng(
            19.50139,
            -68.01197
        );

        for (var x = 0; x < gen; x++) {
            var property = properties[0];
            var randomLat = this.getRandomMapCoordinate(ne.lat(), sw.lat(), 4);
            var randomLng = this.getRandomMapCoordinate(sw.lng(), ne.lng(), 4);

            markers.push({
                position: {
                    lat: randomLat,
                    lng: randomLng
                },
                key: this.randomKey(),
                property: property,
                // This is required by property link inside the map window and therefore needs to be passed through. It
                // sets a store variable that is used by the property navigation's next and previous controls
                itemIndex: gen + 20000,
                exact: property.GeoLocation.exact,
                active: true
            });
        }

        return markers;
    },

    // ****************************************************************************************
    // end mock methods
    // ****************************************************************************************

    setMapData: function (properties) {

        var gmaps = window.google ? google.maps : null,
            markers = [],
            bounds = gmaps ? new gmaps.LatLngBounds() : null;

        let polygonAreaCheck = new gmaps.LatLngBounds();
        let doCheck = false;
        this.state.allMarkersMapBounds = undefined;

        try {
            const polygonBounds = this.getPolygonBounds();  // get the polygon bounds we are supposed to be operating in
            if (polygonBounds) {
                doCheck = true;
                polygonBounds.forEach(function (bound) {
                    var _latLng = new google.maps.LatLng(parseFloat(bound.lat), parseFloat(bound.lng));
                    polygonAreaCheck.extend(_latLng);
                });
            }
            if (!properties || properties.length === 0) {     // ensure we have some default map shown for bounds otherwise it just shows blank for 0 properties
                bounds = polygonBounds;
            }
        } catch (e) {
            // suppress error on polygon bounds
        }

        if (properties && properties.length > 0 && gmaps) {

            const allMarkersMapBounds = new gmaps.LatLngBounds();  // we'll record the actual marker bounds here
            let propertiesInPolygon = 0;
            properties.map(
                function (property, index) {
                    var latLng = new gmaps.LatLng(
                        property.Coordinates.lat,
                        property.Coordinates.lon
                    );

                    if (!doCheck || polygonAreaCheck.contains(latLng)) {
                        bounds.extend(latLng);
                        allMarkersMapBounds.extend(latLng);
                        propertiesInPolygon++;
                    }

                    markers.push({
                        position: {
                            lat: property.Coordinates.lat,
                            lng: property.Coordinates.lon
                        },
                        key: property.PropertyId,
                        property: property,
                        // This is required by property link inside the map window and therefore needs to be passed through. It
                        // sets a store variable that is used by the property navigation's next and previous controls
                        itemIndex: index,
                        exact: property.GeoLocation.exact,
                        active: true
                    });
                }.bind(this)
            );

            if (propertiesInPolygon > 0) {
                this.state.allMarkersMapBounds = allMarkersMapBounds;
            }
        }

        markers = splitMarkers(markers, 'position');

        this.setState(
            {
                markers: markers,
                bounds: bounds,
                initZoom: false
            }
        );
    },

    handleOpenInfoOLD(marker) {
        var markers = this.state.markers,
            _state = this.state;

        if (this.getConfigStore().getFeatures().enableMouseOverInfoWindow) {
            _state.mapOptions = {
                scrollwheel: false,
                draggable: true,
                gestureHandling: 'greedy',
                disableDoubleClickZoom: true
            };
        }

        for (var a = 0; a < markers.properties.length; a++) {
            markers.properties[a].showInfo = false;
            markers.properties[a].active = false;
        }

        for (var b = 0; b < markers.developments.length; b++) {
            markers.developments[b].showInfo = false;
            markers.developments[b].active = false;
        }

        marker.active = true;
        marker.showInfo = true;

        _state.currentMarker = marker;

        this._fireEvent('openMapMarker', {
            propertyId: marker.key
        });

        this.setState(_state);
    },

    handleCloseInfoOLD: function (marker) {
        var markers = this.state.markers,
            _state = this.state;

        _state.mapOptions = {
            scrollwheel: true,
            draggable: true,
            gestureHandling: 'greedy',
            disableDoubleClickZoom: false
        };

        for (var a = 0; a < markers.properties.length; a++) {
            markers.properties[a].active = true;
        }

        for (var b = 0; b < markers.developments.length; b++) {
            markers.developments[b].active = true;
        }

        marker.showInfo = false;

        this.setState(_state);
    },

    /* begin NEW methods to handle marker / info window open and close */
    mouseOverMarkerEvent(marker) {
        return () => {
            const that = this;
            if (mouseoverTimeoutId === null) {
                mouseoverTimeoutId = setTimeout(() => {
                    that.state.currentMouseOverMarker = marker;
                    that.openInfoWindow(marker);
                }, 600);
            }
        };
    },

    mouseOutMarkerEvent(marker) {
        return () => {
            const that = this;
            setTimeout(function () {
                clearTimeout(mouseoverTimeoutId);
                mouseoverTimeoutId = null;
                if (that.state.currentMouseOverMarker !== undefined) {
                    that.state.currentMouseOverMarker = undefined;
                    that.closeInfoWindow(marker);
                }
            }, 200);
        };
    },

    mouseOverInfoWindow: function (marker) {
        this.state.currentInfoWindowMarker = marker;
    },

    mouseOutInfoWindow: function (marker) {
        this.state.currentInfoWindowMarker = undefined;
        this.closeInfoWindow(marker);
    },

    openInfoWindow: function (marker) {
        if (this.state.openedInfoWindowMarker === marker && marker.showInfo) {
            let temp = this.state.openedInfoWindowMarker;
            temp.showInfo = false;
            this.setState({ openedInfoWindowMarker: temp });
        } else {
            if (this.state.openedInfoWindowMarker !== marker || !this.state.openedInfoWindowMarker.showInfo) {
                if (this.state.openedInfoWindowMarker) {
                    this.state.openedInfoWindowMarker.showInfo = false;
                }
                this.state.openedInfoWindowMarker = marker;
                marker.showInfo = true;
                this.setState(this.state);
            }
        }
    },

    closeInfoWindow: function (marker) {
        if (!this.state.currentInfoWindowMarker && !this.state.currentMouseOverMarker) {
            this.state.openedInfoWindowMarker = undefined;
            marker.showInfo = false;
            this.setState(this.state);
        }
    },

    /* end NEW methods to handle marker / info window open and close */

    mouseOverCluster: function (cluster) {
        if (cluster && cluster.clusterIcon_ && cluster.clusterIcon_.div_) {
            cluster.clusterIcon_.div_.style.opacity = .5;
        }
    },

    mouseOutCluster: function (cluster) {
        if (cluster && cluster.clusterIcon_ && cluster.clusterIcon_.div_) {
            cluster.clusterIcon_.div_.style.opacity = 1;
        }
    },

    renderClusters: function () {
        var mapClusterIcons = this.getMarkClusterIcons();

        var mapClusterOptions =
            this.getConfigStore().getItem('mapClustering') ||
            DefaultValues.mapClustering;

        var clustering = this.getConfigStore().getFeatures().propertyClustering;

        if (clustering) {
            return (
                <MarkerClusterer
                    calculator={clusteringCalculator}
                    averageCenter
                    enableRetinaIcons
                    {...mapClusterOptions}
                    styles={mapClusterIcons}
                    key={'markerCluster'}
                    onMouseOver={this.mouseOverCluster}
                    onMouseOut={this.mouseOutCluster}
                    ref={ref => {
                        this.getClusterRef(ref);
                    }}
                >
                    {this.renderMarkers()}
                </MarkerClusterer>
            );
        } else {
            return this.renderMarkers();
        }
    },

    returnClickEvent(marker) {
        let clickEvent = () => { };
        const { mapViewType } = this.props;

        switch (mapViewType) {
            case 'mapView': {
                clickEvent = () => {
                    this.handleOpenInfoOld(marker);
                };
                break;
            }
            case 'mapListView': {
                if (window.cbreSiteTheme === 'commercialr4') {
                    if (this.props.breakpoints.isMobile) {
                        clickEvent = () => {
                            this.props.displayMobileMapPopover(marker);
                        };
                    } else if (!this.props.breakpoints.isMobile) {
                        clickEvent = () => {
                            this.openInfoWindow(marker);
                        };
                    }
                } else {
                    clickEvent = () => {
                        this.setActiveProperty(marker);
                        if (this.handleOpenInfoOld) {
                            this.handleOpenInfoOld(marker);
                        }
                    };
                }
                break;
            }
        }

        return clickEvent;
    },

    setActiveProperty(marker) {
        const { setSelectedItems } = this.props;

        const { property } = marker;

        let markerId;
        let _property = {};
        let _group;
        let _scrollProperty;

        if (property && (property.hasOwnProperty('PropertyId'))) {
            // individual property
            _property = property;
            markerId = `${property.PropertyId}_marker`;
        } else {
            // cluster marker
            _scrollProperty = marker.items[0].property;
            _group = marker.key;
            markerId = `${marker.key}_cluster`;
        }

        setSelectedItems({
            marker: markerId,
            property: _property,
            group: _group,
            scrollToProperty: _scrollProperty,
            disableScroll: false
        });
    },

    getClusterRef(ref) {
        if (ref) {
            this.markerClusterer = ref;
        }
    },

    renderMarkers: function () {
        var markers = this.state.markers,
            renderedMarkers = [];

        const { mapViewType, selectedItems } = this.props;

        const isMapView = mapViewType === 'mapView';


        markers.properties.map(
            function (marker) {
                const _key = `${marker.key}_marker`;

                renderedMarkers.push(
                    <Marker
                        key={_key}
                        onClick={this.getConfigStore().getFeatures().enableMouseOverInfoWindow ? this.returnClickEvent(marker) : this.returnClickEvent(marker)}
                        onMouseOver={this.getConfigStore().getFeatures().enableMouseOverInfoWindow ? this.mouseOverMarkerEvent(marker) : null}
                        onMouseOut={this.getConfigStore().getFeatures().enableMouseOverInfoWindow ? this.mouseOutMarkerEvent(marker) : null}
                        mapHolderRef={this.props.mapHolderRef}
                        bounce={_key === selectedItems.marker}
                        {...marker}
                    >
                        {marker.showInfo ? this.renderInfoWindow(marker, marker.property, false, isMapView) : null}

                    </Marker>
                );
            }.bind(this)
        );

        markers.developments.map(
            function (marker) {
                const _key = `${marker.key}_cluster`;

                renderedMarkers.push(
                    <Marker
                        key={_key}
                        onClick={this.getConfigStore().getFeatures().enableMouseOverInfoWindow ? this.returnClickEvent(marker) : this.returnClickEvent(marker)}
                        onMouseOver={this.getConfigStore().getFeatures().enableMouseOverInfoWindow ? this.mouseOverMarkerEvent(marker) : null}
                        onMouseOut={this.getConfigStore().getFeatures().enableMouseOverInfoWindow ? this.mouseOutMarkerEvent(marker) : null}
                        mapHolderRef={this.props.mapHolderRef}
                        bounce={_key === selectedItems.marker}
                        groupSize={marker.items.length}
                        {...marker}
                    >
                        {marker.showInfo ? this.renderInfoWindow(marker, marker.property, true, isMapView) : null}
                    </Marker>
                );
            }.bind(this)
        );

        return renderedMarkers;
    },

    renderInfoWindow(marker, properties, isDevelopment, isMapView) {
        if (isMapView) {
            return (
                <InfoWindowOld
                    searchResultsPage={this.props.searchResultsPage}
                    key={
                        (properties.PropertyId || properties[0].PropertyId) +
                        '_info_window'
                    }
                    onCloseclick={this.handleCloseInfoOLD.bind(this, marker)}
                    carouselWindow={isDevelopment}
                    itemIndex={marker.itemIndex}
                    properties={properties}
                    searchType={this.props.searchType}
                />
            );
        } else {
            return (
                <InfoWindow key={marker.key + 'infoWindow'}>
                    {window.cbreSiteTheme === 'commercialr4' ?
                        <InfoWindowComponentR4
                            marker={marker}
                            context={this.context}
                            setMapState={this.props.setMapState}
                            handleClick={this.setActiveProperty}
                            handleMouseOver={this.mouseOverInfoWindow}
                            handleMouseOut={this.mouseOutInfoWindow}
                            spaPath={this.context.spaPath}
                            siteType={window.cbreSiteType}
                        />
                        :
                        <InfoWindowComponent
                            marker={marker}
                            context={this.context}
                            handleClick={this.setActiveProperty}
                            handleMouseOver={this.mouseOverInfoWindow}
                            handleMouseOut={this.mouseOutInfoWindow}
                            spaPath={this.props.spaPath}
                            siteType={window.cbreSiteType}
                        />
                    }
                </InfoWindow>
            );
        }
    },

    getProperties: function (fetchAll, bounds, center, radius) {

        var params = Object.assign(
            {},
            this.getParamStore().getParams(),
            this.state.params
        );

        var polygonMap = createPolygonMap(bounds, center);

        params.polygons = polygonMap.polygons;
        params.radius = radius;

        /* if we are doing pagination, just use the search handler passed in to bubble up to the Map.jsx */
        if (window.cbreSiteTheme === 'commercialr4') {
            if (this.props.searchHandler) {
                /*Updating the polygon parameter with the latest generated value based on map reference*/
                this.getParamStore().setParam('polygons', params.polygons);

                /*As we are using the searchLocationPolygon in sorting functionality, Updating the searchLocationPolygon parameter with the generated value based on map reference*/
                this.context.actions.setSearchStateItem('searchLocationPolygon', {
                    bounds: bounds,
                    center: center,
                    polygon: params.polygons.replace(/\[|]|\\/g, '')
                });

                this.props.searchHandler(params);
            }
        } else {
            const selectFields = this.getPropertyStore().getPropertiesMap();
            this.getActions().updateIsAreaSearch(true);

            this.getActions().getProperties(
                fetchAll,
                selectFields,
                params,
                this.context.location.pathname,
                null
            );
        }
    },


    getOSMData: function (placeId) {
        // this.getActions().updateIsAreaSearch(true);
        const params = this.getParamStore().getParams();
        var polyBounds = []

        if (placeId == null || placeId.length == 0)
            return;

        this.getActions().fetchOSMData(placeId, function (data) {
            var poly = null;

            if (data["osm_data"]["geojson"]["type"] == "Polygon") {
                poly = data["osm_data"]["geojson"]["coordinates"][0];
            } else if (data["osm_data"]["geojson"]["type"] == "MultiPolygon") {
                poly = data["osm_data"]["geojson"]["coordinates"][0][0];
            }

            if (poly != null) {
                poly.forEach(x => polyBounds.push({
                    "lat": x[1],
                    "lng": x[0]
                }));
            }

            window.sessionStorage.setItem(placeId, JSON.stringify(polyBounds));

            this.setState({
                boundaryPolygons: polyBounds
            });
        }.bind(this));
    },

    getMarkerCount: function (bounds) {
        let count = 0;
        if (this.props.setMarkerCount && this.state.markers && this.state.markers.properties && this.state.markers.properties.length > 0 && window.cbreSiteTheme === 'commercialr4') {
            this.state.markers.properties.forEach(marker => {
                if (bounds.contains(marker.position)) {
                    count++;
                }
            });

            if (this.state.markers.developments) {
                this.state.markers.developments.forEach(marker => {
                    if (bounds.contains(marker.position)) {
                        if (marker.items) {
                            count += marker.items.length;
                        }
                    }
                });
            }
        }
        return count;
    },

    refreshMarkerCount: function (bounds) {
        const markerCount = this.getMarkerCount(bounds);
        this.props.setMarkerCount(markerCount);
    },

    setMapState: function () {
        if (this.mapReference && this.mapReference.getZoom()) {
            this.props.setMapState({
                ref: this.mapReference,
                bounds: this.state.bounds,
                zoom: this.mapReference.getZoom()
            });
        }
    },

    bounceSelectedCluster(clusters) {
        if (this.props.mapViewType === 'detailView') {
            return;
        }

        const { selectedItems, properties, groupedProperties } = this.props;

        if (
            selectedItems.marker &&
            selectedItems.marker.substring(0, 5) == 'group'
        ) {
            const id = selectedItems.marker.replace('_cluster', '');
            const index = _.findIndex(groupedProperties, function (group) {
                return group.key && group.key === id;
            });

            if (index !== -1) {
                const { lat, lon } = groupedProperties[
                    index
                ].items[0].Coordinates;

                const coords = new google.maps.LatLng(
                    lat,
                    lon
                );
                clusters.forEach(cluster => {
                    const node = findDOMNode(cluster.clusterIcon_.div_);
                    if (node) {
                        if (cluster.getBounds().contains(coords)) {
                            node.classList.add('cbre_map_marker__bounce');
                        } else {
                            node.classList.remove('cbre_map_marker__bounce');
                        }
                    }
                });
            }
        } else if (selectedItems.marker) {
            const id = selectedItems.marker.replace('_marker', '');
            const index = _.findIndex(properties, function (property) {
                return property.PropertyId === id;
            });

            if (index !== -1) {
                const { lat, lon } = properties[index].Coordinates;

                const coords = new google.maps.LatLng(
                    parseFloat(lat),
                    parseFloat(lon)
                );
                clusters.forEach(cluster => {
                    const node = findDOMNode(cluster.clusterIcon_.div_);

                    if (node) {
                        if (cluster.getBounds().contains(coords)) {
                            node.className += ' cbre_map_marker__bounce';
                        } else {
                            node.className.replace(
                                ' cbre_map_marker__bounce',
                                ''
                            );
                        }
                    }
                });
            }
        }
    },

    getMapRefObject: function (map) {
        this.mapReference = map;

        if (map && map !== null && map !== undefined) {
            this.mapInstance = map.context[MAP];
        }
        if (
            map &&
            map !== null &&
            this.props.properties
        ) {

            if (!this.props.overrides || !this.props.overrides.bounds) {
                if (_.isArray(this.state.bounds)) {
                    //Converting the lat and long array to boundaries format.
                    const latLngBnds = new google.maps.LatLngBounds();
                    this.state.bounds.forEach(function (bound) {
                        var _latLng = new google.maps.LatLng(parseFloat(bound.lat), parseFloat(bound.lng));
                        latLngBnds.extend(_latLng);
                    });
                    map.fitBounds(latLngBnds);
                }
                else {
                    map.fitBounds(this.state.bounds);
                }
            }
            else if (this.props.overrides && this.props.overrides.bounds && this.props.mapViewType !== 'detailView') {
                // this should really only happen in r4 with the paginated list map
                // where we have all the markers for a property type/transaction type loaded
                const latLngBnds = new google.maps.LatLngBounds();
                const polygonBounds = this.getPolygonBounds();
                polygonBounds.forEach(function (bound) {
                    var _latLng = new google.maps.LatLng(parseFloat(bound.lat), parseFloat(bound.lng));
                    latLngBnds.extend(_latLng);
                });

                if (latLngBnds) {
                    let setBoundsTo = latLngBnds;
                    if (this.state.allMarkersMapBounds && latLngBnds.getSouthWest() && latLngBnds.getNorthEast()) {
                        // we record the marker map bounds when we are creating the markers initially, so it should be present
                        // we then perform a check: does the marker bounds contain the latLngBnds?  if not, then we set the bounds to the marker bounds
                        if (!this.state.allMarkersMapBounds.contains(latLngBnds.getSouthWest()) && !this.state.allMarkersMapBounds.contains(latLngBnds.getNorthEast())) {
                            setBoundsTo = this.state.allMarkersMapBounds;
                        }
                    }

                    this.state.initBounds = setBoundsTo;

                    map.fitBounds(setBoundsTo);
                }
            }

            // default zoom levels
            const defaultPDPZoomLevel = this.getConfigStore().getItem('mapZoom').detailsMapInitialZoom;
            const defaultPLPZoomlevel = this.getConfigStore().getItem('mapZoom').defaultMapZoomOnPLP;

            if (this.props.mapViewType === 'detailView') {
                if (defaultPDPZoomLevel && this.mapReference.getZoom() < defaultPDPZoomLevel) {
                    this.mapInstance.setZoom(defaultPDPZoomLevel);
                }
            } else if (this.props.mapViewType === 'mapListView') {
                if (this.props.mapViewType === 'mapListView' && defaultPLPZoomlevel && this.mapReference.getZoom() < defaultPLPZoomlevel) {
                    this.mapInstance.setZoom(defaultPLPZoomlevel);
                }
            }
        }
    },

    getPolygonBounds: function () {

        var _polygons =
            this._searchLocationPolygon ||
            this.getParamStore().getParam('initialPolygons') ||
            this.state.polygons;

        _polygons = decodeURIComponent(_polygons);

        var _polygonArray = _polygons ? JSON.parse(_polygons) : [];
        var _bounds = [];
        if (
            _polygonArray.length === 1 &&
            (this.getParamStore().getParam('searchMode') === 'bounding' ||
                this.props.mapViewType === 'mapListView')
        ) {
            for (var i = 0; i < _polygonArray[0].length; i++) {
                var _coords = _polygonArray[0][i].split(',');
                _bounds.push({
                    lat: parseFloat(_coords[0]),
                    lng: parseFloat(_coords[1])
                });
            }
        }

        return _bounds;
    },

    getExtendedRadius: function (radius) {
        let polygon = this.getSearchStateStore().getItem(
            'searchLocationPolygon'
        );
        let bounding =
            this.getParamStore().getParam('searchMode') === 'bounding';
        let _radius = radius;
        let _radiusType = this.getParamStore().getParam('RadiusType');

        if (polygon && bounding) {
            _radius = haversine(polygon, _radius, _radiusType);
        }
        return (
            parseFloat(_radius) *
            DefaultValues.distanceConversions[
            this.getParamStore().getParam('RadiusType') ||
            DefaultValues.radiusType
            ]
        );
    },

    renderOverlay: function () {
        const { mapViewType } = this.props;
        const favsMode = this.getFavouritesStore().isActive();
        const enableZoomOnClusters = this.getConfigStore().getFeatures().enableZoomOnClusters;
        const drawAdminBoundaries = this.getConfigStore().getFeatures().drawAdminBoundaries;
        const placeId = queryParams.getQueryParameter('placeId');

        const shouldRender =
            !favsMode &&
            (mapViewType === 'mapView' || mapViewType === 'mapListView') && // bounding mode is allowed no radius
            (this.getParamStore().getParam('searchMode') === 'bounding' ||
                (mapViewType === 'mapListView' &&
                    this.getParamStore().getParam('radius'))) &&
            !this.getSearchStateStore().getItem('extendedSearch');

        var _overlayStyle = {
            strokeColor: '#006a4d',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#006a4d',
            fillOpacity: 0.1
        },
            _coords = {
                lat: parseFloat(this.getParamStore().getParam('lat')),
                lng: parseFloat(this.getParamStore().getParam('lon'))
            },
            _overlay = [];

        if (shouldRender && drawAdminBoundaries && drawAdminBoundaries.enabled) {
            const polyBounds = JSON.parse(window.sessionStorage.getItem(placeId));
            // const polyBounds = this.state.boundaryPolygons;

            _overlay.push(
                <Polygon
                    key="mapPolygon"
                    options={_overlayStyle}
                    paths={polyBounds}
                />
            );

            var _radius = this.getExtendedRadius(
                this.getParamStore().getParam('radius')
            );
            return _overlay;
        } else if (!enableZoomOnClusters) {
            if (this.getParamStore().getParam('polygons')) {
                _overlay.push(
                    <Polygon
                        key="mapPolygon"
                        options={_overlayStyle}
                        paths={this.getPolygonBounds()}
                    />
                );
            } else if (!enableZoomOnClusters) {
                _overlay.push(
                    <Circle
                        key="mapCircle"
                        options={_overlayStyle}
                        center={_coords}
                        radius={_radius}
                        ref="mapCircle"
                    />
                );
            }

            return _overlay;
        }
    },

    handlePanZoomChange: function () {


        if (this.mapReference && this.props.mapViewType !== 'detailView') {

            const bounds = this.mapReference.getBounds();

            const count = this.getMarkerCount(bounds);
            if (count !== this.state.count && count !== 0) {
                const center = this.mapReference.getCenter();
                this.setState({ count: count })
                this.getProperties(true, bounds, center, 8000);
                this.refreshMarkerCount(bounds);
            }
            else {
                this.props.updatePropertiesLoading(false);
            }

            if (this.state.openedInfoWindowMarker && this.state.openedInfoWindowMarker.showInfo && (this.props.breakpoints && this.props.breakpoints.isMobile)) {
                let marker = this.state.openedInfoWindowMarker;
                marker.showInfo = false;
                this.setState({ openedInfoWindowMarker: marker });
            }
            if (this.props.breakpoints && this.props.breakpoints.isMobile) {
                this.props.displayMobileMapPopover(null);
            }

            this.setMapState();
        }
    },

    onTilesLoaded: function () {
        if (siteTheme === 'commercialr4' && this.mapReference) {
            this.refreshMarkerCount(this.mapReference.getBounds());
        }
    },

    render: function () {

        const searchThisArea = this.getConfigStore().getFeatures().searchThisArea;
        const placeId = queryParams.getQueryParameter('placeId');
        const drawAdminBoundaries = this.getConfigStore().getFeatures().drawAdminBoundaries;

        const { mapOptions } = this.state;

        const { mapViewType } = this.props;

        let mapEvents = {
            onTilesLoaded: this.onTilesLoaded,
            onZoomChanged: debounce(this.handlePanZoomChange, 1000),
            onDragEnd: debounce(this.handlePanZoomChange, 1000)
        };

        if (searchThisArea && searchThisArea.alwaysOn && mapViewType == 'mapListView') {
            mapEvents = {
                onTilesLoaded: this.onTilesLoaded,
                onZoomChanged: debounce(this.handlePanZoomChange, 1000),
                onDragEnd: debounce(this.handlePanZoomChange, 1000)
            };
        }

        // only perform a polygon lookup if the google type is city or locality
        if (this.state.shouldGetPolygon && placeId != null && drawAdminBoundaries && drawAdminBoundaries.enabled) {
            this.getOSMData(placeId);
            this.setState({ shouldGetPolygon: false });
        }

        if (isPrerender) {
            return null;
        }

        if (window.google) {
            return (
                <GoogleMapContainer
                    options={mapOptions} refProp={this.getMapRefObject} {...mapEvents}
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '100%', width: '100%' }} />}
                    mapElement={<div id="map-element-div" style={{ height: '100%' }} />}>
                    {this.renderClusters()}
                    {this.renderOverlay()}
                </GoogleMapContainer>
            );
        } else {
            return <React.Fragment>Google Maps Load Error</React.Fragment>;
        }
    }
});

module.exports = GmapR4;
