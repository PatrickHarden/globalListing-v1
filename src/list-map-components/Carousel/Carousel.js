import PropTypes from "prop-types";
import React, { Component } from "react";
import Slider from "react-slick";
import classNames from "classnames";
import PropertyImage from "../../components/Property/PropertyComponents/PropertyImage";
import PropertyCard_R3 from "../../r3/PLP/PropertyCard/PropertyCard.r3";
import PropertyCard from "../PropertyCard/PropertyCard";
import { MediaWrapper } from "../../external-libraries/agency365-components/components";
import { debounce } from "lodash";
import { DefaultValues } from "../../constants/DefaultValues";
import setImageTag from "../../utils/setImageTag";
import PropertyCard_R4 from "../../r4/PLP/PropertyCard/PropertyCard.r4";
import styled from 'styled-components';

import { Row, Col } from "react-bootstrap";

var siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

class Carousel extends Component {
    componentWillMount = () => {
        window.addEventListener("resize", this.handleResize);
        this.setBreakpointState();
    };

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.handleResize);
    };

    setBreakpointState = () => {
        const isMobile = !!window.matchMedia("(max-width: 767px)").matches;
        this.setState(
            {
                breakpoints: {
                    isMobile
                }
            },
            this.forceUpdate.bind(this)
        );
    };

    getCarouselMedia = () => {
        const { type, items, slideClassName } = this.props;

        return items.map((item, index) => {
            return (
                <div key={index} className={slideClassName}>
                    {this[`get${type}Slide`](item, index)}
                </div>
            );
        });
    };

    getMediaSlide = (item, index) => {
        if (!item.resources) {
            return null;
        }
        let fitWidth;
        let fitHeight;
        if (item.resources[0].width < item.resources[0].height) {
            fitWidth = true;
            fitHeight = false;
        } else {
            fitWidth = false;
            fitHeight = true;
        }

        return (
            <MediaWrapper fitWidth={false} fitHeight={true}>
                <PropertyImage
                    onClick={this.handleOpenLightbox.bind(this, index)}
                    items={item.resources}
                    alt={setImageTag(item.caption, this.props.address, index)}
                    fitHeight={fitHeight && !fitWidth}
                />
            </MediaWrapper>
        );
    };

    handleResize = () => {
        var _this = this;
        var debounced = debounce(function () {
            _this.setBreakpointState();
        }, 500); // Maximum run of once per 500 milliseconds
        return debounced();
    };

    getCardSlide = (item, index) => {
        if (siteTheme == "commercialr3") {
            return (
                <PropertyCard_R3
                    showFavourites={false}
                    property={item}
                    useHardLink={this.props.useHardLink}
                    {...this.props.cardProps}
                    description={
                        this.props.cta && this.props.cta.description
                            ? this.props.cta.description
                            : null
                    }
                    featuredRedesignCarousel={
                        this.props.featuredRedesignCarousel
                    }
                    dynamicImageSizeKey={"pdpCarousel"}
                />
            );
        } else if (siteTheme == "commercialr4") {
            return (
                <PropertyCard_R4
                    showFavourites={false}
                    property={item}
                    index={index}
                    useHardLink={this.props.useHardLink}
                    {...this.props.cardProps}
                    description={
                        this.props.cta && this.props.cta.description
                            ? this.props.cta.description
                            : null
                    }
                    carousel={true}
                    carouselLength={(this.props.items.length) ? this.props.items.length : 0}
                    featuredRedesignCarousel={
                        this.props.featsuredRedesignCarousel
                    }
                    dynamicImageSizeKey={"pdpCarousel"}
                />
            )
        } else {
            return (
                <PropertyCard
                    showFavourites={false}
                    property={item}
                    useHardLink={this.props.useHardLink}
                    {...this.props.cardProps}
                />
            );
        }
    };

    handleOpenLightbox = (index, e) => {
        e.preventDefault();
        this.props.openLightboxFunc(index);
    };

    renderCta = () => {
        const { cta } = this.props;

        if (cta && cta.text && cta.text.trim() && cta.link && cta.link.trim()) {
            var attr = {
                href: cta.link
            };

            if (cta.target) {
                attr.target = cta.target;
            }

            return (
                <React.Fragment>
                    <a {...attr}>{cta.text}</a>
                    {this.props.featuredRedesignCarousel && (siteTheme !== 'commercialr4') && (
                        <img
                            id="cta-image"
                            src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/right-arrow.png"
                        />
                    )}
                </React.Fragment>
            );
        } else {
            return null;
        }
    };

    render() {
        const {
            items,
            className,
            infinite,
            slidesToShow,
            title,
            cta,
            ...other
        } = this.props;

        const classes = [className];

        if (!items || !items.length) {
            return null;
        }

        let _infinite = infinite;
        if (_infinite) {
            _infinite = items.length > this.props.slidesToShow;
        }

        return (
            <StyledCarousel className="cbre-spa--v2carousel" cta={(!!cta && siteTheme === 'commercialr4')}>
                {(!!title || !!cta) && (
                    <Row>
                        <Col xs={8} className="cbre-spa--carousel_title">
                            {!!title && <h2>{title}</h2>}
                        </Col>
                        {siteTheme !== 'commercialr4' &&
                            <Col xs={6} className="cbre-spa--carousel_cta">
                                {this.renderCta()}
                            </Col>
                        }
                    </Row>
                )}
                {(!!cta && siteTheme === 'commercialr4') &&
                    <StyledCta>{this.renderCta()}</StyledCta>
                }
                {siteTheme === 'commercialr4' ?
                    <Slider
                        className={classNames(classes)}
                        infinite={_infinite}
                        slidesToShow={slidesToShow}
                        nextArrow={<img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/rightArrow.png" />}
                        prevArrow={<img src="https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/rightArrow.png" />}
                        {...other}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]}
                    >
                        {this.getCarouselMedia()}
                    </Slider>
                    :
                    <Slider
                        className={classNames(classes)}
                        infinite={_infinite}
                        slidesToShow={slidesToShow}
                        {...other}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 767,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]}
                    >
                        {this.getCarouselMedia()}
                    </Slider>
                }
            </StyledCarousel>
        );
    }
}

const StyledCarousel = styled.div`
    ${({ cta }) => cta && `
        > .r4Carousel.slick-slider {    
            > .slick-next {
                right: 225px !important;
            }
            > .slick-prev {
                right: 290px !important;
            }
        }
    `}
    position: relative;
`;

const StyledCta = styled.div`
    position: absolute;
    right: 0;
    top: 33px;
    > a {
        background: #003F2D !important;
        color: #fff !important;
        padding: 12px 24px !important;
        font-size: 18px !important;
        font-family: 'Calibre Regular' !important;
        transition: .2s ease all;
        &:hover {
           background: #17E88F !important;
           color: #003F2D !important;
        }
    }
`;

Carousel.propTypes = {
    items: PropTypes.array.isRequired,
    infinite: PropTypes.bool,
    dots: PropTypes.bool,
    slidesToShow: PropTypes.number,
    slidesToScroll: PropTypes.number,
    speed: PropTypes.number,
    openLightboxFunc: PropTypes.func,
    afterChange: PropTypes.func,
    className: PropTypes.string,
    slideClassName: PropTypes.string,
    cardProps: PropTypes.object,
    type: PropTypes.oneOf(["Card", "Media"]),
    useHardLink: PropTypes.bool,
    cta: PropTypes.shape({
        text: PropTypes.string,
        link: PropTypes.string,
        target: PropTypes.string,
        description: PropTypes.any
    }),
    title: PropTypes.string,
    featuredRedesignCarousel: PropTypes.bool,
    address: PropTypes.object
};

Carousel.defaultProps = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    arrows: true,
    cardProps: {},
    type: "Media",
    useHardLink: false,
    cta: undefined,
    title: undefined,
    featuredRedesignCarousel: false,
    address: {}
};

Carousel.contextTypes = {
    stores: PropTypes.object
};

export default Carousel;
