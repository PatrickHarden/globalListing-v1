var ReactDOM = require('react-dom'),
    React = require('react'),
    PropertyCarousel = require('../'),
    _property = require('../../../../test/stubs/processedPropertyStub'),
    getAppContext = require('../../../utils/getAppContext');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('PropertyCarousel component', function() {
    var buildContext = getAppContext(),
        context,
        componentInstance,
        renderedComponent,
        renderedComponentChildren,
        props = {
            searchType: 'isSale',
            properties: [_property, _property]
        },
        config = {
            carouselConfig: {
                searchResultsPage: 'results'
            }
        };

    beforeEach(function() {
        buildContext.stores.ConfigStore.setConfig(config);
        context = {
            stores: buildContext.stores,
            actions: buildContext.actions,
            language: require('../../../config/sample/master/translatables.json')
                .i18n
        };

        shallowRenderer.render(<PropertyCarousel {...props} />, context);
        componentInstance = shallowRenderer._instance._instance;
        renderedComponent = shallowRenderer.getRenderOutput();
        renderedComponentChildren = renderedComponent.props.children;
    });

    describe('when rendering in standard component mode', function() {
        it('should not render a header component', function() {
            expect(renderedComponentChildren[0]).toBe(undefined);
        });

        it('should render a slider component', function() {
            expect(renderedComponentChildren[1].props.className).toBe(
                'cbre-spa--carousel'
            );
        });

        describe('the slider component', function() {
            it('should render a slide for each property', function() {
                expect(
                    renderedComponentChildren[1].props.children.length
                ).toEqual(props.properties.length);
            });
        });

        it('should render a slide count component', function() {
            expect(renderedComponentChildren[2].props.className).toBe(
                'cbre-spa--carousel_slide-count'
            );
        });

        describe('the slide count component', function() {
            it('should display current slide and total slides', function() {
                expect(renderedComponentChildren[2].props.children).toEqual([
                    1,
                    ' / ',
                    props.properties.length
                ]);
            });
        });

        it('should not render a footer component', function() {
            expect(renderedComponentChildren[3]).toBe(undefined);
        });
    });

    describe('when rendering in standalone mode', function() {
        beforeEach(function() {
            shallowRenderer.render(
                <PropertyCarousel {...props} standAlone={true} />,
                context
            );
            componentInstance = shallowRenderer._instance._instance;
            renderedComponent = shallowRenderer.getRenderOutput();
            renderedComponentChildren = renderedComponent.props.children;
        });

        it('should render a header component', function() {
            expect(renderedComponentChildren[0].props.componentClass).toBe(
                'div'
            );
        });

        describe('the header component', function() {
            it('should display a title', function() {
                expect(
                    renderedComponentChildren[0].props.children[0].props
                        .className
                ).toBe('cbre-spa--carousel_title');
            });
            it('should display a call to action', function() {
                expect(
                    renderedComponentChildren[0].props.children[1].props
                        .className
                ).toBe('cbre-spa--carousel_cta');
            });
        });

        it('should render a slide count', function() {
            expect(renderedComponentChildren[2].type).toBe('div');
        });

        it('should render a footer component', function() {
            expect(renderedComponentChildren[3].type).toBe('hr');
        });
    });

    describe('when the hideCounter prop is true', function() {
        beforeEach(function() {
            shallowRenderer.render(
                <PropertyCarousel
                    {...props}
                    standAlone={true}
                    hideCounter={true}
                />,
                context
            );
            componentInstance = shallowRenderer._instance._instance;
            renderedComponent = shallowRenderer.getRenderOutput();
            renderedComponentChildren = renderedComponent.props.children;
        });

        it('should not render a slide count', function() {
            expect(renderedComponentChildren[2]).toBe(undefined);
        });
    });

    afterEach(function(done) {
        document.body.innerHTML = '';
        context = undefined;
        componentInstance = undefined;
        renderedComponent = undefined;
        renderedComponentChildren = undefined;
        setTimeout(done);
    });
});
