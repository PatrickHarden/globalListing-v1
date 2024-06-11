import React from "react";
import styled from "styled-components";
import Favourite_R3 from "../../PDP/FavouriteStar/Favourite.r3";

import SizeIcon from "../../../../src/public/map/sizeIcon.png";
import PriceIcon from "../../../../src/public/map/priceIcon.png";
import TranslateString from "../../../utils/TranslateString";
import { props } from "ramda";

const InfoWindowContentR4 = props => {
    const {
        property,
        primaryImage,
        address,
        transactionType,
        propertyType,
        showFavorites,
        size,
        price,
        features
    } = props;

    // locality + region + postcode
    const addressLine2 = address ? address.line2 : undefined;
    const addressLine3 = address ? (
        <TranslateString
            Locality={address.locality}
            Region={address.region}
            PostCode={address.postcode}
            string="AddressLine2"
            appendCommas={
                features.appendCommasToAddress
                    ? features.appendCommasToAddress
                    : false
            }
            removeSelectCommas={
                features.removeSelectCommas ? features.removeSelectCommas : []
            }
        />
    ) : (
        undefined
    );

    const isMobile = window.matchMedia("(max-width: 520px)").matches;

    if (isMobile) {
        return (
            <MobileInfoWindowContentContainer>
                {primaryImage && (
                    <ImageContainer img={primaryImage}>
                        {/* <MobilePrimaryImage src={primaryImage} /> */}
                    </ImageContainer>
                )}
                <MobileContent>
                    <TitleContainer>{address.line1}</TitleContainer>
                    <AddressContainer>
                        {addressLine2 && (
                            <AddressLine>{addressLine2}</AddressLine>
                        )}
                        {addressLine3 && (
                            <AddressLine>{addressLine3}</AddressLine>
                        )}
                        {size && <SizeContainer>{size}</SizeContainer>}
                        {price && <PriceContainer>{price}</PriceContainer>}
                    </AddressContainer>
                </MobileContent>
            </MobileInfoWindowContentContainer>
        );
    } else {
        return (
            <InfoWindowContentContainer>
                {primaryImage && (
                    <ImageContainer>
                        {features && features.enableFavourites && (
                            <FavoriteIcon
                                className="favorite-pcard-icon"
                                alt="Favorite this Property"
                                src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/heart.png"
                            />
                        )}
                        <PrimaryImage src={primaryImage} />
                    </ImageContainer>
                )}
                <Content>
                    <TitleContainer>{address.line1}</TitleContainer>
                    <AddressContainer>
                        {addressLine2 && (
                            <AddressLine>{addressLine2}</AddressLine>
                        )}
                        {addressLine3 && (
                            <AddressLine>{addressLine3}</AddressLine>
                        )}
                        {size && <SizeContainer>{size}</SizeContainer>}
                        {price && <PriceContainer>{price}</PriceContainer>}
                    </AddressContainer>
                </Content>
            </InfoWindowContentContainer>
        );
    }
};

const InfoWindowContentContainer = styled.div``;

const MobileInfoWindowContentContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const PrimaryImage = styled.img`
    height: 220px !important;
    max-height: 220px;
    object-fit: cover;
`;

const ImageContainer = styled.div`
    ${props =>
        props.img &&
        `
        background-image: url(${props.img});
        background-position: center;
        width: 40%;
        background-repeat: no-repeat;
        background-size: cover;
    `}
`;

const MobileImageContainer = styled.div``;

const MobilePrimaryImage = styled.img`
    max-height: 103px;
`;

const TopBar = styled.div`
    padding: 2px 0 0 5px;
    display: flex;
`;

const MobileContent = styled.div`
    font-family: "Calibre Regular";
    padding: 0 10px 2px 10px;
`;

const Content = styled.div`
    font-family: "Calibre Regular";
    padding: 10px 10px 2px 10px;
    margin-bottom: 10px;
`;

const LeftColumn = styled.div`
    width: 100%;
`;

const FavoriteIcon = styled.img`
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
    width: 26px !important;
`;

const RightColumn = styled.div``;

const Badge = styled.div`
    border: 1px solid #979797;
    color: #979797;
    padding: 5px;
    font-size: 10px;
    font-weight: 500;
    min-width: 50px;
    text-align: center;
    display: inline-block;
    margin-right: 5px;
    text-transform: uppercase;
`;

const FavoriteStar = styled.div`
    margin: auto;
    display: inline-block;
`;

const TitleContainer = styled.div`
    font-family: "Financier Medium";
    font-size: 18px;
    line-height: 20px;
    color: #003f2d;
    margin-bottom: 5px;
    @media screen and (max-width: 520px) {
        margin-bottom: 2px;
        margin-top: 2px;
    }
`;

const AddressContainer = styled.div`
    margin-top: 1px;
    font-weight: 400;
    font-size: 16px;
    color: #435254;
    font-family: "Calibre Regular";
    @media screen and (max-width: 520px) {
        font-size: 14px !important;
    }
`;

const PriceContainer = styled.div`
    font-weight: 500;
    font-family: "Calibre Medium";
    margin-top: 3px;
    @media screen and (max-width: 520px) {
        font-size: 14px !important;
    }
`;

const SizeContainer = styled.div`
    font-weight: 500;
    font-family: "Calibre Medium";
    margin-top: 5px;
    @media screen and (max-width: 520px) {
        margin-top: 3px;
        font-size: 14px !important;
    }
`;

const AddressLine = styled.div``;

/*
const PriceSizeContainer = styled.div`
    margin: auto 0;
    display: block;
`;


const IndicatorIcon = styled.img`
    display: inline-block !important;
    margin-right: 5px;
    width: 10px !important;
    height: 10px !important;
    
    @media (min-width: 1024px) {
        width: 15px !important;
        height: 15px !important;
    }
`;


const PriceSizeLabel = styled.div`
    font-weight: 400;
    font-size: 12px;
    color: #000;
`;
*/

export default InfoWindowContentR4;
