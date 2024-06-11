import React from 'react';
import GStaticMaps from '../../GStaticMaps/index';
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();
var TestUtils = require('react-dom/test-utils');

describe('Test google static maps rendering', () => {

    let props;
    beforeEach(() => {
        props = {
            lat: 0,
            lon: 0,
        };
    });

    it('should render image tag', () => {
        shallowRenderer.render(<GStaticMaps lat={props.lat} lon={props.lon} />);
        var renderedComponent = shallowRenderer.getRenderOutput();
        expect(
            renderedComponent.type
        ).toContain('img');
    });

    it('image source should be google staticmap api', () => {
        var GStaticMap = TestUtils.renderIntoDocument(<GStaticMaps lat={props.lat} lon={props.lon} />);
        GStaticMap.setState({
            map: {
                Url: 'https://maps.googleapis.com/maps/api/staticmap'
            }
        });
        var image = TestUtils.findRenderedDOMComponentWithTag(GStaticMap, 'img');
        expect(
            image.getAttribute('src')
        ).toContain('https://maps.googleapis.com/maps/api/staticmap');
    });

    it('will render when prerender is false', function () {
        GStaticMaps.__Rewire__('isPrerender', false);

        shallowRenderer.render(<GStaticMaps lat={props.lat} lon={props.lon} />);
        var renderedComponent = shallowRenderer.getRenderOutput();        
        expect(renderedComponent !== undefined).toBe(true);
    });

    it('will not render when prerender is true', function () {
        GStaticMaps.__Rewire__('isPrerender', true);

        shallowRenderer.render(<GStaticMaps lat={props.lat} lon={props.lon} />);
        var renderedComponent = shallowRenderer.getRenderOutput();        
        expect(renderedComponent).toBe(null);
    });

});

