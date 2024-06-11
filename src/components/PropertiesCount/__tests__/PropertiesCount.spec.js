var React = require('react');
var ReactDOM = require('react-dom');
var PropertiesCount = require('../index')._PropertiesCount;
var TestUtils = require('react-dom/test-utils');
var wrapper = require('../../../../test/stubs/testWrapper');
var getAppContext = require('../../../utils/getAppContext');
var ActionTypes = require('../../../constants/ActionTypes');

import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('PropertiesCount', function() {
    describe('component styling', function() {
        it('should have css styling to visually lowercase the string', function() {
            shallowRenderer.render(
                <PropertiesCount propertiesHasLoadedOnce propertyCount={10} />
            );
            var renderedComponent = shallowRenderer.getRenderOutput();
            expect(renderedComponent.props.className).not.toBe(
                'typography-to-lowercase'
            );
        });
    });

    describe('no propertyCount', function() {
        it('should render a single spaced span', function() {
            shallowRenderer.render(<PropertiesCount />);
            var renderedComponent = shallowRenderer.getRenderOutput();
            expect(renderedComponent.type).toBe('span');
        });
    });

    describe('with a totalResults', function() {
        it('should render TranslateString component', function() {
            shallowRenderer.render(
                <PropertiesCount
                    propertiesHasLoadedOnce={true}
                    propertyCount={100}
                />
            );
            var renderedComponent = shallowRenderer.getRenderOutput();
            // TODO: expect(renderedComponent.props.children.type.displayName).toBe('TranslateString');
        });
    });

    describe('with a totalResults of 0', function() {
        it('should render TranslateString component', function() {
            shallowRenderer.render(
                <PropertiesCount
                    propertiesHasLoadedOnce={true}
                    propertyCount={0}
                />
            );
            var renderedComponent = shallowRenderer.getRenderOutput();
            // TODO: expect(renderedComponent.props.children.type.displayName).toBe('TranslateString');
        });
    });

    describe('rendering with real translation strings', function() {
        it('should default to properties', function(done) {
            var baseContext = getAppContext();
            var context = Object.assign({}, baseContext, {
                language: require('../../../config/sample/master/translatables.json')
                    .i18n
            });
            var config = {
                i18n: require('../../../config/sample/master/translatables.json')
                    .i18n,
                filters: [],
                params: {
                    searchMode: 'bounding'
                },
                language: 'en'
            };

            context.dispatcher.dispatch({
                type: ActionTypes.BOOTSTRAP,
                data: config
            });

            context.stores.ConfigStore.onChange('CONFIG_UPDATED', function() {
                context.stores.LanguageStore.setLanguage();
                var Wrapped = wrapper(PropertiesCount, context);
                var rendered = TestUtils.renderIntoDocument(
                    <Wrapped
                        component={'p'}
                        propertiesHasLoadedOnce={true}
                        propertyCount={10}
                        string={'PropertiesFound'}
                        searchType={'rent'}
                        propertyTypePlural={'properties'}
                    />
                );

                expect(ReactDOM.findDOMNode(rendered).textContent).toBe(
                    '10 matching properties for rent'
                );
                done();
            });
        });

        it('should do show property type as translation', function(done) {
            var baseContext = getAppContext();
            var context = Object.assign({}, baseContext, {
                language: require('../../../config/sample/master/translatables.json')
                    .i18n
            });
            var config = {
                i18n: require('../../../config/sample/master/translatables.json')
                    .i18n,
                filters: [],
                params: {
                    searchMode: 'bounding'
                },
                language: 'en'
            };

            context.dispatcher.dispatch({
                type: ActionTypes.BOOTSTRAP,
                data: config
            });

            context.stores.ConfigStore.onChange('CONFIG_UPDATED', function() {
                context.stores.LanguageStore.setLanguage();
                var Wrapped = wrapper(PropertiesCount, context);
                var rendered = TestUtils.renderIntoDocument(
                    <Wrapped
                        component={'p'}
                        propertiesHasLoadedOnce={true}
                        propertyCount={10}
                        string={'PropertiesFound'}
                        searchType={'rent'}
                        propertyTypePlural={'Offices'}
                    />
                );

                expect(ReactDOM.findDOMNode(rendered).textContent).toBe(
                    '10 matching Offices for rent'
                );
                done();
            });
        });
    });
});
