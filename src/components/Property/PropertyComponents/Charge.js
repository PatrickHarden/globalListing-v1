import React, { Component } from 'react';

import PropTypes from 'prop-types';
import TranslateString from '../../../utils/TranslateString';
import defaultValues from '../../../constants/DefaultValues';

export const basicModifiers = {
    CallForInfo: 'CallForInformation',
    PriceByNegotiation: 'PriceByNegotiation',
    PriceIsNegotiable: 'PriceIsNegotiable',
    PriceOnListing: 'PriceOnListing',
    PrivateTreaty: 'PrivateTreaty',
    DeadlineSale: 'DeadlineSale',
    ExpressionsOfInterest: 'ExpressionsOfInterest',
    Tender: 'Tender',
    Auction: 'Auction',
    OnApplication: 'PriceOnApplication',
    ContactAgent: 'ContactAgent'
};
export default class RentalPrice extends Component {
    static defaultProps = {
        displayLabel: true,
        displayStyling: true,
        labelType: 'Pdp'
    };

    getCommissionPayableChargesProps(props, charge) {
        const { language, stores } = this.context;

        const features = stores.ConfigStore.getItem('features');

        props.amount = props.amount || charge.amount || '';
        props.dependentCharge = language[charge.dependentCharge];
        props.taxModifier = props.taxModifier || '';
        props.paidBy = language[charge.paidBy];
        props.amountKind = charge.amountKind || '';
        props.string += 'CommissionPayableCharges';

        // see CB-945 clarificiation of this logic

        if (!props.paidBy) {
            props.paidBy = language.Purchaser;
        }

        // Change to percentage based string.

        if (charge.amountKind === 'Percentage') {
            props.string += 'Percentage';
        }

        if (charge.amountKind === 'Value') {
            props.string += 'Value';
        } else {
            // Remove currency formatting if amountKind is not 'Value'
            if (!features.forceCurrencyFormatting){
                props.amount = charge.amount || '';
            }
        }

        return props;
    }

    getTranslatedSubStringProps(props, charge) {
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');
        const culture = features.sizeCultureCode? features.sizeCultureCode : stores.ConfigStore.getItem('language'); 
        const numberFormatTranslated = new Intl.NumberFormat(culture, {
            style: 'currency',
            currency: charge.translated.currencyCode,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        });

        props.translatedUnit = language[charge.translated.unit];
        props.translatedInterval = language[charge.translated.interval];
        props.translatedAmount = numberFormatTranslated.format(
            charge.translated.amount
        );

        if (culture && culture === 'da-dk')
        {
            props.translatedAmount = "Kr. " + props.translatedAmount.replace(/\s/g, '').replace('kr.', '');
        }
        return props;
    }


    render() {
        const { charge, labelType, stringPrefix } = this.props;

        const { language, stores } = this.context;
        const features = stores.ConfigStore.getItem('features');

        const culture = features.sizeCultureCode? features.sizeCultureCode : stores.ConfigStore.getItem('language');
        const label = this.props.displayLabel
            ? language[labelType + charge.chargeType] + ': '
            : null;
        let styling = {};

    
        const basicModifier = basicModifiers[charge.chargeModifier];

        if (this.props.displayStyling) {
            styling.className = 'property-price';
        }

        if (
            charge.amount && !basicModifier
        ) {
            // Essentially removes trailing zeros if it is already a whole number.
            const amount = parseFloat(charge.amount);
            const numberFormat = new Intl.NumberFormat(culture, {
                style: 'currency',
                currency: charge.currencyCode || defaultValues.currency,
                //feature flag added for Germany Pages.
                minimumFractionDigits: features.displayDecimalsForCharges? 2:
                    (amount % Math.round(amount) === 0 ? 0 : 2),
                maximumFractionDigits: 2
            });

            // TODO: It seems this functionality is a bit unstable so let's revisit this at some point (outputting 201504?)
            // yearFormat = new Intl.DateTimeFormat(culture, { year: 'numeric'}),
            // Assuming year to being on (typical) begin of financial/tax year.
            // year = charge.year ? yearFormat.format(new Date(charge.year + '04-01')) : null,
            const year = new Intl.NumberFormat(culture, {
                useGrouping: false
            }).format(charge.year);

            let translateStringProps = {
                string: 'Charge',
                unit: language[charge.unit],
                interval: language[charge.interval],
                amount: numberFormat.format(amount),
                chargeModifier: (!features.hideChargeModifiers)?
                    (language[charge.chargeModifier] || charge.chargeModifier):null,
                taxModifier: null,
                component: 'span'
            };

            let translateSubStringProps = {
                year: year,
                translatedUnit: null,
                translatedInterval: null,
                translatedAmount: null,
                component: 'div',
                className: 'cbre_smallText'
            };

            if (charge.unit === 'Whole') {
                charge.unit = null;
            }

            if (charge.interval === 'Once') {
                charge.interval = null;
            }

            translateStringProps.string = stringPrefix || '';
            translateStringProps.string += charge.interval ? 'Charge' : '';
            translateStringProps.string += charge.unit ? 'ByArea' : '';
            translateStringProps.string += charge.year ? 'WithYear' : '';

            if (translateStringProps.string.length === 0) {
                translateStringProps.string = 'SalePrice';
            }

            translateStringProps.string += charge.translated
                ? 'Transformed'
                : '';

            if (charge.taxModifier) {
                translateStringProps.taxModifier = language[charge.taxModifier];
            }
            // Handle Commision payable charges.
            if (
                charge.chargeType === 'BrokerageFees' ||
                charge.chargeType === 'Deposit' ||
                charge.chargeType === 'OperatingCost'
            ) {
                translateStringProps = this.getCommissionPayableChargesProps(
                    translateStringProps,
                    charge
                );
            }

            if (stringPrefix) {
                translateSubStringProps.string = `${
                    translateStringProps.string
                }_sub`;
            }
            if (charge.chargeType === 'NetRent') {
                translateStringProps.string += charge.unit ? 'Net' : '';
            }

            // Handle translated substrings.
            if (charge.translated) {
                translateSubStringProps = this.getTranslatedSubStringProps(
                    translateSubStringProps,
                    charge
                );
            }

            let subText;
            if (translateSubStringProps.string) {
                subText = <TranslateString {...translateSubStringProps} />;
            }

            // Have to manually delete these since we pass the rest through to TranslateString
            // This is to support legacy view
            delete translateSubStringProps.string;
            delete translateSubStringProps.className;
            delete translateSubStringProps.component;

            const chargeAbbreviations = stores.ConfigStore.getItem('chargeAbbreviations') || false;

            if (chargeAbbreviations && typeof chargeAbbreviations === 'object'){
                const chargeAbbreviationKey = numberFormat.format(0).substr(0, numberFormat.format(0).indexOf('0'));
                if (chargeAbbreviationKey && chargeAbbreviations[chargeAbbreviationKey]){
                    translateStringProps.amount =  translateStringProps.amount.replace(chargeAbbreviationKey, chargeAbbreviations[chargeAbbreviationKey]);
                }
            }

            if (charge.chargeType && charge.chargeType === "ServiceCharge"){
                return (
                    <span {...styling}>
                        {label}
                        {language.PriceOnApplication}
                        {subText}
                    </span>
                );
            } else {
                return (
                    <span {...styling}>
                        {label}
                        <TranslateString
                            {...translateStringProps}
                            {...translateSubStringProps}
                        />
                        {subText}
                    </span>
                );
            }
        } else if (
            !charge.amount || basicModifier
        ) {
            if (this.props.displayStyling && window.cbreSiteTheme != 'commercialr3') {
                styling.className += ' property-price--on-application';
            }

            return (
                <span {...styling}>
                    {label}
                    {language[basicModifier] || language.PriceOnApplication}
                </span>
            );
        }
    }
}

RentalPrice.propTypes = {
    charge: PropTypes.object.isRequired,
    displayLabel: PropTypes.bool,
    displayStyling: PropTypes.bool,
    labelType: PropTypes.string,
    stringPrefix: PropTypes.string
};

RentalPrice.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};
