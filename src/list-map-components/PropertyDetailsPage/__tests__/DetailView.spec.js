import React from 'react';
import PropTypes from 'prop-types';
import getAppContext from '../../../utils/getAppContext';
import { DetailViewCommercialTest } from '../DetailView.commercial';
import ExpandableText from '../../ExpandableText/ExpandableText';
import CollapsibleBlock from '../../CollapsibleBlock/CollapsibleBlock';
import SizesAndMeasurements from '../PDPComponents/SizesAndMeasurements';
import PropertyNavigation from '../../../components/Property/PropertyComponents/PropertyNavigation';
import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType, findAllWithClass } from 'react-shallow-testutils';
import LeaseAndCharges from '../PDPComponents/LeaseAndCharges';
let shallowRenderer = createRenderer();

describe('DetailView', function() {
    describe('Location Description', function() {
        let props;
        let context;
        let renderedComponent;
        let expandableTexts;
        let collapsibleBlocks;

        beforeEach(function() {
            props = {
                property: {
                    ActualAddress: {
                        country: 'GB',
                        line1: 'Gosfield Street',
                        line2: 'Fitzrovia',
                        postcode: 'W1W',
                        locality: 'London'
                    },
                    Aspect: [],
                    Coordinates: {
                        lat: 51.518065,
                        lon: -0.117154
                    },
                    LongDescription: 'long string goes here',
                    Comments: '',
                    Photos: []
                },
                breakpoints: {
                    isMobile: true
                },
                params: 'GB_Plus_27878',
                siteType: 'commercial',
                modal: {
                    getModal: () => ({
                        open: false,
                        property: {},
                        contact: {},
                        route: { path: '' }
                    }),
                    addModal: () => {}
                }
            };
            context = getAppContext();
            context.language = require('../../../config/sample/master/translatables.json').i18n;
            context.stores.ConfigStore.setConfig({
                language: 'en-GB',
                countryCode: 'UK',
                siteType: 'uk-comm',
                searchResultsPage: '/something',
                features: {
                    propertyNavigation: true
                }
            });
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
            renderedComponent = undefined;
            expandableTexts = undefined;
            collapsibleBlocks = undefined;
        });

        describe('#render()', function() {
            it('should render an collabsible block for location description if description title is available', function() {
                props.property.LocationDescription = {
                    culture: 'en-GB',
                    content:
                        "The Pariser Platz is the gateway to the new Dorotheenstadt with the streets Unter den Linden , Wilhelmstrasse and Dorotheenstraße . Dert iergarten , Berlin's green lung , is equal vis á vis the object . Many restaurants are located in the immediate vicinity. The connection to the public transport is very good : the subway and train stations Brandenburg gate and Potsdamer Platz , and several bus lines are in close proximity , the main station is reachable in a few minutes."
                };
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'locationBlock'
                )[0];
                expect(collapsibleBlocks.props.title).toEqual(
                    'Location Description'
                );
            });

            it('should render an collabsible block for location description if description content is available', function() {
                props.property.LocationDescription = {
                    culture: 'en-GB',
                    content:
                        "The Pariser Platz is the gateway to the new Dorotheenstadt with the streets Unter den Linden , Wilhelmstrasse and Dorotheenstraße . Dert iergarten , Berlin's green lung , is equal vis á vis the object . Many restaurants are located in the immediate vicinity. The connection to the public transport is very good : the subway and train stations Brandenburg gate and Potsdamer Platz , and several bus lines are in close proximity , the main station is reachable in a few minutes."
                };
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'locationBlock'
                )[0];
                expect(collapsibleBlocks.props.children).toBeTruthy();
            });

            it('should not render an collapsible block for location description if description content is not available', function() {
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'locationBlock'
                );
                expect(collapsibleBlocks.length).toBe(0);
            });
            it('should show the Size and Measurements section if parent and hideFeature is disabled', function() {
                const features = context.stores.ConfigStore.getItem('features');
                const newFeatures = {
                    ...features,
                    hideSizesAndMeasurementsOnParent: false
                };
                props.property.IsParent = true;
                props.property.Sizes = [
                    {
                        sizeKind: 'FrontageWidth',
                        dimensions: {
                            units: 'ft',
                            area: 45.5
                        }
                    }
                ];

                context.stores.ConfigStore.setItem('features', newFeatures);
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                const component = findAllWithClass(
                    renderedComponent,
                    'sizesBlock'
                );
                expect(component.length).toBe(1);
            });
            it('should hide the Size and Measurements section if parent and hideFeature is enabled', function() {
                const features = context.stores.ConfigStore.getItem('features');
                const newFeatures = {
                    ...features,
                    hideSizesAndMeasurementsOnParent: true
                };
                props.property.IsParent = true;
                props.property.Sizes = [
                    {
                        sizeKind: 'FrontageWidth',
                        dimensions: {
                            units: 'ft',
                            area: 45.5
                        }
                    }
                ];

                context.stores.ConfigStore.setItem('features', newFeatures);
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                const component = findAllWithClass(
                    renderedComponent,
                    'sizesBlock'
                );
                expect(component.length).toBe(0);
            });
            it('should show the Leases and Charges section if parent and hideFeature is disabled', function() {
                const features = context.stores.ConfigStore.getItem('features');
                const newFeatures = {
                    ...features,
                    hideLeaseAndChargesOnParent: false
                };
                props.property.IsParent = true;

                context.stores.ConfigStore.setItem('features', newFeatures);

                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                const component = findAllWithClass(
                    renderedComponent,
                    'leasesBlock'
                );
                expect(component.length).toBe(1);
            });
            it('should hide the Leases and Charges section if parent and hideFeature is enabled', function() {
                const features = context.stores.ConfigStore.getItem('features');
                const newFeatures = {
                    ...features,
                    hideLeaseAndChargesOnParent: true
                };
                props.property.IsParent = true;

                context.stores.ConfigStore.setItem('features', newFeatures);

                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                const component = findAllWithClass(
                    renderedComponent,
                    'leasesBlock'
                );
                expect(component.length).toBe(0);
            });

            it('should not render an expandable block for energy performance data if content is NOT available', function() {
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'energyBlock'
                );
                expect(collapsibleBlocks.length).toBe(0);
            });

            it('should render an expandable block for energy performance data if content is available', function() {
                props.property.EnergyPerformanceData = {
                    type: 'hello'
                };
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'energyBlock'
                )[0];
                expect(collapsibleBlocks.props.title).toBe(
                    'Energy Performance'
                );
            });

            it('should render an expandable block with a Floorplan img if data is available', function() {
                props.property.FloorPlans = [
                    {
                        caption: 'Floorplan caption',
                        resources: [
                            {
                                height: 240,
                                uri: 'someimageurl.com',
                                width: 320
                            }
                        ]
                    },
                    {
                        caption: 'Floorplan caption 2',
                        resources: [
                            {
                                height: 240,
                                uri: 'someimageurl2.com',
                                width: 320
                            }
                        ]
                    }
                ];

                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'floorBlock'
                )[0];
                expect(collapsibleBlocks.props.title).toBe('Floorplan');
            });

            it('should render Property Navigation', function() {
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                const propertyNavs = findAllWithClass(
                    renderedComponent,
                    'navBlock'
                );

                expect(propertyNavs.length).toBeGreaterThan(0);
            });

            it('should hide the Property Navigation if disabled', function() {
                const features = context.stores.ConfigStore.getItem('features');
                const newFeatures = {
                    ...features,
                    propertyNavigation: false
                };

                context.stores.ConfigStore.setItem('features', newFeatures);

                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                const propertyNavs = findAllWithClass(
                    renderedComponent,
                    'navBlock'
                );

                expect(propertyNavs.length).toBe(0);
            });

            it('should render Leases and Charges', function() {
                const leasesAndCharges = context.stores.ConfigStore.getItem(
                    'leasesAndCharges'
                );
                const newLeasesAndCharges = {
                    ...leasesAndCharges,
                    hideLeaseSection: false
                };
                context.stores.ConfigStore.setItem(
                    'leasesAndCharges',
                    newLeasesAndCharges
                );
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'leasesBlock'
                )[0];
                expect(collapsibleBlocks.props.title).toBe(
                    'Lease Information & Charges'
                );
            });

            it('should hide Leases and Charges if disabled', function() {
                const leasesAndCharges = context.stores.ConfigStore.getItem(
                    'leasesAndCharges'
                );
                const newLeasesAndCharges = {
                    ...leasesAndCharges,
                    hideLeaseSection: true
                };
                context.stores.ConfigStore.setItem(
                    'leasesAndCharges',
                    newLeasesAndCharges
                );
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'leasesBlock'
                );
                expect(collapsibleBlocks.length).toBe(0);
            });
            it('should render Parking if Parking details exist', function() {
                props.property.Parking = {
                    ratio: '1',
                    ratioPer: '200',
                    rationPerUnit: 'sqft',
                    details: [
                        {
                            parkingType: 'Covered',
                            parkingSpace: '100',
                            parkingCharge: [
                                {
                                    amount: 125,
                                    interval: 'Monthly',
                                    currencyCode: 'CAD'
                                }
                            ]
                        }
                    ]
                };
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'parkingBlock'
                )[0];
                expect(collapsibleBlocks.props.title).toBe('Parking');
            });
            it('should not render Parking if Parking details do not exist', function() {
                props.property.Parking = {
                    ratio: '',
                    details: []
                };
                shallowRenderer.render(
                    <DetailViewCommercialTest {...props} />,
                    context
                );
                renderedComponent = shallowRenderer.getRenderOutput();
                collapsibleBlocks = findAllWithClass(
                    renderedComponent,
                    'parkingBlock'
                );
                expect(collapsibleBlocks.length).toBe(0);
            });
        });
    });
});
