import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import PropertyImage from './PropertyImage';

export default class ImageGrid extends React.Component {
    handleOpenLightbox = (itemIndex, e) => {
        e.preventDefault();
        this.props.openLightboxFunc(itemIndex);
    };

    render() {
        const items = this.props.items;
        let images = [];

        items.forEach(
            function(item, itemIndex) {
                // Exit iteration if there are no actual resources.
                // Only show 6 items.
                if (!item.resources.length || itemIndex > 5) {
                    return;
                }

                // Set up classes.
                const classes =
                    'image-grid-item image-grid-item--' + (itemIndex + 1);
                const gridXs = 12;
                let gridSm = 4;
                const gridMd = null;
                const gridLg = null;

                // The first image is larger for small screens and up.
                if (itemIndex === 0) {
                    gridSm = 8;
                }

                // Render resources.
                images.push(
                    <Col
                        key={'grid-item-' + (itemIndex + 1)}
                        xs={gridXs}
                        sm={gridSm}
                        md={gridMd}
                        lg={gridLg}
                        className={classes}
                    >
                        <a
                            key={'lighbox-item-' + (itemIndex + 1)}
                            onClick={this.handleOpenLightbox.bind(
                                this,
                                itemIndex
                            )}
                        >
                            <PropertyImage
                                items={item.resources}
                                alt={item.caption}
                            />
                        </a>
                    </Col>
                );
            }.bind(this)
        );

        return <Row className="image-grid row">{images}</Row>;
    }
}

ImageGrid.propTypes = {
    items: PropTypes.array.isRequired,
    openLightboxFunc: PropTypes.func
};
