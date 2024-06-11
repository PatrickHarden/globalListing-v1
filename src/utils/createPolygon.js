module.exports = function (bounds) {
    bounds = bounds || {};

    var _centre = bounds.getCenter(),
        _polygon = [],
        _ne = bounds.getNorthEast(),
        _sw = bounds.getSouthWest();

    _polygon.push(
        '"' + _ne.lat() + ',' + _ne.lng() + '"',
        '"' + _sw.lat() + ',' + _ne.lng() + '"',
        '"' + _sw.lat() + ',' + _sw.lng() + '"',
        '"' + _ne.lat() + ',' + _sw.lng() + '"'
    );

    _polygon = _polygon.join(',');

    return {
        centre: _centre,
        polygon: _polygon
    };
};
