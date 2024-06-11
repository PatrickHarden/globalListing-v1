import React from 'react';
import PropTypes from 'prop-types';
import { ListViewTest as ListView } from '../ListView';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import TestUtils from 'react-dom/test-utils';
import property from '../../../../test/stubs/processedPropertyStub';
import { findDOMNode } from 'react-dom';
import groupObjects from '../../../utils/groupObjects';

import { IntlProvider } from 'react-intl';

describe('ListView', function() {
    describe('Selected item behaviour', function() {
        const propsArray = [
            JSON.parse(JSON.stringify(property)),
            JSON.parse(JSON.stringify(property)),
            JSON.parse(JSON.stringify(property)),
            JSON.parse(JSON.stringify(property))
        ];
        propsArray[0].Coordinates = {
            lat: 1,
            lon: 2
        };

        let context = null;
        let props = null;
        let wrappedComponent = null;
        let renderedComponent = null;
        let listComponent = null;
        let mapComponent = null;

        beforeEach(function() {
            props = {
                searchType: 'isLetting',
                searchResultsPage: '/',
                language: require('../../../config/sample/master/translatables.json')
                    .i18n,
                spaPath: {
                    path: '/path',
                    subPath: '/subPath'
                },
                siteType: 'residential',
                selectedItems: {
                    group: 'cardGroup_group_0',
                    property: {},
                    contact: {}
                },
                isModalOpen: false,
                showContactModal: () => {},
                hideContactModal: () => {},
                siteId: 'xxxsiteidxxxx',
                recaptchaKey: 'xxrecaptchaxx',
                apiUrl: 'xxxapiurlxxx',
                breakpoints: {
                    isMobile: true
                },
                properties: propsArray,
                groupedProperties: groupObjects(propsArray, 'Coordinates'),
                modal: {
                    getModal: () => ({
                        open: false,
                        property: {},
                        contact: {},
                        route: { path: '' }
                    }),
                    addModal: () => {}
                },
                setLiveMarker: () => {}
            };

            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                language: 'en-GB',
                siteId: 'test',
                features: { useSocialWidgets: false },
                plpFullScreenSticky: false
            });

            context.language = require('../../../config/sample/master/translatables.json').i18n;

            wrappedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <ListView {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            renderedComponent = TestUtils.findRenderedComponentWithType(
                wrappedComponent,
                ListView
            );
        });

        afterEach(function() {
            window.cbreSiteType = undefined;
            props = undefined;
            context = undefined;
            wrappedComponent = null;
            renderedComponent = null;
        });

        it('should create references to properties and groups', function() {
            expect(
                renderedComponent.cards.hasOwnProperty(
                    'propertyCard_GB_Plus_27877'
                )
            ).toBe(true);
            expect(
                renderedComponent.cardGroups.hasOwnProperty('cardGroup_group_0')
            ).toBe(true);
        });

        it('should scroll listview to the selected item', function() {
            const $cardList = findDOMNode(
                renderedComponent.refs.propertyCardList
            );
            const $spinTo = renderedComponent.cardGroups.cardGroup_group_0;
            expect($cardList.scrollTop).toEqual($spinTo.offsetTop);
        });
    });
});
