import React from "react";
import styled from "styled-components";
import PriceLabel from '../../../components/Property/PropertyComponents/PriceLabel';
import Size_R3 from '../../../r3/components/Size/Size.r3';
import getAvailability from '../../../utils/getAvailability'

const ChildPropertiesR4 = (props) => {

    const properties = props && props.childProperties && props.childProperties.properties && props.childProperties.properties.length > 0 && props.childProperties.properties;

    const { language, cardProps, context } = props;

    const redirectToChildProperty = (property) => {
        const { PropertyId: propertyId, Coordinates, arrIndex: propertyIndex, ParentPropertyId } = property;

        if (cardProps && cardProps.propertyLinkClickHandler) {
            cardProps.propertyLinkClickHandler(Coordinates, propertyIndex, propertyId, ParentPropertyId)
        }
    }

    let childPropertiesList = properties.map((property) => {
        let priceAspect = property.Aspect.includes('isLetting') ? 'isLetting' : 'isSale';
        let availability = getAvailability(property, context);
        return (
            <div>
                <div className="spacesContainer margin-top-10px">
                    <div className="collapsibleSpaceLevelDisplay textContainer">
                        <div className="TitleSpaceLevelDisplay">
                            {property &&
                                property.FloorsAndUnits &&
                                property.FloorsAndUnits.length > 0 &&
                                property.FloorsAndUnits[0] &&
                                property.FloorsAndUnits[0].subdivisionName}
                        </div>
                        <div className="spaceAreaType extraSpaceArea">
                            <div className="pricingContainerpb-10">
                                <div className="priceWrapper alignmentWrapper">
                                    <div width="50px" className="pricingTd leftAlignment">
                                        {property && property.Aspect.includes('isLetting') &&
                                            <img
                                                src="/resources/images/GL-Icons/r4-lease.png"
                                                className="pricingImg"
                                            />
                                        }
                                        {property && property.Aspect.includes('isSale') &&
                                            <img
                                                src="/resources/images/GL-Icons/r4-sale.png"
                                                className="pricingImg"
                                            />
                                        }
                                    </div>
                                    <div className="pricingTd">
                                        <div
                                            className="pricingText"
                                            data-test="dataTestLeasePrice"
                                        >
                                            <PriceLabel
                                                property={property}
                                                searchType={priceAspect}
                                                displayLabel={false}
                                                displayStyling={false}
                                                ignoreConfig={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contentSpaceLevelDisplay">
                        {property &&
                            <SizedStyled className="HeaderInfoSpaceLevelDisplay">
                                <Size_R3
                                    property={property}
                                    displayLabel={false}
                                    displayStyling={false}
                                    disableLabel={true}
                                />
                            </SizedStyled>}
                        <div className="ChildPropertiesAvailableStatusLeaseContainer">
                            <div className="AvailableStatusLeaseItem">
                                <p className="DataLabelLabelSpaceLevelDisplay mb-zero">
                                    {language && language.AvailableFrom ? language.AvailableFrom : "Available From"}
                                </p>
                                <p
                                    className="DataLabelContentSpaceLevelDisplay"
                                    data-test="dataTestAvailableFrom"
                                >
                                    {availability.value}
                                </p>
                            </div>
                            <div className="AvailableStatusLeaseItem">
                                <p className="DataLabelLabelSpaceLevelDisplay mb-zero">
                                    {language && language.Status ? language.Status : "Status"}
                                </p>
                                <p className="DataLabelContentSpaceLevelDisplay">
                                    {property &&
                                        property.FloorsAndUnits &&
                                        property.FloorsAndUnits.length > 0 &&
                                        property.FloorsAndUnits[0] &&
                                        property.FloorsAndUnits[0].status}
                                </p>
                            </div>
                            <div className="AvailableStatusLeaseItem">
                                <p className="DataLabelLabelSpaceLevelDisplay mb-zero">
                                    {property &&
                                        property.FloorsAndUnits &&
                                        property.FloorsAndUnits.length > 0 &&
                                        property.FloorsAndUnits[0] &&
                                        property.FloorsAndUnits[0].leaseType !== ""
                                        ? (`${language.LeaseType}` || "Lease Type")
                                        : (`${language.PDPPropertyType}` || "Property Type")
                                    }
                                </p>
                                <p className="DataLabelContentSpaceLevelDisplay">
                                    {property &&
                                        property.FloorsAndUnits &&
                                        property.FloorsAndUnits.length > 0 &&
                                        property.FloorsAndUnits[0] &&
                                        property.FloorsAndUnits[0].leaseType !== ""
                                        ? property.FloorsAndUnits[0].leaseType
                                        : property.FloorsAndUnits[0].use}
                                </p>
                            </div>
                        </div>
                        <div className="viewDetailsButton">
                            <p className="DataLabelLabelSpaceLevelDisplay mb-zero"></p>
                            <p className="spaceLevelLinkText">
                                <a
                                    target="_blank"
                                    onClick={() => { redirectToChildProperty(property) }}
                                    className="color-links"
                                    data-test="dataTestBrochure"
                                >
                                    <b>{language && language.ViewDetails ? language.ViewDetails : "View Details"}</b>
                                </a>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        );
    });

    return (
        <div>
            {
                childPropertiesList
            }
        </div>
    );
}
const SizedStyled = styled.div`
        font-size: 14px!important;
        font-family: Calibre Regular;
    `;
export default ChildPropertiesR4;
