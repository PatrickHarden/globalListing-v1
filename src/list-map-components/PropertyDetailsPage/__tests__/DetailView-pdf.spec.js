import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import PdfDetailView from '../DetailView.pdf';

import TestUtils from 'react-dom/test-utils';
const {
    findRenderedComponentWithType,
    scryRenderedDOMComponentsWithClass
} = TestUtils;

describe('Component', function() {
    describe('<DetailViewPdf />', function() {
        let props;
        let context;
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(function() {
            props = {
                property: {
                    Coordinates: {},
                    ContactGroup: {
                        contacts: []
                    },
                    Charges: [],
                    FloorsAndUnits: [],
                    Highlights: [],
                    Photos: [],
                    PointsOfInterest: []
                },
                staticMaps: []
            };
            context = getAppContext();
            context.language = require('../../../config/sample/master/translatables.json').i18n;
            context.stores.ConfigStore.setConfig({ language: 'en-GB' });

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <PdfDetailView {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(
                wrappedComponent,
                PdfDetailView
            );
            componentNode = ReactDOM.findDOMNode(component);
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
            wrappedComponent = undefined;
            component = undefined;
            componentNode = undefined;
        });

        describe('#render()', function() {
            it('should render a header component', function() {
                expect(
                    scryRenderedDOMComponentsWithClass(
                        component,
                        'cbre_simpleHeader'
                    ).length
                ).toBe(1);
            });
        });
    });
});
