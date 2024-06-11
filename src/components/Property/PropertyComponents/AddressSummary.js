import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TranslateString from '../../../utils/TranslateString';

export default class AddressSummary extends Component {
    static propTypes = {
        address: PropTypes.object.isRequired,
        floorsAndUnits: PropTypes.array,
        isParent: PropTypes.bool
    };

    CreateAddress()
    {
        const features = this.context.stores.ConfigStore.getItem('features');

        const address = this.props.address || {},
            Line1 = address.line1,
            Line2 = address.line2 || address.line3,
            Line3 = address.line2 ? address.line4 : address.line3,
            Line4 = address.line4,
            Locality = address.locality,
            Region = address.region,
            Country = address.country,
            PostCode = address.postcode,
            FloorsAndUnits = this.props.floorsAndUnits,
            AddressType = address.addressType;
        
        let subdivisionName;

        if (
            FloorsAndUnits &&
            FloorsAndUnits.length > 0 &&
            FloorsAndUnits[0].subdivisionName &&
            features &&
            features.childListings &&
            features.childListings.enableChildListings &&
            !this.props.isParent
        ) {
            subdivisionName = FloorsAndUnits[0].subdivisionName + ', ';
        }

        if (features && features.displaySuburbShortAddress && AddressType == "suburb") {
            return (<span>{Locality}, {Region}, {PostCode}</span>);
        } else {
            return (
                <span>
                    {subdivisionName}
                    <TranslateString
                        Line1={Line1}
                        Line2={Line2}
                        Line3={Line3}
                        Line4={Line4}
                        Locality={Locality}
                        Region={Region}
                        Country={Country}
                        PostCode={PostCode}
                        string={address.addressSummaryFormat}
                        appendCommas={this.context.stores.ConfigStore.getFeatures().appendCommasToAddress || false}
                    />
                </span>
            );
        }
    }

    render() {
        return (
            <div>
                {this.CreateAddress()}
            </div>
        );
    }
}

AddressSummary.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

AddressSummary.defaultProps = {
    isParent: false,
    floorsAndUnits: []
};
