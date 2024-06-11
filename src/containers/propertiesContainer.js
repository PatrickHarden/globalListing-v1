var React = require('react');
var createReactClass = require('create-react-class');
var Spinner = require('react-spinner');
var StoresMixin = require('../mixins/StoresMixin');
var ApplicationActionsMixin = require('../mixins/ApplicationActionsMixin');
import groupObjects from '../utils/groupObjects';

module.exports = function(Component, conf, props) {
    conf = conf || {};
    var propertiesMap = conf.propertiesMap || [];
    var fetchAllProperties = conf.fetchAllProperties || false;

    return createReactClass({
        displayName: 'PropertiesContainer',
        mixins: [StoresMixin, ApplicationActionsMixin],

        getInitialState: function() {
            const {
                properties,
                propertyCount,
                propertiesHasLoadedOnce
            } = this.getPropertyStoreItems();

            return {
                properties,
                groupedProperties: groupObjects(properties, 'Coordinates'),
                propertyCount,
                propertiesHasLoadedOnce,
                isLoading: false
            };
        },

        getPropertyStoreItems() {
            const propertyStore = this.getPropertyStore();
            const properties = propertyStore.getProperties();
            const propertiesHasLoadedOnce = propertyStore.getPropertiesHasLoadedOnce();
            const propertyCount = propertyStore.getTotalResults();
            return {
                properties,
                propertyCount,
                propertiesHasLoadedOnce
            };
        },

        componentDidMount: function() {
            this.getApplicationStore().onChange(
                'LOADING_API',
                this.onLoadingApi
            );
            this.getApplicationStore().onChange(
                'LOADING_VIEW_START',
                this.onLoadingStart
            );
            this.getApplicationStore().onChange(
                'LOADING_VIEW_END',
                this.onLoadingEnd
            );
            this.getPropertyStore().onChange(
                'PROPERTIES_UPDATED',
                this.onUpdateProperties
            );
            this.getFavouritesStore().onChange(
                'TOGGLE_FAVOURITES',
                this.onUpdateFavourites
            );
            this.getFavouritesStore().onChange(
                'FAVOURITES_UPDATED',
                this.onUpdateFavourites
            );

            if (conf.loadOnMount) {
                this.handleLoadProperties();
            }
        },

        componentWillUnmount: function() {
            this.getApplicationStore().off('LOADING_API', this.onLoadingApi);
            this.getApplicationStore().off(
                'LOADING_VIEW_START',
                this.onLoadingStart
            );
            this.getApplicationStore().off(
                'LOADING_VIEW_END',
                this.onLoadingEnd
            );
            this.getPropertyStore().off(
                'PROPERTIES_UPDATED',
                this.onUpdateProperties
            );
            this.getFavouritesStore().off(
                'TOGGLE_FAVOURITES',
                this.onUpdateFavourites
            );
            this.getFavouritesStore().off(
                'FAVOURITES_UPDATED',
                this.onUpdateFavourites
            );
        },

        onUpdateFavourites() {
            const favourites = this.getFavouritesStore().getAll();
            const favouritesCount = this.getFavouritesStore().getCount();
            const favouritesIsActive = this.getFavouritesStore().isActive();
            const { properties, propertyCount } = this.getPropertyStoreItems();
            const items = favouritesIsActive ? favourites : properties;
            const count = favouritesIsActive ? favouritesCount : propertyCount;

            // Assign favourites when active.

            this.setState({
                propertyCount: count,
                properties: items,
                groupedProperties: groupObjects(items, 'Coordinates'),
                isLoading: false,
                favouritesIsActive
            });
        },

        onUpdateProperties: function() {
            if (!this.state.favouritesIsActive) {
                const {
                    properties,
                    propertyCount,
                    propertiesHasLoadedOnce
                } = this.getPropertyStoreItems();

                this.setState({
                    properties,
                    groupedProperties: groupObjects(properties, 'Coordinates'),
                    propertyCount,
                    propertiesHasLoadedOnce,
                    isLoading: false,
                    favouritesIsActive: false
                });
            }
        },

        handleLoadProperties: function() {
            this.getActions().updatePropertiesMap(propertiesMap);
            this.getActions().updateFetchMode(fetchAllProperties);
            this.getActions().updateProperties(
                this.getParamStore().getParams(),
                fetchAllProperties,
                [].concat(this.getPropertyStore().getPropertiesMap()),
                undefined,
                undefined,
                this.props.dispatches ? this.props.dispatches : undefined
            );
        },

        onLoadingApi: function() {
            //if (this.isMounted()) {
            this.setState({
                isLoading: true
            });
            //}
        },

        onLoadingStart: function() {
            //if (this.isMounted()) {
            this.setState({
                isLoading: true
            });
            //}
        },

        onLoadingEnd: function() {
            //if (this.isMounted()) {
            this.setState({
                isLoading: false
            });
            //}
        },

        renderLoadingState: function() {
            if (conf.hideLoadingState) {
                return false;
            }

            if (conf.loaderOverride) {
                return conf.loaderOverride;
            }

            return <Spinner />;
        },

        render: function() {
            if (!conf.bypassLoader && !this.state.propertiesHasLoadedOnce) {
                return this.renderLoadingState();
            } else if (!conf.bypassLoader && this.state.isLoading) {
                return this.renderLoadingState();
            }
            return <Component {...this.state} {...this.props} {...props} reloadProperties={this.handleLoadProperties}/>;
        }
    });
};
