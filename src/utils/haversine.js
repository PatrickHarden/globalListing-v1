// https://en.wikipedia.org/wiki/Haversine_formula
var DefaultValues = require('../constants/DefaultValues');

module.exports = function (polygon, radius, uom) {
    uom = uom || DefaultValues.radiusType;

    if(!polygon.bounds){
        return radius;
    }
    
    var _ne = polygon.bounds.getNorthEast(),
        _centre = polygon.bounds.getCenter(),
        lat1 = _centre.lat(),
        lon1 = _centre.lng(),
        lat2 = _ne.lat(),
        lon2 = _ne.lng();

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = (R * c) * 1000; // Distance in metres

    var _radius = d / DefaultValues.distanceConversions[uom];

    return _radius + parseFloat(radius);
};

function deg2rad(deg) {
    return deg * (Math.PI/180);
}
