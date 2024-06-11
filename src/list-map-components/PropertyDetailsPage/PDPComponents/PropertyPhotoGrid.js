import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';
import classNames from 'classnames';
import { MediaWrapper } from '../../../external-libraries/agency365-components/components';

import LazyLoader from '../../../list-map-components/LazyLoader';
import { isPrerender } from '../../../utils/browser';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import setImageTag from '../../../utils/setImageTag';
import DynamicImage from '../../../components/DynamicImage/DynamicImage';
import { containsFloorplanImage } from '../../../utils/containsFloorplanImage';

export default class PropertyPhotoGrid extends Component {
    handleOpenLightbox = (itemIndex, e) => {
        e.preventDefault();
        this.props.openLightboxFunc(itemIndex);
    };

    render() {
        const { stores } = this.context;
        const { property, siteType, imageType, address, offset } = this.props;

        const lazyLoadOffset = offset ? offset : 500;

        let items;
        if (imageType == 'FloorPlans') {
            items = property.FloorPlans;
        } else {
            items = property.Photos;
        }

        let images = [];

        const self = this;

        items.forEach(function(item, itemIndex) {
            if (!item.resources.length || itemIndex > 6) {
                return;
            }
            if (imageType === 'FloorPlans' && containsFloorplanImage([item]) === false){
                return;
            }
            const isResidentialSmall =
                itemIndex !== 2 && siteType === 'residential';
            const isCommercialSmall =
                itemIndex !== 0 && siteType !== 'residential';

            const imageClasses = classNames(
                'col-xs-12',
                isResidentialSmall && 'col-md-6',
                isCommercialSmall && 'col-md-6',
                'marginBottom-xs-1',
                'listmap-image-grid'
            );
            let imageItemIndex = itemIndex;
            if (imageType == 'FloorPlans') {
                imageItemIndex = itemIndex + property.Photos.length;
            }

            let photosForGrid = item.resources;

            if (isCommercialSmall || isResidentialSmall) {
                photosForGrid =
                    photosForGrid.filter(p => p.breakpoint === 'small')[0] ||
                    photosForGrid[0];
            } else {
                photosForGrid =
                    photosForGrid.filter(p => p.breakpoint === 'medium')[0] ||
                    photosForGrid[0];
            }
            const cdnUrl = stores.ConfigStore.getItem('cdnUrl');
            const features = stores.ConfigStore.getItem('features');
            const dynamicImageSizing = features.dynamicImageSizing;

            let placeholderImage =
                cdnUrl +
                '/resources/fileassets/propertyListingPlaceholder_small.png';
            let fitWidth;
            let fitHeight;

            if (photosForGrid.width < photosForGrid.height) {
                fitWidth = true;
                fitHeight = false;
            } else {
                fitWidth = false;
                fitHeight = true;
            }

            images.push(
                <div
                    key={`photo-grid-item-${imageItemIndex}`}
                    className={imageClasses}
                    onClick={self.handleOpenLightbox.bind(self, imageItemIndex)}
                >
                    <MediaWrapper fitWidth={fitWidth} fitHeight={fitHeight}>
                        <LazyLoader
                            once
                            key={`${imageItemIndex}_photogridimage`}
                            offset={lazyLoadOffset}
                            height={250}
                            disable={isPrerender}
                        >
                            <DynamicImage
                                src={cdnUrl + photosForGrid.uri}
                                featureFlag={dynamicImageSizing}
                                alt={setImageTag(item.caption, address, imageItemIndex)}
                                sizeKey={'pdpGrid'}
                                baseWidth={photosForGrid.width} baseHeight={photosForGrid.height}
                                onError={event =>
                                    event.target.setAttribute(
                                        'src',
                                        isPrerender
                                            ? cdnUrl + photosForGrid.uri
                                            : placeholderImage
                                    )
                                }
                                testId={createDataTestAttribute('pdp-photo',cdnUrl + photosForGrid.uri)}
                            />
                        </LazyLoader>
                    </MediaWrapper>
                </div>
            );
        });

        return <Row className="row">{images}</Row>;
    }
}

PropertyPhotoGrid.contextTypes = {
    openLightboxFunc: PropTypes.func,
    property: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    imageType: PropTypes.string,
    address: PropTypes.object,
    offset: PropTypes.number
};

PropertyPhotoGrid.defaultValues = {
    imageType: 'Images'
};

PropertyPhotoGrid.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};
