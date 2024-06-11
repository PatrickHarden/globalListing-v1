var React = require('react');
var ReactDOM = require('react-dom');
var getAppContext = require('../../utils/getAppContext');
var APIMapping = require('../../constants/APIMapping.js');
var TestUtils = require('react-dom/test-utils');
var propertiesContainer = require('../propertiesContainer');
var wrapper = require('../../../test/stubs/testWrapper');
var ActionTypes = require('../../constants/ActionTypes');
var DefaultValues = require('../../constants/DefaultValues');

import propertyStub from '../../../test/stubs/rawPropertyStub';

describe('propertiesContainer', function() {
    let context;

    beforeEach(function() {
        context = getAppContext();
        context.stores.ParamStore.setParam('aspects', 'isSale');
        window.cbreSiteType = 'commercial';
    });

    afterEach(function() {
        context = undefined;
        window.cbreSiteType = undefined;
    });

    describe('When updating the Favourites store', function() {
        it('should render a property from the Favourites store, set favourites state and propertyCount', function(done) {
            const FavouritesStore = context.stores.FavouritesStore;
            FavouritesStore.setFavourites(propertyStub);
            FavouritesStore.toggleFavourites(true);

            class MockComponent extends React.Component {
                render() {
                    return React.createElement('div');
                }
            }

            const Component = propertiesContainer(MockComponent, {
                hideLoadingState: true
            });
            const Wrapped = wrapper(Component, context);
            const renderedOutput = TestUtils.renderIntoDocument(<Wrapped />);
            const container = TestUtils.findRenderedComponentWithType(
                renderedOutput,
                Component
            );

            setTimeout(() => {
                expect(container.state.favouritesIsActive).toBe(true);
                expect(container.state.propertyCount).toBe(1);
                expect(container.state.properties[0].PropertyId).toBe(
                    'GB_Plus_27880'
                );
                done();
            });
        });

        it(`should ignore properties without matching 'aspects' value`, function(done) {
            const FavouritesStore = context.stores.FavouritesStore;
            context.stores.ParamStore.setParam('aspects', 'isLetting');
            FavouritesStore.setFavourites(propertyStub);
            FavouritesStore.toggleFavourites(true);

            class MockComponent extends React.Component {
                render() {
                    return React.createElement('div');
                }
            }

            const Component = propertiesContainer(MockComponent, {
                hideLoadingState: true
            });
            const Wrapped = wrapper(Component, context);
            const renderedOutput = TestUtils.renderIntoDocument(<Wrapped />);
            const container = TestUtils.findRenderedComponentWithType(
                renderedOutput,
                Component
            );

            setTimeout(() => {
                expect(container.state.favouritesIsActive).toBe(true);
                expect(container.state.propertyCount).toBe(0);
                done();
            });
        });

        it('should not be overriden if propertyStore is updated', function(done) {
            const PropertyStore = context.stores.PropertyStore;
            const FavouritesStore = context.stores.FavouritesStore;

            FavouritesStore.setFavourites(propertyStub);
            FavouritesStore.toggleFavourites(true);
            PropertyStore.setProperties(propertyStub);

            class MockComponent extends React.Component {
                render() {
                    return React.createElement('div');
                }
            }

            const Component = propertiesContainer(MockComponent, {
                hideLoadingState: true
            });
            const Wrapped = wrapper(Component, context);
            const renderedOutput = TestUtils.renderIntoDocument(<Wrapped />);
            const container = TestUtils.findRenderedComponentWithType(
                renderedOutput,
                Component
            );

            setTimeout(() => {
                expect(container.state.favouritesIsActive).toBe(true);
                done();
            });
        });
    });

    describe('When updating the PropertyStore', function() {
        it('should update its state', function(done) {
            var properties = {
                Documents: [
                    [
                        {
                            'Common.PrimaryKey': 'GB-ReapIT-cbrrps-BOW160091',
                            'Common.ActualAddress': {
                                'Common.Country': 'GB',
                                'Common.Line1': 'Gosfield Street',
                                'Common.Line2': 'Fitzrovia',
                                'Common.PostCode': 'W1W'
                            },
                            Highlights: []
                        }
                    ]
                ],
                DocumentCount: 1
            };

            class MockComponent extends React.Component {
                componentDidMount() {
                    expect(this.props.propertyCount).toBe(1);
                    expect(this.props.properties.length).toBe(1);
                    expect(container.state.propertiesHasLoadedOnce).toBe(true);

                    var property = this.props.properties[0];

                    expect(property.PropertyId).toBe(
                        'GB-ReapIT-cbrrps-BOW160091'
                    );
                    expect(property.ActualAddress.line1).toBe(
                        'Gosfield Street'
                    );
                    done();
                }

                render() {
                    return React.createElement('div');
                }
            }

            var Component = propertiesContainer(MockComponent, {
                hideLoadingState: true
            });
            var Wrapped = wrapper(Component, context);

            var renderedOutput = TestUtils.renderIntoDocument(<Wrapped />);

            var container = TestUtils.findRenderedComponentWithType(
                renderedOutput,
                Component
            );

            expect(container.state.propertiesHasLoadedOnce).toBe(false);
            expect(Array.isArray(container.state.properties)).toBe(true);

            context.dispatcher.dispatch({ type: ActionTypes.LOADING_API });
            context.dispatcher.dispatch({
                type: ActionTypes.GET_PROPERTIES,
                data: properties
            });
        });
    });

    describe('WHEN passing properties', function() {
        describe('AND a propeties map "propertiesMap"', function() {
            it('should merge with the PropertiesStores defaults', function() {
                var defaultMapArray = DefaultValues.defaultPropertiesMap;

                class MockComponent extends React.Component {
                    render() {
                        return React.createElement('div');
                    }
                }

                var extraMappings = [
                    APIMapping.Highlights._key,
                    APIMapping.Walkthrough,
                    APIMapping.ContactGroup._key
                ];

                var Component = propertiesContainer(MockComponent, {
                    loadOnMount: true,
                    propertiesMap: extraMappings
                });
                var Wrapped = wrapper(Component, context);

                spyOn(context.actions, 'updatePropertiesMap').and.callFake(
                    function(maps) {
                        expect(maps).toBe(extraMappings);
                        context.dispatcher.dispatch({
                            type: ActionTypes.UPDATE_PROPERTIES_MAP,
                            payload: extraMappings
                        });
                    }
                );

                spyOn(context.actions, 'updateProperties').and.callFake(
                    function(params, fetchAll, propertiesMap) {
                        expect(propertiesMap.length).toBe(
                            defaultMapArray.length + extraMappings.length
                        );
                    }
                );

                TestUtils.renderIntoDocument(<Wrapped />);
            });
        });

        describe('when isLoading state is set to true', function() {
            it('the component should render a spinner', function(done) {
                class MockComponent extends React.Component {
                    render() {
                        return React.createElement('div');
                    }
                }

                var Component = propertiesContainer(MockComponent);
                var Wrapped = wrapper(Component, context);

                var rendered = TestUtils.renderIntoDocument(<Wrapped />);

                var container = TestUtils.findRenderedComponentWithType(
                    rendered,
                    Component
                );

                container.setState(
                    {
                        propertiesHasLoadedOnce: true,
                        isLoading: true
                    },
                    function() {
                        var el = ReactDOM.findDOMNode(container);
                        expect(el.getAttribute('class')).toContain(
                            'react-spinner'
                        );
                        done();
                    }
                );
            });
        });

        describe('loadOnMount', function() {
            it('should call actions', function() {
                class MockComponent extends React.Component {
                    render() {
                        return React.createElement('div');
                    }
                }

                var Component = propertiesContainer(MockComponent, {
                    loadOnMount: true,
                    fetchAllProperties: true
                });
                var Wrapped = wrapper(Component, context);

                spyOn(context.actions, 'updateFetchMode');
                spyOn(context.actions, 'updatePropertiesMap');
                spyOn(context.actions, 'updateProperties');

                TestUtils.renderIntoDocument(<Wrapped />);

                expect(context.actions.updatePropertiesMap.calls.count()).toBe(
                    1
                );
                expect(context.actions.updateFetchMode.calls.count()).toBe(1);
                expect(
                    context.actions.updateFetchMode.calls.mostRecent().args[0]
                ).toBe(true);
                expect(context.actions.updateProperties.calls.count()).toBe(1);
            });
        });
    });

    describe('When container is unmounting', function() {
        it('should call onChange and off events on stores', function() {
            var divEl = document.createElement('div');
            var body = document.getElementsByTagName('body')[0];

            body.appendChild(divEl);
            var stores = context.stores;
            var ApplicationStore = stores.ApplicationStore;
            var PropertyStore = stores.PropertyStore;

            spyOn(ApplicationStore, 'onChange');
            spyOn(PropertyStore, 'onChange');
            spyOn(ApplicationStore, 'off');
            spyOn(PropertyStore, 'off');

            class MockComponent extends React.Component {
                render() {
                    return React.createElement('div');
                }
            }

            var Component = propertiesContainer(MockComponent);
            var Wrapped = wrapper(Component, context);

            ReactDOM.render(<Wrapped />, divEl);
            ReactDOM.unmountComponentAtNode(divEl);
            body.removeChild(divEl);

            expect(ApplicationStore.onChange.calls.count()).toBe(3);
            expect(ApplicationStore.off.calls.count()).toBe(3);
            expect(PropertyStore.onChange.calls.count()).toBe(1);
            expect(PropertyStore.off.calls.count()).toBe(1);
        });
    });
});
