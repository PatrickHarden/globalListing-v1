import React from 'react';
import PropTypes from 'prop-types';
import RelatedProperties from '../RelatedProperties';
import CollapsibleBlock from '../../CollapsibleBlock/CollapsibleBlock';
import Spinner from 'react-spinner';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('Component', function() {
    describe('<RelatedProperties />', function() {
        let props;
        let context;
        let component;

        beforeEach(function() {
            props = {
                relatedProperties: {}
            };
            context = {};
            context.language = require('../../../config/sample/master/translatables.json').i18n;
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
            component = undefined;
        });

        describe('#render()', function() {
            it('should render a Spinner while relatedProperties is empty', function() {
                shallowRenderer.render(
                    <RelatedProperties {...props} />,
                    context
                );
                component = shallowRenderer.getRenderOutput();

                expect(findAllWithType(component, Spinner).length).toBe(1);
            });

            it('should return null if related properties call fails', function() {
                props = {
                    relatedProperties: {
                        properties: [],
                        status: false
                    }
                };
                shallowRenderer.render(
                    <RelatedProperties {...props} />,
                    context
                );
                component = shallowRenderer.getRenderOutput();

                expect(component).toBe(null);
            });

            describe('When relatedProperties is populated', function() {
                beforeEach(function() {
                    props = {
                        relatedProperties: {
                            properties: [],
                            status: true
                        }
                    };
                });

                it('should render a CollapsibleBlock component', function() {
                    shallowRenderer.render(
                        <RelatedProperties {...props} />,
                        context
                    );
                    component = shallowRenderer.getRenderOutput();

                    expect(
                        findAllWithType(component, CollapsibleBlock).length
                    ).toBe(1);
                });
            });
        });
    });
});
