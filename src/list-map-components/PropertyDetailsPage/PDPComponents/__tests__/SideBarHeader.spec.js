import React from 'react';
import PropTypes from 'prop-types';
import SideBarHeader from '../SideBarHeader';

import AddressSummary from '../../../../components/Property/PropertyComponents/AddressSummary';
import PriceLabel from '../../../../components/Property/PropertyComponents/PriceLabel';
import Bedrooms from '../../../../components/Property/PropertyComponents/Bedrooms';
import Size from '../../../../components/Property/PropertyComponents/Size';

import getAppContext from '../../../../utils/getAppContext';
const language = require('../../../../config/sample/master/translatables.json')
    .i18n;

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType, findAllWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('SideBarHeader', function() {
    describe('when component mounts', function() {
        let SideBarHeaderComponent;
        let context;

        const props = {
            property: {
                ActualAddress: {},
                NumberOfBedrooms: 2,
                GeoLocation: {},
                PropertyId: '1',
                UseClass: ['A']
            },
            modal: {},

            searchType: 'isSale'
        };

        beforeEach(function() {
            context = getAppContext();
            context.language = language;
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="residential" />,
                context
            );
        });

        afterEach(function() {
            SideBarHeaderComponent = undefined;
            context = undefined;
        });

        it('should render an AddressSummary component', function() {
            expect(
                findAllWithType(SideBarHeaderComponent, AddressSummary).length
            ).toEqual(1);
        });

        describe('the available on request subtitle', function() {
            it('should render the subtitle if location is not exact', function() {
                props.property.GeoLocation.exact = false;
                SideBarHeaderComponent = shallowRenderer.render(
                    <SideBarHeader {...props} siteType="residential" />,
                    context
                );
                expect(
                    findAllWithClass(
                        SideBarHeaderComponent,
                        'cbre_addressOnRequest'
                    ).length
                ).toBe(1);
            });
            it('should not render the subtitle if location is not exact', function() {
                props.property.GeoLocation.exact = true;
                SideBarHeaderComponent = shallowRenderer.render(
                    <SideBarHeader {...props} siteType="residential" />,
                    context
                );
                expect(
                    findAllWithClass(
                        SideBarHeaderComponent,
                        'cbre_addressOnRequest'
                    ).length
                ).toBe(0);
            });
        });

        it('should render an PriceLabel component', function() {
            expect(
                findAllWithType(SideBarHeaderComponent, PriceLabel).length
            ).toEqual(1);
        });

        it('should render a Bedrooms component if in residential mode', function() {
            expect(
                findAllWithType(SideBarHeaderComponent, Bedrooms).length
            ).toEqual(1);
        });

        it('should render a Size component if in commercial mode', function() {
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="commercial" />,
                context
            );
            expect(
                findAllWithType(SideBarHeaderComponent, Size).length
            ).toEqual(1);
        });

        it('should render a Size component if in residential mode and total size is provided and feature is enabled', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displaySizeInSideHeader: true
                }
            });
            props.property.TotalSize = {
                area: '3',
                units: 'sqm'
            };
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="residential" />,
                context
            );
            expect(
                findAllWithType(SideBarHeaderComponent, Bedrooms).length
            ).toEqual(1);
            expect(
                findAllWithType(SideBarHeaderComponent, Size).length
            ).toEqual(1);
        });

        it('should NOT render a Size component if in residential mode and total size is provided and feature is disabled', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displaySizeInSideHeader: false
                }
            });
            props.property.TotalSize = {
                area: '3',
                units: 'sqm'
            };
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="residential" />,
                context
            );
            expect(
                findAllWithType(SideBarHeaderComponent, Bedrooms).length
            ).toEqual(1);
            expect(
                findAllWithType(SideBarHeaderComponent, Size).length
            ).toEqual(0);
        });

        it('should not render a Property ID if displayProperty is set in config', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displayPropertyId: false
                }
            });
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="commercial" />,
                context
            );
            expect(
                findAllWithClass(SideBarHeaderComponent, 'cbre_subh2').length
            ).toEqual(1);
        });
        it('should render a Property ID if displayProperty is set in config', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displayPropertyId: true
                }
            });
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="commercial" />,
                context
            );
            expect(
                findAllWithClass(SideBarHeaderComponent, 'cbre_subh2').length
            ).toEqual(2);
        });
        it('should not render a Business Class if displayUseClass is set in config', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displayUseClass: false
                }
            });
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="commercial" />,
                context
            );
            expect(
                findAllWithClass(SideBarHeaderComponent, 'use-class').length
            ).toEqual(0);
        });
        it('should render a Business Class if displayUseClass is set in config', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displayUseClass: true
                }
            });
            SideBarHeaderComponent = shallowRenderer.render(
                <SideBarHeader {...props} siteType="commercial" />,
                context
            );
            expect(
                findAllWithClass(SideBarHeaderComponent, 'use-class').length
            ).toEqual(1);
        });
    });
});
