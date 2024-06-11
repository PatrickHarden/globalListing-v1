module.exports = function (bounds, center) {
    bounds = bounds || {};

    var rectangle = new google.maps.Rectangle({
        bounds: bounds
    });

    const _bounds = rectangle.getBounds();

    var _ne = bounds.getNorthEast();
    var _sw = bounds.getSouthWest();
    var _nw = new google.maps.LatLng(_ne.lat(), _sw.lng());
    var _se = new google.maps.LatLng(_sw.lat(), _ne.lng());

    // console.log(`NE/SW: ${JSON.stringify(NE)}/${JSON.stringify(SW)}`);
    // console.log(`NW/SE: ${JSON.stringify(NW)}/${JSON.stringify(SE)}`);

    var polygon = [];

    polygon.push(
        '"' + _ne.lat() + ',' + _ne.lng() + '"',
        '"' + _sw.lat() + ',' + _ne.lng() + '"',
        '"' + _sw.lat() + ',' + _sw.lng() + '"',
        '"' + _ne.lat() + ',' + _sw.lng() + '"'
   );

    polygon = "[[" + polygon.join(',')  + "]]";

    return {
        center: center,
        polygons: polygon
    };
};
