var DefaultValues = require('../../constants/DefaultValues'),
    siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

var SearchButton = {
    residential: require('./SearchButton'),
    commercial: require('./SearchButton'),
    commercialv2: require('./SearchButton'),
    commercialr3: require('./SearchButton')
    //commercial: require('./SearchButton.commercial')
};

module.exports = SearchButton[siteTheme];
