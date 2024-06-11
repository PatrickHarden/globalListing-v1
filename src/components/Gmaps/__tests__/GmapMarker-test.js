var ReactDOM = require('react-dom'),
    React = require('react'),
    GmapMarker = require('../GmapMarker.residential'),
    getAppContext = require('../../../utils/getAppContext');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('GmapMarker component', function() {
    var buildContext = getAppContext(),
        context,
        marker,
        componentInstance,
        renderedComponent,
        markerArray = {
            features: {
                developmentClustering: true
            },
            mapMarkerIcon: '/images/map-marker.png',
            mapMarkerIconInactive: '/images/map-marker_inactive.png',
            mapGroupIcons: [
                {
                    textColor: '#665938',
                    textSize: 10,
                    height: 49,
                    width: 36,
                    url: '/images/map-groupIcon-density1.png',
                    anchorText: [1, 2]
                },
                {
                    textColor: '#665938',
                    textSize: 10,
                    height: 61,
                    width: 46,
                    url: '/images/map-groupIcon-density2.png',
                    anchorText: [3, 4]
                },
                {
                    textColor: '#665938',
                    textSize: 10,
                    height: 73,
                    width: 56,
                    url: '/images/map-groupIcon-density3.png',
                    anchorText: [5, 6]
                }
            ]
        },
        icons = require('../../../constants/DefaultValues').icons,
        getSvgMarker = require('../../../utils/getSvgMarker');

    beforeEach(function() {
        buildContext.stores.ConfigStore.setConfig(markerArray);
        context = {
            stores: buildContext.stores,
            actions: buildContext.actions,
            language: require('../../../config/sample/master/translatables.json')
                .i18n
        };

        shallowRenderer.render(<GmapMarker />, context);

        componentInstance = shallowRenderer._instance._instance;
        renderedComponent = shallowRenderer.getRenderOutput();
    });

    describe('when rendering the component', function() {
        it('should set property on itself containing the icon properties', function() {
            expect(componentInstance.icons).toEqual(icons);
        });
    });

    describe('when no groupSize property is passed', function() {
        describe('when the active property is false or not passed', function() {
            it('should render a single inactive property marker', function() {
                expect(
                    renderedComponent.props.icon.url.endsWith(
                        'map-marker_inactive.png'
                    )
                ).toBe(true);
            });
        });

        describe('when the active property is true', function() {
            it('should render a single active property marker', function() {
                shallowRenderer.render(<GmapMarker active={true} />, context);
                renderedComponent = shallowRenderer.getRenderOutput();
                expect(
                    renderedComponent.props.icon.url.endsWith('map-marker.png')
                ).toBe(true);
            });
        });
    });

    describe('when a groupSize property is passed', function() {
        beforeEach(function() {
            shallowRenderer.render(<GmapMarker groupSize={100} />, context);
            renderedComponent = shallowRenderer.getRenderOutput();
        });

        it('should render an active group marker dependant on the group size', function() {
            const groupIconData = {
                ...icons.mapGroupIcons[1], // density 2 for groupSize 100
                text: '100'
            };
            const renderedSvg =
                'data:image/svg+xml;base64,' +
                window.btoa(getSvgMarker(groupIconData));

            expect(renderedComponent.props.icon.url).toEqual(renderedSvg);
        });
    });

    describe('when exact property is false', function() {
        beforeEach(function() {
            shallowRenderer.render(<GmapMarker exact={false} />, context);
            renderedComponent = shallowRenderer.getRenderOutput();
        });

        it('should render an active group marker with a size of 1', function() {
            const groupIconData = {
                ...icons.mapGroupIcons[0], // density 1 for groupSize 1
                text: '1'
            };
            const renderedSvg =
                'data:image/svg+xml;base64,' +
                window.btoa(getSvgMarker(groupIconData));

            expect(renderedComponent.props.icon.url).toEqual(renderedSvg);
        });
    });

    afterEach(function(done) {
        document.body.innerHTML = '';
        componentInstance = undefined;
        renderedComponent = undefined;
        setTimeout(done);
    });
});
