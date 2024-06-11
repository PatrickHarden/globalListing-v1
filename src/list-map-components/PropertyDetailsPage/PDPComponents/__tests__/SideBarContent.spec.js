import React from 'react';
import PropTypes from 'prop-types';
import SideBarContent from '../SideBarContent';
import { List, Button, FontIcon } from '../../../../external-libraries/agency365-components/components';
import getAppContext from '../../../../utils/getAppContext';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType, findAllWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('SideBarContent', function() {
    describe('when component mounts', function() {
        let SideBarContentComponent;
        const context = getAppContext();
        context.language = require('../../../../config/sample/master/translatables.json').i18n;

        context.stores.ConfigStore.setConfig({
            features: {
                jumpToChildProperties: false,
                hideArrangeViewingOnParent: false
            }
        });

        const props = {
            property: {
                Highlights: [],
                Website: 'www.somewebsite.com',
                FloorPlans: [
                    {
                        resources: [
                            {
                                height: 240,
                                uri: 'http://some-imageurl.jpg',
                                width: 320
                            }
                        ]
                    }
                ],
                ContactGroup: {
                    name: 'Canary Wharf Sales',
                    address: {
                        line1: 'CBRE Ltd',
                        line2: 'Millennium Harbour',
                        line4: '22 Westferry Road',
                        locality: 'London',
                        country: 'GB',
                        line3: '',
                        region: '',
                        postcode: ''
                    },
                    contacts: [
                        {
                            email: 'residential.canarywharf@cbre.com',
                            telephone: '+44 (0)20 7519 5900',
                            name: 'Canary Wharf Sales',
                            avatar: ''
                        }
                    ],
                    avatar: '',
                    website: ''
                },
                EnergyPerformanceData: {
                    ukuri: 'an-EPC.png'
                },
                Brochures: [
                    {
                        uri: 'Brochure1.pdf',
                        culture: 'en-GB'
                    },
                    {
                        uri: 'Brochure3.pdf',
                        brochureName: 'Brochure 3',
                        culture: 'en-GB'
                    }
                ],
                VideoLinks: [
                    {
                        uri: 'https://www.youtube.com',
                        videoName: 'Video 1',
                        culture: 'en-GB'
                    },
                    {
                        uri: 'https://www.google.com',
                        videoName: 'Video 2',
                        culture: 'en-GB'
                    }
                ]
            },
            breakpoints: {
                isMobile: true
            },
            siteType: 'residential',
            showContactForm: function() {},
            openLightboxFunc: function() {}
        };

        beforeEach(function() {
            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...props} />,
                context
            );
        });

        afterEach(function() {
            SideBarContentComponent = undefined;
        });

        it('should render an arrange a viewing button with secondary button classes when siteType is resi', function() {
            const viewingButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const viewingButtonClasses = viewingButton[1].props.className;

            expect(viewingButtonClasses).toEqual(
                'cbre_button cbre_button__flat row cbre_button__secondary'
            );
        });

        it('should render an arrange a viewing button with secondary button classes when siteType is commercial', function() {
            let newProps = Object.assign({}, props);
            newProps.siteType = 'commercial';

            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...newProps} />,
                context
            );
            const viewingButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const viewingButtonClasses = viewingButton[0].props.className;
            expect(viewingButtonClasses).toEqual(
                'cbre_button cbre_button__flat row cbre_button__secondary'
            );
        });

        it('should NOT render a list of features if property.Highlights does not exists', function() {
            expect(
                findAllWithType(SideBarContentComponent, List).length
            ).toEqual(0);
        });

        it('should render a list of features using <List> component if property.Highlights exists', function() {
            props.property.Highlights = ['hot tub', 'time machine', 'waterbed'];

            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...props} />,
                context
            );
            expect(
                findAllWithType(SideBarContentComponent, List).length
            ).toEqual(1);
        });

        it('should render a floorplan buttom  with onClick handler when FloorPlans array is available via props with a .jpg', function() {
            const floorplanButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const floorPlanOnClick = floorplanButton[1].props.onClick;
            const floorplanButtonIcon = findAllWithType(
                SideBarContentComponent,
                FontIcon
            );
            const floorplanIconName = floorplanButtonIcon[1].props.iconName;

            expect(typeof floorPlanOnClick).toBe('function');
            expect(floorplanIconName).toEqual('icon_layers');
        });

        it('should render a floorplan link when FloorPlans array is available via props with a .pdf as uri', function() {
            let newProps = Object.assign({}, props);
            newProps.property.FloorPlans = [
                {
                    resources: [
                        {
                            height: 240,
                            uri: 'http://some-imageurl.pdf',
                            width: 320
                        }
                    ]
                }
            ];

            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...newProps} />,
                context
            );
            const floorplanButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const floorPlanLink = floorplanButton[2].props.link;
            const floorplanButtonIcon = findAllWithType(
                SideBarContentComponent,
                FontIcon
            );
            const floorplanIconName = floorplanButtonIcon[1].props.iconName;

            expect(floorPlanLink).toEqual('http://some-imageurl.pdf');
            expect(floorplanIconName).toEqual('icon_layers');
        });

        it('should render a website link  when Website is available via props', function() {
            const websiteButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const websiteLink = websiteButton[7].props.link;
            expect(websiteLink).toEqual('www.somewebsite.com');
        });

        it('should render an EPC link when a UK EPC doc link is available via props in EnergyPerformanceData', function() {
            const websiteButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const websiteLink = websiteButton[8].props.link;
            expect(websiteLink).toEqual('an-EPC.png');
        });

        describe('Resi contact button', () => {
            let contactButton;

            beforeEach(() => {
                contactButton = findAllWithType(
                    SideBarContentComponent,
                    Button
                )[0];
            });

            it('should create a tel: link with spaces removed', () => {
                expect(contactButton.props.link).toEqual(
                    'tel:+44(0)2075195900'
                );
            });
        });

        it('should not render an arrange a viewing button when hideArrangeViewingOnParent is true', function() {
            let newProps = Object.assign({}, props);
            newProps.siteType = 'commercial';
            context.stores.ConfigStore.setConfig({
                features: {
                    jumpToChildProperties: false,
                    hideArrangeViewingOnParent: true,
                    childListings: {
                        enableChildListings: true
                    }
                }
            });

            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...newProps} />,
                context
            );

            const viewingButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const viewingButtonClasses = viewingButton[0].props.className;
            expect(
                viewingButton[0].props.children.props.children[1].props.children
            ).not.toContain('Arrange a viewing');

            expect(viewingButtonClasses).toEqual(
                'cbre_button cbre_button__flat row cbre_button__secondary'
            );
        });
        it('should render an view child properties link if jumpToChildProperties is true', function() {
            let newProps = Object.assign({}, props);
            newProps.siteType = 'commercial';
            context.stores.ConfigStore.setConfig({
                features: {
                    jumpToChildProperties: true,
                    hideArrangeViewingOnParent: true,
                    childListings: {
                        enableChildListings: true
                    }
                }
            });

            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...newProps} />,
                context
            );

            const viewingButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const viewingButtonClasses = viewingButton[0].props.className;
            expect(
                viewingButton[0].props.children.props.children[1].props.children
            ).toContain('View child properties');

            expect(viewingButtonClasses).toEqual(
                'cbre_button cbre_button__flat row cbre_button__secondary'
            );
        });
        it('should render brochure using BrochureName if exists', function() {
            const websiteButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const websiteLink = websiteButton[4].props;
            expect(websiteLink.link).toEqual('Brochure3.pdf');
            expect(websiteLink.children[0]).toEqual('Brochure 3');
        });
        it('should render generic brochure name if BrochureName does not exists and displayGenericBrochureName is true', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displayGenericBrochureName: true
                }
            });

            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...props} />,
                context
            );
            const websiteButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const websiteLink = websiteButton[3].props;
            expect(websiteLink.link).toEqual('Brochure1.pdf');
            expect(websiteLink.children[0]).toEqual('Document 1');
        });
        it('should render brochure file name if BrochureName does not exists and displayGenericBrochureName is false', function() {
            context.stores.ConfigStore.setConfig({
                features: {
                    displayGenericBrochureName: false
                }
            });
            SideBarContentComponent = shallowRenderer.render(
                <SideBarContent {...props} />,
                context
            );
            const websiteButton = findAllWithType(
                SideBarContentComponent,
                Button
            );
            const websiteLink = websiteButton[3].props;
            expect(websiteLink.link).toEqual('Brochure1.pdf');
            expect(websiteLink.children[0]).toEqual('Brochure1.pdf');
        });

        it('should render video using videoDescription if exists', function() {
            const websiteButton = findAllWithType(
                SideBarContentComponent,
                Button
            );

            const videoLink = websiteButton[5].props;
            expect(videoLink.link).toEqual('https://www.youtube.com');
            expect(videoLink.children[0]).toEqual('Video 1');
        });
    });
});
