module.exports = {
    get: function(polygons, polygonParams) {
        var p;

        // If the the polygon arrays have come in from config as JSON strings then reformat them
        for (p = 0; p < polygons.length; p++) {
            if (typeof polygons[p].coords === 'string') {
                var regexp = /(^"|"$)|(\s+)/g,
                    parsedString = polygons[p].coords.replace(regexp, '');
                polygons[p].coords = parsedString.split('","');
            }
        }

        // Unencode polygon param array and reencode individual items for comparison
        var parsedPolygonArray = polygonParams ? JSON.parse(polygonParams) : [],
            paramPolygons = [];

        for (var i = 0; i < parsedPolygonArray.length; i++) {
            paramPolygons.push(JSON.stringify(parsedPolygonArray[i]));
        }

        // If polygons have been defined set up multi country filter options
        var options = [];

        if (polygons && polygons.length) {
            for (p = 0; p < polygons.length; p++) {
                options.push({
                    label: polygons[p].name,
                    value: JSON.stringify(polygons[p].coords),
                    selected:
                        paramPolygons.indexOf(
                            JSON.stringify(polygons[p].coords)
                        ) !== -1
                });
            }
            return {
                name: 'multiselect',
                options: options
            };
        }
    },

    parse: function(regions) {
        var regexp = /\[(.*?)\]/g,
            matchArray = regions.match(regexp),
            regionArray = [];

        if (matchArray) {
            for (var i = 0; i < matchArray.length; i++) {
                regionArray.push(JSON.parse(matchArray[i]));
            }
        }

        return regionArray;
    }
};
