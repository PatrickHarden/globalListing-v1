var React = require('react'),
    ReactDOM = require('react-dom'),
    TestUtils = require('react-dom/test-utils'),
    SelectFilter = require('../index'),
    wrapper = require('../../../../../test/stubs/testWrapper');

describe('Select filter', function () {
    var renderedComponent,
        changed = false,
        testValue = 'string',
        testConcatenator = {
            string1: 'c1',
            string2: 'c2'
        },
        testValues = ['string1', 'string2'],
        handleChange = function(){
            changed = true;
        },
        filterObject = {
            "name": "filter",
            "type": "select",
            "label": "filter",
            "placement": "primary",
            "options": [
                {
                    "value": 400,
                    "label": "No radius"
                }
            ]
        };

    beforeEach(function (done) {
        var Wrapped = wrapper(SelectFilter),
            wrappedComponent;

        wrappedComponent = TestUtils.renderIntoDocument(
            <Wrapped filter={filterObject} handleFilterChange={handleChange} searchParams={{}} />
        );

        renderedComponent = TestUtils.findRenderedComponentWithType(wrappedComponent, SelectFilter);

        setTimeout(done);
    });

    describe('returnValue', function () {
        describe('when passed a string', function () {
            it('should return that string untouched if index is 0', function () {
                var val = renderedComponent._returnValue(testValue, 0);
                expect(val).toEqual(testValue);
            });
            it('should return null if index is > 0', function () {
                var val = renderedComponent._returnValue(testValue, 1);
                expect(val).toEqual(null);
            });
        });

        describe('when passed an array', function () {
            it('should return the array item that corresponds to the index', function () {
                var val = renderedComponent._returnValue([testValue], 0);
                expect(val).toEqual(testValue);
            });
            it('should return null if no item exists at that index', function () {
                var val = renderedComponent._returnValue([testValue], 1);
                expect(val).toEqual(null);
            });
        });

        describe('when passed an array to concatenate', function () {
            it('should return a string equal to the values of the concatenated array', function () {
                var val = renderedComponent._returnValue(testValues, 0, true);
                expect(val).toEqual(testValues.join(''));
            });
        });

        describe('when passed comparator array', function () {
            it('should return a string equal to the values of the corresponding items in the comparator', function () {
                var val = renderedComponent._returnValue(testValues, 0, true, testConcatenator);
                expect(val).toEqual('c1c2');
            });
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = "";
        setTimeout(done);
    });
});