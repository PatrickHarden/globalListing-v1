import React from 'react';
import DefaultValues from '../../constants/DefaultValues';
import createQueryString from '../../utils/createQueryString';
import staticmaprequest from '../../utils/static-map-request';
var createReactClass = require('create-react-class');
import { isPrerender } from '../../utils/browser';

const mapOptions = {
    zoom: DefaultValues.staticMap.mapZoom,
    size: DefaultValues.staticMap.mapSize,
    maptype: DefaultValues.staticMap.maptype
};

var GStaticMaps = createReactClass({

    getInitialState() {
        return { map: '' };
    },

    componentWillMount: function () {
        this.getMap(this.props.lat, this.props.lon); 
    },

    getMap: function (lat, lon) {

        var maps = [{
            Id: `staticMap`,
            Querystring: `${createQueryString(
                mapOptions
            )}&markers=icon:${DefaultValues.staticMap.markerIconURL}%7C${lat},${lon}`
        }];

        staticmaprequest.getMap(
            DefaultValues.staticMap.staticMapApi,
            maps,
            data => {
                this.setState({
                    map: JSON.parse(data).find(map => {
                        return map.Id === 'staticMap';
                    })
                });
            },
            error => {
                console.warn('error with static map generator', error);
            }
        );
    },

    render: function () {

        if (isPrerender) {
            return null;
        }

        return <img src={this.state.map.Url} />;
    }
});

module.exports = GStaticMaps;
