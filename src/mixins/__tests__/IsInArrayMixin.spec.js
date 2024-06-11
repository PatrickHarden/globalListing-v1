var IsInArrayMixin = require('../IsInArrayMixin');

describe('IsInArrayMixin', function () {
    var array = ['test 1', 'test 2', 'test 3'],
        searchString1 = 'test 2',
        searchString2 = 'test 4';

    describe('When searching an array', function () {
        describe('When search returns no results', function () {
            it('should return false', function() {
                var searchResult = IsInArrayMixin.searchArray(array, searchString2);
                expect(searchResult).toBe(false);
            });
        });

        describe('When search returns results', function () {
            it('should return true', function() {
                var searchResult = IsInArrayMixin.searchArray(array, searchString1);
                expect(searchResult).toBe(true);
            });
        });
    });
});