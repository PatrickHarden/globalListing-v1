require('../utils/CustomEvent');

var previousPathname = '';

export default function analyticsEvents(location) {
    if (typeof document === 'object' && location.action === 'PUSH' && location.pathname !== previousPathname) {
        var pageViewEvent = new CustomEvent('CBRESpaPageViewEvent', {
            'detail': { pathname: location.pathname }
        });
        if (typeof ga !== 'undefined' && typeof ga == 'function') {
            ga('set', 'location', window.location.origin + location.pathname);
        }
        previousPathname = location.pathname;
        document.dispatchEvent(pageViewEvent);
    }
}