import React from 'react';
import ReactDOM from 'react-dom';
import Charge from '../Charge';
import getAppContext from '../../../../utils/getAppContext';
import ApplyAppContext from '../../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

import { createRenderer } from 'react-test-renderer/shallow';

import demoProperty from '../../../../../test/stubs/processedPropertyCommercialStub';

const i18n = require('../../../../config/sample/master/translatables.json')
    .i18n;

const context = getAppContext();
context.stores.ConfigStore.setConfig({ language: 'en-GB' });
context.stores.ConfigStore.setItem('i18n', i18n);
context.language = i18n;
context.stores.LanguageStore.setLanguage();

describe('Charge', () => {
    describe('render()', () => {
        let renderer;
        const charges = [
            {
                chargeType: 'Rent',
                currencyCode: 'GBP',
                interval: 'Annually',
                amount: 0,
                unit: 'sqft',
                year: '',
                taxModifier: 'PlusVAT'
            },
            {
                chargeType: 'BusinessRates',
                currencyCode: 'GBP',
                interval: 'Annually',
                amount: 21.34,
                year: 2017,
                unit: 'sqft',
                chargeModifier: 'OnApplication'
            },
            {
                chargeType: 'ServiceCharge',
                currencyCode: 'GBP',
                interval: 'Annually',
                amount: 13.96,
                year: 2016,
                unit: 'sqft',
                taxModifier: 'PlusVAT'
            },
            {
                chargeType: 'Deposit',
                currencyCode: 'GBP',
                interval: 'Annually',
                amount: 2.26,
                year: 2016,
                unit: 'sqft'
            },
            {
                chargeType: 'BusinessRates',
                currencyCode: 'GBP',
                interval: 'Annually',
                amount: 21.34,
                year: 2017,
                unit: 'sqft',
                chargeModifier: 'CallForInfo'
            }
        ];

        beforeEach(() => {
            renderer = createRenderer();
        });

        afterEach(() => {
            renderer = undefined;
        });

        it('should render price on application if amount is 0', function() {
            renderer.render(<Charge charge={charges[0]} />, context);

            const output = renderer.getRenderOutput();
            const onApplicationString = output.props.children[1];
            expect(onApplicationString).toBe('Price On Application');
        });

        it('should render price on application if chargeModifier is "OnApplication"', function() {
            renderer.render(<Charge charge={charges[1]} />, context);
            const output = renderer.getRenderOutput();
            const onApplicationString = output.props.children[1];
            expect(onApplicationString).toBe('Price On Application');
        });

        it('should render a chargeType label', function() {
            renderer.render(<Charge charge={charges[2]} />, context);
            const output = renderer.getRenderOutput();
            const chargeTypeLabel = output.props.children[0];
            expect(chargeTypeLabel).toBe('Service Charge: ');
        });

        it('should set a tax modifier token when taxModifier property is set', function() {
            renderer.render(<Charge charge={charges[2]} />, context);
            const output = renderer.getRenderOutput();
            const taxModifier = output.props.children[1].props.taxModifier;
            expect(taxModifier).toBe(' (+ Vat)');
        });

        it('should set a commission payable charges string when a relavent chargeType is set.', function() {
            const chargeTypes = ['BrokerageFees', 'Deposit', 'OperatingCost'];
            let charge;
            let output;
            let translateString;

            chargeTypes.forEach(function(chargeType) {
                charge = {
                    chargeType: chargeType,
                    currencyCode: 'GBP',
                    interval: 'Annually',
                    amount: 2.26,
                    year: 2016,
                    unit: 'sqft'
                };

                renderer.render(<Charge charge={charge} />, context);
                output = renderer.getRenderOutput();
                translateString = output.props.children[1].props.string;
                //return expect(translateString.includes('CommissionPayableCharges')).toBe(true);
            });
            expect(translateString.includes('CommissionPayableCharges')).toBe(
                true
            );
        });
    });
});
