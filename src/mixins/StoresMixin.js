var PropTypes = require('prop-types');

var StoresMixin = {
    contextTypes: {
        stores: PropTypes.object
    },

    getConfigStore: function() {
        return this.context.stores.ConfigStore;
    },

    getFavouritesStore: function() {
        return this.context.stores.FavouritesStore;
    },

    getParamStore: function() {
        return this.context.stores.ParamStore;
    },

    getLanguageStore: function() {
        return this.context.stores.LanguageStore;
    },

    getSearchStateStore: function() {
        return this.context.stores.SearchStateStore;
    },

    getPropertyStore: function() {
        return this.context.stores.PropertyStore;
    },

    getApplicationStore: function() {
        return this.context.stores.ApplicationStore;
    }
};

module.exports = StoresMixin;
