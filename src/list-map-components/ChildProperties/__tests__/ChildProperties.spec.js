import React from 'react';
import PropTypes from 'prop-types';
import ChildProperties from '../ChildProperties';
import CollapsibleBlock from '../../CollapsibleBlock/CollapsibleBlock';
import PropertyCard from '../../PropertyCard/PropertyCard';
import { ExpandableContent } from '../../../external-libraries/agency365-components/components';
import getAppContext from '../../../utils/getAppContext';
import CardLoader from '../../CardLoader/CardLoader';
import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';
import findAllWithClass from 'react-shallow-testutils/lib/find-all-with-class';
let shallowRenderer = createRenderer();
describe('Component', function() {
    describe('<ChildProperties />', function() {
        let props;
        let context;
        let component;

        beforeEach(function() {
            props = {
                childProperties: {},
                breakpoints: {
                    isMobile: false
                }
            };
            context = getAppContext();
            context.language = require('../../../config/sample/master/translatables.json').i18n;
            context.stores.ConfigStore.setConfig({
                features: {
                    childListings: {
                        enableChildListings: true
                    }
                }
            });
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
            component = undefined;
        });

        describe('#render()', function() {
            it('should render 3 CardLoader while childProperties is empty and is not mobile', function() {
                shallowRenderer.render(<ChildProperties {...props} />, context);
                component = shallowRenderer.getRenderOutput();

                expect(findAllWithType(component, CardLoader).length).toBe(3);
            });

            it('should render 3 CardLoader while childProperties is empty and is mobile', function() {
                props = {
                    childProperties: {},
                    breakpoints: {
                        isMobile: true
                    }
                };
                shallowRenderer.render(<ChildProperties {...props} />, context);
                component = shallowRenderer.getRenderOutput();

                expect(findAllWithType(component, CardLoader).length).toBe(1);
            });

            it('should return null if related properties call fails', function() {
                props = {
                    childProperties: {
                        properties: [],
                        status: false
                    }
                };
                shallowRenderer.render(<ChildProperties {...props} />, context);
                component = shallowRenderer.getRenderOutput();
                expect(component).toBe(null);
            });

            describe('When childProperties is populated', function() {
                beforeEach(function() {
                    props = {
                        childProperties: {
                            properties: [
                                { propertyId: 1 },
                                { propertyId: 2 },
                                { propertyId: 3 },
                                { propertyId: 4 },
                                { propertyId: 5 },
                                { propertyId: 6 },
                                { propertyId: 7 },
                                { propertyId: 8 },
                                { propertyId: 9 },
                                { propertyId: 10 },
                                { propertyId: 11 },
                                { propertyId: 12 }
                            ],
                            status: true
                        }
                    };
                });

                it('should render a CollapsibleBlock component', function() {
                    shallowRenderer.render(
                        <ChildProperties {...props} />,
                        context
                    );
                    component = shallowRenderer.getRenderOutput();

                    expect(
                        findAllWithType(component, CollapsibleBlock).length
                    ).toBe(1);
                });
                it('should render an ExpandableContent block with default of 10 Property Cards when no limit is set', function() {
                    context.stores.ConfigStore.setConfig({
                        features: {
                            childListings: {
                                enableChildListings: true
                            }
                        }
                    });
                    shallowRenderer.render(
                        <ChildProperties {...props} />,
                        context
                    );
                    component = shallowRenderer.getRenderOutput();

                    expect(
                        findAllWithType(component, ExpandableContent).length
                    ).toBe(1);
                    expect(
                        findAllWithType(component, ExpandableContent)[0].props
                            .limit
                    ).toBe(10);
                });
                it('should render an ExpandableContent block with limit of 3 Property Cards when limit is set to 3', function() {
                    context.stores.ConfigStore.setConfig({
                        features: {
                            childListings: {
                                enableChildListings: true,
                                limitChildListings: 3
                            }
                        }
                    });
                    shallowRenderer.render(
                        <ChildProperties {...props} />,
                        context
                    );
                    component = shallowRenderer.getRenderOutput();

                    expect(
                        findAllWithType(component, ExpandableContent).length
                    ).toBe(1);
                    expect(
                        findAllWithType(component, ExpandableContent)[0].props
                            .limit
                    ).toBe(3);
                });
            });
        });
    });
});
