module.exports = function matchTypeStrings(
    translationStringsObject,
    propertyTypeString,
    usageTypeString
) {
    if (!(translationStringsObject instanceof Object)) {
        throw new TypeError('Expected an Object');
    }

    var propertyTypesAsArray = getTypesAsArray(propertyTypeString);
    var usageTypesAsArray = getTypesAsArray(usageTypeString);

    if (propertyTypesAsArray.length === 1) {
        var propertyType =
            translationStringsObject[
                'PDPPluralPropertyType' + propertyTypesAsArray[0]
            ];
        if (propertyType) {
            return propertyType;
        }
    }

    if (usageTypesAsArray.length === 1) {
        var usageType =
            translationStringsObject[
                'PDPPluralPropertyType' + usageTypesAsArray[0]
            ];
        if (usageType) {
            return usageType;
        }
    }

    return translationStringsObject.Properties;
};

function getTypesAsArray(string) {
    var array = [];

    if (typeof string === 'string') {
        return string.split(',');
    }

    return array;
}
