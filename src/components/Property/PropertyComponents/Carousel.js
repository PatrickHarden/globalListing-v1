import React, { Component } from 'react';

import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import DefaultValues from '../../../constants/DefaultValues';
import Swipeable from 'react-swipeable';
import $ from 'jQuery';
import _ from 'lodash';
import 'image-scale';

let _checkTimer = null;

function getMappedBreakpoint(size) {
    const breakpointMap = {
        xsmall: 'small',
        small: 'small',
        medium: 'medium',
        large: 'large'
    };

    return breakpointMap[size];
}

function initialState(items, configStore) {
    const slides = filterSlides(items, configStore);

    return {
        slides: slides,
        currentSlide: 0,
        currentSlideAnimation: '',
        previousSlide: null,
        previousSlideAnimation: '',
        slideCount: slides.length || DefaultValues.slideCount,
        animating: false,
        loading: true,
        autoplay: true,
        initialized: false,
        initializing: true,
        currentBreakpoint: configStore.getCurrentBreakpoint()
    };
}

function filterSlides(slides, configStore) {
    const useCarouselAspectRatioFilter = configStore.getFeatures()
        .useCarouselAspectRatioFilter;

    slides = _.filter(slides, function(slide) {
        return slide.resources.length;
    });

    if (useCarouselAspectRatioFilter) {
        const aspectRatio = configStore.getCarouselAspectRatio().asDecimal;
        const currentBreakpoint = getMappedBreakpoint(
            configStore.getCurrentBreakpoint()
        );

        slides = _.filter(slides, function(slide) {
            const image = _.find(slide.resources, {
                breakpoint: currentBreakpoint
            });
            return image && image.width / image.height >= aspectRatio;
        });
    }

    return slides;
}

export default class CBRECarousel extends Component {
    static defaultProps = {
        transitionDelay: 5000,
        animationDuration: 600
    };

    componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
            this.setState(
                initialState(newProps.items, this.context.stores.ConfigStore),
                this.initializeCarousel
            );
        }
    }

    componentDidMount() {
        this.initializeCarousel();

        this.context.stores.ConfigStore.onChange(
            'BREAKPOINT_UPDATED',
            this._setCurrentBreakpointImage
        );
    }

    componentDidUpdate() {
        if (!this.state.slideCount) {
            return;
        }

        $(ReactDOM.findDOMNode(this.refs.carousel))
            .find('img')
            .off('load');

        if (!this.state.initialized && !this.state.initializing) {
            this.initializeCarousel();
        } else {
            this.autoplay();
        }
    }

    componentWillUnmount() {
        clearTimeout(_checkTimer);
        clearTimeout(this.autoplayTimer);
        $(ReactDOM.findDOMNode(this.refs.carousel))
            .find('img')
            .off('load');
    }

    initializeCarousel = () => {
        clearTimeout(_checkTimer);
        clearTimeout(this.autoplayTimer);

        if (this.state.slideCount) {
            this.setState({
                loading: false,
                initialized: true,
                initializing: false
            });
        }
    };

    autoplay = () => {
        clearTimeout(this.autoplayTimer);

        if (this.state.autoplay) {
            this.autoplayTimer = setTimeout(
                this.next,
                this.props.transitionDelay
            );
        }
    };

    autoplayTimer = null;

    toggleAutoplay = () => {
        if (!this.state.isOpen) {
            this.setState({
                autoplay: !this.state.autoplay
            });
        }
    };

    next = () => {
        this.carouselWillTransition();
    };

    prev = () => {
        this.carouselWillTransition('prev');
    };

    carouselWillTransition = direction => {
        if (this.state.animating) {
            return;
        }

        const slideCount = this.state.slideCount;
        const currentSlide = this.state.currentSlide;
        let nextSlide =
            direction === 'prev' ? currentSlide - 1 : currentSlide + 1;

        if (nextSlide === slideCount) {
            nextSlide = 0;
        } else if (nextSlide === -1) {
            nextSlide = slideCount - 1;
        }

        const nextElement = ReactDOM.findDOMNode(
            this.refs['item-' + nextSlide]
        );

        $(nextElement).imageScale();

        this.setState(
            {
                loading: true
            },
            this.carouselIsTransitioning(direction, currentSlide, nextSlide)
        );
    };

    carouselIsTransitioning = (direction, currentSlide, nextSlide) => {
        this.setState(
            {
                previousSlide: currentSlide,
                previousSlideAnimation:
                    direction === 'prev' ? 'slideOutRight' : 'slideOutLeft',
                currentSlide: nextSlide,
                currentSlideAnimation:
                    direction === 'prev' ? 'slideInLeft' : 'slideInRight',
                animating: true,
                loading: false
            },
            this.carouselDidTransition
        );
    };

    carouselDidTransition = () => {
        setTimeout(
            function() {
                this.setState({
                    previousSlide: null,
                    previousSlideAnimation: '',
                    currentSlideAnimation: '',
                    animating: false
                });
            }.bind(this),
            this.props.animationDuration
        );
    };

    _openCarouselLightbox = (itemIndex, e) => {
        this.props.openLightboxFunc(itemIndex, '_checkTimer', e);
    };

    _setCurrentBreakpointImage = () => {
        const currentBreakpoint = this.context.stores.ConfigStore.getCurrentBreakpoint();

        this.setState({
            currentBreakpoint: currentBreakpoint
        });
    };

    _getMappedBreakpoint = size => {
        return getMappedBreakpoint(size);
    };

    state = initialState(this.props.items, this.context.stores.ConfigStore);

    render() {
        const slides = this.state.slides,
            images = [],
            loading = null,
            language = this.context.language,
            cdnUrl = this.context.stores.ConfigStore.getItem('cdnUrl');

        // No image handling.
        if (!slides.length) {
            slides.push({
                caption: language.NoImageAvailable,
                resources: [
                    {
                        height: 480,
                        width: 640,
                        uri: this.context.stores.ConfigStore.getItem(
                            'smallPlaceholderImageUrl'
                        ),
                        breakpoint: 'small',
                        isPlaceHolder: true
                    },
                    {
                        height: 960,
                        width: 1280,
                        uri: this.context.stores.ConfigStore.getItem(
                            'mediumPlaceholderImageUrl'
                        ),
                        breakpoint: 'medium',
                        isPlaceHolder: true
                    },
                    {
                        height: 1200,
                        width: 1600,
                        uri: this.context.stores.ConfigStore.getItem(
                            'largePlaceholderImageUrl'
                        ),
                        breakpoint: 'large',
                        isPlaceHolder: true
                    }
                ]
            });
        }

        slides.forEach(
            function(slide, itemIndex) {
                let className = 'pdp-carousel-item',
                    resources = slide['resources'];

                if (itemIndex === this.state.currentSlide) {
                    className +=
                        ' pdp-carousel-item--active ' +
                        this.state.currentSlideAnimation;
                } else if (itemIndex === this.state.previousSlide) {
                    className += ' ' + this.state.previousSlideAnimation;
                }

                // Loop through resources and render asset that matches current breakpoint.
                resources.forEach(
                    function(resource, index) {
                        const mappedBreakpoint = this._getMappedBreakpoint(
                            this.state.currentBreakpoint
                        );

                        if (resources[index].breakpoint === mappedBreakpoint) {
                            const uri = resources[index].uri;
                            const url =
                                uri.split('//').length > 1 ? uri : cdnUrl + uri;

                            const containerStyle = {
                                backgroundImage: 'url(' + url + ')'
                            };

                            // Render resources.
                            images.push(
                                <div
                                    style={containerStyle}
                                    onClick={this._openCarouselLightbox.bind(
                                        this,
                                        itemIndex
                                    )}
                                    key={itemIndex}
                                    className={className}
                                />
                            );
                        }
                    }.bind(this)
                );
            }.bind(this)
        );

        const carouselProps = {
            className:
                'pdp-carousel' +
                (this.state.slideCount < 2 ? ' pdp-carousel--single' : ''),
            ref: 'carousel',
            onMouseOver: this.toggleAutoplay,
            onMouseOut: this.toggleAutoplay
        };

        return (
            <div {...carouselProps}>
                {loading}
                <div className={'pdp-carousel-control-count-wrapper container'}>
                    <div className={'pdp-carousel-control-count'}>
                        <div className={'inner'}>
                            <div
                                className="pdp-carousel-control pdp-carousel-control--previous"
                                onClick={this.prev}
                            >
                                <span className="glyphicon glyphicon-chevron-left" />
                            </div>
                            <div className="pdp-carousel-count">
                                {this.state.currentSlide + 1}{' '}
                                {language.PdpCarouselSlideIndexOfText}{' '}
                                {this.state.slideCount}
                            </div>
                            <div
                                className="pdp-carousel-control pdp-carousel-control--next"
                                onClick={this.next}
                            >
                                <span className="glyphicon glyphicon-chevron-right" />
                            </div>
                        </div>
                    </div>
                </div>
                <Swipeable onSwipingRight={this.prev} onSwipingLeft={this.next}>
                    <div className={'pdp-carousel-images'}>{images}</div>
                </Swipeable>
            </div>
        );
    }
}

CBRECarousel.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

CBRECarousel.propTypes = {
    items: PropTypes.array.isRequired,
    transitionDelay: PropTypes.number,
    animationDuration: PropTypes.number,
    openLightboxFunc: PropTypes.func
};
