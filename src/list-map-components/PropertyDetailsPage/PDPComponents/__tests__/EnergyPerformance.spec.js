import React from 'react';
import PropTypes from 'prop-types';
import expect from 'expect';

import getAppContext from '../../../../utils/getAppContext';
import EnergyPerformance from '../EnergyPerformance';
import { Cell } from '../../../Table/Table';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('EnergyPerformance', function() {
    let props;
    let context;
    let renderedComponent;
    let cell;

    beforeEach(function() {
        props = {
            data: {}
        };
        context = getAppContext();
        context.language = require('../../../../config/sample/master/translatables.json').i18n;
        context.stores.ConfigStore.setConfig({ language: 'en-GB' });
    });

    afterEach(function() {
        props = undefined;
        context = undefined;
        renderedComponent = undefined;
        cell = undefined;
    });

    describe('#render()', function() {
        it('should render a Cell for year if year is available', function() {
            props.data = {
                year: '2000'
            };
            shallowRenderer.render(<EnergyPerformance {...props} />, context);
            renderedComponent = shallowRenderer.getRenderOutput();
            cell = findAllWithType(renderedComponent, Cell)[0];
            expect(cell.props.children[1]).toBe('2000');
        });

        describe('MajorEnergySources', function() {
            it('should not render a Cell for MajorEnergySources if MajorEnergySources not populated', function() {
                props.data = {
                    MajorEnergySources: []
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(0);
            });

            it('should render a Cell for MajorEnergySources if MajorEnergySources is available and populated', function() {
                props.data = {
                    MajorEnergySources: ['a source']
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell)[0];
                expect(cell.props.children[1]).toBe('a source');
            });

            it('should join multiple MajorEnergySources items with a comma', function() {
                props.data = {
                    MajorEnergySources: ['a source', 'another source']
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell)[0];
                expect(cell.props.children[1]).toBe('a source, another source');
            });
        });
        describe('HeatEnergy', function() {
            it('should render a Cell for heatEnergy if heatEnergy is available and has an amount property', function() {
                props.data = {
                    heatEnergy: {
                        amount: '10000',
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(1);
            });
            it('should not render a Cell for heatEnergy if heatEnergy is available but does not have an amount property', function() {
                props.data = {
                    heatEnergy: {
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(0);
            });
        });
        describe('ElectricalEnergy', function() {
            it('should render a Cell for electricalEnergy if electricalEnergy is available and has an amount property', function() {
                props.data = {
                    electricalEnergy: {
                        amount: '10000',
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(1);
            });
            it('should not render a Cell for electricalEnergy if electricalEnergy is available but does not have an amount property', function() {
                props.data = {
                    electricalEnergy: {
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(0);
            });
        });
        describe('TotalEnergy', function() {
            it('should render a Cell for totalEnergy if totalEnergy is available and has an amount property', function() {
                props.data = {
                    totalEnergy: {
                        amount: '10000',
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(1);
            });
            it('should not render a Cell for totalEnergy if totalEnergy is available but does not have an amount property', function() {
                props.data = {
                    totalEnergy: {
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
                expect(cell.length).toBe(0);
            });
        });

        describe('EPC document link', function() {
            beforeEach(function() {
                props.data = {
                    ukuri: 'alink.pdf'
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell);
            });

            it('should render a Cell for the EPC document link if uri is available', function() {
                expect(cell.length).toBe(1);
            });

            it('should render aan anchor element with the uri valus as the href attribute', function() {
                const link = findAllWithType(renderedComponent, 'a')[0];
                expect(link.props.href).toBe('alink.pdf');
            });
        });
        describe('International numbers', function() {
            it('should render correct format for en-GB', function() {
                props.data = {
                    totalEnergy: {
                        amount: '9999.99',
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell)[0];
                expect(cell.props.children[1].props.amount).toEqual('9,999.99');
            });
            it('should render correct format for de-DE', function() {
                context.stores.ConfigStore.setConfig({ language: 'de-DE' });
                props.data = {
                    totalEnergy: {
                        amount: '9999.99',
                        interval: 'Monthly',
                        energyUnits: 'kwh',
                        perUnit: 'sqm'
                    }
                };
                shallowRenderer.render(
                    <EnergyPerformance {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                cell = findAllWithType(renderedComponent, Cell)[0];
                expect(cell.props.children[1].props.amount).toEqual('9.999,99');
            });
        });
    });
});
