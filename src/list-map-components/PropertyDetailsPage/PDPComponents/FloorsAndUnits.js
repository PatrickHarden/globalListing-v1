import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Charge from '../../../components/Property/PropertyComponents/Charge';
import Table, { Row, Cell } from '../../Table/Table';
import getAvailability from '../../../utils/getAvailability';

import TranslateString from '../../../utils/TranslateString';
import formatArea from '../../../utils/getFormattedArea';
import { createDataTestAttribute } from '../../../utils/automationTesting';

export default class FloorsAndUnits extends Component {
    // Returns an array of translated and ordered { title, value }
    getFloorProps = floor => {
        const { language } = this.context;
        const culture = this.context.stores.ConfigStore.getItem('language');
        const features = this.context.stores.ConfigStore.getFeatures();
        const { displayBuildingAvailableDate } = features;


        // extract approx because we don't want it in 'rest'
        // it's a property related to all floors but appears inside any random one instead...
        const {
            approx, // eslint-disable-line
            use,
            unitSize,
            status,
            unitCharges,
            availableFrom,
            availability,
            vacancy,
            floorPlans,
            brochure,
            spaceDescription,
            unitPhotos,
            videoLinks,
            sizes,
            unitWalkthrough,
            leaseType,
            ...rest
        } = floor;

        

        const newFloorProps = [];

        if (use) {
            newFloorProps.push({
                title: language['Details'],
                value: language['UnitUse' + use] || use
            });
        }
        if (unitSize && unitSize.area && unitSize.units) {
            const translateStringProps = {
                string: 'PropertySize',
                unit: language[unitSize.units],
                size: formatArea(
                    culture,
                    unitSize.units,
                    unitSize.area,
                    language,
                    false
                ),
                component: 'span'
            };
            newFloorProps.push({
                title: language['Size'],
                value: <TranslateString {...translateStringProps} />
            });
        }

        if (status) {
            newFloorProps.push({
                title: language['Status'],
                value: language[status] || status
            });
        }

        if (unitCharges && unitCharges.length) {
            const {
                searchType
            } = this.context.stores.ConfigStore.getConfig().searchConfig;
            const remove = searchType === 'isSale' ? 'Rent' : 'SalePrice';

            newFloorProps.push(
                ...unitCharges
                    .filter(charge => charge.chargeType !== remove)
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
                                stringPrefix={
                                    charge.chargeType === 'SalePrice'
                                        ? ''
                                        : 'LM'
                                }
                                debug
                            />
                        )
                    }))
            );
        }

        if (!displayBuildingAvailableDate && (availableFrom || availability)) {
            newFloorProps.push(getAvailability(floor, this.context));
        }

        if (vacancy) {
            newFloorProps.push({
                title: language['Vacancy'],
                value: language['Vacancy' + vacancy] || vacancy
            });
        }

        // properties without preset translations
        if (rest) {
            Object.keys(rest).forEach(key => {
                if (rest[key])
                    newFloorProps.push({ title: key, value: rest[key] });
            });
        }

        return newFloorProps;
    };

    renderFloorProp({ title, value, key }) {
        return (
            <Cell key={`floorProp-${key || value}`} widthXs={4} data-test={createDataTestAttribute('pdp-floors-and-units-value',value)}>
                <h4 className="cbre_h6">{title}</h4>
                {value}
            </Cell>
        );
    }

    renderApproxString = () => {
        return (
            <div className="approx-sizing marginBottom-xs-1 paddingLeft-xs-1 paddingLeft-md-0">
                {this.context.language['ApproximateSizing']}
            </div>
        );
    };

    render() {
        const approx = !!this.props.floors.find(floor => !!floor.approx);
        const approxElem = approx ? this.renderApproxString() : null;

        return (
            <div>
                <Table striped>
                    {this.props.floors.map((floor, index) => {
                        const floorProps = this.getFloorProps(floor);
                        let name = '';
                        if (
                            floorProps.find(
                                prop => prop.title === 'subdivisionName'
                            ) &&
                            floorProps.find(
                                prop => prop.title === 'subdivisionName'
                            ).value
                        ) {
                            name =
                                floorProps.find(
                                    prop => prop.title === 'subdivisionName'
                                ).value || '';
                        }
                        return (
                            <Row key={`floor-${index}`}>
                                <Cell widthXs={12} data-test={createDataTestAttribute('pdp-floors-and-units-name',name)}>
                                    <h3 className="cbre_h5">{name}</h3>
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
                {approxElem}
            </div>
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
