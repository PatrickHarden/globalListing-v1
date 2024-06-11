import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

export default class FeatureGrid extends React.Component {
    renderFeatures = () => {
        // Remove empty array items
        const _features = _.reject(this.props.features, function(i) {
            return i === '';
        });

        if (!_features || !_features.length) {
            return this.props.emptyListElement;
        }

        const jsx = [];

        let featureBlobs = _features.map(function(f, i) {
            return (
                <Col xs={6} key={'feature_' + i} className="feature-grid__item">
                    {f}
                </Col>
            );
        });

        // If a more details link has been specified, append a more details link
        if (this.props.moreDetailsLink) {
            // If the list is full, trim the last element off the list to make space
            if (featureBlobs.length == this.props.featureCount) {
                featureBlobs = featureBlobs.splice(0, featureBlobs.length - 1);
            }
            featureBlobs.push(
                <Col
                    xs={6}
                    key="feature_padding"
                    className="feature-grid__link"
                >
                    {this.props.moreDetailsLink}
                </Col>
            );
        }

        for (let i = 0; i < featureBlobs.length; i += 2) {
            jsx.push(
                <Row key={i}>
                    {featureBlobs[i]}
                    {featureBlobs[i + 1]}
                </Row>
            );
        }

        return jsx;
    };

    render() {
        return <div className="feature-grid">{this.renderFeatures()}</div>;
    }
}

FeatureGrid.propTypes = {
    emptyListElement: PropTypes.object.isRequired,
    moreDetailsLink: PropTypes.object,
    features: PropTypes.array.isRequired,
    featureCount: function(props, propName) {
        if (!props[propName] % 2) {
            return new Error('featureCount should be an uneven number');
        }
    }
};
