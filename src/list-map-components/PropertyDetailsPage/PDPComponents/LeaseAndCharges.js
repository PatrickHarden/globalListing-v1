import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales.min';

import Charge from '../../../components/Property/PropertyComponents/Charge';
import PriceLabel from '../../../components/Property/PropertyComponents/PriceLabel';
import Bedrooms from '../../../components/Property/PropertyComponents/Bedrooms';
import Table, { Row, Cell } from '../../Table/Table';
import defaultValues from '../../../constants/DefaultValues';
import TranslateString from '../../../utils/TranslateString';
import getAvailability from '../../../utils/getAvailability';
import { createDataTestAttribute } from '../../../utils/automationTesting';

const checkChargeForAmount = (charge) => {
    // check an amount to see if it exists, checking on an "amount" value
    if (!charge || !charge.amount || charge.amount === '' || charge.amount === null || charge.amount === 0) {
        return false;
    }
    return true;
};

export default class LeaseAndCharges extends Component {


    static propTypes = {
        property: PropTypes.object.isRequired,
        searchType: PropTypes.string
    };

    static contextTypes = {
        stores: PropTypes.object,
        language: PropTypes.object
    };


    getTranslatedLeaseTypes(types) {
        const { language } = this.context;
        let translatedString = '';

        types.forEach(function (type) {
            translatedString += language[`LeaseType${type.replace(/\s/g, '')}`] + ', ';
        });
        // Return string without last comma or whitespace.
        return translatedString.replace(/,\s*$/, '');
    }

    buildLeaseAndChargeData(property) {
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');

        const leaseInformationAndCharges = [];
        const currentLanguage = stores.ConfigStore.getItem('language');
        const leaseSettings = stores.ConfigStore.getLeasesAndCharges();

        let dateFormat;

        try {
            dateFormat = new Intl.DateTimeFormat(currentLanguage);
        } catch (e) {
            dateFormat = "mm-dd-yyyy";
        }

        const contactBrokerTranslation = stores.ConfigStore.getItem('i18n').PriceOnApplication || 'Contact Broker For Pricing';

        if (property.PropertyStatus && leaseSettings.showPropertyStatus) {
            leaseInformationAndCharges.push({
                title: language['Status'],
                value:
                    language[property.PropertyStatus] || property.PropertyStatus
            });
        }

        if (property.LeaseType && !leaseSettings.hideLeaseType) {
            leaseInformationAndCharges.push({
                id: 'leaseType',
                title: language['PDPLeaseType'],
                value: language['PDPLeaseType' + property.LeaseType]
            });
        }

        if (
            ((property.AvailableFrom || property.Availability) &&
                !leaseSettings.hideAvailableFrom &&
                (stores.ConfigStore.getFeatures().childListings &&
                    !stores.ConfigStore.getFeatures().childListings
                        .enableChildListings)) ||
            ((property.AvailableFrom || property.Availability) &&
                !leaseSettings.hideAvailableFrom &&
                stores.ConfigStore.getFeatures().childListings &&
                stores.ConfigStore.getFeatures().childListings
                    .enableChildListings &&
                property.ParentPropertyId)
        ) {
            leaseInformationAndCharges.push(
                getAvailability(property, this.context)
            );
        }

        if (property.LeaseInfo) {
            const {
                leaseEnd,
                nextLeaseBreak,
                nextRentReview,
                rentReviewCycle
            } = property.LeaseInfo;

            if (leaseEnd && !leaseSettings.hideLeaseEnd) {
                const leaseEndDate = new moment(leaseEnd).locale(currentLanguage).format('L');

                leaseInformationAndCharges.push({
                    id: 'leaseEndDate',
                    title: language['LeaseContractEndDate'],
                    // value: dateFormat.format(new Date(leaseEnd))
                    value: leaseEndDate
                });
            }

            if (nextRentReview && !leaseSettings.hideNextRentReviewDate) {
                leaseInformationAndCharges.push({
                    id: 'nextRentReviewDate',
                    title: language['LeaseRentNextReviewDate'],
                    value: dateFormat.format(new Date(nextRentReview))
                });
            }

            if (rentReviewCycle && !leaseSettings.hideNextRentReviewCycleDate) {
                leaseInformationAndCharges.push({
                    id: 'rentReviewCycleDate',
                    title: language['LeaseRentReviewCycle'],
                    value: rentReviewCycle
                });
            }
            if (nextLeaseBreak && !leaseSettings.hideNextLeaseBreakDate) {
                leaseInformationAndCharges.push({
                    id: 'nextLeaseBreakDate',
                    title: language['LeaseContractBreakDate'],
                    value: dateFormat.format(new Date(nextLeaseBreak))
                });
            }
        }

        if (
            property.LeaseTypes &&
            property.LeaseTypes.length &&
            !leaseSettings.hideLeaseType
        ) {
            const leaseTypes = this.getTranslatedLeaseTypes(
                property.LeaseTypes
            );

            leaseInformationAndCharges.push({
                id: 'leaseTypes',
                title: language['LeaseType'],
                value: leaseTypes
            });
        }

        if (!leaseSettings.hidePrice) {
            const isSale = property.Aspect.filter(x => x == 'isSale').length >= 1;
            const isSalePriceExists = property.Charges.some(x => x.chargeType == 'SalePrice');
            if (isSale) {
                leaseInformationAndCharges.push({
                    id: 'priceSaleLabel',
                    title: language['LMPdpPriceLabelSale'],
                    value: (
                        isSalePriceExists ?
                            <PriceLabel
                                property={property}
                                searchType={'isSale'}
                                displayLabel={false}
                                displayStyling={false}
                                ignoreConfig={true}
                            /> :
                            <span>
                                {contactBrokerTranslation}
                            </span>
                    )
                });
            }

            const isLetting = property.Aspect.filter(x => x == 'isLetting').length >= 1;
            let isLettingPriceExists = property.Charges.some(x => x.chargeType == 'Rent');

            let leasePrice = property.Charges.filter(charge => charge.chargeType.toLowerCase() === 'rent');
            if (leasePrice && leasePrice.length > 1) {

                let minCharge = leasePrice[0];
                let maxCharge = leasePrice && leasePrice.length > 1 ? leasePrice[1] : undefined;

                if (checkChargeForAmount(minCharge) || checkChargeForAmount(maxCharge)) {
                    const minAmount = parseFloat(minCharge.amount);
                    const maxAmount = parseFloat(maxCharge.amount);
                    
                    const culture = features.sizeCultureCode ? features.sizeCultureCode: this.props.culture;
                    const numberFormatTranslated = new Intl.NumberFormat(culture, {
                        style: 'currency',
                        currency: minCharge.currencyCode,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    let translatedUnit = language[leasePrice[0].unit] || leasePrice[0].unit || '';
                    let translatedInterval = language[leasePrice[0].interval] || leasePrice[0].interval || '';

                    if (translatedUnit !== "" && translatedInterval !== "") {
                        leasePrice = `${numberFormatTranslated.format(minAmount)} - ${numberFormatTranslated.format(maxAmount)}/${translatedUnit}/${translatedInterval}`;
                    } else if (translatedUnit !== "") {
                        leasePrice = `${numberFormatTranslated.format(minAmount)} - ${numberFormatTranslated.format(maxAmount)}/${translatedUnit}`;
                    } else if (translatedInterval !== "") {
                        leasePrice = `${numberFormatTranslated.format(minAmount)} - ${numberFormatTranslated.format(maxAmount)}/${translatedInterval}`;
                    } else {
                        leasePrice = `${numberFormatTranslated.format(minAmount)} - ${numberFormatTranslated.format(maxAmount)}`;
                    }
                    
                    // Manually fix currency issue for Denmark because react-intl v2.4 couldn't return property format 
                    if (culture && culture === 'da-dk')
                    {
                        leasePrice = "Kr. " + leasePrice.replaceAll('kr.', '').replace(' -', '-');
                    }
                }
                else {
                    isLettingPriceExists = false;
                }
            } else {
                leasePrice = (
                    <PriceLabel
                        property={property}
                        searchType={"isLetting"}
                        displayLabel={false}
                        displayStyling={false}
                        ignoreConfig={true}
                    />
                );
            }

            if (isLetting) {
                leaseInformationAndCharges.push({
                    id: "priceLettingLabel",
                    title: language["LMPdpPriceLabelRent"],
                    value: isLettingPriceExists ? (leasePrice) : (<span>{contactBrokerTranslation}</span>)
                });
            }
        }

        if (property.BusinessRatesInfo) {
            const {
                rateInThePound,
                rateableValuePounds
            } = property.BusinessRatesInfo;

            if (rateInThePound) {
                leaseInformationAndCharges.push({
                    id: 'rateInThePound',
                    title: language['PdpUbr'],
                    value: (
                        <TranslateString
                            string="PdpUbrText"
                            unit={rateInThePound}
                        />
                    )
                });
            }

            if (rateableValuePounds) {
                const currencyCode =
                    stores.ParamStore.getParam('CurrencyCode') ||
                    defaultValues.currency;

                const formattedCurrency = new Intl.NumberFormat(
                    features.sizeCultureCode? features.sizeCultureCode : currentLanguage,
                    {
                        style: 'currency',
                        currency: currencyCode
                    }
                ).format(rateableValuePounds);

                leaseInformationAndCharges.push({
                    id: 'rateableValuePounds',
                    title: language['PdpRatableValue'],
                    value: formattedCurrency
                });
            }
        }

        let remainingCharges = property.Charges.filter(
            c => c.chargeType !== 'SalePrice' && c.chargeType !== 'Rent'
            //&& (c.chargeType === 'BusinessRates' && leaseSettings.hideBusinessRates)
        );

        remainingCharges.forEach(function (charge) {
            leaseInformationAndCharges.push({
                id: charge.chargeType,
                title: charge.chargeType
                    ? language['Pdp' + charge.chargeType]
                    : '',
                value: (
                    <Charge
                        charge={charge}
                        displayLabel={false}
                        displayStyling={false}
                        stringPrefix={'LM'}
                    />
                )
            });
        });

        if (property.ActualAddress && property.ActualAddress.zone) {
            leaseInformationAndCharges.push({
                id: 'zone',
                title: language['Zone'],
                value: property.ActualAddress.zone
            });
        }
        if (!stores.ConfigStore.getFeatures().showStoriesInBuildingStatus && property.NumberOfStoreys) {
            leaseInformationAndCharges.push({
                id: 'stories',
                title: language['NumberOfStories'],
                value: property.NumberOfStoreys
            });
        }
        if (property.NumberOfLots) {
            leaseInformationAndCharges.push({
                id: 'lots',
                title: language['NumberOfLots'],
                value: property.NumberOfLots
            });
        }
        if (property.NumberOfBedrooms) {
            leaseInformationAndCharges.push({
                id: 'bedrooms',
                title: language['NumberOfBedrooms'],
                value: (
                    <Bedrooms
                        bedrooms={property.NumberOfBedrooms}
                        displayStyling={false}
                    />
                )
            });
        }
        if (!stores.ConfigStore.getFeatures().displayBuildingStatusInfo && property.YearBuilt) {
            leaseInformationAndCharges.push({
                id: 'YearBuilt',
                title: language['YearBuilt'],
                value: property.YearBuilt
            });
        }
        if (
            stores.ConfigStore.getFeatures().displayPropertyUsageType &&
            property.UsageType &&
            !property.ParentPropertyId
        ) {
            leaseInformationAndCharges.push({
                id: 'UsageType',
                title: language['PropertyUsageTypeHeader'],
                value: language['PdpUsageType' + property.UsageType]
                    ? language['PdpUsageType' + property.UsageType]
                    : property.UsageType
            });
        }
        if (
            stores.ConfigStore.getFeatures().displayPropertySubType &&
            property.PropertySubType &&
            property.PropertySubType != 'Unknown' &&
            (!property.ParentPropertyId || property.ParentPropertyId == '')
        ) {
            leaseInformationAndCharges.push({
                id: 'PropertySubType',
                title: language['PropertySubTypeHeader'],
                value: language['PDPPropertyType' + property.PropertySubType]
                    ? language['PDPPropertyType' + property.PropertySubType]
                    : property.PropertySubType
            });
        }

        if (
            property.FloorsAndUnits[0] &&
            property.FloorsAndUnits[0].vacancy &&
            property.ParentPropertyId
        ) {
            leaseInformationAndCharges.push({
                id: 'Vacancy',
                title: language['Vacancy'],
                value:
                    language['Vacancy' + property.FloorsAndUnits[0].vacancy] ||
                    property.FloorsAndUnits[0].vacancy
            });
        }

        if (
            property.LeaseRateType &&
            stores.ConfigStore.getFeatures().displayLeaseRateType
        ) {
            const leaseRateTypeValue = language[`PDP${property.LeaseRateType}`]
                ? language[`PDP${property.LeaseRateType}`]
                : property.LeaseRateType;

            leaseInformationAndCharges.push({
                id: 'LeaseRateType',
                title: language['PDPLeaseRateType'],
                value: leaseRateTypeValue
            });
        }

        // Mapping for property.CommonCharges
        try {
            if (property.CommonCharges && Array.isArray(property.CommonCharges)) {
                property.CommonCharges
                    .filter(c => c["Common.Interval"] == stores.ParamStore.getParam('Interval'))
                    .forEach(c => {
                        if (
                            c["Common.ChargeKind"] == "AskingRentOffice"
                            || c["Common.ChargeKind"] == "AskingRentMezzanine"
                            || c["Common.ChargeKind"] == "AskingRentWarehouse"
                        ) {

                            const formattedCurrency = new Intl.NumberFormat(
                                features.sizeCultureCode? features.sizeCultureCode : currentLanguage,
                                {
                                    style: 'currency',
                                    currency: c['Common.CurrencyCode']
                                }
                            ).format(c['Common.Amount']);

                            leaseInformationAndCharges.push({
                                id: c["Common.ChargeKind"],
                                title: language[c["Common.ChargeKind"]] ? language[c["Common.ChargeKind"]] : c["Common.ChargeKind"],
                                value: (
                                    <TranslateString
                                        string="ByArea"
                                        amount={formattedCurrency}
                                        unit={language[c["Common.PerUnit"]]}
                                        interval={language[c["Common.Interval"]]}
                                    />
                                )
                            });
                        }
                    });
            }
        } catch (e) {
            console.log(e);
        }

        return leaseInformationAndCharges;
    }

    render() {
        const cells = this.buildLeaseAndChargeData(this.props.property);
        if (!cells || cells.length === 0) {
            return null;
        }

        return (
            <Table>
                <Row>
                    {cells.map(({ id, title, value }) => (
                        <Cell key={id + title + value + Math.floor(Math.random() * Math.floor(1000)) + ''} widthXs={6} widthSm={5} widthLg={4} data-test={createDataTestAttribute('pdp-lease-and-charge', title)}>
                            <h3 className="cbre_h6">{title}</h3>
                            {value}
                        </Cell>
                    ))}
                </Row>
            </Table>
        );
    }
}
