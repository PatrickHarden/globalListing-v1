import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table, { Row, Cell } from '../../Table/Table';
import classNames from 'classnames';
import TranslateString from '../../../utils/TranslateString';
import { createDataTestAttribute } from '../../../utils/automationTesting';

class EnergyPerformance extends Component {
    getEnergyUsageData(string, data) {
        const { language, stores } = this.context;

        const currentLanguage = stores.ConfigStore.getItem('features').sizeCultureCode ? stores.ConfigStore.getItem('features').sizeCultureCode : stores.ConfigStore.getItem('language');

        let translateStringProps = {
            string: string,
            amount: new Intl.NumberFormat(currentLanguage).format(data.amount),
            interval: language[data.interval],
            energyUnits: language['EnergyUnit' + data.energyUnits],
            perUnit: language[data.perUnit]
        };

        return <TranslateString {...translateStringProps} />;
    }

    buildEnergyPerformanceData(data) {
        const { language, stores } = this.context;

        const energyPerformanceData = [];
        const currentLanguage = stores.ConfigStore.getItem('language');
        let dateFormat;

        try{
            dateFormat = new Intl.DateTimeFormat(currentLanguage);
        }catch(e){
            dateFormat = "mm-dd-yyyy";
        }

        if (data.year) {
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceYear',
                title: language['PdpEnergyPerformanceYear'],
                value: data.year
            });
        }

        if (data.type) {
            var energyType = language['EnergyType' + data.type] || data.type;
            if (data.uri) {
                energyType = (
                    <a href={data.uri} target="_blank"  rel="noopener">
                        {energyType}
                    </a>
                );
            }
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceType',
                title: language['PdpEnergyPerformanceType'],
                value: energyType
            });
        }

        if (data.expires) {
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceCertificateExpires',
                title: language['PdpEnergyPerformanceCertificateExpires'],
                value: dateFormat.format(new Date(data.expires))
            });
        }

        if (data.MajorEnergySources && data.MajorEnergySources.length) {
            // Translate each string
            data.MajorEnergySources.forEach(function(element, index) {
                data.MajorEnergySources[index] =
                    language['EnergySource' + element] || element;
            });
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceSource',
                title: language['PdpEnergyPerformanceSource'],
                value: data.MajorEnergySources.join(', ')
            });
        }

        if (data.heatEnergy && data.heatEnergy.amount) {
            let heatEnergy = this.getEnergyUsageData(
                'PdpEnergyPerformanceAmountString',
                data.heatEnergy
            );
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceTypesHeat',
                title: language['PdpEnergyPerformanceTypesHeat'],
                value: heatEnergy
            });
        }

        if (data.electricalEnergy && data.electricalEnergy.amount) {
            let electricalEnergy = this.getEnergyUsageData(
                'PdpEnergyPerformanceAmountString',
                data.electricalEnergy
            );
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceTypesElectrical',
                title: language['PdpEnergyPerformanceTypesElectrical'],
                value: electricalEnergy
            });
        }

        if (data.totalEnergy && data.totalEnergy.amount) {
            let totalEnergy = this.getEnergyUsageData(
                'PdpEnergyPerformanceAmountString',
                data.totalEnergy
            );
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceAmount',
                title: language['PdpEnergyPerformanceAmount'],
                value: totalEnergy
            });
        }

        if (data.ukuri) {
            energyPerformanceData.push({
                id: 'PdpEnergyPerformanceLink',
                title: language['PdpEnergyPerformanceLink'],
                value: (
                    <a href={data.ukuri} target="_blank"  rel="noopener">
                        {language['PdpEnergyPerformanceLinkText']}
                    </a>
                )
            });
        }

        return energyPerformanceData;
    }

    render() {
        const { className, data } = this.props;

        const cells = this.buildEnergyPerformanceData(data);
        if (!cells || cells.length === 0) {
            return null;
        }

        const classes = [className];

        return (
            <Table className={classNames(classes)}>
                <Row>
                    {cells.map(({ id, title, value }) => (
                        <Cell key={id} widthXs={6} widthSm={5} widthLg={4} data-test={createDataTestAttribute('pdp-energy-performance',title)}>
                            <h3 className="cbre_h6">{title}</h3>
                            {value}
                        </Cell>
                    ))}
                </Row>
            </Table>
        );
    }
}

EnergyPerformance.propTypes = {
    className: PropTypes.string,
    data: PropTypes.object.isRequired
};

EnergyPerformance.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

export default EnergyPerformance;
