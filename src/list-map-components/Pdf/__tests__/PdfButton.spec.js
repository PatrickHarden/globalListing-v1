import React from 'react';
import getDocumentRoot from '../../../utils/getDocumentRoot';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import defaultValues from '../../../constants/DefaultValues';
import { IntlProvider } from 'react-intl';
import PdfButton from '../PdfButton';

import { wrap } from 'react-stateless-wrapper'
import TestUtils from 'react-dom/test-utils';
import { Link } from 'react-router';
const {
    findRenderedComponentWithType,
    scryRenderedComponentsWithType,
    scryRenderedDOMComponentsWithClass
} = TestUtils;

describe('Component', function () {
    describe('<PdfButton />', function () {
        let props;
        let language;
        let context;
        let StatefulComponent;
        let wrappedComponent;
        let component;
        let componentNode;

        beforeEach(function () {
            props = {};
            language = require('../../../config/sample/master/translatables.json').i18n;
            context = getAppContext();
            context.language = language;
            context.stores.ConfigStore.setConfig({
                features: {
                    printFavourites: true
                }
            });
            context.spaPath = {
                path: '/path',
                subPath: '/subPath'
            };
            spyOn(context.actions, 'getFavouriteParamsValues').and.returnValue('item1,item2');

            StatefulComponent = wrap(PdfButton);
            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <StatefulComponent {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            component = findRenderedComponentWithType(wrappedComponent, StatefulComponent);
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

            it('should not render if the show prop is false or not available', function () {
                expect(scryRenderedDOMComponentsWithClass(component, 'cbre_button').length).toBe(0);
            });

            describe('render as downloadable', function () {

                beforeEach(function () {
                    props = {
                        show: true
                    };
                    wrappedComponent = TestUtils.renderIntoDocument(
                        <IntlProvider locale="en-GB" messages={{}}>
                            <ApplyAppContext passContext={context}>
                                <StatefulComponent {...props} />
                            </ApplyAppContext>
                        </IntlProvider>
                    );

                    component = findRenderedComponentWithType(wrappedComponent, StatefulComponent);
                    componentNode = scryRenderedDOMComponentsWithClass(component, 'cbre_button')[0];
                });

                it('should render an anchor', function () {
                    expect(componentNode.nodeName).toBe('A');
                });

                it('should generate a link to the download service', function () {
                    const api = defaultValues.pdf.pdfDownloadApi;
                    const renderMiddleware = defaultValues.pdf.renderMiddleware;
                    const pathname = getDocumentRoot() + '/path/generate-pdf';
                    let protocol = `${window.location.protocol}`;
                    protocol = (protocol === 'about:') ? '': protocol;
                    expect(componentNode.href).toBe(`${protocol}${api}?document=${renderMiddleware}${pathname}&qs=properties=0`);
                });

            });

            describe('render as link', function () {

                beforeEach(function () {
                    props = {
                        show: true,
                        viewInBrowser: true
                    };
                    wrappedComponent = TestUtils.renderIntoDocument(
                        <IntlProvider locale="en-GB" messages={{}}>
                            <ApplyAppContext passContext={context}>
                                <StatefulComponent {...props} />
                            </ApplyAppContext>
                        </IntlProvider>
                    );

                    component = findRenderedComponentWithType(wrappedComponent, StatefulComponent);
                });

                it('should render a react-router Link', function () {
                    expect(scryRenderedComponentsWithType(component, Link).length).toBe(1);
                });

                it('should generate a link to the PDF render route', function () {
                    const routerLink = scryRenderedComponentsWithType(component, Link)[0];
                    const to = {
                        pathname: getDocumentRoot() + '/path/generate-pdf',
                        query: {
                            properties: '0'
                        }
                    };
                    expect(routerLink.props.to).toEqual(to);
                });

            });

        });
    });
});
