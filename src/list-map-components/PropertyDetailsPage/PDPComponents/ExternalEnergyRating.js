import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table, { Row, Cell } from '../../Table/Table';
import { createDataTestAttribute } from '../../../utils/automationTesting';

export default class ExternalEnergyRating extends Component {
    static propTypes = {
        property: PropTypes.object.isRequired
    };

    static contextTypes = {
        language: PropTypes.object,
        stores: PropTypes.object
    };

    getExternalEnergyRatingData = (property) => {
        const ExternalEnergyRatingData = [];
        const { language } = this.context;
        const {
            EnergyPerformanceData
        } = property;

        EnergyPerformanceData.ExternalRatings.map(ratings => ExternalEnergyRatingData.push({
            ratingType: language[ratings.ratingType],
            ratingLevel: ratings.ratingLevel
        }))

        return ExternalEnergyRatingData;
    };

    render() {
        const cells = this.getExternalEnergyRatingData(this.props.property);
        if (!cells || cells.length === 0) {
            return null;
        }
        return (
            <Table className="sizesandmeasurements">
                <Row>
                    {cells.map(({ ratingType, ratingLevel }) => (
                        <Cell widthXs={6} widthSm={5} widthLg={4}>
                            <h3 className="cbre_h6" data-test={createDataTestAttribute('pdp-external-energy-rating', ratingType)}>{ratingType}</h3>
                            {ratingLevel}
                        </Cell>
                    ))}
                </Row>
            </Table>
        );
    }
}
