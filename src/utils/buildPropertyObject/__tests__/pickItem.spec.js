var pickItem = require('../pickItem');

describe('pickItem helper', () => {
    let map;
    let context;
    let property;
    let comparators;
    let output;

    beforeEach(() => {
        map = {
            _key: "SampleUnitArray",
            units: "units",
            value: "value",
            _collapseArray: true
        };
        context = {
            original: "[\"SampleUnitArray\"]",
            mapped: "SampleUnitArray"
        };
        property = {
            SampleUnitArray: [
                {
                    value: 'item1',
                    units: 'foo'
                },
                {
                    value: 'item2',
                    units: 'sqm'
                }
            ]
        };
        comparators = {
            units: "sqm"
        };
    });

    afterEach(() => {
        map = undefined;
        context = undefined;
        property = undefined;
        comparators = undefined;
        output = undefined;
    });

    describe('Retrieve correct item from array', () => {
        describe('When an array contains a matching item', () => {

            beforeEach(() => {
                output = pickItem(map, context, property, comparators);
            });

            it('should return a single object', () => {
                expect(typeof output).toBe('object');
                expect(Array.isArray(output)).toBe(false);
            });

            it('should return the item that matches the comparator', () => {
                expect(output).toEqual(property.SampleUnitArray[1]);
            });
        });

        describe('When an array contains an item that matches a unit alias', () => {
            it('should return the item that matches the alias', () => {
                property.SampleUnitArray[1].units = 'm';
                output = pickItem(map, context, property, comparators);
                expect(output).toEqual(property.SampleUnitArray[1]);
            });
        });

        describe('When an array contains no matching items', () => {
            it('should return nothing', () => {
                property.SampleUnitArray[1].units = 'bar';
                output = pickItem(map, context, property, comparators);
                expect(output).toBe(undefined);
            });
        });

        describe('When an array contains no matching items and _allowFallback is set', () => {
            it('should return the first item', () => {
                property.SampleUnitArray[1].units = 'bar';
                map._allowFallback = true;
                output = pickItem(map, context, property, comparators);
                expect(output).toEqual(property.SampleUnitArray[0]);
            });
        });
    });

});
