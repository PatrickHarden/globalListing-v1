import isPrerender from './isPrerender';

module.exports = function(features) {
    return (features && features.sortPropertiesByRelevancy && !isPrerender());
};
