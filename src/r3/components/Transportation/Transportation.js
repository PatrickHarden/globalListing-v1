import React from 'react';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import styled from 'styled-components';

export const Transportation = (props) => {

    const { transportationsType, context } = props;

    const { language, stores: { ConfigStore } } = context;

    const TransportationTypes = [
        'transit/subway',
        'commuter',
        'airport',
        'ferry',
        'shipyard',
        'commuterrail',
        'highway'
    ];

    const images = [
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/transit.png',
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/commuter.png',
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/plane.png',
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/boat.png',
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/shipyard.png',
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/commuter.png',
        'https://wwwlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/highway.png'
    ];

    const numberFormat = new Intl.NumberFormat(
        ConfigStore.getItem('features').sizeCultureCode? ConfigStore.getItem('features').sizeCultureCode : ConfigStore.getItem('language'),
        {
            maximumFractionDigits: 1
        }
    );

    if (transportationsType.length && transportationsType.length !== 0){
        return (
            <TransportationContainer className="col-xs-12 col-md-12 col-lg-12 center-block padding-xs-1 collapsableBlock_body_inner external-libraries-collapsible-block-contentInner">
                {(language.LMPdpTransportationsType && typeof language.LMPdpTransportationsType !== 'undefined') ?
                    <TransporationHeader>
                        {language.LMPdpTransportationsType}
                    </ TransporationHeader>
                    :
                    <TransporationHeader>
                        {language.Transportation || 'Transportation'}
                    </ TransporationHeader>
                }
                {transportationsType.map((transport, t) => {
    
                    const { type, places } = transport;
    
                    return (
                        <InterestContainer key={name + t} data-test={createDataTestAttribute('pdp-transportation', name)}>
                            <RowTitle>
                                {TransportationTypes.map((trasportType, i) => {
                                    if (trasportType == type.toLowerCase()) {
                                        return (
                                            <img src={images[i]} alt={type} key={images[i] + i} />
                                        );
                                    }
                                })}
                                <h5>{ language[type.replace(" ",'')] || ((type === 'CommuterRail') ? 'Commuter Rail':type)}</h5>
                            </RowTitle>
                            {places.map((place, i) => {
                                
                                return (
                                    <React.Fragment key={i + ''}>
                                        {place.name.map((name, index) => {
                                            const { text } = name;
                                            let duration = {};
                                            let distances = {};
    
                                            if (typeof place.duration[index] === 'object' && place.duration[index] !== null) {
                                                duration = place.duration[index];
                                            }
                                            if (typeof place.distances[index] === 'object' && place.distances[index] !== null) {
                                                distances = place.distances[index];
                                            }
    
                                            let { amount, unitTime, travelMode } = duration;
                                            const { units, distanceAmount } = distances;
                                            let distanceUnit = `DistanceUnits_${ units? units.replace(" ",'') : ''}`;
                                            distanceUnit = distanceAmount != 1.0 ? (language[`${distanceUnit}s`] || language[distanceUnit] || units) : ( language[distanceUnit] || units);  
                                            unitTime = (!isNaN(amount) && amount > 1) ? (language[`DistanceUnits_${unitTime}s`] || language[`DistanceUnits_${unitTime}`] || unitTime+'s') : (language[`DistanceUnits_${unitTime}`] || unitTime);
                                            travelMode = travelMode ? (language[travelMode.replace(' ','')] || travelMode):'';
                                          
                                            return (
                                                <Row key={index + ''} className="transpo-row">
                                                    <Name style={{ width: 'auto' }}>
                                                        <TextAlignTop>{text}</TextAlignTop>
                                                    </Name>
                                                    <WrapDiv>
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
                                                            {(!isNaN(amount) && amount > 0 && unitTime && travelMode) ?
                                                                <React.Fragment>
                                                                    {unitTime}/{travelMode}
                                                                </React.Fragment>
                                                                :
                                                                <React.Fragment>
                                                                    {unitTime}{travelMode}
                                                                </React.Fragment>
                                                            }
                                                        </Units>
                                                    </DistanceContainer>
                                                    </WrapDiv>
                                                </Row>
                                            );
                                        })}
                                    </React.Fragment>
                                );
    
                            })}
                        </InterestContainer>
                    );
                })}
            </TransportationContainer>
        );
    } else {
        return null;
    }
};

const TransportationContainer = styled.div`
    display:block !important;
    float:left !important;
    width:100% !important;
`;

const TransporationHeader = styled.h3`
    font-family: futura-pt-bold !important;
    font-weight: 400 !important;
    font-size: 21px !important;
    line-height: 27px !important;

    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;

    color: #333333 !important;
    margin-bottom: 15px !important;
`;

const InterestContainer = styled.div`
    width: 100%;
    float:left;

    @media (max-width:520px){
        .transpo-row {
            display: flex;
            flex-direction: column;
            text-align: left;
            align-items: baseline;
            > span {
                text-indent: 0 !important;
                width:auto !important;
            }
        }
    }
`;

const Name = styled.span`
    font-family: futura-pt;
    font-style: normal !important;
    font-weight: 500 !important;
    font-size: 16px !important;
    line-height: 16px !important;
    /* identical to box height, or 89% */

    letter-spacing: 0.9px !important;
    text-transform: uppercase !important;

    color: #333333 !important;
    min-width:50% !important;
    white-space: nowrap;

    @media (max-width:520px){
        margin-bottom:5px;
        width:56% !important;
        text-align:left !important;
    }
`;

const DistanceContainer = styled.span`
 > span:first-of-type {
     margin-right:5px;
 }
 margin-right:10px !important;
`;

const WrapDiv = styled.div`
    @media (max-width:520px){
        display:flex; 
        flex-direction:column;
        text-align:right;
        width:auto; 
        float:right;
    }
`;

const TextAlignTop = styled.span`
    @media (max-width:520px){
        height:40px; 
        display:inline-block;
    }
`;

const Units = styled.span`
    font-family: futura-pt;
    font-weight:500;
    font-size:18px;
    line-height:23px;
    color: #333;
`;

const Amount = styled.span`
font-family: futura-pt-bold;
    font-weight:500;
    font-size:18px;
    line-height:23px;
    color: #333;
`;

const RowTitle = styled.div`
    width:100%;
    border-bottom: solid 1px #ccc;
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
        font-family: futura-pt;
        font-style: normal !important;
        font-weight: 500 !important;
        font-size: 18px !important;
        line-height: 16px !important;
        /* identical to box height, or 89% */

        letter-spacing: 0.9px !important;
        text-transform: uppercase !important;

        color: #333333 !important;
        margin-left:20px !important;
    }
`;

const Row = styled.div`
    width:100%;
    padding-bottom:10px;
    padding-top:10px;
    font-family: futura-pt;
    font-weight:500;
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
    }
    > span {
        width:20%;
        text-indent:15%;
    }
    > span:last-of-type{
        text-align:right;
        text-indent: 0;
    }

    @media (max-width:520px){
        display:inline-block !important;
    }
`;

export default Transportation;