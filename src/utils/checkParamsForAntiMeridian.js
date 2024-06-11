import _ from 'lodash';

export const checkPolygonForAntiMeridianIntersection = (inputParams) => {
    // expected params:
    // lat (center lat)
    // lon (center lng)
    // polygons in a string format of [[ne lat, ne lng, se lat, se lng, sw lat, sw lng, nw lat, sw lng]]

    // it was created to overcome an issue where querying over the antimeridian
    // was causing the paginated list map not to show any listings in the list view
    // if it's determined the user is zoomed out enough to have a northeast point over these, then we delete the polygons from the params

    const params = _.cloneDeep(inputParams);

    // if we don't have params, polygons, lat, or lon, then we can't perform this check
    if (!params || !params.polygons || !params.lat || !params.lon) {
        return params;
    }

    // strip out the characters from the polygons array we don't need so we can create an array of points
    const polygonString = params.polygons.replace(/\[|]|\"|\\/g, '');
    let polygons = polygonString.split(',');
    polygons = polygons.map(polygon => {
        return Number(polygon);
    });
    // we should now have a list of 8 points, we put them into points assuming [ne lat, ne lng, se lat, se lng, sw lat, sw lng, nw lat, sw lng]
    const polygonPoints = [];
    for (var i = 0; i < polygons.length; i += 2) {
        const newPolygon = {
            lat: polygons[i],
            lng: polygons[i + 1]
        };
        polygonPoints.push(newPolygon);
    }

    // setup the points we need to evaluate
    const center = {
        lat: Number(params.lat),
        lng: Number(params.lon)
    };

    // figure out if the center point is in the western hemisphere or the eastern hemisphere
    // if the center point lng is < 0 (meridian) but > -180 (antimeridian) then we assume it's western hemisphere

    const westernHemisphere = center.lng <= -30 && center.lng > -180 ? true : false;
    // the lng for -30 runs through the middle of the atlantic ocean, as does -180 runs through the pacific ocean for the anti-meridian
    // next, lets store off some variables for the northeast and northwest points. 
    // latitude doesn't seem to affect things so we will just focus on longitude
    const northeast = polygonPoints[0];
    const northwest = polygonPoints[3];

    if (westernHemisphere && (northwest.lng > 0 || northwest.lng === -180)) {
        // if we are in the western hemisphere and the northwest point breaches -180 or the northeast point is greater than 0, 
        // then we know the point is past the antimeridian or the meridian
        delete params.polygons;
    } else if (!westernHemisphere && ((northeast.lng < -10 && northeast.lng >= -75) || (northeast.lng < -125 && northeast.lng >= -180))) {
        delete params.polygons;
    }
    return params;
};
