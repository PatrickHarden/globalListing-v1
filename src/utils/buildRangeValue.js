module.exports = function(minValue, maxValue, includePOA){
    return 'range[' + minValue + '|' + maxValue + '|' + (includePOA ? 'include' : 'exclude') + ']';
};
