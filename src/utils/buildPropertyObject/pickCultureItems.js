// Pick correct items depending on item using the following logic:
// 1. match on exact language culture
// 2. match on 2 digit language code
// 3. take the first item in the array

const { match } = require("sinon");

// 4. show nothing
module.exports = (array, spaCulture, map) => {
    var _spaCultureArray = spaCulture.split('-'),
        _pickedItem = [],
        _fixTestString = undefined;

    for (var i = 0; i < array.length; i++) {
        if (array[i].hasOwnProperty(map['culture'])) {
            // Make sure Culture code is not null.
            if (array[i][map['culture']] === null) {
                console.warn('Invalid property data. Culture code set to null'); // eslint-disable-line
                continue;
            }

            var itemType = array[i][map['culture']].toLowerCase();
            // Loop through culture code elements and test for matches e.g. first test 'en-gb' then 'en'
            for (var a = _spaCultureArray.length; a > 0; a--) {
                var testString = _fixTestString || '';
                if (!_fixTestString) {
                    for (var b = 0; b < a; b++) {
                        testString += _spaCultureArray[b] + '-';
                    }
                }

                if (itemType.search(testString.slice(0, -1)) !== -1) {
                    // Override item with a culture code matching or partially matching culture meeting requirements 1 & 2
                    _fixTestString = testString;
                    _pickedItem.push(array[i]);
                    break;
                }
            }
        }
    }

    // If the previous logic picked up no matches set value to be first or nothing meeting requirements 3 and 4
    if (!_pickedItem.length) {
        if (map.defaultToPrevious == undefined || map.defaultToPrevious == true) {
            _pickedItem = array.length ? [array[0]] : null;
        }
    }

    var result = undefined;
    // If we're expecting a single result return the first item instead of an array, by try matching on language 
    if (!map._sliceArray) {
        // of the array, see if one matches the language and set that as the only item
        const matchingOnlyLanguage = _pickedItem.filter(picked => picked["Common.CultureCode"].toLowerCase().slice(0, 2) == spaCulture);

        if (matchingOnlyLanguage.length > 0) {
            result = matchingOnlyLanguage[0];
        } else {
            // loop through items and check if their culture code equals the spa culture code, if so, set that item as the result
            _pickedItem.forEach(picked => {
                if (picked["Common.CultureCode"] && picked["Common.CultureCode"].toLowerCase() == spaCulture){
                    result = picked;
                }
            });
            // fallback to first index if nothing else matches
            if (!result){
                result = _pickedItem[0];
            }
        }
    }

    return result ? result : _pickedItem;
};
