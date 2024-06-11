var config = require('../../../../nightwatch.conf.js');
var lang;

function getLanguagePack(browser) {
    lang = require(browser.globals.test_settings.languagePack);
}


module.exports = {
    beforeEach: function (browser) {
        getLanguagePack(browser);
    },
    'User can Search to Buy (when both buttons exist)': function (browser) {
        var search = browser.page.search.search();
        search.navigate().waitForElementVisible('.cbre-react-spa-container')
            .searchForArea(lang.search.searchText);
        search.assert.title(lang.search.title);
        search.expect.element('@googleAutoPredictListItem').text.to.equal(lang.search.autoResponse);
        search.click('@googleAutoPredictListItem');
        search.expect.element('@searchField').value.to.equal(lang.search.autoResponse);
        if (lang.search.buyButton === true){
            search.expect.element('@buyButton').to.be.present;
            browser.element('css selector', '.btn--buy', function(result){
                search.click('@buyButton');
                search.waitForElementVisible('.list-map-view');
                search.assert.title(lang.search.buyPageTitle);
                browser.end();
            });
        }
        else{
            search.expect.element('@buyButton').to.not.be.present;
        }
        browser.end();
    },
    'User can Search to Let (when both buttons exist)': function (browser) {
        var search = browser.page.search.search();
        search.navigate().waitForElementVisible('.cbre-react-spa-container')
            .searchForArea(lang.search.searchText);
        search.assert.title(lang.search.title);
        search.expect.element('@googleAutoPredictListItem').text.to.equal(lang.search.autoResponse);
        search.click('@googleAutoPredictListItem');
        search.expect.element('@searchField').value.to.equal(lang.search.autoResponse);
        if (lang.search.letButton === true){
            search.expect.element('@letButton').to.be.present;
            browser.element('css selector', '.btn--let', function(result){
                search.click('@letButton');
                search.waitForElementVisible('.list-map-view');
                search.assert.title(lang.search.letPageTitle);
                browser.end();
            });
        }
        else{
            search.expect.element('@letButton').to.not.be.present;
        }
        browser.end();
    },
    'User can Search when single button exist)': function (browser) {
        var search = browser.page.search.search();
        search.navigate().waitForElementVisible('.cbre-react-spa-container')
            .searchForArea(lang.search.searchText);
        search.assert.title(lang.search.title);
        search.expect.element('@googleAutoPredictListItem').text.to.equal(lang.search.autoResponse);
        search.click('@googleAutoPredictListItem');
        search.expect.element('@searchField').value.to.equal(lang.search.autoResponse);
        if (lang.search.singleSearchButton === true){
            search.expect.element('@searchButton').to.be.present;
            browser.element('css selector', '.cbre-spa--search_button-group', function(result){
                search.click('@searchButton');
                search.waitForElementVisible('.list-map-view');
                search.assert.title(lang.search.searchResultsPageTitle);
            });
        }
        else{
            search.expect.element('@letButton').to.be.present;
            search.expect.element('@buyButton').to.be.present;
        }
        browser.end();
    }

};
