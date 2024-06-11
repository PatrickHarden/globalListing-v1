var CustomEventPoly;

CustomEventPoly = function(event, params) {
    var evt;
    params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
    };
    evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
};

CustomEventPoly.prototype = window.Event.prototype;

window.CustomEvent = CustomEventPoly;
