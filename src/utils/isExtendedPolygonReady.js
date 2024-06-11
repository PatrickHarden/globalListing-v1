module.exports = function (params) {
    if (!params) {
        return false;
    }

    var isBoundingMode = params.searchMode && params.searchMode === 'bounding';
    var isRadiusDefined = !!params.radius;
    var isRadiusZero = params.radius === '0';

    return isBoundingMode && isRadiusDefined && !isRadiusZero;
};
