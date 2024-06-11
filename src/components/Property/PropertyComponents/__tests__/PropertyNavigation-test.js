var React = require('react'),
    ReactDOM = require('react-dom'),
    getAppContext = require('../../../../utils/getAppContext'),
    PropertyNavigation = require('../PropertyNavigation').default,
    wrapper = require('../../../../../test/stubs/testWrapper'),
    TestUtils = require('react-addons-test-utils');
var queryParams = require('../../../../utils/queryParams');

describe('Component', function() {
    describe('<PropertyNavigation />', function() {
        describe('when rendering the component', function() {
            var renderedComponent,
                searchContext = {},
                propStore,
                context = getAppContext(),
                constructedSearchContext,
                defaultProps = { postcode: 'SW8', country: 'GB' },
                renderComponent = function(
                    propIndex,
                    searchContext,
                    done,
                    props
                ) {
                    props = props || defaultProps;
                    context.stores.ParamStore.setSearchContext(searchContext);
                    context.stores.PropertyStore.setTotalResults(10);
                    context.stores.PropertyStore.setCurrentPropertyIndex(
                        propIndex
                    );

                    var Wrapped = wrapper(PropertyNavigation, context),
                        wrappedComponent;

                    wrappedComponent = TestUtils.renderIntoDocument(
                        <Wrapped address={props} location={{}} />
                    );

                    renderedComponent = TestUtils.findRenderedComponentWithType(
                        wrappedComponent,
                        PropertyNavigation
                    );

                    setInterval(function() {
                        if (!renderedComponent.state.loading) {
                            done();
                        }
                    }, 250);
                };

            beforeEach(function(done) {
                renderComponent(10, null, done);
            });

            describe('when there is no search context', function() {
                // it('should perform a lookup against the defined address segment', function() {
                //   expect(renderedComponent.state.searchContext).not.toBeNull();
                // });

                describe('when the places lookup is successful', function() {
                    describe('but does not return a formatted_address', function() {
                        it('should return a null searchContext', function() {
                            constructedSearchContext = renderedComponent.createSearchContext(
                                {},
                                {}
                            );
                            expect(constructedSearchContext).toBeNull();
                        });
                    });

                    describe('and returns a formatted_address', function() {
                        it('should construct a searchContext in the form of a query string and all expected values should be present', function() {
                            constructedSearchContext = renderedComponent.createSearchContext(
                                {
                                    query: {
                                        view: 'isLetting'
                                    }
                                },
                                {
                                    gmaps: {
                                        formatted_address: 'SE1'
                                    },
                                    location: {
                                        lat: 0,
                                        lng: 0
                                    }
                                }
                            );
                            expect(constructedSearchContext).toContain(
                                'location'
                            );
                            expect(constructedSearchContext).toContain(
                                'radius'
                            );
                            expect(constructedSearchContext).toContain('Sort');
                            expect(constructedSearchContext).toContain(
                                'aspects'
                            );
                        });

                        describe('but there is no type context', function() {
                            it('should construct a query string without a view property', function() {
                                constructedSearchContext = renderedComponent.createSearchContext(
                                    {},
                                    {
                                        gmaps: {
                                            formatted_address: 'SE1'
                                        }
                                    }
                                );
                                expect(constructedSearchContext).not.toContain(
                                    'aspects'
                                );
                            });
                        });
                    });
                });

                it('should render a single back link', function() {
                    var button = TestUtils.scryRenderedDOMComponentsWithTag(
                        renderedComponent,
                        'a'
                    );
                    expect(button.length).toBe(1);
                });

                describe('when the places lookup is not successful', function() {
                    beforeEach(function(done) {
                        renderComponent(10, null, done, {
                            postcode: 'thisisnotapostcode'
                        });
                    });

                    it('the created search context should remain null', function() {
                        expect(
                            renderedComponent.state.searchContext
                        ).toBeNull();
                    });
                });
            });

            describe('when there is search context', function() {
                describe('when there are no previous properties', function() {
                    beforeEach(function(done) {
                        renderComponent(0, searchContext, done);
                    });

                    it('should render 1 navigation button', function() {
                        var button = TestUtils.scryRenderedDOMComponentsWithTag(
                            renderedComponent,
                            'a'
                        );
                        // There's 2 <a> objects, one is the back link
                        expect(button.length).toBe(2);
                    });
                });

                describe('when there are no further properties', function() {
                    beforeEach(function(done) {
                        renderComponent(10, searchContext, done);
                    });

                    it('should render 1 navigation button', function() {
                        var button = TestUtils.scryRenderedDOMComponentsWithTag(
                            renderedComponent,
                            'a'
                        );
                        expect(button.length).toBe(2);
                    });
                });

                describe('when there are both previous and next properties', function() {
                    beforeEach(function(done) {
                        renderComponent(2, searchContext, done);
                    });

                    it('should render 2 navigation buttons', function() {
                        var button = TestUtils.scryRenderedDOMComponentsWithTag(
                            renderedComponent,
                            'a'
                        );
                        // There's 3 <a> objects one is the back link, the other 2 prev/next
                        expect(button.length).toBe(3);
                    });
                });

                describe('when the homeUri prop is passed', function() {
                    it('should render the home link as with the passed URI as href', function() {
                        var context = getAppContext();

                        context.stores.ParamStore.setSearchContext({});
                        context.stores.PropertyStore.setTotalResults(10);
                        context.stores.PropertyStore.setCurrentPropertyIndex(0);

                        var Wrapped = wrapper(PropertyNavigation, context),
                            wrappedComponent;

                        wrappedComponent = TestUtils.renderIntoDocument(
                            <Wrapped
                                address={{ postcode: 'SW8', country: 'GB' }}
                                location={{}}
                                useBreadcrumb={true}
                                homeUri="/foo"
                            />
                        );

                        var buttons = TestUtils.scryRenderedDOMComponentsWithTag(
                            wrappedComponent,
                            'a'
                        );

                        expect(buttons[1].href).toContain('/foo');
                    });
                });
            });

            afterEach(function(done) {
                ReactDOM.unmountComponentAtNode(document.body);
                document.body.innerHTML = '';
                setTimeout(done);
            });
        });
    });
});
