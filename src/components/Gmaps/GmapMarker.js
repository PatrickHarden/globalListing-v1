var DefaultValues = require('../../constants/DefaultValues'),
    siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

var View = {
    residential: require('./GmapMarker.residential'),
    commercial: require('./GmapMarker.residential'),
    commercialv2: require('./GmapMarker.commercial'),
    commercialr3: require('./GmapMarker.commercial'),
    commercialr4: require('./GmapMarker.commercialR4')
};

module.exports = View[siteTheme];