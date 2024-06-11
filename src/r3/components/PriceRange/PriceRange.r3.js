import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import TranslateString from '../../../utils/TranslateString';

class PriceRange_R3 extends Component {
    constructor(props) {
        super(props);
    }


    // if priceRangeCheck returns true, run this logic to display the price range
    generatePriceRange = (charges) => {
        // variable used to convert currencyCode to currencySymbol
        const features = this.context.stores.ConfigStore.getItem('features');
        const culture = features.sizeCultureCode? features.sizeCultureCode : this.props.stores.ConfigStore.getItem('language');

        // variable used to choose NetRent or GrossRent
        
        const useNetRent = features && features.useNetRent;

        // defaulted values
        let from = null;
        let to = null;
        let interval = null;
        let unit = null;

        if (useNetRent && this.props.notLeaseAndCharge) {
            // Filter values based on Net Rent
            charges.filter(charge => charge.chargeType == 'NetRent').map(charge => {
                if (charge.chargeModifier == 'From' && !from) {
                    interval = charge.interval ? charge.interval.toLowerCase() : '';
                    unit = charge.unit;

                    // set up currencyCode conversion (e.g. USD -> $)
                    const numberFormatTranslated = new Intl.NumberFormat(culture, {
                        style: 'currency',
                        currency: charge.currencyCode,
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 0
                    });
                    from = numberFormatTranslated.format(
                        charge.amount
                    );

                } else if (charge.chargeModifier == 'To' && !to) {
                    // regex to append commas to charge amount
                    to = charge.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
            });

        }
        else {
            // update values
            charges.map(charge => {
                if (charge.chargeModifier == 'From' && !from) {
                    interval = charge.interval ? charge.interval.toLowerCase() : '';
                    unit = charge.unit;

                    // set up currencyCode conversion (e.g. USD -> $)
                    const numberFormatTranslated = new Intl.NumberFormat(culture, {
                        style: 'currency',
                        currency: charge.currencyCode,
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    });
                    from = numberFormatTranslated.format(
                        charge.amount
                    );

                } else if (charge.chargeModifier == 'To' && !to) {
                    const numberFormatTranslated = new Intl.NumberFormat(culture, {
                        style: 'currency',
                        currency: charge.currencyCode,
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    });
                    to = numberFormatTranslated.format(
                        charge.amount
                    );
                    // Commented out the below RegEX validation as it is breaking Region Price Range for Some Regions
                    // regex to append commas to charge amount
                    // to = charge.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
            });

        }

        // construct translation
        let monthly = 'mo';
        let annually = 'yr';
        const i18n = this.props.stores.ConfigStore.getItem('i18n');
        if (i18n) {
            if (i18n.Monthly) {
                monthly = i18n.Monthly;
            }
            if (i18n.Annually) {
                annually = i18n.Annually;
            }
        }

        const apiIntervals = ['monthly', 'annually'];
        const shortIntervals = [monthly, annually];
        // matches the api interval to the config i18n value
        interval = shortIntervals[apiIntervals.indexOf(interval)];
        
        // Commented Below code as we have adjusted adding succeeding digits while Formatting the original value

        // const shouldConvertToDecimal = this.isDecimal(from) || this.isDecimal(to);
        // // To maintain the conistency, convert to decimal if from or to value is decimal
        // if (shouldConvertToDecimal) {
        //     from = this.convertToDecimals(from);
        //     to = this.convertToDecimals(to);
        // }

        // Manually fix currency issue for Denmark because react-intl v2.4 couldn't return property format 
        if (culture && culture === 'da-dk')
        {
            from = "Kr. " + from.replace(/\s/g, '').replace('kr.', '');
            to = to.replace('kr.', '');
        }

        const useTranslateString = this.props.stores.ConfigStore.getItem('features').usePriceRangeTranslateString;
        const net = useNetRent && this.props.notLeaseAndCharge ? i18n.Net : null;

        return (
            <div data-test={createDataTestAttribute('price-range', this.props.dataTestIndex)}>
                {useTranslateString ?
                    <TranslateString
                        from={from}
                        to={to}
                        unit={i18n[unit] || unit}
                        interval={interval}
                        string={"PriceRangeTranslation"}
                        net={net}
                    /> :
                    <span>
                        {from && <span>{from} - </span>}{to}{unit && <span>/{i18n[unit] || unit}</span>}{interval && <span>/{interval}</span>}
                    </span>
                }
            </div>
        );
    };

    isDecimal(value) {
        return value && String(value).indexOf('.') !== -1;
    }

    convertToDecimals = (num) => {
        if (!num) { return num; }
        let value = String(num);
        const periodIndex = value.indexOf('.');
        if (periodIndex !== -1) {
            const decimals = value.substr(periodIndex + 1, value.length);
            // and there exist less than one decimal, or no decimals, append zeros
            if (decimals.length == 0) {
                value += '00';
            } else if (decimals.length == 1) {
                value += '0';
            }
        } else {
            value += '.00';
        }

        return value;
    }


    render() {

        return (
            <span>
                {this.props.priceRangeCheck(this.props.charges) &&
                    <span>{this.generatePriceRange(this.props.charges)}</span>
                }
            </span>
        );
    }
}

PriceRange_R3.contextTypes = {
    stores: PropTypes.object
};

PriceRange_R3.propTypes = {
    charges: PropTypes.array,
    stores: PropTypes.object,
    priceRangeCheck: PropTypes.func,
    displayLabel: PropTypes.bool,
    dataTestIndex: PropTypes.number
};

export default PriceRange_R3;