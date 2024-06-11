var SortOrderMixin = {
    sortArray: function(array, sortKey){
        if(array && array.length && sortKey){
            return array.sort(function(a, b) {
                return a[sortKey] - b[sortKey];
            });
        }
    }
};

module.exports = SortOrderMixin;