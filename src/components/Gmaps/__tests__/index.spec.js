var React = require('react'),
    ReactDOM = require('react-dom'),
    Gmap = require('../index'),
    getAppContext = require('../../../utils/getAppContext');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('Gmap component', function () {
    var buildContext = getAppContext(),
        context,
        props = {
            searchType: 'isLetting',
            searchResultsPage: '/',
            properties: [
                {
                    PropertyId: 'GB-ReapIT-cbrrps-BOW160091',
                    ActualAddress: {
                        country: 'GB',
                        line1: 'Gosfield Street',
                        line2: 'Fitzrovia',
                        postcode: 'W1W',
                        locality: 'London'
                    },
                    Highlights: [],
                    Coordinates: {
                        lat: 51.51361,
                        lon: -0.141723
                    },
                    GeoLocation: {
                        exact: null
                    }
                },
                {
                    PropertyId: 'GB-ReapIT-cbrrps-BOW160091',
                    ActualAddress: {
                        country: 'GB',
                        line1: 'Gosfield Street',
                        line2: 'Fitzrovia',
                        postcode: 'W1W',
                        locality: 'London'
                    },
                    Highlights: [],
                    Coordinates: {
                        lat: 51.51361,
                        lon: -0.141723
                    },
                    GeoLocation: {
                        exact: null
                    }
                }
            ]
        },
        componentInstance,
        renderedComponent,
        infoWindowClass = 'cbre-spa--map-info-window',
        carouselInfoWindowClass = 'cbre-spa--map-info-window--carousel';

    var renderedComponent;
    
    describe('render map', function () {
        beforeEach(function() {
            buildContext.stores.ConfigStore.setConfig({});
            context = {
                stores: buildContext.stores,
                actions: buildContext.actions,
                language: require('../../../config/sample/master/translatables.json')
                    .i18n
            };
    
            shallowRenderer.render(<Gmap {...props} />, context);
    
            componentInstance = shallowRenderer._instance._instance;
            renderedComponent = shallowRenderer.getRenderOutput();
        });
    
        it('will render when prerender is false', function() {
            Gmap.__Rewire__('isPrerender', false);
            shallowRenderer.render(<Gmap {...props} />, context);
            renderedComponent = shallowRenderer.getRenderOutput();

            expect(renderedComponent !== undefined).toBe(true);
        });

        it('will not render when prerender is true', function() {
            Gmap.__Rewire__('isPrerender', true);
            shallowRenderer.render(<Gmap {...props} />, context);
            renderedComponent = shallowRenderer.getRenderOutput();

            expect(renderedComponent).toBe(null);
        });

        afterEach(function() {
            document.body.innerHTML = '';
            context = undefined;
            componentInstance = undefined;
            renderedComponent = undefined;
        });
    })
});