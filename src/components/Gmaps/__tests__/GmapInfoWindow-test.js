var ReactDOM = require('react-dom'),
    React = require('react'),
    GmapInfoWindow = require('../GmapInfoWindow'),
    getAppContext = require('../../../utils/getAppContext'),
    _property = require('../../../../test/stubs/processedPropertyStub');

import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('GmapMarker component', function() {
    var buildContext = getAppContext(),
        context,
        props = {
            searchType: 'isSale',
            carouselWindow: false,
            itemIndex: 1,
            properties: _property,
            searchResultsPage: '/'
        },
        componentInstance,
        renderedComponent,
        infoWindowClass = 'cbre-spa--map-info-window',
        carouselInfoWindowClass = 'cbre-spa--map-info-window--carousel';

    beforeEach(function() {
        buildContext.stores.ConfigStore.setConfig({});
        context = {
            stores: buildContext.stores,
            actions: buildContext.actions,
            language: require('../../../config/sample/master/translatables.json')
                .i18n
        };

        shallowRenderer.render(<GmapInfoWindow {...props} />, context);

        componentInstance = shallowRenderer._instance._instance;
        renderedComponent = shallowRenderer.getRenderOutput();
    });

    describe('when rendering the component', function() {
        it('should initially set windowReady to false', function() {
            expect(componentInstance.state.windowReady).toBe(false);
        });

        it('should create an infowindow component which inherits the parent props', function() {
            expect(renderedComponent.props).toEqual(
                jasmine.objectContaining(props)
            );
        });

        it('should render a child div with class', function() {
            expect(renderedComponent.props.children.props.className).toBe(
                infoWindowClass
            );
        });

        describe('when the viewing browser is IE', function() {
            it('should render an infowindow component', function() {
                GmapInfoWindow.__Rewire__('isIE', true);
                shallowRenderer.render(<GmapInfoWindow {...props} />, context);
                renderedComponent = shallowRenderer.getRenderOutput();
                expect(renderedComponent.type.name).toBe('InfoWindow');
            });
        });

        describe('when the viewing browser is not IE', function() {
            it('should render an infowindow component', function() {
                GmapInfoWindow.__Rewire__('isIE', false);
                shallowRenderer.render(<GmapInfoWindow {...props} />, context);
                renderedComponent = shallowRenderer.getRenderOutput();
                expect(renderedComponent.type.name).toBe('InfoBox');
            });
        });

        describe('when the carouselWindow prop is true', function() {
            it('should render a child div with additional class', function() {
                props.carouselWindow = true;
                shallowRenderer.render(<GmapInfoWindow {...props} />, context);
                renderedComponent = shallowRenderer.getRenderOutput();
                expect(renderedComponent.props.children.props.className).toBe(
                    infoWindowClass + ' ' + carouselInfoWindowClass
                );
            });
        });

        describe('when the carouselWindow component is ready', function() {
            beforeEach(function() {
                componentInstance._windowReady();
            });

            it('should set windowReady to true', function() {
                expect(componentInstance.state.windowReady).toBe(true);
            });
        });
    });

    afterEach(function() {
        document.body.innerHTML = '';
        context = undefined;
        componentInstance = undefined;
        renderedComponent = undefined;
    });
});
