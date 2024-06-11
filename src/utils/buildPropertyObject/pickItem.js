import _ from 'lodash';
import defaultValues from '../../constants/DefaultValues';
import pickCultureItems from './pickCultureItems';

// Select item depending on comparator
module.exports = (map, context, property, comparators) => {
    // Save a copy and define comparison type
    var _array = _.get(property, context.original),
        _type = map.hasOwnProperty('culture') ? 'culture' :
                map.hasOwnProperty('units') ? 'units' :
                map.hasOwnProperty('currency') ? 'currency' : null,
        _spaType = comparators[_type],
        _fallback = map.hasOwnProperty('_allowFallback');

    let typeArray = Object.assign([], defaultValues.unitsAliases[_spaType]) || [];
    typeArray.push(_spaType);

    if (_array && _type) {
        // Loop through items and return item found with a matching item type
        // If we're comparing against culture code some additional logic required
        if (_type === 'culture') {
            return pickCultureItems(_array, _spaType, map);
            // Else just return the matching item
        } else {
            for (var i = 0; i < _array.length; i++) {
                if (_array[i].hasOwnProperty(map[_type]) && _array[i][map[_type]] !== null) {
                    var itemType = _array[i][map[_type]].toLowerCase();

                    // Check types and type aliases
                    for (let chk = 0; chk < typeArray.length; chk++) {
                        if (itemType === typeArray[chk]) {
                            return _array[i];
                        }
                    }
                }
            }
            // Allow a mapping to fall back to the first item
            // If none have matched and _allowFallback is set
            if (_fallback && _array.length) {
                return _array[0];
            }
        }
    } else if (_fallback && _array && _array.length) {
        // Allow a mapping to fall back to the first item
        // If there is no matching comparitor
        return _array[0];
    }
};
