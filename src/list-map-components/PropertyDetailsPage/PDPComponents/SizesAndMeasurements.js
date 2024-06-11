import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table, { Row, Cell } from '../../Table/Table';
import TranslateString from '../../../utils/TranslateString';
import formatArea from '../../../utils/getFormattedArea';
import formatSize from '../../../utils/getFormattedSize';
import { createDataTestAttribute } from '../../../utils/automationTesting';

export default class SizesAndMeasurements extends Component {
    static propTypes = {
        property: PropTypes.object.isRequired
    };

    static contextTypes = {
        language: PropTypes.object,
        stores: PropTypes.object
    };

    getSizesAndMeasurementsData = (property, features) => {
        const SizesAndMeasurementsData = [];
        const { language, stores } = this.context;
        const culture = stores.ConfigStore.getItem('language');

        const {
            LoadingDocks,
            LoadingDocksUnit,
            LoadingDoors,
            DriveInDoors,
            Sizes,
            InternalParkingSpaces,
            ExternalParkingSpaces
        } = property;

        let translateStringProps = {
            string: 'PropertySize',
            component: 'span'
        };

        if (Sizes && Sizes.length) {

            Sizes.map(function(size, i, sizes) {
                var maxDecimals = 0;
                var minimumCeilingHeight = sizes.filter(x=>x.sizeKind=="MinimumCeilingHeight").reduce((a,s)=>s.dimensions.area, 0);
                var maximumCeilingHeight = sizes.filter(x=>x.sizeKind=="MaximumCeilingHeight").reduce((a,s)=>s.dimensions.area, 0);

                if (size.sizeKind === "MinimumCeilingHeight" && (minimumCeilingHeight == maximumCeilingHeight || minimumCeilingHeight == 0)) {
                    return;
                } 
                
                if ((size.sizeKind === "MinimumSize" || size.sizeKind === "MaximumSize" || size.sizeKind === "TotalSize" || size.sizeKind==="BuildableSize" ) && (size.dimensions.area === null || size.dimensions.area === 0)) {
                    return;
                }
                if (size.sizeKind === "MinimumCeilingHeight"||size.sizeKind === "MaximumCeilingHeight") {
                    maxDecimals = 2;
                }

                let unitSize = size.dimensions.units;
                if (
                    size.dimensions.area !== 1 &&
                    size.dimensions.units && size.dimensions.units.toLowerCase() === 'acre'
                ) {
                    unitSize = 'acrePlural';
                }
                if (size.dimensions.units && size.dimensions.units.toLowerCase() === 'pp') {
                    if (parseFloat(size.dimensions.area) !== 1) {
                        unitSize = 'deskPlural';
                    } else {
                        unitSize = 'desk';
                    }
                }
                if (size.dimensions.units && size.dimensions.units.toLowerCase() === 'hectare') {
                    if (size.dimensions.area !== 1) {
                        unitSize = 'hectarePlural';
                    } else {
                        unitSize = 'hectare';
                    }
                }
                if (
                    stores.ConfigStore.getFeatures().childListings &&
                    stores.ConfigStore.getFeatures().childListings
                        .enableChildListings &&
                    !property.ParentPropertyId
                ) {
                    if (
                        size.sizeKind === 'MinimumSize' ||
                        size.sizeKind === 'MaximumSize'
                    ) {
                        return;
                    }
                }
                if (
                    ~size.sizeKind.indexOf('Width') ||
                    ~size.sizeKind.indexOf('Depth')
                ) {
                    if (size.dimensions.units && size.dimensions.units.toLowerCase() === 'ft') {
                        translateStringProps = {
                            string: 'PropertySize',
                            size: formatSize(
                                size.dimensions.area,
                                size.dimensions.units
                            ),
                            component: 'span'
                        };
                    } else {
                        translateStringProps = {
                            string: 'PropertySize',
                            unit: language[unitSize] || size.dimensions.units,
                            size: size.dimensions.area,
                            component: 'span'
                        };
                    }
                } else {
                    translateStringProps = {
                        string: 'PropertySize',
                        unit: language[unitSize] || size.dimensions.units,
                        size: formatArea(
                            culture,
                            size.dimensions.units,
                            size.dimensions.area,
                            language,
                            false,
                            maxDecimals
                        ),
                        component: 'span'
                    };
                }

                SizesAndMeasurementsData.push({
                    id: `${size.sizeKind}`,
                    title: language[`SizeKind${size.sizeKind}`],
                    value: <TranslateString {...translateStringProps} />
                });
            }, this);
        }

        if (LoadingDocks) {
            SizesAndMeasurementsData.push({
                id: 'LoadingDocks',
                title: language['PdpLoadingDocks'],
                value: formatSize(
                    LoadingDocks,
                    language[LoadingDocksUnit] || LoadingDocksUnit
                )
            });
        }

        if (LoadingDoors) {
            SizesAndMeasurementsData.push({
                id: 'LoadingDoors',
                title: language['PdpLoadingDoors'],
                value: LoadingDoors
            });
        }
        if (DriveInDoors) {
            SizesAndMeasurementsData.push({
                id: 'DriveInDoors',
                title: language['PdpDriveInDoors'],
                value: DriveInDoors
            });
        }

        if (InternalParkingSpaces) {
            SizesAndMeasurementsData.push({
                id: 'InternalParkingSpaces',
                title: language['InternalParkingSpaces'],
                value: InternalParkingSpaces
            });
        }

        if (ExternalParkingSpaces) {
            SizesAndMeasurementsData.push({
                id: 'ExternalParkingSpaces',
                title: language['ExternalParkingSpaces'],
                value: ExternalParkingSpaces
            });
        }

        return SizesAndMeasurementsData;
    };

    render() {
        const { stores } = this.context;
        if (
            stores.ConfigStore.getFeatures().hideSizesAndMeasurementsOnParent &&
            this.props.property.IsParent
        ) {
            return null;
        }
        const cells = this.getSizesAndMeasurementsData(this.props.property, stores.ConfigStore.getFeatures());
        if (!cells || cells.length === 0) {
            return null;
        }
        return (
            <Table className="sizesandmeasurements">
                <Row>
                    {cells.map(({ id, title, value }) => (
                        <Cell key={id} widthXs={6} widthSm={5} widthLg={4}>
                            <h3 className="cbre_h6" data-test={createDataTestAttribute('pdp-sizes-and-measurements',title)}>{title}</h3>
                            {value}
                        </Cell>
                    ))}
                </Row>
            </Table>
        );
    }
}
