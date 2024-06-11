/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

var BaseStore = require('./BaseStore'),
    ActionTypes = require('../constants/ActionTypes');

var ApplicationStore = function(stores, Dispatcher) {
    // Private
    var _applicationError = null;
    let _hasConfigLoaded = false;

    this.dispatchToken = Dispatcher.register(
        function(action) {
            switch (action.type) {
                case ActionTypes.BOOTSTRAP:
                    Dispatcher.waitFor([
                        stores.ConfigStore.dispatchToken,
                        stores.ParamStore.dispatchToken,
                        stores.LanguageStore.dispatchToken,
                        stores.SearchStateStore.dispatchToken
                    ]);

                    _hasConfigLoaded = true;
                    this.emitChange('BOOTSTRAP_COMPLETE');
                    break;

                case ActionTypes.UPDATE_APPLICATION_STATE:
                    this.emitChange('APPLICATION_STATE_UPDATED');
                    break;

                case ActionTypes.LOADING_CONFIG:
                    this.emitChange('LOADING_CONFIG');
                    break;

                case ActionTypes.LOADING_API:
                    this.emitChange('LOADING_API');
                    break;

                case ActionTypes.LOADING_VIEW_START:
                    this.emitChange('LOADING_VIEW_START');
                    break;

                case ActionTypes.LOADING_VIEW_END:
                    this.emitChange('LOADING_VIEW_END');
                    break;

                case ActionTypes.API_ERROR:
                    this.emitChange('API_ERROR');
                    break;

                case ActionTypes.CONFIG_ERROR:
                    this.emitChange('CONFIG_ERROR');
                    break;

                case ActionTypes.APPLICATION_ERROR:
                    _applicationError = action.payload;
                    this.emitChange('APPLICATION_ERROR');
                    break;

                case ActionTypes.PLACES_ERROR:
                    this.emitChange('PLACES_ERROR');
                    break;

                case ActionTypes.FAILED_GET_RELATED_PROPERTIES:
                    this.emitChange(ActionTypes.FAILED_GET_RELATED_PROPERTIES);
                    break;

                case ActionTypes.FAILED_GET_CHILD_PROPERTIES:
                    this.emitChange(ActionTypes.FAILED_GET_CHILD_PROPERTIES);
                    break;

                case ActionTypes.CLOSE_MODAL:
                    this.emitChange('CLOSED_MODAL');
                    break;

                default:
                // Do nothing
            }
        }.bind(this)
    );

    this.getApplicationError = function() {
        return _applicationError;
    };

    this.hasConfigLoaded = function() {
        return _hasConfigLoaded;
    };
};

ApplicationStore.prototype = Object.create(BaseStore.prototype);

module.exports = ApplicationStore;
