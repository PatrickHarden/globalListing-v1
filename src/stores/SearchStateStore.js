/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */
import normalizeSearchType from '../utils/normalizeSearchType';
import normalizeSearchTypeExtended from '../utils/normalizeSearchTypeExtended';

var ActionTypes = require('../constants/ActionTypes'),
    BaseStore = require('./BaseStore'),
    _ = require('lodash');

var SearchStateStore = function(stores, Dispatcher) {
    // Private
    var _searchState = [];

    this.dispatchToken = Dispatcher.register(
        function(action) {
            switch (action.type) {
                case ActionTypes.BOOTSTRAP:
                    Dispatcher.waitFor([
                        stores.ConfigStore.dispatchToken,
                        stores.ParamStore.dispatchToken
                    ]);
                    this.bootstrap(action);
                    this.emitChange('SEARCH_STATE_UPDATED', _searchState);
                    break;

                case ActionTypes.UPDATE_QUERY_PARAMS:
                    Dispatcher.waitFor([stores.ParamStore.dispatchToken]);
                    this.bootstrap(action);
                    break;

                case ActionTypes.DELETE_SEARCH_STATE_ITEM:
                    this.deleteItem(action.item);
                    break;

                case ActionTypes.CREATE_SEARCH_STATE:
                    this.setAll(action.payload);
                    this.emitChange('SEARCH_STATE_UPDATED', _searchState);
                    break;

                case ActionTypes.SET_SEARCH_STATE:
                    this.setItem(action.item, action.value);
                    this.emitChange('SEARCH_STATE_UPDATED', _searchState);
                    break;

                default:
                // Do nothing
            }
        }.bind(this)
    );

    this.bootstrap = function(searchContext) {
        var searchConfig = stores.ConfigStore.getItem('searchConfig'),
            params = stores.ParamStore.getParams(),
            viewType = normalizeSearchType(searchContext.searchtype || params['aspects']),
            searchTypeExtended = normalizeSearchTypeExtended(searchContext.searchtype || params['aspects']);

        if (viewType) {
            searchConfig.searchType = viewType;
        }

        if (searchTypeExtended) {
            searchConfig.searchTypeExtended = searchTypeExtended;
        }

        var _pn =
            searchContext.placename ||
            stores.ParamStore.getSearchLocationName();
        if (_pn) {
            searchConfig.searchLocationName = _pn;
        }

        // Are we in favourites view
        if (
            searchContext.queryParams &&
            searchContext.queryParams.hasOwnProperty('isFavourites')
        ) {
            searchConfig.isFavourites = true;
        }

        _.assign(_searchState, searchConfig);
    };

    this.setAll = function(payload) {
        _searchState = payload;
    };

    this.getAll = function() {
        return _searchState;
    };

    this.setItem = function(item, value) {
        _searchState[item] = value;
    };

    this.deleteItem = function(item) {
        delete _searchState[item];
    };

    this.getItem = function(item) {
        if (typeof _searchState[item] !== 'undefined') {
            return _searchState[item];
        }

        return null;
    };
};

SearchStateStore.prototype = Object.create(BaseStore.prototype);

module.exports = SearchStateStore;
