import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table, { Row, Cell } from '../../Table/Table';
import TranslateString from '../../../utils/TranslateString';
import { createDataTestAttribute } from '../../../utils/automationTesting';

export default class Parking extends Component {
    static propTypes = {
        parking: PropTypes.object.isRequired
    };

    static contextTypes = {
        language: PropTypes.object,
        stores: PropTypes.object
    };

    getParkingData = parking => {
        const ParkingData = [];
        const { language, stores } = this.context;

        const { ratio, ratioPer, ratioPerUnit, details } = parking;

        const currentLanguage = stores.ConfigStore.getItem('language');
        const features = stores.ConfigStore.getFeatures();
        const displayYes = features.defaultToYesInsteadOfZeroIfNoParkingSpaceValue;

        let translateStringProps = {
            string: 'ParkingTypeSingleRatio',
            component: 'span'
        };

        if (ratio && ratioPer && ratioPerUnit) {
           
            let parkingString = 'ParkingTypeRatio';
            if (ratio === 1){
                parkingString = 'ParkingTypeSingleRatio';
            }
            

            translateStringProps = {
                string: parkingString,
                ratio: ratio,
                ratioPer: ratioPer,
                ratioPerUnit: language[ratioPerUnit] || ratioPerUnit,
                component: 'span'
            };
            ParkingData.push({
                id: 'parkingRatio',
                title: language['ParkingRatioTitle'],
                value: <TranslateString {...translateStringProps} />
            });
        }

        const yes = language['Yes'] ? language['Yes'] : 'Yes';

        details.map(detail => {

            if (detail.parkingCharge[0]) {
                const formattedCurrency = new Intl.NumberFormat(
                    features.sizeCultureCode? features.sizeCultureCode : currentLanguage,
                    {
                        style: 'currency',
                        currency: detail.parkingCharge[0].currencyCode
                    }
                ).format(detail.parkingCharge[0].amount);

                const formattedSpaces = (displayYes && (!detail.parkingSpace || detail.parkingSpace == '')) ?
                    yes :
                    new Intl.NumberFormat(features.sizeCultureCode? features.sizeCultureCode : currentLanguage).format(detail.parkingSpace);

                translateStringProps = {
                    string: 'ParkingSpaceAndCharge',
                    spaces: formattedSpaces,
                    amount: formattedCurrency,
                    interval: language[detail.parkingCharge[0].interval],
                    component: 'span'
                };
            } else {
                const formattedSpaces = (displayYes && (!detail.parkingSpace || detail.parkingSpace == '')) ?
                    yes :
                    new Intl.NumberFormat(features.sizeCultureCode? features.sizeCultureCode : currentLanguage).format(detail.parkingSpace);

                translateStringProps = {
                    string: 'ParkingSpaces',
                    spaces: formattedSpaces,
                    component: 'span'
                };
            }

            ParkingData.push({
                id: `${detail.parkingType}`,
                title: language[`ParkingType${detail.parkingType}`],
                value: (translateStringProps.spaces == yes && !detail.parkingCharge[0]) ? translateStringProps.spaces : <TranslateString {...translateStringProps} />
            });
        });

        return ParkingData;
    };

    render() {
        const cells = this.getParkingData(this.props.parking);
        if (!cells || cells.length === 0) {
            return null;
        }
        return (
            <Table>
                <Row>
                    {cells.map(({ id, title, value }) => (
                        <Cell key={id} widthXs={6} widthSm={5} widthLg={4} data-test={createDataTestAttribute('pdp-parking', value)}>
                            <h3 className="cbre_h6">{title}</h3>
                            {value}
                        </Cell>
                    ))}
                </Row>
            </Table>
        );
    }
}
