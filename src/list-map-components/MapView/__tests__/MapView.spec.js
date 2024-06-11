import React from 'react';
import PropTypes from 'prop-types';
import MapView from '../MapView';
import { createRenderer } from 'react-test-renderer/shallow';
import { findWithClass } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('MapView component', function() {
    let props;
    let context;
    describe('rendering properties', function() {
        beforeEach(function() {
            window.cbreSiteType = 'residential';
            props = {
                searchType: 'isLetting',
                searchResultsPage: '/'
            };

            context = {
                language: require('../../../config/sample/master/translatables.json')
                    .i18n
            };
        });

        afterEach(function() {
            window.cbreSiteType = undefined;
            props = undefined;
            context = undefined;
        });

        it('should render a list of properties', function() {
            props.properties = [
                {
                    PropertyId: 'GB-ReapIT-cbrrps-BOW160091',
                    ActualAddress: {
                        country: 'GB',
                        line1: 'Gosfield Street',
                        line2: 'Fitzrovia',
                        postcode: 'W1W',
                        locality: 'London'
                    },
                    Highlights: [],
                    Coordinates: {
                        lat: 51.51361,
                        lon: -0.141723
                    }
                },
                {
                    PropertyId: 'GB-ReapIT-cbrrps-BOW160091',
                    ActualAddress: {
                        country: 'GB',
                        line1: 'Gosfield Street',
                        line2: 'Fitzrovia',
                        postcode: 'W1W',
                        locality: 'London'
                    },
                    Highlights: [],
                    Coordinates: {
                        lat: 51.51361,
                        lon: -0.141723
                    }
                }
            ];

            shallowRenderer.render(<MapView {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            let wrapperElement = findWithClass(renderedComponent, 'cbre_map');
            let childProperties =
                wrapperElement.props.children.props.children.props.properties;
            expect(childProperties.length === 2).toBe(true);
        });
    });
});
