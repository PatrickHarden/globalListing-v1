var scrapeFilterParams = require('../scrapeFilterParams');

describe('Scraping the filters to populate param store defaults', function () {
    var selectFilter = {
            name: 'select',
            type: 'select',
            options: [
                {
                    value: '1'
                },
                {
                    value: '2',
                    default: true
                }
            ]
        },
        checkBoxFilter = {
            name: 'checkbox',
            type: 'checkbox',
            value: '1',
            checked: true
        },
        rangeFilter = {
            name: 'range',
            type: 'range',
            minValues: [
                {
                    value: '1',
                    default: true
                },
                {
                    value: '2'
                }
            ],
            maxValues: [
                {
                    value: '3'
                },
                {
                    value: '4',
                    default: true
                }
            ]
        },
        toggleFilter1 = {
            name: 'toggle',
            type: 'toggle',
            action: 'OR',
            value: '1',
            checked: true
        },
        toggleFilter2 = {
            name: 'toggle',
            type: 'toggle',
            action: 'OR',
            value: '2',
            checked: true
        },
        conditionalFilter = {
            name: 'conditional',
            type: 'checkbox',
            value: '1',
            checked: true,
            conditional: {
                condition: '1'
            }
        },
        filterGroup = {
            "label": "filterGroup",
            "name": "filterGroup",
            "type": "group",
            "children": [
                selectFilter,
                checkBoxFilter
            ]
        },
        _params = {};

    describe('When a filter object is passed in along with a set of comparison params', function () {

        describe('When a select filter is passed in', function () {
            it('should retrieve the default value from that filter', function () {
                _params = scrapeFilterParams([selectFilter], {}, {});
                expect(_params).toEqual({ select: '2' });
            });
        });

        describe('When a checkbox filter is passed in', function () {
            it('should retrieve the default value from that filter', function () {
                _params = scrapeFilterParams([checkBoxFilter], {}, {});
                expect(_params).toEqual({ checkbox: '1' });
            });
        });

        describe('When a range filter is passed in', function () {
            it('should build a string based on the default values from that filter', function () {
                _params = scrapeFilterParams([rangeFilter], {}, {});
                expect(_params).toEqual({ range: 'range[1|4|exclude]' });
            });
        });

        describe('When a toggle filter is passed in', function () {
            describe('When the existing params object contains no value for that param', function () {
                it('should retrieve the default value from that filter', function () {
                    _params = scrapeFilterParams([toggleFilter1], {}, {});
                    expect(_params).toEqual({ toggle: '1' });
                });
            });

            describe('When the existing params object contains a value for that param', function () {
                it('should append the param value with the default value from that filter', function () {
                    _params = scrapeFilterParams([toggleFilter1, toggleFilter2], {}, {});
                    expect(_params).toEqual({ toggle: '1,2' });
                });
            });
        });

        describe('When a conditional filter is passed in', function () {
            it('should retrieve the default value from that filter if the condition is met', function () {
                _params = scrapeFilterParams([conditionalFilter], { condition: '1 '}, {});
                expect(_params).toEqual({ conditional: '1' });
            });

            it('should not retrieve the default value from that filter if the condition is not met', function () {
                _params = scrapeFilterParams([conditionalFilter], {}, {});
                expect(_params).toEqual({ });
            });
        });

        describe('When a filter group is passed in', function () {
            it('should retrieve the default values from items in that group', function () {
                _params = scrapeFilterParams([filterGroup], {}, {});
                expect(_params).toEqual({ select: '2', checkbox: '1' });
            });
        });

    });

    afterEach(function(){
        _params = {};
    });
});
