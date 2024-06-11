import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CollapsibleBlock from '../CollapsibleBlock/CollapsibleBlock';
import { ExpandableContent } from '../../external-libraries/agency365-components/components';
import Carousel from '../Carousel/Carousel';
import PropertyCard from '../PropertyCard/PropertyCard';
import PropertyCard_R3 from '../../r3/PLP/PropertyCard/PropertyCard.r3';
import classNames from 'classnames';
import Spinner from 'react-spinner';
import trackingEvent from '../../utils/trackingEvent';
import { DefaultValues } from '../../constants/DefaultValues';
import styled from 'styled-components';

var siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

class RelatedProperties extends Component {
    renderComponent = component => {
        const { relatedProperties = {} } = this.props;

        const { language } = this.context;

        return (
            <CollapsibleBlock
                title={language[relatedProperties.type]}
                isCollapsible={false}
                startExpanded={true}
                headerClassName="has_lightBorder r4CarouselTitle"
                innerClassName="padding-xs-1"
            >
                {component}
            </CollapsibleBlock>
        );
    };

    carouselScroll = index => {
        const { stores, actions } = this.context;

        trackingEvent(
            'siblingCarouselScroll',
            {
                carousel: index
            },
            stores,
            actions
        );
    };

    render() {
        const {
            className,
            cardProps,
            relatedProperties = {},
            breakpoints = {}
        } = this.props;

        const classes = [className];
        const { language, stores } = this.context;

        const callComplete = relatedProperties.hasOwnProperty('properties');
        const callFailed = callComplete && !relatedProperties.status;

        if (!callComplete) {
            return <Spinner />;
        }

        if (callFailed) {
            return null;
        }

        const carouselComponent = (breakpoints.isMobile && siteTheme != 'commercialr3' && siteTheme != 'commercialr4') ? (
            <ExpandableContent
                contentClassName="cbre_multiCarousel"
                showMoreString={language.LMExpandableTextMore}
                showLessString={language.LMExpandableTextLess}
                showHideClassName="showHideToggle has_arrow cbre_smallText"
                mode="items"
                limit={2}
            >
                {relatedProperties.properties.slice(0, 8).map(p => (
                    (siteTheme == 'commercialr3' || siteTheme == 'commercialr4') ?
                        <PropertyCard_R3
                            showFavourites={false}
                            className="relatedProperties cardItem"
                            property={p}
                            {...cardProps}
                            shouldLazyLoad={false}
                        />
                        :
                        <PropertyCard
                            showFavourites={false}
                            className="relatedProperties cardItem"
                            property={p}
                            {...cardProps}
                        />
                ))}
            </ExpandableContent>
        ) : (
            siteTheme !== 'commercialr4' ?
                <div className={classNames(classes)}>
                    <Carousel
                        dots={true}
                        arrows={false}
                        slidesToShow={4}
                        slidesToScroll={4}
                        items={relatedProperties.properties}
                        cardProps={cardProps}
                        className="cbre_multiCarousel"
                        afterChange={this.carouselScroll}
                        type="Card"
                    />
                </div>
                :
                <StyledCarousel>
                    <Carousel
                        dots={false}
                        arrows={true}
                        slidesToShow={4}
                        slidesToScroll={1}
                        items={relatedProperties.properties}
                        cardProps={cardProps}
                        className="cbre_multiCarousel margin-bottom-40 cbre_standalone_carousel r4Carousel"
                        type="Card"
                        useHardLink={(stores.ConfigStore.getItem('features').useHardLink !== undefined) ? stores.ConfigStore.getItem('features').useHardLink : true}
                        featuredRedesignCarousel={false}
                    />
                </StyledCarousel>
        );

        return this.renderComponent(carouselComponent);
    }
}

const StyledCarousel = styled.div`
    .r4Carousel {
        margin-top: 90px !important;
        > img {
            top: -55px !important;
            height: 50px !important;
            width: 50px !important;
        }
        .slick-prev {
            left: auto;
            right: 65px;
            transform: rotate(180deg);
            top: -80px !important;
        }
        .slick-next {
            right: 0 !important;
        }
    }
`;

RelatedProperties.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object,
    actions: PropTypes.object
};

RelatedProperties.propTypes = {
    relatedProperties: PropTypes.object.isRequired,
    className: PropTypes.string,
    breakpoints: PropTypes.object,
    cardProps: PropTypes.object
};

export default RelatedProperties;
