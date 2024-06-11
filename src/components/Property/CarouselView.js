var DefaultValues = require('../../constants/DefaultValues'),
    siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

var CarouselView = {
    residential: require('./CarouselView.residential'),
    commercial: require('./CarouselView.commercial'),
    commercialv2: require('./CarouselView.commercial'),
    commercialr3: require('./CarouselView.commercial')
};

module.exports = CarouselView[siteTheme];
