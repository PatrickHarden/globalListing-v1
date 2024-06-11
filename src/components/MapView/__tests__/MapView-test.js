var MapView = require('../index')._MapView;
var React = require('react');
var ReactDOM = require('react-dom');
var wrapper = require('../../../../test/stubs/testWrapper');
var getAppContext = require('../../../utils/getAppContext');
var APIMapping = require('../../../constants/APIMapping.js');
import TestUtils from 'react-dom/test-utils';
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('MapView component', function() {
    beforeEach(function() {
        window.cbreSiteType = 'commercial';
        this.props = {
            searchType: 'isLetting',
            searchResultsPage: '/'
        };
        this.context = {
            language: require('../../../config/sample/master/translatables.json')
                .i18n
        };

        this.pathname = window.location.pathname;
        this.queryForCanonical = '?aspects=isLetting';
        this.pathResults = '/results';
        this.pathMap = '/map';
        this.testUrl =
            this.pathResults +
            this.pathMap +
            this.queryForCanonical +
            '&anotherParam=12345';
        window.history.pushState(null, null, this.testUrl);
    });

    afterEach(function() {
        window.cbreSiteType = undefined;
        this.props = undefined;
        this.context = undefined;

        window.history.pushState(null, null, this.pathname);
        this.pathname = undefined;
        this.queryForCanonical = undefined;
        this.testUrl = undefined;
        this.pathResults = undefined;
        this.pathMap = undefined;
    });

    describe('When rendering a map view', function() {
        it('should render a Map with passed through properties', function() {
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

            shallowRenderer.render(<MapView {...this.props} />, this.context);
            var renderedComponent = shallowRenderer.getRenderOutput();
            var gmapComponent = renderedComponent.props.children.props.children;
            // TODO: expect(gmapComponent.type.displayName).toBe('Gmap');
            expect(gmapComponent.props.properties).toBe(this.props.properties);
        });

        it('should return an Empty View Error if no properties are given', function() {
            shallowRenderer.render(<MapView {...this.props} />, this.context);
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

        it('should build meta tags', function() {
            var context = Object.assign({}, getAppContext());
            var Wrapped = wrapper(MapView, context);

            context.stores.SearchStateStore.setItem(
                'searchLocationName',
                'Smurf Town, Manchester'
            );

            this.renderedComponent = TestUtils.renderIntoDocument(
                <Wrapped {...this.props} />
            );

            expect(window.title).toBe(
                'Properties to Rent in Smurf Town, Manchester - CBRE Commercial'
            );
        });
    });

    describe('meta canonical', function() {
        it('should return a stripped down canonical link', function() {
            var context = Object.assign({}, getAppContext());
            var Wrapped = wrapper(MapView, context);
            this.props.searchType = 'isLetting';
            this.renderedComponent = TestUtils.renderIntoDocument(
                <Wrapped {...this.props} />
            );
            var loc = window.location;
            var url =
                loc.protocol +
                '//' +
                loc.host +
                this.pathResults +
                this.queryForCanonical;
            expect(
                document
                    .querySelector('link[rel="canonical"]')
                    .getAttribute('href')
            ).toBe(url);
        });
    });
});
