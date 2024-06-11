import React, { useMemo } from 'react';
import { createDataTestAttribute } from '../../../utils/automationTesting';
import CollapsibleBlock from '../../../list-map-components/CollapsibleBlock/CollapsibleBlock';
import { SvgIcon } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ShipyardIcon from '../../icons/ShipyardIcon';
import HighwayIcon from '../../icons/HighwayIcon';
import { InterestContainer, Row, RowTitle, Name, DistanceContainer, Amount, Units, StyleContainer, WrapDiv, TextAlignTop } from '../PointsOfInterest/PointsOfInterest';

export const Transportation = (props) => {

    const { transportationsType, context, breakpoints: { isMobile }, breakpoints, collapsibleBlock } = props;

    const { language, stores: { ConfigStore } } = context;

    const icons = {
        'transit/subway': TrainIcon,
        'commuter': DirectionsRailwayIcon,
        'airport': LocalAirportIcon,
        'ferry': DirectionsBoatIcon,
        'shipyard': ShipyardIcon,
        'commuterrail': DirectionsRailwayIcon,
        'highway':HighwayIcon
    };

    const numberFormat = new Intl.NumberFormat(
        ConfigStore.getItem('features').sizeCultureCode? ConfigStore.getItem('features').sizeCultureCode : ConfigStore.getItem('language'),
        {
            maximumFractionDigits: 1
        }
    );

    const muiIconStyle = {
        width: 20,
        height: 20,
        fill: '#003F2D'
    };

    const transportationMemo = useMemo(() => 
            transportationsType.map((transport, t) => {

            const { type, places } = transport;

            return (
                <InterestContainer key={type + t} className='poiR3' data-test={createDataTestAttribute('pdp-transportation', name)} style={(t === 0 && !isMobile) ? {marginTop: '10px'}: {}}>
                    <RowTitle>
                        { icons && icons[type.toLowerCase()] && <SvgIcon component={icons[type.toLowerCase()]} alt={type} style={muiIconStyle} /> }
                        <h5>{ language[type.replace(" ",'')] || ((type === 'CommuterRail') ? 'Commuter Rail':type)}</h5>
                    </RowTitle>
                    {
                        places.map((place, i) => {
                        
                        return (
                            <React.Fragment key={i + ''}>
                                { 
                                    place.name.map((name, index) => {
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
                                                        {
                                                            <React.Fragment>
                                                                {!isNaN(amount) && amount > 0 && unitTime}
                                                                {travelMode && (!isNaN(amount) && amount > 1) && '/' + travelMode}
                                                            </React.Fragment>
                                                        }
                                                    </Units>
                                                </DistanceContainer>
                                                </WrapDiv>
                                            </Row>
                                        );
                                    })
                                
                                }
                            </React.Fragment>
                        );
                    }
                )}
                </InterestContainer>
            );
        }), [transportationsType]);

    if (transportationsType.length && transportationsType.length !== 0) {

        const transportationTitle = language.LMPdpTransportationsType && typeof language.LMPdpTransportationsType !== 'undefined' ? language.LMPdpTransportationsType : language.Transportation || 'Transportation';

        if (collapsibleBlock) {
            return (
                <StyleContainer>
                    <CollapsibleBlock
                        className="transportation newPOI"
                        title={transportationTitle}
                        isCollapsible={breakpoints.isMobile}
                        startExpanded={!breakpoints.isMobile}
                        innerClassName="padding-xs-1"
                    >
                        {transportationMemo}
                    </CollapsibleBlock>
                </StyleContainer>
            );
        } else {
            return (
                <React.Fragment>
                    <TransporationHeader>
                        {transportationTitle}
                    </TransporationHeader>
                    {transportationMemo}
                </React.Fragment>
            );
        }
    } else {
        return null;
    }
};

export default Transportation;