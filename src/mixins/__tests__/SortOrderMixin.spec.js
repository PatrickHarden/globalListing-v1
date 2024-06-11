var SortOrderMixin = require('../SortOrderMixin');

describe('SortOrderMixin', function () {
    var array = [
            {name: 'item 1', sort: '3'},
            {name: 'item 2', sort: '1'},
            {name: 'item 3', sort: '2'}
        ],
        sortKey = 'sort';

    describe('When called on a component', function() {
        it('should sort the provided array by the provided property', function() {
            var newArray = SortOrderMixin.sortArray(array, sortKey);

            expect(newArray).toEqual([
                {name: 'item 2', sort: '1'},
                {name: 'item 3', sort: '2'},
                {name: 'item 1', sort: '3'}
            ]);
        });
    });
});