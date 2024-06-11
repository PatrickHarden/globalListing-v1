import React from 'react';
import ReactDOM from 'react-dom';
import defaultValues from '../../../constants/DefaultValues';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';
import PdfHeader from '../PdfHeader';
import moment from 'moment/min/moment-with-locales.min';

import { wrap } from 'react-stateless-wrapper'
import TestUtils from 'react-dom/test-utils';
const {
    findRenderedComponentWithType,
    scryRenderedDOMComponentsWithClass
} = TestUtils;

describe('Component', function () {
    describe('<PdfHeader />', function () {
        let props;
        let language;
        let context;
        let StatefulComponent;
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(function () {
            props = {
                siteType: 'commercial'
            };
            language = require('../../../config/sample/master/translatables.json').i18n;
            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                language: 'en-GB'
            });
            context.language = language;

            StatefulComponent = wrap(PdfHeader);
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <StatefulComponent {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(wrappedComponent, StatefulComponent);
            componentNode = ReactDOM.findDOMNode(component);
        });

        afterEach(function () {
            props = undefined;
            language = undefined;
            context = undefined;
            StatefulComponent = undefined;
            wrappedComponent = undefined;
            component = undefined;
            componentNode = undefined;
        });

        describe('#render()', function () {

            it('should render a logo', function () {
                expect(scryRenderedDOMComponentsWithClass(component, 'headerLogoWrap').length).toBe(1);
            });

            it('should render site link', function () {
                const link = scryRenderedDOMComponentsWithClass(component, 'headerLogoWrap_cbreLink');
                const linkNode = ReactDOM.findDOMNode(link[0]);
                expect(link.length).toBe(1);
                expect(linkNode.innerHTML).toBe(language.PdfHeaderLinkText);
            });

            it('should render a title based on the supplied translation string', function () {
                const title = scryRenderedDOMComponentsWithClass(component, 'cbre_headerTitle');
                const titleNode = ReactDOM.findDOMNode(title[0]);
                expect(title.length).toBe(1);
                expect(titleNode.innerHTML).toBe(language.PdfHeaderTitle);
            });

            it('should render todays date', function () {
                const date = scryRenderedDOMComponentsWithClass(component, 'cbre_smallText');
                const dateNode = ReactDOM.findDOMNode(date[0]);

                let dateText = new moment();
                dateText = dateText.locale('en-GB').format(defaultValues.pdfDateFormat);

                expect(date.length).toBe(1);
                expect(dateNode.innerHTML).toBe(dateText);
            });

            describe('Residential view', function () {
                beforeEach(function () {
                    props = {
                        siteType: 'residential'
                    };

                    StatefulComponent = wrap(PdfHeader);
                    wrappedComponent = TestUtils.renderIntoDocument(
                        <IntlProvider locale="en-GB" messages={{}}>
                            <ApplyAppContext passContext={context}>
                                <StatefulComponent {...props} />
                            </ApplyAppContext>
                        </IntlProvider>
                    );

                    component = findRenderedComponentWithType(wrappedComponent, StatefulComponent);
                    componentNode = ReactDOM.findDOMNode(component);
                });

                it('should not render a site link', function () {
                    const link = scryRenderedDOMComponentsWithClass(component, 'headerLogoWrap_cbreLink');
                    expect(link.length).toBe(0);
                });
            });

        });
    });
});
