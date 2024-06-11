var DefaultValues = require('../constants/DefaultValues'),
    TrackingEvents = require('../constants/TrackingEvents');

var TrackingEventMixin = {
    // this is for legacy sites only
    _fireEvent: function(eventName, opts) {
        // Default options
        opts = opts || {};
        opts.event = TrackingEvents[eventName];
        opts.eventType = 'analytics';
        opts.spaType = window.cbreSiteType || DefaultValues.cbreSiteType;
        opts.path = window.location.href;
        opts.searchType =
            this.getSearchStateStore().getItem('searchType') ||
            DefaultValues.searchType;
        opts.widgetName = this.getConfigStore().getItem('title');
        // Additional options
        if (!opts.hasOwnProperty('placeName')) {
            opts.placeName = this.getSearchStateStore().getItem(
                'searchLocationName'
            );
        }
        // Fire a user event
        this.getActions().publishCustomEvent(opts);
    }
};

module.exports = TrackingEventMixin;
