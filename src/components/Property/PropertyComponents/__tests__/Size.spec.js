import React from 'react';
import PropTypes from 'prop-types';
import getAppContext from '../../../../utils/getAppContext';
import Size from '../Size';
import TranslateString from '../../../../utils/TranslateString';

import { createRenderer } from 'react-test-renderer/shallow';
import { findWithType, findAllWithType } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('Component', () => {
    describe('<Size />', () => {
        let props;
        let context;
        let renderedComponent;
        let node;

        beforeEach(() => {
            props = {
                property: {
                    MinimumSize: {},
                    MaximumSize: {},
                    TotalSize: {},
                    LandSize: {},
                    LotDepthSize: {},
                    LotFrontSize: {},
                    OfficeSize: {},
                    Other: {},
                    RetailSize: {},
                    TotalBuildingSize: {},
                    UnitSize: {},
                    WarehouseSize: {}
                }
            };
            context = getAppContext();
            context.language = require('../../../../config/sample/master/translatables.json').i18n;
            context.stores.ConfigStore.setConfig({
                language: 'en-GB',
                features: { useMaxSizeRatherThanTotalSize: false }
            });
            context.stores.ParamStore.setParams({ Unit: 'sqft' });
        });

        afterEach(() => {
            props = undefined;
            context = undefined;
            renderedComponent = undefined;
            node = undefined;
        });

        describe('#render()', () => {
            describe('When neither MinimumSize nor TotalSize have values', () => {
                it('should return null', () => {
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findAllWithType(renderedComponent, 'span');
                    expect(node.length).toBe(0);
                });
            });

            describe('When there is a MinimumSize but no TotalSize', () => {
                it('should use the PropertySize translation string and the MinimumSize value', () => {
                    props.property.MinimumSize.area = 1000.987;
                    props.property.MinimumSize.units = 'acre';
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, TranslateString);
                    expect(node.props.string).toBe('PropertySize');
                    expect(node.props.size).toBe('1,000.99');
                });
            });

            describe('When there is a TotalSize but no MinimumSize', () => {
                it('should use the PropertySize translation string and the TotalSize value', () => {
                    props.property.TotalSize.area = 500;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, TranslateString);
                    expect(node.props.string).toBe('PropertySize');
                    expect(node.props.size).toBe('500');
                });
            });

            describe('When TotalSize and MinimumSize are equal', () => {
                it('should use the PropertySize translation string and the MinimumSize value', () => {
                    props.property.MinimumSize.area = 500;
                    props.property.TotalSize.area = 500;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, TranslateString);
                    expect(node.props.string).toBe('PropertySize');
                    expect(node.props.size).toBe('500');
                });
            });

            describe('When TotalSize and MinimumSize are different', () => {
                it('should use the PropertySizeRange translation string and display both values', () => {
                    props.property.MinimumSize.area = 500;
                    props.property.TotalSize.area = 1000;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, TranslateString);
                    expect(node.props.string).toBe('PropertySizeRange');
                    expect(node.props.minimumSize).toBe('500');
                    expect(node.props.totalSize).toBe('1,000');
                });
            });

            describe('When TotalSize and MinimumSize are different, config is set to use MaximumSize rather than TotleSize', () => {
                it('should use the PropertySizeRange translation string and display both maximumsize rather than totalsize', () => {
                    props.property.MinimumSize.area = 500;
                    props.property.MaximumSize.area = 750;
                    props.property.TotalSize.area = 1000;
                    context.stores.ConfigStore.setConfig({
                        language: 'en-GB',
                        features: { useMaxSizeRatherThanTotalSize: true }
                    });
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, TranslateString);
                    expect(node.props.string).toBe('PropertySizeRange');
                    expect(node.props.minimumSize).toBe('500');
                    expect(node.props.totalSize).toBe('750');
                });
            });

            describe('When displayStyling is false', () => {
                it('should add no class to the component', () => {
                    props.property.MinimumSize.area = 1000;
                    props.displayStyling = false;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, 'span');
                    expect(node.props.className).toBe(undefined);
                });
            });

            describe('When displayStyling is true', () => {
                it('should add a property-size class to the component', () => {
                    props.property.MinimumSize.area = 1000;
                    props.displayStyling = true;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, 'span');
                    expect(node.props.className).toBe('property-size');
                });
            });

            describe('When displayLabel is false', () => {
                it('should display no label', () => {
                    props.property.MinimumSize.area = 1000;
                    props.displayLabel = false;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, 'span');
                    expect(node.props.children[0]).toBe(null);
                });
            });

            describe('When displayLabel is true', () => {
                it('should display a label', () => {
                    props.property.MinimumSize.area = 1000;
                    props.displayLabel = true;
                    shallowRenderer.render(<Size {...props} />, context);
                    renderedComponent = shallowRenderer.getRenderOutput();
                    node = findWithType(renderedComponent, 'span');
                    expect(node.props.children[0].includes(':')).toBeTruthy();
                });
            });
        });
    });
});
