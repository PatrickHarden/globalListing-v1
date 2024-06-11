import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import getAppContext from '../../../utils/getAppContext';
import property from '../../../../test/stubs/processedPropertyStub';
import Carousel from '../Carousel';
import Slider from 'react-slick';
import PropertyCard from '../../PropertyCard/PropertyCard';
import { MediaWrapper } from '../../../external-libraries/agency365-components/components';
import { createRenderer } from 'react-test-renderer/shallow';
import { findAllWithType } from 'react-shallow-testutils';

describe('Component', function() {
    describe('<Carousel />', function() {
        const renderer = createRenderer();
        const context = getAppContext();
        const items = ['slide', 'slide'];

        beforeEach(function() {
            this.props = {
                wrapperClass: 'someNewWrapperClass',
                carouselItemsClass: 'someNewCarouselItemsClass'
            };
        });

        afterEach(function() {
            this.props = undefined;
        });

        describe('#render()', function() {
            it('should render a carousel when items prop contains an array of content', function() {
                renderer.render(<Carousel items={items} />, context);

                const output = renderer.getRenderOutput();
                expect(findAllWithType(output, Slider).length).toBe(1);
            });

            it('should NOT render any element when no items are passed', function() {
                renderer.render(<Carousel items={[]} />, context);

                const output = renderer.getRenderOutput();
                expect(output).toEqual(null);
            });

            xit('should change the infinite prop to false if items.length is less than or equal to slidesToShow', function() {
                renderer.render(
                    <Carousel items={items} slidesToShow={3} infinite={true} />,
                    context
                );

                const output = renderer.getRenderOutput();
                const carouselItemsElement = expect(findAllWithType(output, Slider)[0]).props;
                expect(carouselItemsElement.infinite).toEqual(false);
            });
        });

        describe('#getMediaSlide()', function() {
            it('should render items as MediaWrapper components', function() {
                renderer.render(<Carousel items={property.Photos} />, context);

                const output = renderer.getRenderOutput();
                expect(findAllWithType(output, MediaWrapper).length).toBe(3);
            });
        });

        describe('#getCardSlide()', function() {
            it('should render items as PropertyCard components', function() {
                renderer.render(
                    <Carousel
                        type="Card"
                        items={[{ slide: 'slide' }, { slide: 'slide' }]}
                    />,
                    context
                );

                const output = renderer.getRenderOutput();
                expect(findAllWithType(output, PropertyCard).length).toBe(2);
            });
        });
    });
});
