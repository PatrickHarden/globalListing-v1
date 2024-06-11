import React from 'react';

import UnderOfferBanner from '../../UnderOfferBanner/UnderOfferBanner';
import AddressSummary from '../../../components/Property/PropertyComponents/AddressSummary';
import PriceLabel from '../../../components/Property/PropertyComponents/PriceLabel';
import Size from '../../../components/Property/PropertyComponents/Size';
import Favourite from '../../Favourite/Favourite';
import ShareButton from '../../ShareButton/ShareButton';
import TranslateString from '../../../utils/TranslateString';
import getEnergyRating from '../../../utils/getEnergyRating';
import PropTypes from 'prop-types';

const SideBarHeader = (props, context) => {
    const {
        bannerText,
        breakpoints,
        property,
        searchType,
        showShareIcons,
        modal
    } = props;

    const {
        ActualAddress,
        IsParent,
        PropertyId: propertyId,
        GeoLocation: { exact },
        Highlights,
        SaleAuthority,
        NumberOfBedrooms: bedrooms,
    } = property;

    const { stores } = context;

    const features = stores.ConfigStore.getItem('features');

    let inexactText;
    let _IsParent = IsParent === '' ? false : IsParent;

    if (!exact) {
        if (typeof features.displayFullAddressOnRequest === 'undefined' || features.displayFullAddressOnRequest === true) {
            inexactText = (
                <div className="cbre_subh1 cbre_addressOnRequest">
                    {context.language.FullAddressOnRequest}
                </div>
            );
        }
    }

    let useClass = '';
    if (features && features.displayUseClass) {
        useClass = property.UseClass;
    }

    const isMobile = !breakpoints.isTabletLandscapeAndUp;


    const ratingIcon = getEnergyRating(features, Highlights);
    const rating = ratingIcon ? (
        <div className="energy-rating">
            <img src={ratingIcon} />
        </div>
    ) : null;

    const showUnderOffer = !!bannerText && !rating;
    const numberOfBedroomsTranslationString = parseInt(bedrooms) === 1 ? "NumberOfBedroomsSingular" : "NumberOfBedroomsPlural";

    return (
        <div className="row sidebar-header commercial-header">
            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                <div className="padding-xs-1">
                    <div className="cbre_flex">
                        <div className="flexGrow-xs-1">
                            <div className="header-content">
                                <div className="header-title">
                                    <h1 className="cbre_h1">
                                        <AddressSummary
                                            address={ActualAddress}
                                            floorsAndUnits={
                                                property.FloorsAndUnits
                                            }
                                            isParent={_IsParent}
                                        />
                                    </h1>
                                    {!isMobile && (
                                        <UnderOfferBanner
                                            displayText={bannerText}
                                            underOffer={showUnderOffer}
                                        />
                                    )}
                                    {!isMobile && rating}
                                </div>
                                <div className="header-details">
                                    <div className="cbre_h1 header-price">
                                        <PriceLabel
                                            property={property}
                                            searchType={searchType}
                                            displayLabel={false}
                                            displayStyling={false}
                                        />
                                    </div>
                                    <div className="cbre_subh2 header-size">
                                        <Size
                                            property={property}
                                            displayLabel={false}
                                            displayStyling={false}
                                        />
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
                                        <div className="cbre_subh2">
                                            <TranslateString 
                                                string={SaleAuthority}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {showShareIcons && (
                            <div className="header-buttons">
                                <Favourite
                                    propertyId={propertyId}
                                />
                                <ShareButton modal={modal} />
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
    );
};

SideBarHeader.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

SideBarHeader.propTypes = {
    property: PropTypes.object.isRequired,
    siteType: PropTypes.string.isRequired,
    searchType: PropTypes.string.isRequired,
    showShareIcons: PropTypes.bool,
    breakpoints: PropTypes.object,
    bannerText: PropTypes.string,
    modal: PropTypes.object.isRequired
};

SideBarHeader.defaultProps = {
    bannerText: null,
    property: {},
    siteType: '',
    searchType: '',
    showShareIcons: false,
    modal: {}
};

export default SideBarHeader;
