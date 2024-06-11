var ReactDOM = require('react-dom'),
    PropTypes = require('prop-types'),
    React = require('react'),
    Carousel = require('../Carousel')._Carousel,
    _rawProperty = require('../../../test/stubs/rawPropertyStub'),
    _property = require('../../../test/stubs/processedPropertyStub'),
    getAppContext = require('../../utils/getAppContext');

import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('Carousel view component', function() {
    var buildContext = getAppContext(),
        context,
        componentInstance,
        renderedComponent;

    beforeEach(function() {
        buildContext.stores.ConfigStore.setConfig({
            carouselConfig: {
                searchResultsPage: '/'
            }
        });
        buildContext.stores.PropertyStore.setProperties(_rawProperty);
        buildContext.stores.SearchStateStore.setItem('searchType', 'isLetting');
        context = {
            stores: buildContext.stores,
            actions: buildContext.actions,
            language: require('../../config/sample/master/translatables.json')
                .i18n
        };

        shallowRenderer.render(<Carousel properties={[_property]} />, context);
        componentInstance = shallowRenderer._instance._instance;
        renderedComponent = shallowRenderer.getRenderOutput();
    });

    describe('when the component has rendered', function() {
        it('should retrieve properties from properties container', function() {
            expect(componentInstance.props.properties).toEqual([_property]);
        });

        it('should render a carousel component with properties set', function() {
            expect(renderedComponent.props.children.props).toEqual({
                searchResultsPage: '/',
                standAlone: true,
                hideCounter: true,
                searchType: 'isLetting',
                properties: [_property],
                isImageRestricted: false
            });
        });
    });

    afterEach(function(done) {
        document.body.innerHTML = '';
        context = undefined;
        componentInstance = undefined;
        renderedComponent = undefined;
        setTimeout(done);
    });
});
