import React from 'react';

import UnderOfferBanner from '../../../list-map-components/UnderOfferBanner/UnderOfferBanner';
import AddressSummary from '../../../r4/PDP/AddressSummary';
import PriceLabel from '../../../components/Property/PropertyComponents/PriceLabel';
import Size_R3 from '../../../r3/components/Size/Size.r3';
import Favourite_R3 from '../FavouriteStar/Favourite.r3';
import TranslateString from '../../../utils/TranslateString';
import getEnergyRating from '../../../utils/getEnergyRating';
import PriceRange_R3 from '../../../r3/components/PriceRange/PriceRange.r3';
import PropTypes from 'prop-types';
import ShareButton_R4 from '../../../r4/components/ShareButton/ShareButton.r4';
import { basicModifiers } from '../../../components/Property/PropertyComponents/Charge';
import styled from 'styled-components';

const SideBarHeader_R4 = (props, context) => {
    const { bannerText, breakpoints, property, showShareIcons, modal } = props;

    const { ActualAddress, IsParent, PropertyId: propertyId, GeoLocation: { exact }, Highlights, SaleAuthority, NumberOfBedrooms: bedrooms } = property;

    const { stores } = context;

    const features = stores.ConfigStore.getItem('features');

    let inexactText;

    let _IsParent = IsParent === '' ? false : IsParent;

    const isMobile = !breakpoints.isTabletLandscapeAndUp;

    const ratingIcon = getEnergyRating(features, Highlights);

    const showUnderOffer = !!bannerText && !rating;

    const numberOfBedroomsTranslationString = parseInt(bedrooms) === 1 ? "NumberOfBedroomsSingular" : "NumberOfBedroomsPlural";

    const contactBrokerTranslation = stores.ConfigStore.getItem('i18n').PriceOnApplication || 'Contact Broker For Pricing';

    let useClass = '';
    if (features && features.displayUseClass) {
        useClass = property.UseClass;
    }


    const rating = ratingIcon ? (
        <div className="energy-rating">
            <img src={ratingIcon} />
        </div>
    ) : null;

    const priceRangeExists = checkIfPriceRangeExists(property.Charges);
    const showRentPriceLabel = features.hideDuplicatePriceLables ? showChargeLabel(property, features.useNetRent, 'isLetting') : true;
    const showSalePriceLabel = features.hideDuplicatePriceLables ? showChargeLabel(property, features.useNetRent, 'isSale', features) : true;

    if (!exact) {
        if (typeof features.displayFullAddressOnRequest === 'undefined' || features.displayFullAddressOnRequest === true) {
            inexactText = (
                <div className="cbre_subh1 cbre_addressOnRequest">
                    {context.language.FullAddressOnRequest}
                </div>
            );
        }
    }


    const energyRating = !features.hideCertificationTypeLabel && props && props.property && props.property.EnergyPerformanceData && props.property.EnergyPerformanceData.CertificateType ? (
        <div style={{ display: "table" }}>
            <div style={{ color: "#666666", display: "table-cell", verticalAlign: "middle" }} data-test="energy-rating-label">
                {context.language.CertificateType}
            </div>
            <span style={{ color: "#333333", fontSize: "1.5em", paddingLeft: "10px", fontWeight: "bold", display: "table-cell", verticalAlign: "middle" }} data-test="energy-rating-value">
                <TranslateString string={props.property.EnergyPerformanceData.CertificateType} />
            </span>
        </div>
    ) : null;

    return (
        <div className="row sidebar-header commercial-header">
            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                <div className="padding-xs-1">
                    <div className="cbre_flex">
                        <div className="flexGrow-xs-1">
                            <div className="header-content" style={{ alignItems: 'normal', marginTop: '11px' }}>
                                <div className="header-title" style={{ marginTop: '-7px' }}>
                                    <h1 className="cbre_h1">
                                        <AddressSummary
                                            address={ActualAddress}
                                            floorsAndUnits={
                                                property.FloorsAndUnits
                                            }
                                            isParent={_IsParent}
                                            propertyCount={1}
                                        />
                                    </h1>
                                    {!isMobile && (
                                        <UnderOfferBanner
                                            displayText={bannerText}
                                            underOffer={showUnderOffer}
                                        />
                                    )}
                                    {!isMobile && rating}
                                    {!isMobile && energyRating}
                                </div>
                                <Wrapper className="cbre_subh2 header-size">
                                    <Size_R3
                                        property={property}
                                        displayLabel={false}
                                        displayStyling={false}
                                    />
                                </Wrapper>
                                <Wrapper>

                                    <div>
                                        {property.Aspect.includes('isLetting') && !property.Aspect.includes('isSale') &&
                                            <span>
                                                <h4 className="headerH4">
                                                    <span>
                                                        {context.language.PdpHeaderLeasePrice ?
                                                            context.language.PdpHeaderLeasePrice
                                                            :
                                                            (context.language.LMPdpPriceLabelRent ?
                                                                context.language.LMPdpPriceLabelRent
                                                                : 'Lease Rate')
                                                        }
                                                    </span>
                                                </h4>
                                                {features.useNetRent || !checkIfPriceRangeExists(property.Charges) ?
                                                    <div className="cbre_h1 headerValue">
                                                        <PriceLabel
                                                            property={property}
                                                            searchType={'isLetting'}
                                                            displayLabel={false}
                                                            displayStyling={false}
                                                        />
                                                    </div>
                                                    :
                                                    <div style={{ marginTop: '5px' }}>
                                                        <PriceRange_R3 charges={property.Charges} stores={stores} priceRangeCheck={checkIfPriceRangeExists} notLeaseAndCharge={true} />
                                                    </div>
                                                }
                                            </span>
                                        }
                                        {property.Aspect.includes('isSale') && !property.Aspect.includes('isLetting') &&
                                            <span>
                                                <h4 className="headerValue">
                                                    {context.language.PdpHeaderSalePrice ?
                                                        context.language.PdpHeaderSalePrice
                                                        :
                                                        (context.language.LMPdpPriceLabelSale ?
                                                            context.language.LMPdpPriceLabelSale
                                                            : 'Lease Rate')
                                                    }
                                                </h4>
                                                <div className="cbre_h1 header-price">
                                                    <PriceLabel
                                                        property={property}
                                                        searchType={'isSale'}
                                                        displayLabel={false}
                                                        displayStyling={false}
                                                    />
                                                </div>
                                            </span>
                                        }
                                        {property.Aspect.includes('isSale') && property.Aspect.includes('isLetting') &&
                                            <span>
                                                {(showSalePriceLabel || showRentPriceLabel || priceRangeExists) &&
                                                    <React.Fragment>
                                                        <h4 className="headerH4">
                                                            {context.language.PdpHeaderLeasePrice ?
                                                                context.language.PdpHeaderLeasePrice
                                                                :
                                                                (context.language.LMPdpPriceLabelRent ?
                                                                    context.language.LMPdpPriceLabelRent
                                                                    : 'Lease Rate')
                                                            }
                                                        </h4>
                                                        {
                                                            !checkRentPriceExists(property.Charges) ?
                                                                <div className="headerValue">
                                                                    <span>
                                                                        <span>
                                                                            {contactBrokerTranslation}
                                                                        </span>
                                                                    </span>
                                                                </div> :
                                                                (!checkIfPriceRangeExists(property.Charges.filter(charge => charge.chargeType !== 'SalePrice')) ?
                                                                    <div className="headerValue">
                                                                        <PriceLabel
                                                                            property={property}
                                                                            searchType={'isLetting'}
                                                                            displayLabel={false}
                                                                            displayStyling={false}
                                                                        />
                                                                    </div>
                                                                    :
                                                                    <PriceRange_R3 charges={property.Charges} stores={stores} priceRangeCheck={checkIfPriceRangeExists} />
                                                                )
                                                        }
                                                    </React.Fragment>
                                                }
                                                {(showSalePriceLabel || showRentPriceLabel || priceRangeExists || (!showRentPriceLabel && !showSalePriceLabel && !priceRangeExists)) &&
                                                    <React.Fragment>
                                                        <h4 className="headerH4" style={{ marginTop: '12px' }}>
                                                            {context.language.PdpHeaderSalePrice ?
                                                                context.language.PdpHeaderSalePrice
                                                                :
                                                                (context.language.LMPdpPriceLabelSale ?
                                                                    context.language.LMPdpPriceLabelSale
                                                                    : 'Lease Rate')
                                                            }
                                                        </h4>
                                                        {salePriceExists(property.Charges) ?
                                                            <div className="headerValue">
                                                                <PriceLabel
                                                                    property={property}
                                                                    searchType={'isSale'}
                                                                    displayLabel={false}
                                                                    displayStyling={false}
                                                                />
                                                            </div>
                                                            :
                                                            <div className="headerValue">
                                                                <span>
                                                                    <span>
                                                                        {contactBrokerTranslation}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        }
                                                    </React.Fragment>
                                                }
                                            </span>
                                        }
                                    </div>

                                    {features && features.displayNumberOfBedrooms &&
                                        <div className="cbre_subh2 header-size">
                                            <TranslateString
                                                string={numberOfBedroomsTranslationString}
                                                bedroomCount={bedrooms}
                                            />
                                        </div>
                                    }

                                    {features && features.displayPropertyId && (
                                        <div className="cbre_subh2">
                                            <h4 className="headerH4" style={{ marginTop: '10px', marginBottom: '3px' }}>
                                                {context.language.PropertyID ? context.language.PropertyID : 'Property ID'}
                                            </h4>
                                            <TranslateString
                                                string="PropertyId"
                                                propertyId={propertyId}
                                            />
                                        </div>
                                    )}
                                    {inexactText}
                                    {useClass && (
                                        <div className="cbre_subh2 use-class">
                                            <TranslateString
                                                string="UseClass"
                                                useClass={useClass}
                                            />
                                        </div>
                                    )}
                                    {features && features.enableAuthority && typeof SaleAuthority === "string" && (
                                        <div className="cbre_subh2" style={{ marginTop: '5px' }}>
                                            <TranslateString
                                                string={SaleAuthority}
                                            />
                                        </div>
                                    )}
                                </Wrapper>
                            </div>
                            {showShareIcons && (
                                <div className="header-buttons">
                                    <Favourite_R3
                                        propertyId={propertyId}
                                    />
                                    <ShareButton_R4 modal={modal} page={'PDP'} property={property} />
                                    {isMobile && (
                                        <UnderOfferBanner
                                            displayText={bannerText}
                                            underOffer={showUnderOffer}
                                        />
                                    )
                                    }
                                    {isMobile && rating}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// loop through charges, check if "to" and "from" values exist
export const checkIfPriceRangeExists = (charges) => {
    let fromExists = false;
    let toExists = false;

    charges.map(charge => {
        if (charge.chargeModifier == 'From') {
            if (!charge.OnApplication) {
                fromExists = true;
            }
        } else if (charge.chargeModifier == 'To') {
            if (!charge.OnApplication) {
                toExists = true;
            }
        }
    });

    return (fromExists && toExists);
};

// validating whether value exists or not
export const checkRentPriceExists = (charges) => {
    return charges.some(x => x.chargeType == 'Rent');
};

export const salePriceExists = (charges) => {
    let result = false;
    charges.map(charge => {
        if (charge.chargeType == 'SalePrice') {
            result = true;
        }
    });
    return result;
};

export const showChargeLabel = ({ Charges, UsageType }, useNetRent, searchType) => {
    let charge;
    if (searchType == 'isSale') {
        charge = _.chain(Charges)
            .filter({ chargeType: 'SalePrice' })
            .first()
            .value();
    } else if (UsageType === 'FlexOffice') {
        charge = _.chain(Charges)
            .filter({ chargeType: 'FlexRent' })
            .first()
            .value();
    } else {
        if (useNetRent) {
            charge = _.chain(Charges)
                .filter({ chargeType: 'NetRent' })
                .first()
                .value();
        } else {
            charge = _.chain(Charges)
                .filter({ chargeType: 'Rent' })
                .first()
                .value();

        }

    }
    return charge && (charge.amount && !basicModifiers[charge.chargeModifier]);
};

const Wrapper = styled.div`    
    @media screen and (min-width: 1024px){
        padding-top: 4rem;
        padding-bottom: 4rem;
    }
`;

SideBarHeader_R4.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

SideBarHeader_R4.propTypes = {
    property: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    searchType: PropTypes.string.isRequired,
    showShareIcons: PropTypes.bool,
    breakpoints: PropTypes.object,
    bannerText: PropTypes.string,
    modal: PropTypes.object.isRequired
};

SideBarHeader_R4.defaultProps = {
    bannerText: null,
    property: {},
    siteType: '',
    searchType: '',
    showShareIcons: false,
    modal: {}
};

export default SideBarHeader_R4;