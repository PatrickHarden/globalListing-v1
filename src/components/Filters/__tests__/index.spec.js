var React = require('react'),
    ReactDOM = require('react-dom'),
    PropTypes = require('prop-types'),
    Filters = require('../index'),
    TestUtils = require('react-dom/test-utils'),
    wrapper = require('../../../../test/stubs/testWrapper');

describe('the Filters component', function() {
    var renderedComponent,
        renderedComponentWithParams,
        filterChange = {
            target: {
                name: 'Common.UsageType',
                value: 'commercial'
            }
        };

    function renderComponent(props) {
        var Wrapped = wrapper(Filters),
            wrappedComponent,
            wrappedComponentWithParams;

        wrappedComponent = TestUtils.renderIntoDocument(
            <Wrapped placement="primary" submitBtn={true} {...props} />
        );

        wrappedComponentWithParams = TestUtils.renderIntoDocument(
            <Wrapped placement="primary" type="auto" {...props} />
        );

        renderedComponent = TestUtils.findRenderedComponentWithType(
            wrappedComponent,
            Filters
        );
        renderedComponentWithParams = TestUtils.findRenderedComponentWithType(
            wrappedComponentWithParams,
            Filters
        );

        renderedComponent.setState({
            loading: false,
            params: {
                Sort: 'desc(lastUpdated)',
                'Common.UsageType': 'residential',
                'Common.Aspects': 'isSale,isLetting'
            },
            locationTypeDefinitions: [
                {
                    name: 'type 1',
                    definitions: [['item 1']],
                    radius: 1
                },
                {
                    name: 'type 2',
                    definitions: [
                        ['item 2'],
                        ['item 3', 'item 4'],
                        ['item 5', 'item 6', 'item 7']
                    ],
                    radius: 2
                },
                {
                    name: 'default',
                    definitions: [],
                    radius: 3
                }
            ]
        });

        renderedComponentWithParams.setState({ loading: false });
    }

    beforeEach(function() {
        renderComponent();
    });

    describe('when rendering the filters', function() {
        it('should get filter values from the param store', function() {
            expect(typeof renderedComponent.state.params).toBe('object');
        });

        it('should render a submit button if the submitBtn param is set to true', function() {
            var submit = TestUtils.scryRenderedDOMComponentsWithTag(
                renderedComponent,
                'a'
            );
            expect(submit.length).toBe(1);
        });

        it('should not render a submit button if the submitBtn param is not set', function() {
            var submit = TestUtils.scryRenderedDOMComponentsWithTag(
                renderedComponentWithParams,
                'a'
            );
            expect(submit.length).toBe(0);
        });
    });

    describe('when rendering a filter with conditional property', function() {
        var renderedFilter,
            filter = {
                name: 'Dynamic.UnderOffer',
                type: 'checkbox',
                placement: 'primary',
                label: 'Include under offer',
                value: 'true,false',
                conditional: {
                    'Common.UsageType': 'commercial'
                }
            };

        describe('when the condition(s) are not met', function() {
            beforeEach(function() {
                renderedFilter = renderedComponent._renderFilter(filter, 1);
            });
            it('should not display the filter', function() {
                expect(renderedFilter).toEqual(undefined);
            });
        });

        describe('when there is a single condition and it is met', function() {
            beforeEach(function() {
                filter.conditional['Common.UsageType'] = 'residential';
                renderedFilter = renderedComponent._renderFilter(filter, 1);
            });
            it('should display the filter', function() {
                expect(renderedFilter).not.toEqual(undefined);
            });
        });

        describe('when there are multiple conditions and all are met', function() {
            beforeEach(function() {
                filter.conditional['Common.UsageType'] = 'residential';
                filter.conditional['Common.Aspects'] = 'isSale';
                renderedFilter = renderedComponent._renderFilter(filter, 1);
            });
            it('should display the filter', function() {
                expect(renderedFilter).not.toEqual(undefined);
            });
        });

        describe('when there are multiple conditions and not all are met', function() {
            beforeEach(function() {
                filter.conditional['Common.UsageType'] = 'residential';
                filter.conditional['Common.Aspects'] = 'test';
                renderedFilter = renderedComponent._renderFilter(filter, 1);
            });
            it('should not display the filter', function() {
                expect(renderedFilter).toEqual(undefined);
            });
        });
    });

    describe('when a filter changes', function() {
        it('should update the state to reflect the change', function() {
            renderedComponent._filterChanged(filterChange);
            expect(renderedComponent.state.params['Common.UsageType']).toEqual(
                'commercial'
            );
        });
    });

    describe('the _getRadius function', function() {
        describe('When passed a type 1 match', function() {
            it('should return 1', function() {
                var radius = renderedComponent._getRadius(['item 1']);
                expect(radius).toBe('1');
            });
        });
        describe('When passed a type 2 match', function() {
            it('should return 2', function() {
                var radius = renderedComponent._getRadius(['item 3', 'item 4']);
                expect(radius).toBe('2');
            });
        });
        describe('When passed a partial type 2 match', function() {
            it('should return 2', function() {
                var radius = renderedComponent._getRadius(['item 5', 'item 7']);
                expect(radius).toBe('2');
            });
        });
        describe('When passed a non match', function() {
            it('should return 2', function() {
                var radius = renderedComponent._getRadius(['item 8']);
                expect(radius).toBe('3');
            });
        });
    });

    describe('the _renderSearchComponent function', function() {
        beforeEach(function() {
            renderComponent({
                view: 'map-list'
            });
        });
        describe('When in nonGeo search mode', function() {
            it('should return a string', function() {
                var searchComponent = renderedComponent._renderSearchComponent(
                    'nonGeo',
                    'London'
                );
                expect(searchComponent.type).toBe('p');
                expect(searchComponent.props.children).toBe('London');
            });
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });
});
