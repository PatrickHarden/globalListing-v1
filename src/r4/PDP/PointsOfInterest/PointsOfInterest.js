import React, { useMemo, useState } from 'react';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import styled from 'styled-components';
import CollapsibleBlock from '../../../list-map-components/CollapsibleBlock/CollapsibleBlock';
import { SvgIcon } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import MapIcon from '@mui/icons-material/Map';

export const PointsOfInterestR3 = (props) => {

    const { pointsOfInterest, pointsOfInterests, context, breakpoints: { isMobile }, breakpoints, collapsibleBlock } = props;

    /* Randomize array using Durstenfeld shuffle algorithm - looks better to mix old data with new */
    const shuffleArray = (array) => {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    // merge old data model with new
    const combinePOIS = (array) => {
        let tempArray = array;
        pointsOfInterest.forEach((poi, i) => {
            const {
                name,
                distance: [{ amount, units }],
                duration,
                interestKind
            } = poi;

            const result = {
                interestKind: interestKind,
                places: [{
                    name: [
                        {
                            text: name.content,
                            cultureCode: name.culture
                        }
                    ],
                    distances: [{
                        distanceAmount: amount,
                        units: units
                    }],
                    duration: [duration],
                    type: []
                }]
            };

            tempArray.push(result);
        });
        if (pointsOfInterest.length === 0) {
            return tempArray;
        } else {
            return shuffleArray(tempArray);
        }
    };

    const [pois, setPois] = useState(combinePOIS(pointsOfInterests));

    const { language, stores: { ConfigStore } } = context;

    const numberFormat = new Intl.NumberFormat(
        ConfigStore.getItem('features').sizeCultureCode? ConfigStore.getItem('features').sizeCultureCode : ConfigStore.getItem('language'),
        {
            maximumFractionDigits: 1
        }
    );

    const icons = {
        'amenity': ShoppingBagIcon,
        'retail': ShoppingBagIcon,
        'restaurants': RestaurantMenuIcon,
        'hotels': HotelIcon,
        'attractions': MapIcon,
        'restaurant': RestaurantMenuIcon,
        'hotel': HotelIcon,
        'place': MapIcon
    };

    const muiIconStyle = {
        width: 20,
        height: 20,
        fill: '#003F2D'
    };

    const poisMemo = useMemo(() =>
        pois.map((poi, t) => {

            const { interestKind, places } = poi;

            return (
                <InterestContainer key={interestKind + t} className="poiR3" data-test={createDataTestAttribute('pdp-poi', interestKind)} style={(t === 0 && !isMobile) ? {marginTop: '10px'}: {}}>
                    <RowTitle>
                    { icons && icons[interestKind.toLowerCase()] && <SvgIcon component={icons[interestKind.toLowerCase()]} style={muiIconStyle} alt={interestKind} /> }
                    <h5 style={{paddingBottom: '0'}}>{language[interestKind.replace(' ','')] || interestKind}</h5>
                    </RowTitle>
                    {places.map((place, i) => {

                        return (
                            <React.Fragment key={i + ''}>
                                {place.name.map((name, index) => {
                                    const { text } = name;
                                    let duration = {};
                                    let distances = {};
                                    let poiType = {};

                                    if (typeof place.duration[index] === 'object' && place.duration[index] !== null) {
                                        duration = place.duration[index];
                                    }
                                    if (typeof place.distances[index] === 'object' && place.distances[index] !== null) {
                                        distances = place.distances[index];
                                    }
                                    if (typeof place.type[index] === 'object' && place.type[index] !== null) {
                                        poiType = place.type[index];
                                    }

                                    let { amount, unitTime, travelMode } = duration;
                                    const { units, distanceAmount } = distances;
                                    let distanceUnit = `DistanceUnits_${ units? units.replace(" ",'') : ''}`;
                                    distanceUnit = distanceAmount != 1.0 ? (language[`${distanceUnit}s`] || language[distanceUnit] || units) : ( language[distanceUnit] || units);  
                                    unitTime = (!isNaN(amount) && amount > 1) ? (language[`DistanceUnits_${unitTime}s`] || language[`DistanceUnits_${unitTime}`] || unitTime+'s') : (language[`DistanceUnits_${unitTime}`] || unitTime);
                                    travelMode = travelMode ? (language[travelMode.replace(' ','')] || travelMode):'';
                                    return (
                                        <Row key={index + ''} style={isMobile ? { display: 'block', float: 'left', width: '100%' } : {}}>
                                            {isMobile ?
                                                <React.Fragment>
                                                    <MobileRow>
                                                        <Name style={(poiType.text) ? { width: '30%' } : { width: '53%' }}>
                                                            {text}
                                                        </Name>
                                                        {poiType.text &&
                                                            <Type style= {isMobile ? { marginLeft:"10px"} : {}}>
                                                                {poiType.text}
                                                            </Type>
                                                        }
                                                    </MobileRow>
                                                    <MobileRow>
                                                        <DistanceContainer>
                                                            <Amount>
                                                                {!isNaN(distanceAmount) && distanceAmount > 0 && distanceAmount}
                                                            </Amount>
                                                            <Units>
                                                                {!isNaN(distanceAmount) && distanceAmount > 0 && distanceUnit}
                                                            </Units>
                                                        </DistanceContainer>
                                                        <DistanceContainer>
                                                            <Amount>
                                                                {!isNaN(amount) && amount > 0 && numberFormat.format(amount)}
                                                            </Amount>
                                                            <Units>
                                                                {
                                                                    <React.Fragment>
                                                                        {!isNaN(amount) && amount > 0 && unitTime}
                                                                        {travelMode && (!isNaN(amount) && amount > 1) && '/' + travelMode}
                                                                    </React.Fragment>
                                                                }
                                                            </Units>
                                                        </DistanceContainer>
                                                    </MobileRow>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <Name style={(poiType.text) ? { width: '30%' } : { width: '53%' }}>
                                                        {text}
                                                    </Name>
                                                    {poiType.text &&
                                                        <Type>
                                                            {poiType.text}
                                                        </Type>
                                                    }
                                                    <DistanceContainer>
                                                        <Amount>
                                                            {!isNaN(distanceAmount) && distanceAmount > 0 && distanceAmount}
                                                        </Amount>
                                                        <Units>
                                                            {!isNaN(distanceAmount) && distanceAmount > 0 && distanceUnit}
                                                        </Units>
                                                    </DistanceContainer>
                                                    <DistanceContainer>
                                                        <Amount>
                                                            {!isNaN(amount) && amount > 0 && numberFormat.format(amount)}
                                                        </Amount>
                                                        <Units>
                                                            {
                                                                <React.Fragment>
                                                                    {!isNaN(amount) && amount > 0 && unitTime}
                                                                    {travelMode && (!isNaN(amount) && amount > 1) && '/' + travelMode}
                                                                </React.Fragment>
                                                            }
                                                        </Units>
                                                </DistanceContainer>
                                                </React.Fragment>
                                            }
                                        </Row>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </InterestContainer>
            );
        })
        , [pointsOfInterests]);

    if (pois.length && pois.length !== 0) {
        if (collapsibleBlock) {
            return (
                <StyleContainer>
                    <CollapsibleBlock
                        className="points-of-interest newPOI"
                        title={language.LMPdpPointsOfInterest}
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={!breakpoints.isMobile}
                        innerClassName="padding-xs-1"
                    >
                        {poisMemo}
                    </CollapsibleBlock>
                </StyleContainer>
            );
        } else {
            return (
                <React.Fragment>
                    <InterestHeader>
                        {language.LMPdpPointsOfInterest}
                    </InterestHeader>
                    {poisMemo}
                </React.Fragment>
            );
        }
    } else {
        return null;
    }
};

export const StyleContainer = styled.span`
    .collapsableBlock_header {
        border-bottom: 1px solid #D1D1D1 !important;
    }
    .collapsableBlock_body_inner {
        border: none !important;
        margin-top: 15px;
    }
`;

export const InterestContainer = styled.div`
    width: 100%;
    float:left;
    margin: 2px 0;
    img {
        max-width:30px !important;
    }
`;

const MobileRow = styled.div`
    display:block;
    width:100%;
    float:left;
`;

const Type = styled.span`
    font-family: Calibre Regular;
    font-size:14px;
    line-height:23px;
    color: #333;
    text-indent: 0 !important;
`;

const InterestHeader = styled.h2`
    font-family: Financier !important;
    font-weight: 400 !important;
    font-size: 24px !important;
    line-height: 27px !important;

    letter-spacing: 0.5px !important;

    color: #333333 !important;
`;

export const RowTitle = styled.div`
    width:100%;
    display: flex;
    align-items:center;
    padding: 15px 0;

    img, h5 {
        width:50%;
        float:left;
    }
    img {
        max-width:30px;
    }
    h5 {
        font-family: Calibre Medium !important;
        font-style: bold !important;
        font-size: 20px !important;
        line-height: 16px !important;
        /* identical to box height, or 89% */

        letter-spacing: 0.9px !important;

        color: #003F2D !important;
        margin-left:20px !important;
        width:100%;
    }
`;

export const Row = styled.div`
    width:100%;
    padding-bottom:10px;
    padding-top:10px;
    font-family: Calibre Regular;
    font-size:18px;
    line-height:23px;
    font-style:normal;
    color:#333;
    border-bottom: solid 1px #ccc;
    display: flex;
    justify-content: space-between;
    align-items:center;

    > span:first-of-type {
        text-indent: 0;
        word-break: break-word !important;
    }
    > span {
        width:23%;
        text-indent:15%;
        word-break: break-word !important;
    }
    > span:last-of-type{
        text-align:right;
        text-indent:0;
        word-break: break-word !important;
    }
`;



export const Name = styled.span`
    font-family: Calibre Regular;
    font-size: 16px !important;
    line-height: 16px !important;
    /* identical to box height, or 89% */

    letter-spacing: 0.9px !important;

    color: #333333 !important;
    @media (max-width:520px){
        width:56% !important;
        text-align:left !important;
    }
`;

export const DistanceContainer = styled.span`
 > span:first-of-type {
     margin-right:10px;
 }
}
`;

export const WrapDiv = styled.div`
    @media (max-width:520px){
        display:flex; 
        flex-direction:column;
        text-align:right
    }
`;

export const TextAlignTop = styled.span`
    @media (max-width:520px){
        height:40px; 
        display:inline-block;
    }
`;

export const Units = styled.span`
    font-family: Calibre Regular;
    font-size:16px;
    line-height:23px;
    color: #333;
    word-break: break-word !important;
`;

export const Amount = styled.span`
    font-family: Calibre Regular;
    font-size:16px;
    line-height:23px;
    color: #333;
`;

export default React.memo(PointsOfInterestR3);


