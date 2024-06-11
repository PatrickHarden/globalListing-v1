import React from 'react';
import ListingCount from '../ListingCount';
import TranslateString from '../../../utils/TranslateString';

import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';
let shallowRenderer = createRenderer();

describe('Component', function() {
    describe('<ListingCount />', function() {
        let props;
        let context;
        let component;

        beforeEach(function() {
            props = {
                propertyId: '123'
            };
            context = {};
            context.language = require('../../../config/sample/master/translatables.json').i18n;
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
            component = undefined;
        });

        describe('#render()', function() {
            it('should render a Loading Text while listingCount is empty', function() {
                shallowRenderer.render(<ListingCount {...props} />, context);
                component = shallowRenderer.getRenderOutput();

                expect(findAllWithType(component, TranslateString).length).toBe(
                    1
                );
                expect(
                    findAllWithType(component, TranslateString)[0].props.string
                ).toEqual('EventButtonLoadingText');
            });

            ///TODO: Need to add in more tests for this
        });
    });
});
