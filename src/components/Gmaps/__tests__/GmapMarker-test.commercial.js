var ReactDOM = require('react-dom'),
    React = require('react'),
    GmapMarker = require('../GmapMarker.commercial'),
    getAppContext = require('../../../utils/getAppContext');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();



describe('GmapMarker component', function() {
    const icons =  {
        mapMarkerIcon: {
            textColor: '#00a657',
            textSize: 10,
            height: 35,
            width: 29,
            svg:
                '<image id="map-marker" x="0" y="0" width="29" height="35" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgPGcgaWQ9IlN5bWJvbHMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPiAgICAgICAgPGcgaWQ9Ik1pc2MvTWFwL1BpbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwLjAwMDAwMCwgLTYuMDAwMDAwKSIgZmlsbD0iIzAwNkE0RCI+ICAgICAgICAgICAgPHBhdGggZD0iTTMyLDU5IEMxNy4zMzMzMzMzLDQ2LjQzMzUwOTcgMTAsMzYuMTAwMTc2MyAxMCwyOCBDMTAsMTUuODQ5NzM1NSAxOS44NDk3MzU1LDYgMzIsNiBDNDQuMTUwMjY0NSw2IDU0LDE1Ljg0OTczNTUgNTQsMjggQzU0LDM2LjEwMDE3NjMgNDYuNjY2NjY2Nyw0Ni40MzM1MDk3IDMyLDU5IFogTTMyLDM5IEMzOC4wNzUxMzIyLDM5IDQzLDM0LjA3NTEzMjIgNDMsMjggQzQzLDIxLjkyNDg2NzggMzguMDc1MTMyMiwxNyAzMiwxNyBDMjUuOTI0ODY3OCwxNyAyMSwyMS45MjQ4Njc4IDIxLDI4IEMyMSwzNC4wNzUxMzIyIDI1LjkyNDg2NzgsMzkgMzIsMzkgWiIgaWQ9Im1hcC1waW4iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
            anchorText: [-20, 0],
            offset: [0, -5],
            backgroundPosition: '0 -14px'
        },
        mapMarkerIconInactive: {
            textColor: '#00a657',
            textSize: 10,
            height: 35,
            width: 29,
            svg:
                '<image id="map-marker_inactive" x="0" y="0" width="29" height="35" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAlCAYAAABcZvm2AAAB80lEQVRYw72WMUvDQBTHO3ft7Nq5s2ubbF0cKm3FgojgJkgnHRxE0CVb8Tbp0kaogwrioOigQx3qoINQ6mDa2sXFDxDvBe9o2tzL3eU08Cfk8t775e7evZdUSuJabuez1ZaVL7t2kQmeYTyV9Fo9y2fKbqFUbttOpV0gIsF7sAN7ZQh8MRZcCKV+UoCNi2K66lrbOhAm8Ic4KKTi2rtJIFw0jhBWde2aEQifmV2bg1ROrZyM83pniezf1oO7FJDGDW9+yzrAHI67R2Ty/Ul83+eCZxhHk4PGlZ7Nk/cQAszqdfKMz5DNCtubq7cOCmECu9i9Ei3b1vmKFIQJ7NHlE31Js9dQAnVemsJZoSBwVAHdD66FoOBMmQJh+xTUQVNLB/b40gnKjqlkgPi/lbpQ+sv0hvi872AHFjZZNwn4/sgWVCg171/9EACe40rQXGENumlMJ1VugjReZNeFfwCjbYLGEzY/Uz0pshfNw5K1cp7OMv8N2i0da+HGllEHogxLApGGmYDEwkxCRqNR2vO83OHNTuhA1y/XSK/fXYT3iQA0eGY8Hm/SQITJudvjkMFHn4+DHdjrQHI0gDMNYTp5bIQgU3LAT3W5IiESclRBRFdKS/hvMxoOhwsaMAf8dLOuJgMBO62sizhHWfq1xVnBuOw5+gETgUINCDL4xQAAAABJRU5ErkJggg=="></image>',
            anchorText: [-20, 0],
            offset: [0, -5],
            backgroundPosition: '0 -14px'
        },
        mapGroupIcons: [
            {
                textColor: '#69411E',
                textSize: 12,
                height: 40,
                width: 33,
                svg:
                    '<image id="map-groupIcon-density1" x="0" y="0" width="33" height="40" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iTWlzYy9NYXAvUGluLShCdWlsZGluZykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIsNTMgQzM2LjY2NjY2NjcsNDAuNDMzNTA5NyA0NCwzMC4xMDAxNzYzIDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzAuMTAwMTc2MyA3LjMzMzMzMzMzLDQwLjQzMzUwOTcgMjIsNTMgWiIgaWQ9Im1hcC1waW4iIGZpbGw9IiM2OTQxMUUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIiIGN5PSIyMiIgcj0iMTYiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
                svgColor: '#69411E',
                offset: [0, -5],
                topOffset: 0.5,
                anchorText: [19, 19]
            },
            {
                textColor: '#69411E',
                textSize: 14,
                height: 50,
                width: 41,
                svg:
                    '<image id="map-groupIcon-density2" x="0" y="0" width="41" height="50" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iTWlzYy9NYXAvUGluLShCdWlsZGluZykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIsNTMgQzM2LjY2NjY2NjcsNDAuNDMzNTA5NyA0NCwzMC4xMDAxNzYzIDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzAuMTAwMTc2MyA3LjMzMzMzMzMzLDQwLjQzMzUwOTcgMjIsNTMgWiIgaWQ9Im1hcC1waW4iIGZpbGw9IiM2OTQxMUUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIiIGN5PSIyMiIgcj0iMTYiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
                svgColor: '#69411E',
                offset: [0, -6],
                topOffset: 0.5,
                anchorText: [19, 19]
            },
            {
                textColor: '#69411E',
                textSize: 14,
                height: 60,
                width: 50,
                svg:
                    '<image id="map-groupIcon-density3" x="0" y="0" width="50" height="60" xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSI0NHB4IiBoZWlnaHQ9IjUzcHgiIHZpZXdCb3g9IjAgMCA0NCA1MyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4gICAgICAgIDx0aXRsZT5Hcm91cDwvdGl0bGU+ICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiAgICA8ZyBpZD0iU3ltYm9scyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0iTWlzYy9NYXAvUGluLShCdWlsZGluZykiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMC4wMDAwMDAsIC02LjAwMDAwMCkiPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTAuMDAwMDAwLCA2LjAwMDAwMCkiPiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjIsNTMgQzM2LjY2NjY2NjcsNDAuNDMzNTA5NyA0NCwzMC4xMDAxNzYzIDQ0LDIyIEM0NCw5Ljg0OTczNTUgMzQuMTUwMjY0NSwwIDIyLDAgQzkuODQ5NzM1NSwwIDAsOS44NDk3MzU1IDAsMjIgQzAsMzAuMTAwMTc2MyA3LjMzMzMzMzMzLDQwLjQzMzUwOTcgMjIsNTMgWiIgaWQ9Im1hcC1waW4iIGZpbGw9IiM2OTQxMUUiPjwvcGF0aD4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBmaWxsPSIjRkZGRkZGIiBjeD0iMjIiIGN5PSIyMiIgcj0iMTYiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg=="></image>',
                svgColor: '#69411E',
                offset: [0, -7],
                topOffset: 0.5,
                anchorText: [19, 19]
            }
        ]
    };
    var buildContext = getAppContext(),
        context,
        marker,
        componentInstance,
        renderedComponent,
        markerArray = {
            features: {
                developmentClustering: true
            },
            ...icons
        },
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

    describe('when no groupSize property is passed', function() {
        describe('when the active property is false or not passed', function() {
            it('should render a single inactive property marker', function() {
                expect(
                    renderedComponent.props.icon.url).toContain('data:image/svg+xml');
            });
        });

        describe('when the active property is true', function() {
            it('should render a single active property marker', function() {
                shallowRenderer.render(<GmapMarker active={true} />, context);
                renderedComponent = shallowRenderer.getRenderOutput();
                expect(
                    renderedComponent.props.icon.url).toContain('data:image/svg+xml');
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
            expect(renderedComponent.props.icon.url).toContain('data:image/svg+xml');
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
            expect(renderedComponent.props.icon.url).toContain('data:image/svg+xml');
        });
    });

    afterEach(function(done) {
        document.body.innerHTML = '';
        componentInstance = undefined;
        renderedComponent = undefined;
        setTimeout(done);
    });
});
