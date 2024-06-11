var React = require('react'),
    ReactDOM = require('react-dom'),
    TestUtils = require('react-dom/test-utils'),
    RangeFilter = require('../index'),
    wrapper = require('../../../../../test/stubs/testWrapper');

describe('Range filter', function() {
    var renderedComponent,
        param,
        handleChange = function(e) {
            param = e.target[0].value;
        },
        filterObject = {
            name: 'someFilter',
            type: 'range',
            label: 'label',
            placement: 'primary',
            minValues: [],
            maxValues: []
        };

    beforeEach(function(done) {
        var Wrapped = wrapper(RangeFilter),
            wrappedComponent;

        wrappedComponent = TestUtils.renderIntoDocument(
            <Wrapped filter={filterObject} handleFilterChange={handleChange} />
        );

        renderedComponent = TestUtils.findRenderedComponentWithType(
            wrappedComponent,
            RangeFilter
        );

        setTimeout(done);
    });

    describe('validateRange', function() {
        describe('when min is > max', function() {
            beforeEach(function() {
                renderedComponent.setState(
                    {
                        minValue: 2,
                        maxValue: 1
                    },
                    renderedComponent._validateRange
                );
            });

            it('should set minValue to equal maxValue', function() {
                expect(renderedComponent.state.minValue).toEqual(1);
            });

            it('should not change maxValue', function() {
                expect(renderedComponent.state.maxValue).toEqual(1);
            });
        });

        describe('when min is < max', function() {
            beforeEach(function() {
                renderedComponent.setState(
                    {
                        minValue: 1,
                        maxValue: 2
                    },
                    renderedComponent._validateRange
                );
            });

            it('should not change minValue', function() {
                expect(renderedComponent.state.minValue).toEqual(1);
            });

            it('should not change maxValue', function() {
                expect(renderedComponent.state.maxValue).toEqual(2);
            });
        });

        describe('when min is = max', function() {
            beforeEach(function() {
                renderedComponent.setState(
                    {
                        minValue: 1,
                        maxValue: 1
                    },
                    renderedComponent._validateRange
                );
            });

            it('should not change minValue', function() {
                expect(renderedComponent.state.minValue).toEqual(1);
            });

            it('should not change maxValue', function() {
                expect(renderedComponent.state.maxValue).toEqual(1);
            });
        });
    });

    describe('changeFilter', function() {
        beforeEach(function() {
            renderedComponent.setState(
                {
                    minValue: 1,
                    maxValue: 2
                },
                renderedComponent._changeFilter
            );
        });

        it('should pass a dummy event to handleFilterChange with formatted parameter', function() {
            expect(param).toEqual('range[1|2|exclude]');
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });
});
