var DefaultValues = require('../../constants/DefaultValues'),
    siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

var ListView = {
        residential: require('./ListView'),
        commercial: require('./ListView.commercial'),
        commercialv2: require('./ListView.commercial'),
        commercialr3: require('./ListView.commercial')
    },
    DetailView = {
        residential: require('./DetailView'),
        commercial: require('./DetailView.commercial'),
        commercialv2: require('./DetailView.commercial'),
        commercialr3: require('./DetailView.commercial')
    };

module.exports = {
    ListView: ListView[siteTheme],
    DetailView: DetailView[siteTheme],
    CarouselView: require('./CarouselView')
};
