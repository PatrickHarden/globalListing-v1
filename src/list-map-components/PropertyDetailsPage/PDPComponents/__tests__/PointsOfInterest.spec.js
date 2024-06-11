import React from 'react';
import PropTypes from 'prop-types';
import getAppContext from '../../../../utils/getAppContext';
import PointsOfInterest from '../PointsOfInterest';
import property from '../../../../../test/stubs/processedPropertyCommercialStub';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType, findWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('Component', () => {
    describe('<PointsOfInterest />', () => {
        let props;
        let language;
        let context;
        let poiContainer;
        let poi;
        let poiItems;

        beforeEach(() => {
            props = {
                property: Object.assign({}, property),
                breakpoints: {
                    isMobile: true
                }
            };
            language = require('../../../../config/sample/master/translatables.json')
                .i18n;
            context = getAppContext();
            context.stores.ConfigStore.setConfig({
                language: 'en-GB',
                countryCode: 'UK',
                siteType: 'uk-resi',
                searchResultsPage: '/something'
            });
            context.language = language;

            poiContainer = shallowRenderer.render(
                <PointsOfInterest {...props} />,
                context
            );
            poi = findWithClass(poiContainer, 'cbre_bulletList');
            poiItems = findAllWithType(poi, 'li');
        });

        afterEach(() => {
            props = undefined;
            language = undefined;
            context = undefined;
            poiContainer = undefined;
            poi = undefined;
            poiItems = undefined;
        });

        describe('#render()', () => {
            it('should render POIs', () => {
                expect(poi).not.toBe(null);
                expect(poiItems.length).toEqual(3);
            });

            it('should pass details to translatestring', () => {
                const poiProps = poiItems[1].props.children.props;
                expect(poiProps.name).toEqual('Airport');
                expect(poiProps.amount).toEqual('15');
            });

            it('should use the pluralised translation string when more than one item', () => {
                const poiProps = poiItems[1].props.children.props;
                expect(poiProps.units).toEqual('kilometres');
            });

            describe('singular translation string', () => {
                beforeEach(() => {
                    props.property.PointsOfInterest[1].distance[0].amount = 1.0;
                    poiContainer = shallowRenderer.render(
                        <PointsOfInterest {...props} />,
                        context
                    );
                    poi = findWithClass(poiContainer, 'cbre_bulletList');
                    poiItems = findAllWithType(poi, 'li');
                });

                it('should use the singular translation string when single unit', () => {
                    const poiProps = poiItems[1].props.children.props;
                    expect(poiProps.units).toEqual('kilometre');
                });
            });

            it('should use the unit name in no translation string exists', () => {
                const poiProps = poiItems[2].props.children.props;
                expect(poiProps.units).toEqual('parsec');
            });
        });
    });
});
