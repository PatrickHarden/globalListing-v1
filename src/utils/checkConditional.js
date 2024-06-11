import paramMap from './paramMap';

module.exports = function(object, params){
    let conditionMet = true;
    if (object.hasOwnProperty('conditional')) {
        for (var condition in object.conditional) {
            if (object.conditional.hasOwnProperty(condition)) {

                var mappedParam = paramMap.hasParam(params, condition);

                // Check if the key exists
                if (!mappedParam) {
                    conditionMet = false;
                    break;
                }

                var values = object.conditional[condition].split(',');

                for (var key in values) {
                    var value = values[key];
                    if (value.startsWith('!')) {
                        value = value.substring(1);
                        if (!params[mappedParam] || params[mappedParam].indexOf(value) !== -1) {
                            conditionMet = false;
                        }
                    } else if (!params[mappedParam] || params[mappedParam].indexOf(value) === -1) {
                        conditionMet = false;
                    }
                }
                if (!conditionMet) {
                    break;
                }
            }
        }
    }

    return conditionMet;
};
