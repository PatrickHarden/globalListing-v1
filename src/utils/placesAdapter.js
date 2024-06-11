// geometry
function Bounds(bounds, location) {
    // this.pa = {
    //     g: bounds.south,
    //     h: bounds.north
    // };
    // this.ka = {
    //     g: bounds.west,
    //     h: bounds.east
    // };

    this.getCenter = () => {
        return {
            lat: function () {
                return location.lat;
            },
            lng: function () {
                return location.lng;
            }
        };
    }
    this.getNorthEast = () => {
        return {
            lat: function () {
                return bounds.northeast.lat;
            },
            lng: function () {
                return bounds.northeast.lng;
            }
        };
    }
    this.getSouthWest = () => {
        return {
            lat: function () {
                return bounds.southwest.lat;
            },
            lng: function () {
                return bounds.southwest.lng;
            }
        };
    }
}



function Viewport(viewport, location) {
    // this.pa = {
    //     g: viewport.south,
    //     h: viewport.north
    // };
    // this.ka = {
    //     g: viewport.west,
    //     h: viewport.east
    // };

    this.getCenter = () => {
        return {
            lat: function () {
                return location.lat;
            },
            lng: function () {
                return location.lng;
            }
        };
    }
    this.getNorthEast = () => {
        return {
            lat: function () {
                return viewport.northeast.lat;
            },
            lng: function () {
                return viewport.northeast.lng;
            }
        };
    }
    this.getSouthWest = () => {
        return {
            lat: function () {
                return viewport.southwest.lat;
            },
            lng: function () {
                return viewport.southwest.lng;
            }
        };
    }

}

function Geometry(result) {
    var bounds = result.geometry.bounds;
    var viewport = result.geometry.viewport;

    this.bounds = new Bounds(bounds, result.geometry.location);
    this.viewport = new Viewport(viewport, result.geometry.location);
    this.location = result.geometry.location;
    this.location_type = result.geometry.location_type;
}

function Place(result) {
    this.address_components = result.address_components;
    this.formatted_address = result.formatted_address;
    this.geometry = new Geometry(result);
    this.place_id = result.place_id;
    this.types = [];

}

export default (result) => {
    const place = new Place(result);
    place.geometry = new Geometry(result);
    return place;
};