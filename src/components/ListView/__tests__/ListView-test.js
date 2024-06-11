var ListView = require('../index')._ListView;
var React = require('react');
var ReactDOM = require('react-dom');
var wrapper = require('../../../../test/stubs/testWrapper');
var getAppContext = require('../../../utils/getAppContext');

var TestUtils = require('react-dom/test-utils');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('ListView component', function() {
    describe('rendering properties', function() {
        beforeEach(function() {
            window.cbreSiteType = 'residential';
            this.props = {
                searchType: 'isLetting',
                searchResultsPage: '/',
                groupedProperties: []
            };

            this.context = {
                language: require('../../../config/sample/master/translatables.json')
                    .i18n
            };
        });

        afterEach(function() {
            window.cbreSiteType = undefined;
            this.props = undefined;
            this.context = undefined;
        });

        it('should render a list of properties', function() {
            this.props.properties = [
                {
                    PropertyId: 'GB-ReapIT-cbrrps-BOW160091',
                    ActualAddress: {
                        country: 'GB',
                        line1: 'Gosfield Street',
                        line2: 'Fitzrovia',
                        postcode: 'W1W',
                        locality: 'London'
                    },
                    Highlights: []
                }
            ];

            shallowRenderer.render(<ListView {...this.props} />, this.context);
            var renderedComponent = shallowRenderer.getRenderOutput();
            var children = renderedComponent.props.children.props.children;
            var listItems = children[0].props.children;

            expect(children && children.length > 0).toBe(true);
            expect(children[0].type === 'ul').toBe(true);
            expect(listItems.length === 1).toBe(true);
            expect(
                listItems[0].props.children.props.property ===
                    this.props.properties[0]
            );
        });

        it('should return an Empty View Error if no properties are given', function() {
            shallowRenderer.render(<ListView {...this.props} />, this.context);
            var renderedComponent = shallowRenderer.getRenderOutput();
            var childrenElements = renderedComponent.props.children;
            var title = renderedComponent.props.title;
            var subTitle = childrenElements[0].props.children;
            var paragraph = childrenElements[1].props.children;

            var contextTitle = 'No results';
            var contextSubTitle =
                'We are sorry, there is nothing that matches your exact requirements.';
            var contextParagraph =
                'Please try a different search using the search options on the left.';

            expect(title).toBe(contextTitle);
            expect(subTitle).toBe(contextSubTitle);
            expect(paragraph).toBe(contextParagraph);
        });
    });

    describe('render meta tags', function() {
        var context = getAppContext();
        var Wrapped = wrapper(ListView, context);

        beforeEach(function() {
            window.cbreSiteType = 'residential';
            context.stores.SearchStateStore.setItem(
                'searchLocationName',
                'Magic Land, London'
            );

            this.props = {
                searchType: 'isLetting',
                spaPath: {
                    path: ''
                }
            };

            this.pathname = window.location.pathname;
            this.queryForCanonical = '?aspects=isLetting';
            this.testUrl =
                window.location.pathname +
                this.queryForCanonical +
                '&anotherParam=12345';
            window.history.pushState(null, null, this.testUrl);
        });

        afterEach(function() {
            window.cbreSiteType = undefined;
            this.props = undefined;
            this.renderedComponent = undefined;

            window.history.pushState(null, null, this.pathname);
            this.pathname = undefined;
            this.queryForCanonical = undefined;
            this.testUrl = undefined;
        });

        describe('returned object property: title', function() {
            it('should set the title to RENT when in letting mode', function() {
                this.props.searchType = 'isLetting';
                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                expect(window.title).toBe(
                    'Properties to Rent in Magic Land, London - CBRE Residential'
                );
            });

            it('should set the title to SALE when in letting mode', function() {
                this.props.searchType = 'isSale';
                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                expect(window.title).toBe(
                    'Properties for Sale in Magic Land, London - CBRE Residential'
                );
            });

            it('should update title with the location searched for', function() {
                context.stores.SearchStateStore.setItem(
                    'searchLocationName',
                    'Magicton, Plumpinshire'
                );

                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                expect(window.title).toBe(
                    'Properties to Rent in Magicton, Plumpinshire - CBRE Residential'
                );
            });

            it('should say PROPERTIES when property sub type is not defined', function() {
                context.stores.ParamStore.setParam('propertySubType', null);
                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                expect(window.title).toBe(
                    'Properties to Rent in Magic Land, London - CBRE Residential'
                );
            });

            it('should say the property type when a single property sub type is defined', function() {
                context.stores.ParamStore.setParam('propertySubType', 'Office');
                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                expect(window.title).toBe(
                    'Offices to Rent in Magic Land, London - CBRE Residential'
                );
            });

            it('should say PROPERTIES when many property sub types are defined', function() {
                context.stores.ParamStore.setParam(
                    'propertySubType',
                    'Office,Warehouse'
                );
                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                expect(window.title).toBe(
                    'Properties to Rent in Magic Land, London - CBRE Residential'
                );
            });
        });

        describe('meta canonical', function() {
            it('should return a stripped down canonical link', function() {
                this.props.searchType = 'isLetting';
                this.renderedComponent = TestUtils.renderIntoDocument(
                    <Wrapped {...this.props} />
                );
                var loc = window.location;
                var url =
                    loc.protocol +
                    '//' +
                    loc.host +
                    loc.pathname +
                    this.queryForCanonical;
                expect(
                    document
                        .querySelector('link[rel="canonical"]')
                        .getAttribute('href')
                ).toBe(url);
            });
        });
    });
});
