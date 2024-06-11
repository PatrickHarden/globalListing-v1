var Places = {
    lookup: function(search, callback, error) {
        error = error || function() {};
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode(
            search,
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        callback({
                            gmaps: results[0],
                            location: {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            }
                        });
                    } else {
                        error();
                    }
                } else {
                    error();
                }
            }.bind(this)
        );
    }
};

module.exports = Places;
