var counterpart = require('counterpart');

module.exports = {
    init: function(strings, locale){
        counterpart.registerTranslations(locale, strings);
    }
};