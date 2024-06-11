import React from 'react';
import ReactDOM from 'react-dom';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import PdfList from '../PdfList';
import PropertyCard from '../../PropertyCard/PropertyCard';

import TestUtils from 'react-dom/test-utils';
const {
    findRenderedComponentWithType,
    scryRenderedComponentsWithType,
    scryRenderedDOMComponentsWithClass
} = TestUtils;

describe('Component', function () {
    describe('<PdfList />', function () {
        let props;
        let language;
        let context;
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(function () {
            const prop = require('../../../../test/stubs/processedPropertyCommercialStub');
            const prop1 = prop;
            let prop2 = Object.assign({}, prop);
            let prop3 = Object.assign({}, prop);
            prop2.PropertyId = 'prop2';
            prop3.PropertyId = 'prop3';
            props = {
                spaPath: {},
                siteType: 'commercial',
                staticMaps: [],
                properties: [prop1, prop2, prop3]
            };

            language = require('../../../config/sample/master/translatables.json').i18n;
            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                language: 'en-GB'
            });
            context.language = language;

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <PdfList {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(wrappedComponent, PdfList);
            componentNode = ReactDOM.findDOMNode(component);
        });

        afterEach(function () {
            props = undefined;
            language = undefined;
            context = undefined;
            wrappedComponent = undefined;
            component = undefined;
            componentNode = undefined;
        });

        describe('#render()', function () {

            it('should render Property cards for each supplied property', function () {
                expect(scryRenderedComponentsWithType(component, PropertyCard).length).toBe(3);
            });

            it('should render a new row after every second property', function () {
                expect(scryRenderedDOMComponentsWithClass(component, 'row').length).toBe(2);
            });

        });
    });
});
