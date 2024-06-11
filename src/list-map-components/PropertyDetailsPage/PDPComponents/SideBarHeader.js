import React from 'react';

import AddressSummary from '../../../components/Property/PropertyComponents/AddressSummary';
import PriceLabel from '../../../components/Property/PropertyComponents/PriceLabel';
import Bedrooms from '../../../components/Property/PropertyComponents/Bedrooms';
import Size from '../../../components/Property/PropertyComponents/Size';
import Favourite from '../../Favourite/Favourite';
import ShareButton from '../../ShareButton/ShareButton';
import TranslateString from '../../../utils/TranslateString';
import PropTypes from 'prop-types';

const SideBarHeader = (props, context) => {
    const { property, siteType, searchType, modal } = props;

    const {
        ActualAddress,
        IsParent,
        NumberOfBedrooms,
        PropertyId: propertyId,
        GeoLocation: { exact }
    } = property;

    const { stores } = context;

    const features = stores.ConfigStore.getItem('features');

    let inexactText;
    let _IsParent = IsParent === '' ? false : IsParent;

    if (!exact) {
        inexactText = (
            <div className="cbre_subh1 cbre_addressOnRequest">
                {context.language.FullAddressOnRequest}
            </div>
        );
    }

    let useClass = '';
    if (features && features.displayUseClass) {
        // if (property.UseClass.uk) {
        //   useClass = property.UseClass.uk;
        // } else if (property.UseClass.ca) {
        //   useClass = property.UseClass.ca;
        // }
        useClass = property.UseClass;
    }

    const subh2 =
        siteType === 'residential' ? (
            <div>
                <Bedrooms bedrooms={NumberOfBedrooms} displayStyling={false} />
                {features &&
                    features.displaySizeInSideHeader &&
                    (property.TotalSize.area || property.MinimumSize.area) && (
                        <span>
                            &nbsp;/&nbsp;
                            <Size
                                property={property}
                                displayLabel={false}
                                displayStyling={false}
                            />
                        </span>
                    )}
            </div>
        ) : (
            <Size
                property={property}
                displayLabel={false}
                displayStyling={false}
            />
        );

    return (
        <div className="row sidebar-header">
            <div className="col-xs-12 col-md-12 col-lg-12 center-block">
                <div className="padding-xs-1">
                    <div className="cbre_flex">
                        <div className="flexGrow-xs-1">
                            <h1 className="cbre_h1">
                                <AddressSummary
                                    address={ActualAddress}
                                    floorsAndUnits={property.FloorsAndUnits}
                                    isParent={_IsParent}
                                />
                            </h1>

                            <div className="flex-two-column">
                                <div className="cbre_subh1">
                                    <PriceLabel
                                        property={property}
                                        searchType={searchType}
                                        displayLabel={false}
                                        displayStyling={false}
                                    />
                                </div>
                                <div className="cbre_subh2">{subh2}</div>
                            </div>
                            {features &&
                                features.displayPropertyId && (
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
                        </div>
                        <div>
                            <Favourite
                                propertyId={propertyId}
                                buttonClass="marginBottom-xs-1"
                            />
                            <ShareButton modal={modal} />
                        </div>
                    </div>

                    <div className="cbre_divider cbre_divider__large marginTop-xs-1 hide-lg" />
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
    breakpoints: PropTypes.object,
    modal: PropTypes.object.isRequired
};

SideBarHeader.defaultProps = {
    property: {},
    siteType: '',
    searchType: '',
    modal: {}
};

export default SideBarHeader;
