var _ = require('lodash'),
    hash = require('object-hash');

module.exports = function (arr, property) {
    var propertyArray = [],
        developmentArray = [],
        groups = _(arr)
            .map(function (e) {
                e.hash = hash(e[property]);
                return e;
            })
            .groupBy('hash')
            .value(),
        i = 0;

    for (var key in groups) {
        if (groups.hasOwnProperty(key)) {
            if (groups[key].length > 1) {
                var _development = {
                    key: 'group_' + i,
                    active: true,
                    items: []
                };
                _development[property] = groups[key][0][property];
                for (var a = 0; a < groups[key].length; a++) {
                    delete groups[key][a].hash;
                    _development.items.push(groups[key][a]);
                }
                developmentArray.push(_development);
                i++;
            } else {
                delete groups[key][0].hash;
                propertyArray.push(groups[key][0]);
            }
        }
    }

    return {
        properties: propertyArray,
        developments: developmentArray
    };
};
