import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isPrerender } from '../../../utils/browser';
import setImageTag from '../../../utils/setImageTag';
import DynamicImage from '../../DynamicImage/DynamicImage';
import styled from 'styled-components';

export default class PropertyImage extends Component {
    static contextTypes = {
        stores: PropTypes.object,
        language: PropTypes.object
    };

    static propTypes = {
        items: PropTypes.array,
        breakpointMap: PropTypes.object,
        alt: PropTypes.string,
        className: PropTypes.string,
        container: PropTypes.bool,
        underOffer: PropTypes.bool,
        isImageRestricted: PropTypes.bool,
        address: PropTypes.object
    };

    static defaultProps = {
        // Allow override of breakpoint mappings... large screen/small image etc.
        breakpointMap: {
            small: 'small',
            medium: 'medium',
            large: 'large'
        },
        container: false,
        underOffer: false,
        isImageRestricted: false
    };

    _renderImage = () => {
        const { stores } = this.context;
        // render a placeholder if there is no image.
        const cdnUrl = stores.ConfigStore.getItem('cdnUrl');
        const dynamicImageSizing = stores.ConfigStore.getItem('features').dynamicImageSizing;
        const fitHeight = stores.ConfigStore.getItem('features').adjustImageCarouselHeight || true;

        let placeholderImage =
            cdnUrl +
            '/resources/fileassets/propertyListingPlaceholder_small.png';
        if (!this.props.items || !this.props.items.length) {
            return <img src={placeholderImage} />;
        }

        let sources = [];
        //const cdnUrl = this.state.cdnUrl;
        let imageUrl = null;
        let fallbackUrl = null;
        let resource = null;
        this.props.items.forEach(
            function(value) {
                // srcset images
                resource = value;
                if (
                    value.breakpoint !== null &&
                    typeof this.props.breakpointMap[value.breakpoint] !==
                        'undefined'
                ) {
                    imageUrl = cdnUrl + value.uri;
                    sources.push({
                        size: this.state.breakpoints[
                            this.props.breakpointMap[value.breakpoint]
                        ],
                        imageUrl: imageUrl
                    });
                    if (value.breakpoint === 'large') {
                        fallbackUrl = cdnUrl + value.uri;
                    }
                } else {
                    imageUrl = cdnUrl + value.uri;
                    fallbackUrl = cdnUrl + value.uri;
                }
            }.bind(this)
        );
        if (fallbackUrl === null) {
            fallbackUrl = sources[0] ? sources[0].imageUrl : null;
        }
        const classNames = [this.props.className];

        if (this.props.isImageRestricted) {
            classNames.push('img-container_img');
            classNames.push('img-container_img--is-restricted');
        }
        
        return (
            <Picture className={classNames.join(' ')}>
                {sources.map((s, i) => {
                    return (
                        <source
                            key={`imageSource_${i}`}
                            media={'(max-width:' + s.size + 'px)'}
                            srcSet={s.imageUrl}
                        />
                    );
                })}
                <DynamicImage
                    srcSet={fallbackUrl}
                    src={fallbackUrl}
                    alt={setImageTag(this.props.alt, this.props.address, 0)}
                    baseWidth={resource.width} baseHeight={resource.height} 
                    featureFlag={dynamicImageSizing} sizeKey={'pdpBanner'}
                    fitHeight={fitHeight}
                    onClick={this.props.onClick}
                    onError={event => {
                        event.target.setAttribute(
                            'src',
                            isPrerender ? fallbackUrl : placeholderImage
                        );
                        event.target.setAttribute(
                            'srcset',
                            isPrerender ? fallbackUrl : placeholderImage
                        );
                    }}
                />
            </Picture>
        );
    };

    _renderContainer = () => {
        let underOffer;
        const language = this.context.language;

        if (this.props.underOffer) {
            underOffer = (
                <div className="under-offer">
                    <div className="under-offer-text">
                        {language.UnderOfferText}
                    </div>
                </div>
            );
        }

        const classNames = ['img-container'];

        if (this.props.isImageRestricted) {
            classNames.push('img-container--is-restricted');
        }

        return (
            <div className={classNames.join(' ')}>
                {this._renderImage()}
                {underOffer}
            </div>
        );
    };

    state = {
        breakpoints: this.context.stores.ConfigStore.getAllBreakpointValues() || {
            small: '768',
            medium: '992',
            large: '1200'
        },
        cdnUrl: this.context.stores.ConfigStore.getItem('cdnUrl')
    };

    render() {
        if (this.props.container) {
            return this._renderContainer();
        } else {
            return this._renderImage();
        }
    }
}

const Picture = styled.picture`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #E8E8E8;
    > img {
        min-width: auto;
        width: auto !important;
        padding: 0 !important;
        max-height: 573px !important;
    }
`;