import React from 'react';
import PropTypes from 'prop-types';
import getAppContext from '../../../utils/getAppContext';
import { ListViewTest as ListView } from '../ListView';

var TestUtils = require('react-dom/test-utils');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();
import property from '../../../../test/stubs/processedPropertyStub';
import ReactDOM from 'react-dom';
import ApplyAppContext from '../../../components/ApplyAppContext';
import groupObjects from '../../../utils/groupObjects';
import sinon from 'sinon';
let tmp;

import { IntlProvider } from 'react-intl';

describe('list-map-components /<ListView>', function() {
    let props;
    let context;
    describe('rendering properties', function() {
        const propsArray = [
            JSON.parse(JSON.stringify(property)),
            JSON.parse(JSON.stringify(property)),
            JSON.parse(JSON.stringify(property)),
            JSON.parse(JSON.stringify(property))
        ];
        propsArray[0].Coordinates = {
            lat: 1,
            lon: 2
        };
        const propertyStub = require('../../../../test/stubs/rawPropertyStub');

        beforeEach(function() {
            tmp = window.cbreSiteType;
            window.cbreSiteType = 'residential';
            props = {
                searchType: 'isLetting',
                searchResultsPage: '/',
                language: require('../../../config/sample/master/translatables.json')
                    .i18n,
                spaPath: {
                    path: '/path',
                    subPath: '/subPath'
                },
                siteType: 'residential',
                selectedItems: {
                    group: {},
                    property: {},
                    contact: {}
                },
                isModalOpen: false,
                showContactModal: () => {},
                hideContactModal: () => {},
                siteId: 'xxxsiteidxxxx',
                recaptchaKey: 'xxrecaptchaxx',
                apiUrl: 'xxxapiurlxxx',
                breakpoints: {
                    isMobile: true
                },
                properties: propsArray,
                groupedProperties: groupObjects(propsArray, 'Coordinates'),
                modal: {
                    getModal: () => ({
                        open: false,
                        property: {},
                        contact: {},
                        route: { path: '' }
                    }),
                    addModal: () => {}
                },
                setLiveMarker: () => {},
                favouritesIsActive: true,
                shouldTriggerScroll: false
            };
            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                searchConfig: {},
                language: 'en-GB',
                siteId: 'test',
                features: { useSocialWidgets: false, enhancedMapList: true },
                fullScreenSticky: false
            });
            context.stores.SearchStateStore.setItem('mapState', {
                zoom: 1
            });
            context.language = require('../../../config/sample/master/translatables.json').i18n;
        });

        afterEach(function() {
            window.cbreSiteType = tmp;
            props = undefined;
            context = undefined;
        });

        it('should render a list of single and grouped properties', function() {
            shallowRenderer.render(<ListView {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            let propertyGroups = renderedComponent.props.children;
            expect(propertyGroups.length).toBe(2);
        });

        describe('activate top property', function() {
            it('should be called after mount', function() {
                ListView.activateTopProperty = sinon.spy();
                let wrappedComponent = TestUtils.renderIntoDocument(
                    <IntlProvider locale="en-GB" messages={{}}>
                        <ApplyAppContext passContext={context}>
                            <ListView {...props} />
                        </ApplyAppContext>
                    </IntlProvider>
                );

                let listView = TestUtils.findRenderedComponentWithType(
                    wrappedComponent,
                    ListView
                );
                sinon.stub(
                    listView,
                    'activateTopProperty',
                    listView.activateTopProperty
                );
                sinon.stub(
                    listView,
                    'setLiveMarkerId',
                    listView.setLiveMarkerId
                );
                listView.componentDidMount();
                expect(listView.activateTopProperty.called).toBe(true);
            });
        });

        describe('Carousel', function() {
            it('should render a slick carosuel when isMobile is set via props and isMapView state is true', function() {
                props.renderAsCarousel = true;
                shallowRenderer.render(<ListView {...props} />, context);
                let renderedComponent = shallowRenderer.getRenderOutput();
                let carouselRef =
                    renderedComponent.props.children[0].props.children[0].ref;
                expect(carouselRef).toBe('slickCarousel');
            });

            it('should set some dynamic styles', function() {
                props.renderAsCarousel = true;
                // Calculated form headless browser dimensions and map height fallback.
                let mapHeight = 500;
                let innerPropertyListMarginTop = 363;

                let wrappedComponent = TestUtils.renderIntoDocument(
                    <IntlProvider locale="en-GB" messages={{}}>
                        <ApplyAppContext passContext={context}>
                            <ListView {...props} />
                        </ApplyAppContext>
                    </IntlProvider>
                );

                let listView = TestUtils.findRenderedComponentWithType(
                    wrappedComponent,
                    ListView
                );
                let listViewMarkup = ReactDOM.findDOMNode(listView);
                let hiddenScrollbar = listViewMarkup.querySelector(
                    '.scrollWindow'
                );
                let innerPropertyList = listViewMarkup.querySelector(
                    '.cardGroup'
                );
                if (hiddenScrollbar) {
                    expect(hiddenScrollbar.style.height).toBe(`${mapHeight}px`);
                }
                if (innerPropertyList) {
                    expect(innerPropertyList.style.marginTop).toBe(
                        `${innerPropertyListMarginTop}px`
                    );
                }
            });

            describe('Clear all favorites button', function() {
                let wrapperComponent;
                let renderedComponent;

                beforeEach(function() {
                    context.stores.FavouritesStore.setFavourites(propertyStub);
                    context.stores.FavouritesStore.toggleFavourites(true);

                    wrapperComponent = TestUtils.renderIntoDocument(
                        <IntlProvider locale="en-GB" messages={{}}>
                            <ApplyAppContext passContext={context}>
                                <ListView {...props} />
                            </ApplyAppContext>
                        </IntlProvider>
                    );

                    renderedComponent = TestUtils.findRenderedComponentWithType(
                        wrapperComponent,
                        ListView
                    );

                    spyOn(context.actions, 'clearAllFavourites');
                });

                afterEach(function() {
                    wrapperComponent = undefined;
                    renderedComponent = undefined;
                });

                it('should render a clear all favourites button', function() {
                    const markup = ReactDOM.findDOMNode(renderedComponent);
                    const clearFavouritesButton = markup.querySelector(
                        '.cbre_button__favourites_clear'
                    );
                    expect(
                        clearFavouritesButton.getAttribute('class')
                    ).toContain('cbre_button__favourites_clear');
                });

                it('should call the clearAllFavourites favourites action when clicked.', function() {
                    renderedComponent.clearAllFavourites({
                        preventDefault: () => {}
                    });
                    expect(
                        context.actions.clearAllFavourites
                    ).toHaveBeenCalled();
                });
            });
        });
    });
});
