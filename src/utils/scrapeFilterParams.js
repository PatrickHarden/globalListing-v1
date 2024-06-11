var _ = require('lodash'),
    $ = require('jQuery'),
    buildRangeValue = require('./buildRangeValue'),
    paramMap = require('./paramMap'),
    _params;

module.exports = function(filters, params, queryParams){
    _params = $.extend(params, paramMap.mapParams(queryParams, true));
    return _scrapeFilters(filters);
};

function _scrapeFilters(filters){
    var params = {};

    // Loop through all filters
    for (var a = 0; a < filters.length; a++) {
        // Check if filter is relevant to current search (i.e. are conditions met)
        if(_.isPlainObject(filters[a]) && _isRelevant(filters[a], _params)){
            // Rerun function if this is a filter group
            if(filters[a].hasOwnProperty('children')){
                $.extend(params, _scrapeFilters(filters[a].children));
            }
            // Store param name to add as property to params object
            var _paramName = filters[a].name,
                _val;
            // Handle different types of filter
            if(filters[a].hasOwnProperty('options')){
                // if one of the items is assigned as default then add it to the params object
                _val = _getDefaultValue(filters[a].options);
                if(_val){
                    params[_paramName] = _val;
                }
            } else if(filters[a].hasOwnProperty('minValues') && filters[a].hasOwnProperty('maxValues')) {
                // Build the max and min values param
                if(_getDefaultValue(filters[a].minValues) || _getDefaultValue(filters[a].maxValues)){
                    // Handle standard and double parameter ranges
                    var _rangeParams = _paramName.split('|');
                    if(_rangeParams.length > 1){
                        params[_rangeParams[0]] = buildRangeValue('', _getDefaultValue(filters[a].maxValues) || '', filters[a].includePOA);
                        params[_rangeParams[1]] = buildRangeValue(_getDefaultValue(filters[a].minValues) || '', '', filters[a].includePOA);
                    } else {
                        params[_rangeParams[0]] = buildRangeValue(_getDefaultValue(filters[a].minValues) || '', _getDefaultValue(filters[a].maxValues) || '', filters[a].includePOA);
                    }
                }
            } else if(filters[a].checked){
                // this is a checkbox that should be ticked as default and therefore needs to be added to the params
                // First we need to establish the type
                switch(filters[a].type) {
                    case 'toggle':
                        _val = params[_paramName] || '';
                        // If the parameter is already populated then append val as and or, else just set the param to val
                        if(_val !== ''){
                            _val += (filters[a].action === 'OR') ? ',' : '^';
                        }
                        params[_paramName] = _val += filters[a].value;
                        break;
                    case 'checkbox':
                        params[_paramName] = filters[a].value;
                        break;
                    default:
                    // New checkbox types will need adding to logic here
                }
            } else {
                // New filter types will need adding to logic here
            }
        }
    }

    return params;
}

function _isRelevant(filter, params){
    var relevant = true;
    // If filter has conditionals
    if(filter.hasOwnProperty('conditional')){
        // Loop through them
        _.forOwn(filter.conditional, function(value, key){
            var mappedParam = paramMap.hasParam(params, key);
            // Check if the key exists
            if (!mappedParam) {
                relevant = false;
                return;
            }
            // check if the value exists.
            if (params[mappedParam].indexOf(value) === -1) {
                relevant = false;
            }
        });
    }
    // Return true or false depending on whether any conditions are met
    return relevant;
}

function _getDefaultValue(opts){
    // Loop through supplied options and if there is a default and it is set to true then return it
    for (var a = 0; a < opts.length; a++) {
        if(opts[a].default){
            return opts[a].value;
        }
    }
    return null;
}
