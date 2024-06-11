import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import SizesAndMeasurements from '../SizesAndMeasurements';
import getAppContext from '../../../../utils/getAppContext';
import ApplyAppContext from '../../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import TestUtils from 'react-dom/test-utils';
const { findRenderedComponentWithType } = TestUtils;

import demoProperty from '../../../../../test/stubs/processedPropertyCommercialStub';
import demoParentProperty from '../../../../../test/stubs/processedPropertyCommercialStub';
demoParentProperty.IsParent = true;
const i18n = require('../../../../config/sample/master/translatables.json')
    .i18n;
const context = getAppContext();
context.stores.ConfigStore.setConfig({ language: 'en-GB' });
context.stores.ConfigStore.setItem('i18n', i18n);
context.language = i18n;
context.stores.LanguageStore.setLanguage();

describe('SizesAndMeasurements', () => {
    describe('render()', () => {
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(() => {
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SizesAndMeasurements property={demoProperty} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                SizesAndMeasurements
            );
            componentNode = ReactDOM.findDOMNode(component);
        });

        afterEach(() => {
            wrappedComponent = null;
            component = null;
            componentNode = null;
            context.stores.ConfigStore.setItem('features', {
                hideSizesAndMeasurementsOnParent: false
            });
        });

        it('should render', () => {
            expect(component).toBeDefined();
        });

        it('should hide the Size and Measurements table if parent and hideFeature is enabled', () => {
            context.stores.ConfigStore.setItem('features', {
                hideSizesAndMeasurementsOnParent: true
            });
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SizesAndMeasurements property={demoParentProperty} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                SizesAndMeasurements
            );
            componentNode = ReactDOM.findDOMNode(component);

            expect(componentNode).toEqual(null);
        });
        it('should render every item in the Size and Measurements table', () => {
            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            expect(cells.length).toEqual(19);
        });

        it('should output formatted units (eg ft + in)', () => {
            const sizeAsString = '45 ft 6 in';
            demoProperty.Sizes = [
                {
                    sizeKind: 'FrontageWidth',
                    dimensions: {
                        units: 'ft',
                        area: 45.5
                    }
                }
            ];

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SizesAndMeasurements property={demoProperty} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                SizesAndMeasurements
            );
            componentNode = ReactDOM.findDOMNode(component);

            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            const cellText = cells[0].textContent;
            expect(cellText).toContain(sizeAsString);
        });
        it('should output formatted units (eg m)', () => {
            const sizeAsString = '45.5 m';
            demoProperty.Sizes = [
                {
                    sizeKind: 'FrontageWidth',
                    dimensions: {
                        units: 'm',
                        area: 45.5
                    }
                }
            ];

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SizesAndMeasurements property={demoProperty} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                SizesAndMeasurements
            );
            componentNode = ReactDOM.findDOMNode(component);

            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            const cellText = cells[0].textContent;
            expect(cellText).toContain(sizeAsString);
        });
        it('should output formatted units (eg acres)', () => {
            const sizeAsString = '0.99 acres';
            demoProperty.Sizes = [
                {
                    sizeKind: 'TotalSize',
                    dimensions: {
                        units: 'acre',
                        area: 0.99
                    }
                }
            ];

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SizesAndMeasurements property={demoProperty} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                SizesAndMeasurements
            );
            componentNode = ReactDOM.findDOMNode(component);

            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            const cellText = cells[0].textContent;
            expect(cellText).toContain(sizeAsString);
        });
        it('should output correct formatted units, if acre is exactly 1', () => {
            const sizeAsString = '1 acre';
            demoProperty.Sizes = [
                {
                    sizeKind: 'TotalSize',
                    dimensions: {
                        units: 'acre',
                        area: 1
                    }
                }
            ];

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <SizesAndMeasurements property={demoProperty} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                SizesAndMeasurements
            );
            componentNode = ReactDOM.findDOMNode(component);

            const cells = componentNode.getElementsByClassName(
                'cbre_table__cell'
            );
            const cellText = cells[0].textContent;
            expect(cellText).toContain(sizeAsString);
        });
    });
});
