var splitMarkerArray = require('../splitMarkerArray');

describe('Split array of markers out into single and clustered components', function () {
    var array = [
            { key: 1, comp: { a: 51.511857, b: -0.03584 }},
            // Note switched properties testing the hashing function
            { key: 2, comp: { b: -0.001229, a: 51.483062 }},
            { key: 3, comp: { a: 51.483062, b: -0.001229 }},
            { key: 4, comp: { a: 51.483062, b: -0.001229 }},
            { key: 5, comp: { a: 51.490437, b: 0.003458 }},
            { key: 6, comp: { a: 51.490437, b: 0.003458 }}
        ],
        singleArray = [
            { key: 1, comp: { a: 51.511857, b: -0.03584 }}
        ],
        clusterArray = [
            {
                key: 'group_0',
                active: true,
                comp: { a: 51.483062, b: -0.001229 },
                items: [
                    { key: 2, comp: { b: -0.001229, a: 51.483062 }},
                    { key: 3, comp: { a: 51.483062, b: -0.001229 }},
                    { key: 4, comp: { a: 51.483062, b: -0.001229 }}
                ]
            },
            {
                key: 'group_1',
                active: true,
                comp: { a: 51.490437, b: 0.003458 },
                items: [
                    { key: 5, comp: { a: 51.490437, b: 0.003458 }},
                    { key: 6, comp: { a: 51.490437, b: 0.003458 }}
                ]
            }
        ];

    describe('When an array of items containing duplicate properties is passed in', function () {
        var newObj = splitMarkerArray(array, 'comp');

        it('should return a new object with two properties each containing arrays', function () {
            expect(typeof newObj.properties).toEqual('object');
            expect(typeof newObj.developments).toEqual('object');
        });

        describe('The returned object', function () {

            describe('The single property', function () {
                it('should contain an array of unique items from the original array passed in', function () {
                    expect(newObj.properties).toEqual(singleArray);
                });
            });

            describe('The clustered property', function () {
                it('should contain an array of duplicate items clustered together into single items', function () {
                    expect(newObj.developments).toEqual(clusterArray);
                });

                describe('Each clustered item', function () {
                    it('should contain a property matching the comparator passed in', function () {
                        expect(newObj.developments[0].comp).toEqual(clusterArray[0].comp);
                    });

                    it('should contain an array of at least two further items', function () {
                        expect(newObj.developments[0].items.length).toBe(clusterArray[0].items.length);
                    });

                    it('should have a unique key based on its position in the array', function () {
                        expect(newObj.developments[0].key).toBe(clusterArray[0].key);
                    });
                });
            });
        });
    });

});
