import DefaultValues from '../constants/DefaultValues';
import TrackingEvents from '../constants/TrackingEvents';

function trackingEvent(eventName, opts, stores, actions) {
    const { SearchStateStore, ConfigStore } = stores;

    // Set up default options.
    opts = opts || {};
    opts.event = TrackingEvents[eventName];
    opts.eventType = 'analytics';
    opts.spaType = window.cbreSiteType || DefaultValues.cbreSiteType;
    opts.path = window.location.href;
    opts.searchType =
        SearchStateStore.getItem('searchType') || DefaultValues.searchType;
    opts.widgetName = ConfigStore.getItem('title');
    // Additional options
    if (!opts.hasOwnProperty('placeName')) {
        opts.placeName = SearchStateStore.getItem('searchLocationName');
    }

    // Fire a user event
    actions.publishCustomEvent(opts);
}

export default trackingEvent;
