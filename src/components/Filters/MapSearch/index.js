var React = require('react'),
    StoresMixin = require('../../../mixins/StoresMixin'),
    ComponentPathMixin = require('../../../mixins/ComponentPathMixin')(
        __dirname
    ),
    LanguageMixin = require('../../../mixins/LanguageMixin'),
    Geosuggest = require('./Geosuggest'),
    LatLng = window.google ? window.google.maps.LatLng : null,
    PropTypes = require('prop-types');

var createReactClass = require('create-react-class');

var MapSearch = createReactClass({
    displayName: 'MapSearch',
    mixins: [StoresMixin, LanguageMixin, ComponentPathMixin],

    propTypes: {
        biaRadius: PropTypes.string,
        locationBias: PropTypes.shape({
            lat: PropTypes.string,
            lng: PropTypes.string
        }),
        handleFilterChange: PropTypes.func,
        onSuggestSelect: PropTypes.func,
        standalone: PropTypes.bool,
        searchPlaceTypes: PropTypes.array,
        onInputChange: PropTypes.func
    },

    getDefaultProps: function() {
        return {
            biasRadius: null,
            locationBias: null,
            searchPlaceTypes: null,
            restrictToCountry: null,
            standalone: false,
            handleFilterChange: function() {},
            onSuggestSelect: function() {}
        };
    },

    onFilterChange: function(suggestion) {
        this.props.handleFilterChange(suggestion);
    },

    onSuggestSelect: function(suggestion) {
        this.props.onSuggestSelect(suggestion);
    },

    render: function() {
        var props = this.props;
        var componentRestrictions = props.restrictToCountry
            ? { country: props.restrictToCountry }
            : null;
        var searchPlaceTypes = props.searchPlaceTypes;
        var biasRadius = props.biasRadius;
        var locationBias = props.locationBias;
        var currentLocation = null;
        var bias = null;

        if (!props.standalone) {
            currentLocation = this.getSearchStateStore().getItem(
                'searchLocationName'
            );
        }

        if (locationBias) {
            bias = new LatLng(locationBias.lat, locationBias.lon);
        }

        if (!LatLng) {
            return null;
        }

        const initialValue = window.cbreSiteTheme === 'commercialr4' ? null : currentLocation;

        return (
            <div className="map-search">
                <Geosuggest
                    placeholder={
                        this.context.language.SearchLocationPlaceholder
                    }
                    initialValue={initialValue}
                    location={bias}
                    radius={biasRadius}
                    componentRestrictions={componentRestrictions}
                    types={searchPlaceTypes}
                    onSuggest={this.onFilterChange}
                    onSuggestSelect={this.onSuggestSelect}
                    inputChangeCallback={this.props.onInputChange ? this.props.onInputChange : () => {}}
                />
            </div>
        );
    }
});

module.exports = MapSearch;
