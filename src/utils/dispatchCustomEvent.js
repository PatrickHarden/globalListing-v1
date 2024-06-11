module.exports = function() {
    var _hasDispatched = false,
        _propertyId = null;

        // RSTODO
    this.preRender = function(actions) {
        if (!_hasDispatched) {
            _hasDispatched = true;

            actions.publishCustomEvent('CBRE SPA has completed initial render', 'CBRESPA_LOADED');
        }
    };

    this.propertyLoaded = function(actions, propertyId) {
        if (propertyId !== _propertyId) {
            _propertyId = propertyId;
            actions.publishCustomEvent('CBRE SPA has loaded a new property', 'CBRESPA_NEW_PROPERTY_LOADED');
        }
    };

    this.propertyClicked = function(actions) {

        actions.publishCustomEvent('User has clicked on a property', 'CBRESPA_PROPERTY_CLICKED');

    };

    this.listingsPage = function(actions) {

        actions.publishCustomEvent('User has mounted the listings page component', 'CBRESPA_LISTINGS_PAGE');

    };

    this.routeEvent = function(actions, location) {
        actions.publishCustomEvent(location, 'CBRESpaRouteEvent');
    };

};
