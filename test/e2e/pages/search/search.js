'use strict';

module.exports = {  
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    reactContainer:{
        selector: '.cbre-react-spa-container'
    },
    searchField: {
      selector: 'input[type=text].geosuggest__input'
    },
    googleAutoPredictListItem: {
      selector: 'li.geosuggest-item'
    },
    buyButton:{
      selector: '.btn--buy a.btn'
    },
    letButton:{
      selector: '.btn--let a.btn'
    },
    searchButton:{
      selector: '.cbre-spa--search_button-group a.btn'
    }
  },
  commands: [{
    searchForArea: function(searchText) {
      return this.setValue('@searchField', searchText);
    }
  }]
};