import groupObjects from '../groupObjects';

describe('Group objects inside array by specified property', function () {
    var array = [
            {key: 1, comp: {a: 51.511857, b: -0.03584}},
            // Note switched properties testing the hashing function
            {key: 2, comp: {b: -0.001229, a: 51.483062}},
            {key: 3, comp: {a: 51.483062, b: -0.001229}},
            {key: 4, comp: {a: 51.490437, b: 0.003458}},
            {key: 5, comp: {a: 51.483062, b: -0.001229}},
            {key: 6, comp: {a: 49.45645, b: 2.34}},
            {key: 7, comp: {a: 51.490437, b: 0.003458}},
            {key: 8, comp: {a: 51.490437, b: 0.003458}},
            {key: 9, comp: {a: 50.43534, b: 1.657657}},
            {key: 10, comp: {a: 51.483062, b: -0.001229}}
        ],
        groupedArray = [
            {key: 1, comp: {a: 51.511857, b: -0.03584}, arrIndex: 0},
            {
                key: 'group_0',
                comp: {a: 51.483062, b: -0.001229},
                items: [
                    {key: 2, comp: {b: -0.001229, a: 51.483062}, arrIndex: 1},
                    {key: 3, comp: {a: 51.483062, b: -0.001229}, arrIndex: 2},
                    {key: 5, comp: {a: 51.483062, b: -0.001229}, arrIndex: 4},
                    {key: 10, comp: {a: 51.483062, b: -0.001229}, arrIndex: 9}
                ]
            },
            {
                key: 'group_1',
                comp: {a: 51.490437, b: 0.003458},
                items: [
                    {key: 4, comp: {a: 51.490437, b: 0.003458}, arrIndex: 3},
                    {key: 7, comp: {a: 51.490437, b: 0.003458}, arrIndex: 6},
                    {key: 8, comp: {a: 51.490437, b: 0.003458}, arrIndex: 7}
                ]
            },
            {key: 6, comp: {a: 49.45645, b: 2.34}, arrIndex: 5},
            {key: 9, comp: {a: 50.43534, b: 1.657657}, arrIndex: 8}
        ];

    describe('When an array of objects is passed in', function () {
        var groupedObjects = groupObjects(array, 'comp');

        it('should return a new array', function () {
            expect(typeof groupedObjects).toEqual('object');
        });

        describe('The returned array', function () {

            it('should contain the original items, in the same order, grouped by the specified property', function () {
                expect(groupedObjects).toEqual(groupedArray);
            });

        });
    });

});
