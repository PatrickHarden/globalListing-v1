import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Charge from '../../../components/Property/PropertyComponents/Charge';
import Table, { Row, Cell } from '../../Table/Table';
import getAvailability from '../../../utils/getAvailability';

import TranslateString from '../../../utils/TranslateString';
import formatArea from '../../../utils/getFormattedArea';

export default class FloorsAndUnits extends Component {
    // Returns an array of translated and ordered { title, value }
    getFloorProps = floor => {
        const { language } = this.context;
        const culture = this.context.stores.ConfigStore.getItem('language');

        const {
            unitSize = {},
            unitCharges,
            availableFrom,
            availability
        } = floor;

        const newFloorProps = [];
        const { minArea, maxArea, area, units } = unitSize;
        let singleArea;
        if ((minArea && maxArea) && minArea === maxArea) {
            singleArea = minArea;
        }
        const hasArea = minArea || maxArea || area;

        const formatAreaType = (area) => formatArea(
            culture,
            units,
            area,
            language,
            false
        );

        const getProps = (size) => ({
            string: 'PropertySize',
            component: 'span',
            size: formatAreaType(size)
        });

        if (hasArea && units) {
            if (!singleArea) {
                if (minArea) {
                    newFloorProps.push({
                        key: 'minArea',
                        title: language.SizeKindMinimumDesks,
                        value: <TranslateString {...getProps(minArea)} />
                    });
                }
                if (maxArea) {
                    newFloorProps.push({
                        key: 'maxArea',
                        title: language.SizeKindMaximumDesks,
                        value: <TranslateString {...getProps(maxArea)} />
                    });
                }
                if (!minArea && !maxArea) {
                    newFloorProps.push({
                        key: 'area',
                        title: language.Desks,
                        value: <TranslateString {...getProps(area)} />
                    });
                }
            } else if (singleArea) {
                newFloorProps.push({
                    key: 'singleArea',
                    title: language.Desks,
                    value: <TranslateString {...getProps(singleArea)} />
                });
            }
        }

        if (unitCharges && unitCharges.length) {
            newFloorProps.push(
                ...unitCharges
                    .map(charge => ({
                        key: `charge-${charge.chargeType}`,
                        title: charge.chargeType
                            ? language['Pdp' + charge.chargeType]
                            : '',
                        value: (
                            <Charge
                                charge={charge}
                                displayLabel={false}
                                displayStyling={false}
                            />
                        )
                    }))
            );
        }

        if (availableFrom || availability) {
            newFloorProps.push(getAvailability(floor, this.context));
        }

        return newFloorProps;
    };

    renderFloorProp({ title, value, key }) {
        return (
            <Cell key={`floorProp-${key || value}`} widthXs={4}>
                <h4 className="cbre_h6">{title}</h4>
                {value}
            </Cell>
        );
    }

    render() {
        const { floors } = this.props;

        return (
            <Table striped>
                {floors.map((floor, index) => {
                    const floorProps = this.getFloorProps(floor);
                    const title = floor.subdivisionName;
                    return (
                        <Row key={`space-${index}`}>
                            <Cell widthXs={12}>
                                <h3 className="spaceTitle">{title || ''}</h3>
                            </Cell>
                            {floorProps
                                .filter(
                                    prop => prop.title !== 'subdivisionName'
                                )
                                .map(this.renderFloorProp)}
                        </Row>
                    );
                })}
            </Table>
        );
    }
}

FloorsAndUnits.propTypes = {
    floors: PropTypes.array
};

FloorsAndUnits.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};
