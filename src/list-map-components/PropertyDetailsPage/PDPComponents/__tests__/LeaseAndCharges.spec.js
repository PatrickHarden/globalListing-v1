import React from 'react';
import PropTypes from 'prop-types';
import expect from 'expect';

import ReactDOM from 'react-dom';
import LeaseAndCharges from '../LeaseAndCharges';
import getAppContext from '../../../../utils/getAppContext';
import ApplyAppContext from '../../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import TestUtils from 'react-dom/test-utils';
const { findRenderedComponentWithType } = TestUtils;

import demoProperty from '../../../../../test/stubs/processedPropertyCommercialStub';

const i18n = require('../../../../config/sample/master/translatables.json')
    .i18n;

const context = getAppContext();
context.stores.ConfigStore.setConfig({ language: 'en-GB' });
context.stores.ConfigStore.setItem('i18n', i18n);
context.language = i18n;
context.stores.LanguageStore.setLanguage();

describe('LeaseAndCharges', () => {
    describe('render()', () => {
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(() => {
            context.stores.ConfigStore.setItem('features', {
                childListings: { enableChildListings: false },
                displayPropertySubType: false
            });
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <LeaseAndCharges
                            property={demoProperty}
                            searchType={'isLetting'}
                        />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                LeaseAndCharges
            );
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render', () => {
            expect(component).toExist();
        });

        it('should render each value or charge', () => {
            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            expect(cells.length).toEqual(14);
        });

        it('should translate titles', () => {
            const availabilityCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[0];
            expect(availabilityCell.querySelector('h3').textContent).toEqual(
                'Available from'
            );
        });

        it('should render each Property Sub Type', () => {
            context.stores.ConfigStore.setItem('features', {
                childListings: { enableChildListings: true }
            });
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <LeaseAndCharges
                            property={demoProperty}
                            searchType={'isLetting'}
                        />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                LeaseAndCharges
            );
            componentNode = ReactDOM.findDOMNode(component);
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[0];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toNotEqual(
                'Available from'
            );
        });

        it('should translate values', () => {
            const sizeCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[6];
            const title = sizeCell.querySelector('h3').textContent;
            expect(sizeCell.textContent.replace(title, '')).toEqual(
                '£65/sqft/pa (+ Vat)'
            );
        });

        it('should render `estimated for year` text to a separate div', () => {
            const businessCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[7];
            const subtitle = businessCell.querySelector('.cbre_smallText')
                .textContent;
            expect(subtitle).toEqual('(estimated for the year ending 2017)');
        });

        it('should not render `lease types` if the LeastTypes property is an empty array', () => {
            let demoPropertyWithoutLeaseTypes = Object.assign({}, demoProperty);
            demoPropertyWithoutLeaseTypes.LeaseTypes = [];

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <LeaseAndCharges
                            property={demoPropertyWithoutLeaseTypes}
                            searchType={'isLetting'}
                        />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                LeaseAndCharges
            );
            componentNode = ReactDOM.findDOMNode(component);

            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );

            for (var i = 0; i < cells.length; i++) {
                const title = cells[i].querySelector('h3').textContent;

                expect(title).toNotEqual('Lease Types');
            }
        });

        it('should render each year built', () => {
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[13];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toEqual('2000');
        });
        it('should render each zoning', () => {
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[10];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toEqual(
                'zone 1'
            );
        });
        it('should render number of storeys', () => {
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[11];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toEqual('3');
        });
        it('should render number of lots', () => {
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[12];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toEqual('10');
        });

        it('should render vacancy field', () => {
            let demoPropertyWithVacancy = Object.assign({}, demoProperty);
            demoPropertyWithVacancy.FloorsAndUnits[0].vacancy = 'Vacant';
            demoPropertyWithVacancy.ParentPropertyId = '123';

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <LeaseAndCharges
                            property={demoPropertyWithVacancy}
                            searchType={'isLetting'}
                        />
                    </ApplyAppContext>
                </IntlProvider>
            );
            component = findRenderedComponentWithType(
                wrappedComponent,
                LeaseAndCharges
            );
            componentNode = ReactDOM.findDOMNode(component);
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[14];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toEqual(
                'Vacant'
            );
        });
        it('should render each Property Sub Type', () => {
            context.stores.ConfigStore.setItem('features', {
                displayPropertySubType: true
            });
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <LeaseAndCharges
                            property={demoProperty}
                            searchType={'isLetting'}
                        />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                LeaseAndCharges
            );
            componentNode = ReactDOM.findDOMNode(component);
            const selectedCell = componentNode.getElementsByClassName(
                'cbre_table__cell'
            )[13];
            const title = selectedCell.querySelector('h3').textContent;
            expect(selectedCell.textContent.replace(title, '')).toEqual(
                'Sub Type'
            );
        });
    });
});
