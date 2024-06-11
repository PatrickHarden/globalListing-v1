import React from 'react';
import styled from 'styled-components';
import Favourite_R3 from '../../PDP/FavouriteStar/Favourite.r3';

import SizeIcon from '../../../../src/public/map/sizeIcon.png';
import PriceIcon from '../../../../src/public/map/priceIcon.png';
import TranslateString from '../../../utils/TranslateString';

const InfoWindowContent = (props) => {

    const { property, primaryImage, address, transactionType, propertyType, showFavorites, size, price, features } = props;

    // locality + region + postcode 
    const addressLine2 = address ? address.line2 : undefined;
    const addressLine3 = address ? 
        <TranslateString
            Locality={address.locality}
            Region={address.region}
            PostCode={address.postcode}
            string="AddressLine2"
            appendCommas={features.appendCommasToAddress ? features.appendCommasToAddress : false}
            removeSelectCommas={features.removeSelectCommas ? features.removeSelectCommas : []}
        /> : undefined;

    return (
        <InfoWindowContentContainer>
            { primaryImage && 
                <ImageContainer>
                    <PrimaryImage src={primaryImage}/>
                </ImageContainer>
            }
            <TopBar>
                <LeftColumn>
                    { propertyType && <Badge>{propertyType}</Badge>}
                    { transactionType && <Badge>{transactionType}</Badge>}
                </LeftColumn>
                { showFavorites && 
                    <RightColumn>
                        <FavoriteStar><Favourite_R3 propertyId={property.PropertyId}/></FavoriteStar>
                    </RightColumn>
                }   
            </TopBar>
            <Content>
                <TitleContainer>{address.line1}</TitleContainer>
                <AddressContainer>
                    { addressLine2 && <AddressLine>{addressLine2}</AddressLine>}
                    { addressLine3 && <AddressLine>{addressLine3}</AddressLine>}
                </AddressContainer>
                { /*
                    <PriceSizeContainer>
                    { price && <PriceContainer><IndicatorIcon src={PriceIcon}/><PriceSizeLabel>{price}</PriceSizeLabel></PriceContainer> }
                    { size && <SizeContainer><IndicatorIcon src={SizeIcon}/><PriceSizeLabel>{size}</PriceSizeLabel></SizeContainer>}
                </PriceSizeContainer>
            
                    */
                }
            </Content>
        </InfoWindowContentContainer>
    ); 
};  

const InfoWindowContentContainer = styled.div``;

const PrimaryImage = styled.img`
    height: 140px;
    max-height: 140px;
`;

const ImageContainer = styled.div``;

const TopBar = styled.div`
    padding: 2px 0 0 5px;
    display: flex;
`;

const Content = styled.div`
    font-family: 'futura-pt';
    padding: 15px 5px 2px 5px;
`;

const LeftColumn = styled.div` 
    width: 100%;
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
    font-size: 22px;
    font-weight: 700;
    color: #333;
`;

const AddressContainer = styled.div`
    margin-top: 1px;
    font-weight: 400;
    font-size: 16px;
    color: #333;
`;

const AddressLine = styled.div`
`;

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

export default InfoWindowContent;