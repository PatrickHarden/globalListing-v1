var EventEmitter = require('eventemitter3');

var BaseStore = function(){};

BaseStore.prototype = Object.create(EventEmitter.prototype);

BaseStore.prototype.emitChange = function(change_event, payload) {
    payload = typeof payload !== 'undefined' ? payload : null;

    setTimeout(function() {
        this.emit(change_event, payload);
    }.bind(this));
};

BaseStore.prototype.onChange = function(change_event, callback) {
    this.on(change_event, callback);
};

BaseStore.prototype.off = function(change_event, callback) {
    this.removeListener(change_event, callback);
};

BaseStore.prototype.alterRoute = function(newRoute, params) {
    newRoute.context.transitionTo(newRoute.route, newRoute.segments, params);
};

module.exports = BaseStore;
