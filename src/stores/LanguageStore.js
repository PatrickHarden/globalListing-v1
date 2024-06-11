/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */
var ActionTypes = require('../constants/ActionTypes'),
    BaseStore = require('./BaseStore'),
    counterpart = require('counterpart'),
    configTranslateStrings = require('../utils/configTranslateStrings');

var LanguageStore = function(stores, Dispatcher) {
    var _language = null;

    this.dispatchToken = Dispatcher.register(function(action){
        switch (action.type) {
            case ActionTypes.BOOTSTRAP:
                Dispatcher.waitFor([stores.ConfigStore.dispatchToken]);
                this.setLanguage();
                this.emitChange('LANGUAGE_UPDATED');
                break;

            default:
            // Do nothing
        }
    }.bind(this));

    this.setLanguage = function() {
        var locale = stores.ConfigStore.getItem('language'),
            i18n = stores.ConfigStore.getItem('i18n');

        // @TODO long term plan is to remove this store, for now I am making use of <TranslationString /> more accessable.
        const mergedStrings = Object.assign({}, i18n, i18n.TokenReplaceStrings);

        counterpart.setLocale(locale);
        configTranslateStrings.init(mergedStrings, locale);

        _language = i18n;
    };

    this.getLanguage = function() {
        return _language;
    };
};

LanguageStore.prototype = Object.create(BaseStore.prototype);

module.exports = LanguageStore;
