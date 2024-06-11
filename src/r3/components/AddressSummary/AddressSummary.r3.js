import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TranslateString from '../../../utils/TranslateString';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import styled from 'styled-components';

export default class AddressSummary extends Component {
    static propTypes = {
        address: PropTypes.object.isRequired,
        floorsAndUnits: PropTypes.array,
        isParent: PropTypes.bool,
        propertyCount: PropTypes.number,
        dataTestIndex: PropTypes.number,
        featuredRedesignCarousel: PropTypes.bool,
        pdpLocationCard: PropTypes.bool
    };

    CreateAddress() {

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
            return (
                <div id={(this.props.featuredRedesignCarousel == true) ? "featuredAddress1" : "addressLine1"} data-test={createDataTestAttribute('address-line-1', this.props.dataTestIndex)}>
                    <span>{Locality}, {Region}, {PostCode}</span>
                </div>
            );
        } else if (this.props.isBreadCrumb) {
            return (
                <TranslateString
                    Line1={Line1}
                    Line2={Line2}
                    Line3={Line3}
                    Line4={Line4}
                    Locality={Locality}
                    Region={Region}
                    PostCode={PostCode}
                    Country={Country}
                    string={"AddressSummaryShort"}
                    appendCommas={features.appendCommasToAddress ? features.appendCommasToAddress : false}
                    removeSelectCommas={features.removeSelectCommas ? features.removeSelectCommas : []}
                />
            );
        } else if (this.props.pdpLocationCard) {
            return (
                <div>
                    <span>{subdivisionName}</span>
                    <TranslateString
                        Line1={Line1}
                        Line2={Line2}
                        Line3={Line3}
                        Line4={Line4}
                        Locality={Locality}
                        Region={Region}
                        PostCode={PostCode}
                        Country={Country}
                        string={"AddressLine1"}
                        appendCommas={features.appendCommasToAddress ? features.appendCommasToAddress : false}
                        removeSelectCommas={features.removeSelectCommas ? features.removeSelectCommas : []}
                    />
                    <TranslateString
                        Locality={Locality}
                        Region={Region}
                        Country={Country}
                        PostCode={PostCode}
                        string={"AddressLine2"}
                        appendCommas={true}
                    />
                </div>
            );
        } else {
            return (
                <span>
                    <div id={(this.props.featuredRedesignCarousel == true) ? "featuredAddress1" : "addressLine1"} data-test={createDataTestAttribute('address-line-1', this.props.dataTestIndex)}>
                        <span>{subdivisionName}</span>
                        <Address1
                            Line1={Line1}
                            Line2={Line2}
                            Line3={Line3}
                            Line4={Line4}
                            Locality={Locality}
                            Region={Region}
                            Country={Country}
                            PostCode={PostCode}
                            string={"AddressLine1"}
                            r4={(window.cbreSiteTheme=== 'commercialr4') ? true : false}
                            appendCommas={features.appendCommasToAddress ? features.appendCommasToAddress : false}
                            removeSelectCommas={features.removeSelectCommas ? features.removeSelectCommas : []}
                        />
                    </div>
                    <div id={(this.props.featuredRedesignCarousel == true) ? "featuredAddress2" : "addressLine2"} data-test={createDataTestAttribute('address-line-2', this.props.dataTestIndex)} style={this.props.propertyCount > 1 ? { width: '60%', float: 'left' } : { width: '100%' }}>
                        <Address2
                            Line2={Line2}
                            Locality={Locality}
                            Region={Region}
                            Country={Country}
                            PostCode={PostCode}
                            string={"AddressLine2"}
                            r4={(window.cbreSiteTheme === 'commercialr4') ? true : false}
                            appendCommas={features.appendCommasToAddress ? features.appendCommasToAddress : false}
                            removeSelectCommas={features.removeSelectCommas ? features.removeSelectCommas : []}
                        />
                    </div>
                    {this.props.propertyCount && this.props.propertyCount > 1 &&
                        <div className="propertyCount" style={{ width: '40%', float: 'left' }} data-test={createDataTestAttribute('address-property-count', this.props.dataTestIndex)}>
                            {this.props.propertyCount} Spaces Available
                        </div>
                    }
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
    floorsAndUnits: [],
    featuredRedesignCarousel: false,
    isBreadCrumb: false,
    pdpLocationCard: false
};


const Address1 = styled(TranslateString)`
    ${({r4}) => r4 && 
        `
            font-family: "Financier Regular";
            font-style: normal;
            font-weight: normal;
            font-size: 24px;
            line-height: 30px;
            color: #003F2D;
        `
    }
`;

const Address2 = styled(TranslateString)`
    ${({r4}) => r4 && 
        `
        font-family: "Calibre Regular";
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        color: #435254;
        `
    }
`;