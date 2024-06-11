var IsInArrayMixin = {
    searchArray: function(array, searchString){
        if(array && array.length && searchString){
            return array.indexOf(searchString) === -1 ? false : true;
        }
    }
};

module.exports = IsInArrayMixin;