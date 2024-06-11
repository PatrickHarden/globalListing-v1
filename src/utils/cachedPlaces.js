import placesAdapter from './placesAdapter';

var CachedPlaces = {
    lookup: function (search, callback, error) {
        error = error || function () { };

        var placesRequest = fetch(search.endpoint)
            .then((response) => response.json()).then((data) => {

                const place =  data.results && data.results.length > 0 ? placesAdapter(data.results[0]) : null;

                var result = place ? {
                    gmaps: place,
                    location: {
                        lat: place.geometry.location.lat,
                        lng: place.geometry.location.lng
                    }
                }:{};


                callback(result);
            });

        Promise.all([placesRequest]).then(function (data) { });
    }
};

module.exports = CachedPlaces;