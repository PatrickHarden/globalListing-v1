var ApplicationActions = require('../actions/ApplicationActions'),
    Dispatcher = require('../core/Dispatcher'),
    ConfigStore = require('../stores/ConfigStore'),
    ParamStore = require('../stores/ParamStore'),
    LanguageStore = require('../stores/LanguageStore'),
    SearchStateStore = require('../stores/SearchStateStore'),
    PropertyStore = require('../stores/PropertyStore'),
    ApplicationStore = require('../stores/ApplicationStore');

import FavouritesStore from '../stores/FavouritesStore';

module.exports = function () {
    var dispatcher = new Dispatcher(),
        stores = {};

    stores.ConfigStore = new ConfigStore(stores, dispatcher);
    stores.ParamStore = new ParamStore(stores, dispatcher);
    stores.LanguageStore = new LanguageStore(stores, dispatcher);
    stores.SearchStateStore = new SearchStateStore(stores, dispatcher);
    stores.PropertyStore = new PropertyStore(stores, dispatcher);
    stores.ApplicationStore = new ApplicationStore(stores, dispatcher);
    stores.FavouritesStore = new FavouritesStore(stores, dispatcher);

    return window.context = {
        'stores': stores,
        'actions': new ApplicationActions(stores, dispatcher),
        'dispatcher': dispatcher,
        'language': stores.ConfigStore.getItem('i18n'),
        'setStub': function (stubName, stubData) {

            switch (stubName) {
                case 'getProperties':
                    if (stubData) {
                        if (!this.actions.real_getProperties) {
                            this.actions.real_getProperties = this.actions.getProperties;
                        }

                        this.actions.getProperties = function (fetchAll, selectFields, params, path, history) {
                            this.handlePropertyResults(stubData, fetchAll, selectFields, params, path, history);
                        };
                    } else {
                        if (this.actions.real_getProperties) {
                            this.actions.getProperties = this.actions.real_getProperties;
                        }
                    }
                    break;
                case 'getProperty':
                    if (stubData) {
                        if (!this.actions.real_getProperty) {
                            this.actions.real_getProperty = this.actions.getProperty;
                        }

                        this.actions.getProperty = function () {
                            dispatcher.dispatch({
                                type: 'GET_PROPERTY',
                                data: stubData
                            });
                        };
                    } else {
                        if (this.actions.real_getProperty) {
                            this.actions.getProperty = this.actions.real_getProperty;
                        }
                    }
                    break;
            }
        }
    };

};
