import React from 'react';
import PropTypes from 'prop-types';
import PropertyCard from '../PropertyCard';
import Size from '../../../components/Property/PropertyComponents/Size';
import { Link } from 'react-router';
import TranslateString from '../../../utils/TranslateString';
import { Card } from '../../../external-libraries/agency365-components/components';

import getAppContext from '../../../utils/getAppContext';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType, findAllWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

const language = require('../../../config/sample/master/translatables.json')
    .i18n;

describe('Component', function() {
    describe('<PropertyCard />', function() {
        let props;
        let context;

        beforeEach(function() {
            props = {
                property: require('../../../../test/stubs/processedPropertyStub'),
                siteType: 'residential',
                spaPath: {
                    path: '/path',
                    subPath: '/subPath'
                }
            };
            context = getAppContext();
            context.stores.ConfigStore.setItem('searchConfig', {
                searchResultsPage: props.spaPath.path
            });
            context.stores.ConfigStore.setItem('features', {
                childListings: { enableChildListings: false }
            });
            context.language = language;

            shallowRenderer = createRenderer();
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
        });

        describe('#render()', function() {
            it('should render a Card component', function() {
                shallowRenderer.render(<PropertyCard {...props} />, context);
                let renderedComponent = shallowRenderer.getRenderOutput();
                expect(findAllWithType(renderedComponent, Card).length).toBe(1);
                expect(
                    findAllWithClass(renderedComponent, 'card_listings_count')
                        .length
                ).toBe(0);
            });

            describe('enableChildListings', function() {
                it('should render a Card component with IsParent and enableChildListing both true', function() {
                    props.property.IsParent = true;
                    context.stores.ConfigStore.setItem('features', {
                        childListings: { enableChildListings: true }
                    });
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    expect(
                        findAllWithClass(
                            renderedComponent,
                            'card_listings_count'
                        ).length
                    ).toBe(1);
                });
            });

            describe('the available on request subtitle', function() {
                it('should render the subtitle if location is not exact', function() {
                    props.property.GeoLocation.exact = false;
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    expect(
                        findAllWithClass(
                            renderedComponent,
                            'cbre_addressOnRequest'
                        ).length
                    ).toBe(1);
                });
                it('should not render the subtitle if location is not exact', function() {
                    props.property.GeoLocation.exact = true;
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    expect(
                        findAllWithClass(
                            renderedComponent,
                            'cbre_addressOnRequest'
                        ).length
                    ).toBe(0);
                });
            });

            describe('the propertyLink', function() {
                it('should render Link components if its the default widget', function() {
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    expect(
                        findAllWithType(renderedComponent, Link).length
                    ).toBe(2);
                });

                it("should render anchor components if it's not the default widget", function() {
                    context.stores.ConfigStore.setItem('searchConfig', {
                        searchResultsPage: '/something'
                    });
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    expect(findAllWithType(renderedComponent, 'a').length).toBe(
                        2
                    );
                });

                it('should follow structure /path/subpath/propertyId/... by default', function() {
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    const link = findAllWithType(renderedComponent, Link)[0];
                    expect(link.props.to.pathname).toBe(
                        '/path/details/GB_Plus_27877/line1-line2'
                    );
                });
            });

            describe('the number of bedrooms', function() {
                it('should pass NumberOfBedrooms TranslationString studio', function() {
                    props.property.NumberOfBedrooms = 0;
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    const bedrooms = findAllWithType(
                        renderedComponent,
                        TranslateString
                    )[0];
                    expect(bedrooms.props.bedroomCount).toBe(undefined);
                    expect(bedrooms.props.string).toBe('Studio');
                    expect(
                        findAllWithType(renderedComponent, Size).length
                    ).toEqual(0);
                });

                it('should pass NumberOfBedrooms TranslationString singular', function() {
                    props.property.NumberOfBedrooms = 1;
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    const bedrooms = findAllWithType(
                        renderedComponent,
                        TranslateString
                    )[0];
                    expect(bedrooms.props.bedroomCount).toBe(1);
                    expect(bedrooms.props.string).toBe(
                        'NumberOfBedroomsSingular'
                    );
                    expect(
                        findAllWithType(renderedComponent, Size).length
                    ).toEqual(0);
                });

                it('should pass NumberOfBedrooms TranslationString plural', function() {
                    props.property.NumberOfBedrooms = 2;
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    const bedrooms = findAllWithType(
                        renderedComponent,
                        TranslateString
                    )[0];
                    expect(bedrooms.props.bedroomCount).toBe(2);
                    expect(bedrooms.props.string).toBe(
                        'NumberOfBedroomsPlural'
                    );
                    expect(
                        findAllWithType(renderedComponent, Size).length
                    ).toEqual(0);
                });

                it('should render size after bedrooms if feature is enabled', function() {
                    context.stores.ConfigStore.setConfig({
                        features: {
                            displaySizeInSideHeader: true
                        }
                    });
                    props.property.NumberOfBedrooms = 2;
                    shallowRenderer.render(
                        <PropertyCard {...props} />,
                        context
                    );
                    let renderedComponent = shallowRenderer.getRenderOutput();
                    const bedrooms = findAllWithType(
                        renderedComponent,
                        TranslateString
                    )[0];
                    expect(bedrooms.props.bedroomCount).toBe(2);
                    expect(bedrooms.props.string).toBe(
                        'NumberOfBedroomsPlural'
                    );
                    expect(
                        findAllWithType(renderedComponent, Size).length
                    ).toEqual(1);
                });
            });
        });
    });
});
