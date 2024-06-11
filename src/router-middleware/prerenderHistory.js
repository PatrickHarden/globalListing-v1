var isPrerender = require('../utils/isPrerender'),
    writeMetaTag = require('../utils/writeMetaTag');

export default function prerenderHistory() {
    return function (location) {
        if (isPrerender() && locationChanged(location)) {
            window.prerenderReady = false;
            writeMetaTag('prerender-status-code', '301', 'html');
            writeMetaTag('prerender-header',
                'Location: ' + window.location.origin + (location.pathname + window.location.search),
                'html');
            window.prerenderReady = true;
            return false;
        }
    };
}

function locationChanged(newLoc) {
    try {
        const oldLoc = window.location.pathname + window.location.search;
        return oldLoc !== newLoc.pathname + newLoc.search;
    } catch (ex) {
        // malformed location?
        return true;
    }
}
