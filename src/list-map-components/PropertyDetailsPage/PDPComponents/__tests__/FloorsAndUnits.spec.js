import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import FloorsAndUnits from '../FloorsAndUnits';
import getAppContext from '../../../../utils/getAppContext';
import ApplyAppContext from '../../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import TestUtils from 'react-dom/test-utils';
const { findRenderedComponentWithType } = TestUtils;

import expect from 'expect';

const floors = [
    {
        subdivisionName: '9th',
        unitSize: { units: 'sqm', area: 1176.988107 },
        status: '',
        use: 'RegionalSuperRegionalMall',
        unitCharges: [],
        availableFrom: '2016-09-30T00:00:00'
    },
    {
        subdivisionName: '8th',
        unitSize: { units: 'sqm', area: 1176.988107 },
        status: 'Available',
        use: 'Office',
        unitCharges: [],
        availableFrom: '2016-09-30T00:00:00'
    },
    {
        subdivisionName: '7th',
        unitSize: { units: 'acre', area: 1176.988107 },
        status: 'UnderOffer',
        use: 'Office',
        unitCharges: [],
        availableFrom: '2016-09-30T00:00:00'
    },
    {
        subdivisionName: '6th',
        unitSize: { units: 'hectare', area: 1176.988107 },
        status: 'PendingCompletion',
        use: 'Office',
        unitCharges: [],
        availableFrom: '2016-09-30T00:00:00'
    }
];
// const context = getAppContext()
// context.stores.ConfigStore.setConfig({ language: 'en-GB' })

// context.language = require('../../../../config/sample/master/translatables.json').i18n

const i18n = require('../../../../config/sample/master/translatables.json')
    .i18n;
const context = getAppContext();
context.stores.ConfigStore.setConfig({ language: 'en-GB' });
context.stores.ConfigStore.setItem('i18n', i18n);
context.language = i18n;
context.stores.LanguageStore.setLanguage();

describe('FloorsAndUnits', () => {
    describe('render()', () => {
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(() => {
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <FloorsAndUnits floors={floors} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                FloorsAndUnits
            );
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render properties with values', () => {
            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            expect(cells.length).toEqual(19);
        });

        it('should render status correctly', () => {
            const availableCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[7];
            const underOfferCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[12];
            const pendingCompletionCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[17];
            expect(availableCell.textContent.replace('Status', '')).toEqual(
                'Available'
            );
            expect(underOfferCell.textContent.replace('Status', '')).toEqual(
                'Under Offer'
            );
            expect(
                pendingCompletionCell.textContent.replace('Status', '')
            ).toEqual('Pending Completion');
        });

        it('should not render properties without values', () => {
            // same as above lol
            // the floors prop contains some empty values, 8 cells means we don't show
            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            expect(cells.length).toEqual(19);
        });

        it('should translate titles', () => {
            const detailCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[1];
            expect(detailCell.querySelector('h4').textContent).toEqual(
                'Details'
            );
        });

        it('should translate units', () => {
            const sizeCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[2];
            // why is it impossible to get text without child element text
            expect(sizeCell.textContent.replace('Size', '')).toEqual(
                '1,177 m²'
            );
        });
        it('should display acres with 2 decimal places', () => {
            const sizeCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[11];
            // why is it impossible to get text without child element text
            expect(sizeCell.textContent.replace('Size', '')).toEqual(
                '1,176.99 acre'
            );
        });
        it('should display hactare with 2 decimal places', () => {
            const sizeCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[16];
            // why is it impossible to get text without child element text
            expect(sizeCell.textContent.replace('Size', '')).toEqual(
                '1,176.99 hectare'
            );
        });

        it('should translate uses', () => {
            const useCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[1];
            expect(useCell.textContent.replace('Details', '')).toEqual('Mall');
        });

        it(`should render approx value when any floor contains 'approx'`, () => {
            const expectedClass = 'approx-sizing';

            // Check before status
            let approxText = componentNode.getElementsByClassName(
                expectedClass
            );
            expect(approxText.length).toBe(0);

            const approxFloors = [...floors];
            approxFloors[1].approx = 'true'; // mapper applies string not bool

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <FloorsAndUnits floors={approxFloors} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                FloorsAndUnits
            );
            componentNode = ReactDOM.findDOMNode(component);

            // Check after status
            approxText = componentNode.getElementsByClassName(expectedClass);
            expect(approxText.length).toBe(1);
        });
    });
});
