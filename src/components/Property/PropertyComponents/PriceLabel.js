import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Charge from './Charge';
import _ from 'lodash';
import PriceRange_R3 from '../../../r3/components/PriceRange/PriceRange.r3';
import { checkIfPriceRangeExists }  from '../../../r3/PDP/PDPHeader/SideBarHeader.Commercial.r3';
import { DefaultValues } from '../../../constants/DefaultValues';

export default class PriceLabel extends Component {
    static propTypes = {
        searchType: PropTypes.string,
        property: PropTypes.object.isRequired,
        displayLabel: PropTypes.bool,
        displayClasses: PropTypes.bool,
        ignoreConfig: PropTypes.bool
    };

    static contextTypes = {
        stores: PropTypes.object,
        language: PropTypes.object
    };

    static defaultProps = {
        searchType: '',
        property: {},
        displayLabel: true,
        ignoreConfig: false
    };

    render() {
        let charge;
        const features = this.context.stores.ConfigStore.getItem('features');
        const useNetRent = features && features.useNetRent;

        let siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

        if (this.props.searchType == 'isSale') {
            charge = _.chain(this.props.property.Charges)
                .filter({ chargeType: 'SalePrice' })
                .first()
                .value();
        } else if (this.props.property.UsageType === 'FlexOffice') {
            charge = _.chain(this.props.property.Charges)
                .filter({ chargeType: 'FlexRent' })
                .first()
                .value();
        } else {
            if (useNetRent && !this.props.ignoreConfig) {
                charge = _.chain(this.props.property.Charges)
                    .filter({ chargeType: 'NetRent' })
                    .first()
                    .value();
            } else {
                charge = _.chain(this.props.property.Charges)
                    .filter({ chargeType: 'Rent' })
                    .first()
                    .value();
            }
        }

        // If the above mapping isn't fruitful, just try to grap the first one.
        if (!charge && !(siteTheme && siteTheme === 'commercialr3')) {
            charge = _.chain(this.props.property.Charges).first().value();
        }

        // A fallback object if no charges exist, which I've seen! This will result in POA
        if (!charge) {
            charge = {
                chargeType:
                    this.props.searchType == 'isSale' ? 'SalePrice' : 'Rent'
            };
        }

        // Handle lease "Price Range" for r3 design
        if (siteTheme === 'commercialr3') {
            if(checkIfPriceRangeExists(this.props.property.Charges) && charge.chargeType == 'Rent') {
                return(<PriceRange_R3 charges={this.props.property.Charges} stores={this.context.stores} priceRangeCheck={checkIfPriceRangeExists} />);
            }
        }

        return (
            <Charge
                charge={charge}
                displayLabel={this.props.displayLabel}
                displayStyling={this.props.displayStyling}
            />
        );
    }
}
