var _ = require('lodash');
var DefaultValues = require('../constants/DefaultValues');

module.exports = function(tokens, string){
    if(!string){
        return;
    }

    _.forOwn(tokens, function(value, key) {
        string = string.replace('%(' + key + ')s', value);
    });

    // Remove any unmatched tokens
    string = string.replace(/%\(([A-Za-z\d]+)\)s/g, '');

    let siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

    // remove floating commas - comma's which don't proceed a character
    if (siteTheme == 'commercialr3'){
        string = string.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ',');
    }

    return string;
};
