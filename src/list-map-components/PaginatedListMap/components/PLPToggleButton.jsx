import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { markersLoadingSelector } from '../../../redux/selectors/map/markers/markers-loading-selector';

const PLPToggleButton = (props) => {

    const { buttonLabel, clickHandler } = props;

    const markersLoading = useSelector(markersLoadingSelector);
    
    return (
        <Container>
            {!markersLoading && 
                <MobileButton href="#" onClick={clickHandler}>
                    <MobileIcon src='https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-mobile-map-icon.png'/>
                    <MobileButtonLabel>{buttonLabel}</MobileButtonLabel>
                </MobileButton>
            }
        </Container>    
    );
};

const Container = styled.div`
    position: sticky;
    bottom: 45px;
    display: flex;
    justify-content: center;
    z-index: 11;
    @media screen and (orientation:landscape) {
        bottom: 0px;
    }
`;

const MobileButton = styled.a`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px 16px 6px 12px;
    background-color: #42807E !important;
    border-radius: 2px;
    width: 93px !important;
    height: 36px;

    @media (min-width: 768px) {
        margin-bottom: 65px !important;
    }
`;

const MobileIcon = styled.img`
    width: 18px !important;
    height: 18px !important;
`;

const MobileButtonLabel = styled.div`
    font-family: Calibre;
    font-size: 16px;
    line-height: 16px;
    color: #fff;
    margin-left: 10px;
`;

export default PLPToggleButton;