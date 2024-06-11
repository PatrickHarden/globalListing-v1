import React from 'react';
import ReactDOM from 'react-dom';
import UnderOfferBanner from '../UnderOfferBanner';
import TestUtils from 'react-dom/test-utils';
import { createRenderer } from 'react-test-renderer/shallow';

describe('Component', function() {
    describe('<UnderOfferBanner />', function() {
        const renderer = createRenderer();

        describe('#render()', function() {
            it('should render an under offer banner and banner text when underOffer prop is set', function() {
                renderer.render(
                    <UnderOfferBanner
                        underOffer={true}
                        displayText={'someBannerText'}
                    />
                );

                const output = renderer.getRenderOutput();
                expect(output.props.className).toBe('flag flag__text');
                expect(output.props.children).toBe('someBannerText');
            });

            it('should override wrapper class when wrapperClass prop is set', function() {
                renderer.render(
                    <UnderOfferBanner
                        underOffer={true}
                        displayText={'someText'}
                        wrapperClass={'wrapperClassOverride'}
                    />
                );

                const output = renderer.getRenderOutput();
                expect(output.props.className).toBe('wrapperClassOverride');
            });
        });
    });
});
