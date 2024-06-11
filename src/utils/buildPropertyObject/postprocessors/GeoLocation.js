module.exports = (item) => {
    // If the GeoLocation attribute exists and is populated with a standard lat/lon
    if(item.location.type === 'Point' && item.location.coordinates.length === 2){
        // then we can overwrite / create the Coordinates property. This will satisfy requirements of both new and legacy codebase
        return [
            {
                prop: 'Coordinates',
                val: {
                    lat: item.location.coordinates[0],
                    lon: item.location.coordinates[1]
                }
            }
        ];
    }
};
