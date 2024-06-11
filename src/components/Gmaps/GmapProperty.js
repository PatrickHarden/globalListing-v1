var DefaultValues = require('../../constants/DefaultValues'),
    siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

var View = {
    residential: require('./GmapProperty.residential'),
    commercial: require('./GmapProperty.commercial'),
    commercialv2: require('./GmapProperty.commercial'),
    commercialr3: require('./GmapProperty.commercial'),
    commercialr4: require('./GmapProperty.commercial')
};

module.exports = View[siteTheme];
