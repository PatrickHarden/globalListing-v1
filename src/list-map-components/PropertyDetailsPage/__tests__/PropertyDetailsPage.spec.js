import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { PropertyDetailsPageTest as PropertyDetailsPage } from '../PropertyDetailsPage';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import property from '../../../../test/stubs/processedPropertyStub';
import { IntlProvider } from 'react-intl';
import PdfDetailView from '../DetailView.pdf';
import { PdfList } from '../../Pdf';

import TestUtils from 'react-dom/test-utils';

const {
    findRenderedComponentWithType,
    scryRenderedComponentsWithType,
    scryRenderedDOMComponentsWithClass
} = TestUtils;

describe('Component', () => {
    describe('<PropertyDetailsPage />', () => {
        let props;
        let properties;
        let language;
        let context;
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(() => {
            language = require('../../../config/sample/master/translatables.json')
                .i18n;
            props = {
                location: {
                    query: {
                        properties: 'GB-Plus-276538'
                    }
                }
            };
            properties = [property];
            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                language: 'en-GB',
                searchConfig: {},
                siteId: 'uk-resi'
            });
            context.language = language;
            context.spaPath = {};
        });

        afterEach(() => {
            props = undefined;
            properties = undefined;
            language = undefined;
            context = undefined;
            wrappedComponent = undefined;
            component = undefined;
            componentNode = undefined;
        });

        describe('#render()', () => {
            describe('PDF mode', () => {
                beforeEach(done => {
                    wrappedComponent = TestUtils.renderIntoDocument(
                        <IntlProvider locale="en-GB" messages={{}}>
                            <ApplyAppContext passContext={context}>
                                <PropertyDetailsPage {...props} isPdf />
                            </ApplyAppContext>
                        </IntlProvider>
                    );

                    component = findRenderedComponentWithType(
                        wrappedComponent,
                        PropertyDetailsPage
                    );
                    component.setState(
                        {
                            staticMaps: [],
                            pdfProperties: properties,
                            loading: false
                        },
                        () => {
                            done();
                            componentNode = ReactDOM.findDOMNode(component);
                        }
                    );
                });

                it('should render a PDF list component', () => {
                    expect(
                        scryRenderedComponentsWithType(component, PdfList)
                            .length
                    ).toBe(1);
                });

                it('should render one or more PDF header components', () => {
                    expect(
                        scryRenderedDOMComponentsWithClass(
                            component,
                            'cbre_simpleHeader'
                        ).length
                    ).not.toBeLessThan(1);
                });

                it('should render one or more PDF detail view components', () => {
                    expect(
                        scryRenderedComponentsWithType(component, PdfDetailView)
                            .length
                    ).not.toBeLessThan(1);
                });

                it('should render a PDF footer', () => {
                    const footer = scryRenderedDOMComponentsWithClass(
                        component,
                        'cbre_disclaimer'
                    );
                    const footerNode = ReactDOM.findDOMNode(footer[0]);
                    // Check a footer is rendering
                    expect(footer.length).toBe(1);
                    // Check it is displaying text from the language config
                    expect(footerNode.innerHTML).toBe(language.PdfDisclaimer);
                    // Check it uses the correct css so newlines can be rendered
                    expect(
                        footerNode.className.includes('cbre-spa--pre-line')
                    ).toBeTruthy();
                });
            });
        });
    });
});
