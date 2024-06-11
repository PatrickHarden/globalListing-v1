import React from 'react';
import ReactDOM from 'react-dom';
import { ListMapPageTest as ListMapPage } from '../ListMapPage';
import Gmap from '../../../components/Gmaps';
import ListView from '../../ListView/ListView';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import TestUtils from 'react-addons-test-utils';
import property from '../../../../test/stubs/processedPropertyStub';
import sinon from 'sinon';

let shallowRenderer = TestUtils.createRenderer();

import { IntlProvider } from 'react-intl';

describe('ListMapPage', function() {
    describe('when component mounts', function() {
        let context = null;
        let props = null;
        let wrappedComponent = null;
        let renderedComponent = null;
        let listComponent = null;
        let mapComponent = null;

        beforeEach(function() {
            let propertyStub = require('../../../../test/stubs/rawPropertyStub');

            props = {
                location: {
                    pathname: '/',
                    query: {
                        p: 1
                    }
                },
                propertiesHasLoadedOnce: true,
                truncatedProperties: [property, property],
                truncatedGroupedProperties: [],
                propertyCount: 50,
                breakpoints: {
                    isMobile: null,
                    isMobilePortrait: null,
                    isMobileLandscape: null,
                    isMobileLandscapeAndUp: null,
                    isTablet: null,
                    isTabletAndUp: null,
                    isTabletLandscape: null,
                    isTabletLandscapeAndUp: null,
                    isDesktop: null
                },
                config: {
                    urlPropertyAddressFormat: '%(Line1)s-%(Line2)s'
                },
                modal: {
                    getModal: () => ({
                        open: false,
                        property: {},
                        contact: {},
                        route: { path: '' }
                    }),
                    addModal: () => {}
                },
                options: {
                    renderOmissions: {
                        Search: false,
                        Filters: false
                    }
                }
            };

            context = getAppContext();
            context.stores.ParamStore.setParam('page', 2);
            context.stores.ParamStore.setParam('pageSize', 10);
            context.stores.SearchStateStore.setItem('searchType', 'isSale');
            context.stores.SearchStateStore.setItem('mapState', {
                zoom: 1
            });
            context.stores.ConfigStore.setConfig({
                language: 'en-GB',
                countryCode: 'UK',
                siteType: 'uk-resi',
                features: {
                    useSocialWidgets: true
                },
                filters: [
                    {
                        name: 'Sort',
                        type: 'select',
                        label: 'Order results by',
                        placement: 'lm_sortFilter',
                        options: [
                            {
                                value: 'asc(Common.LastUpdated)',
                                label: 'Last updated',
                                default: true
                            },
                            {
                                value: 'asc(Dynamic.SalePrice)',
                                label: 'Sale price (Lowest first)'
                            },
                            {
                                value: 'desc(Dynamic.SalePrice)',
                                label: 'Sale price (Highest first)'
                            },
                            {
                                value: 'asc(_distance)',
                                label: 'Closest'
                            }
                        ]
                    }
                ]
            });
            context.language = require('../../../config/sample/master/translatables.json').i18n;
            context.stores.FavouritesStore.setFavourites(propertyStub);
            context.spaPath = {};

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <ListMapPage {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            renderedComponent = TestUtils.findRenderedComponentWithType(
                wrappedComponent,
                ListMapPage
            );
            listComponent = TestUtils.scryRenderedComponentsWithType(
                renderedComponent,
                ListView
            );
            mapComponent = TestUtils.scryRenderedComponentsWithType(
                renderedComponent,
                Gmap
            );
        });

        afterEach(function() {
            window.cbreSiteType = undefined;
            props = undefined;
            context = undefined;
            wrappedComponent = null;
            renderedComponent = null;
            listComponent = null;
            mapComponent = null;
        });

        it('should render a favourites count when favourites is active', function() {
            props.favouritesIsActive = true;

            let wrapperComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <ListMapPage {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            renderedComponent = TestUtils.findRenderedComponentWithType(
                wrapperComponent,
                ListMapPage
            );
            const markup = ReactDOM.findDOMNode(renderedComponent);
            const truncatedString = markup.querySelector('.favourites-count');
            expect(truncatedString.textContent).toContain('50 favourites');
        });

        xit('should render a loading component when loading props are set', function() {
            props.isLoading = true;
            props.properties = [];
            props.propertiesHasLoadedOnce = false;

            const component = shallowRenderer.render(
                <ListMapPage {...props} />,
                context
            );
            const loaderComponenet =
                component.props.children[1].props.children[1].props.children[1];

            expect(loaderComponenet.props.className).toContain('card-loader');
        });

        it('should contain a wrapper class for altering page', function() {
            const element = ReactDOM.findDOMNode(renderedComponent);
            expect(element.getAttribute('class')).toContain('main plp');
        });

        xit('should render a carousel class when on mobile and activeTab state is map', function() {
            const responsiveProps = {
                breakpoints: {
                    isMobile: true
                }
            };

            let wrapperComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <ListMapPage {...props} {...responsiveProps} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            renderedComponent = TestUtils.findRenderedComponentWithType(
                wrapperComponent,
                ListMapPage
            );
            renderedComponent.setState({ activeTab: 'map' });
            const markup = ReactDOM.findDOMNode(renderedComponent);
            const carouselNode = markup.getElementsByClassName('carousel');
            expect(carouselNode.length).not.toBe(null);
        });

        it('should contain a wrapper class for altering page', function() {
            const element = ReactDOM.findDOMNode(renderedComponent);
            expect(element.getAttribute('class')).toContain('main plp');
        });

        it('should render the list component', function() {
            expect(listComponent.length).toBe(1);
        });

        it('should render the map component', function() {
            expect(mapComponent.length).toBe(1);
        });

        describe('the setMapState function', function() {
            it('should update the searchStateStore with the passed in mapState', function() {
                renderedComponent.setMapState({
                    zoom: 2
                });
                expect(
                    context.stores.SearchStateStore.getItem('mapState')
                ).toEqual({
                    zoom: 2
                });
            });
            it('should merge new mapState with existing mapState', function() {
                renderedComponent.setMapState({
                    centre: 1
                });
                expect(
                    context.stores.SearchStateStore.getItem('mapState')
                ).toEqual({
                    zoom: 1,
                    centre: 1
                });
            });
        });

        describe('properties truncation', function() {
            it('should render a PropertiesTruncated string when propertyCount < 100', function() {
                props.propertyCount = 300;

                let wrapperComponent = TestUtils.renderIntoDocument(
                    <IntlProvider locale="en-GB" messages={{}}>
                        <ApplyAppContext passContext={context}>
                            <ListMapPage {...props} />
                        </ApplyAppContext>
                    </IntlProvider>
                );

                renderedComponent = TestUtils.findRenderedComponentWithType(
                    wrapperComponent,
                    ListMapPage
                );
                const markup = ReactDOM.findDOMNode(renderedComponent);
                const truncatedString = markup.querySelector(
                    '.propertiesTruncated'
                );
                expect(truncatedString.textContent).toContain(
                    'Showing 100 of 300 matching Properties for sale'
                );
            });
        });

        describe('the setSelectedItems function', function() {
            let state;
            const selectedItems = {
                group: 'group',
                property: { prop: 'prop' },
                disableScroll: false,
                scrollToProperty: 'property',
                contact: {},
                marker: null
            };
            beforeEach(function(done) {
                state = Object.assign({}, renderedComponent.state);
                delete state.selectedItems;
                renderedComponent.setSelectedItems(selectedItems, done);
            });
            it('should update the component state with the passed in items', function() {
                expect(renderedComponent.state.selectedItems).toEqual(
                    selectedItems
                );
            });
            it('should leave the rest of state untouched', function() {
                expect(renderedComponent.state).toEqual(
                    Object.assign({}, state, { selectedItems: selectedItems })
                );
            });
            it('should pass the selected items props down to ListView', function() {
                expect(listComponent[0].props.selectedItems).toEqual(
                    selectedItems
                );
            });
        });

        describe('the propertyLinkClickHandler function', function() {
            beforeEach(function() {
                renderedComponent.propertyLinkClickHandler(
                    {
                        lat: 1,
                        lon: 0
                    },
                    3
                );
            });
            it('should update the searchStateStore with the passed in coordinates', function() {
                expect(
                    context.stores.SearchStateStore.getItem('mapState')
                ).toEqual({
                    zoom: 1,
                    centre: {
                        lat: 1,
                        lng: 0
                    }
                });
            });
            it('should update the propertyStore with selected properties position in the entire property array', function() {
                // (page * pageSize) - pageSize + (index + 1)
                expect(
                    context.stores.PropertyStore.getCurrentPropertyIndex()
                ).toBe(14);
            });
            it('should update the paramStore with current search context path', function() {
                expect(context.stores.ParamStore.getSearchContext()).toEqual({
                    path: '/',
                    query: {
                        p: 1
                    }
                });
            });
        });
    });
});
