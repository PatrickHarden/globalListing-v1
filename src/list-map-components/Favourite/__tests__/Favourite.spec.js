import React from 'react';
import ReactDOM from 'react-dom';
import getAppContext from '../../../utils/getAppContext';
import Favourite from '../Favourite';
import { addFavourite } from '../../../utils/favourites';
import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';

describe('Component', function() {
    describe('<Favourite />', function() {
        let renderer;
        let props;
        let context;

        beforeEach(function() {
            renderer = createRenderer();
            props = {
                property: require('../../../../test/stubs/processedPropertyStub')
            };
            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                features: {
                    enableFavourites: true
                }
            });
            context.language = require('../../../config/sample/master/translatables.json').i18n;
        });

        afterEach(function() {
            renderer = undefined;
            props = undefined;
            context = undefined;
            localStorage.clear();
        });

        describe('When button is clicked', () => {
            it('Should set an active class on itself', function(done) {
                renderer.render(
                    <Favourite
                        propertyId={props.property.PropertyId}
                        {...props}
                    />,
                    context
                );
                let renderedComponent = renderer.getRenderOutput();
                renderedComponent.props.onClick({ preventDefault: () => {} });

                setTimeout(() => {
                    renderedComponent = renderer.getRenderOutput();
                    let linkClasses = renderedComponent.props.className;
                    expect(linkClasses.includes('is_selected')).toBe(true);
                    done();
                }, 10);
            });

            it('Should NOT have an active class when clicked after rendering as active.', function(done) {
                addFavourite(props.property.PropertyId);

                renderer.render(
                    <Favourite
                        propertyId={props.property.PropertyId}
                        {...props}
                    />,
                    context
                );
                let renderedComponent = renderer.getRenderOutput();
                renderedComponent.props.onClick({ preventDefault: () => {} });

                setTimeout(() => {
                    renderedComponent = renderer.getRenderOutput();
                    let linkClasses = renderedComponent.props.className;
                    expect(linkClasses.includes('is_selected')).toBe(false);
                    done();
                }, 10);
            });
        });

        describe('#render()', function() {
            it('should render a favourite <a> with classes when favourites feature is enabled', function() {
                renderer.render(
                    <Favourite
                        propertyId={props.property.PropertyId}
                        {...props}
                    />,
                    context
                );
                let renderedComponent = renderer.getRenderOutput();
                let linkClasses = renderedComponent.props.className;

                expect(renderedComponent.type).toBe('a');
                expect(linkClasses.includes('cbre_button__favourite')).toBe(
                    true
                );
            });

            it('Should render an active button when propertyId is set in local storage', function() {
                addFavourite(props.property.PropertyId);

                renderer.render(
                    <Favourite
                        propertyId={props.property.PropertyId}
                        {...props}
                    />,
                    context
                );
                let renderedComponent = renderer.getRenderOutput();
                let linkClasses = renderedComponent.props.className;

                expect(linkClasses.includes('is_selected')).toBe(true);
            });
        });
    });
});
