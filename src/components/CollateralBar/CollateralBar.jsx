import React from 'react';
import styled from 'styled-components';
import CollateralBarPill  from './CollateralBarPill.jsx';

const CollateralBar = props => {

    const { assets, analyticsCallback, handleOpenFloorplanInLightbox  } = props;

    return (
        <CollateralBarContainer>
            { assets && assets.map(asset => {
                return <CollateralBarPill handleOpenFloorplanInLightbox ={handleOpenFloorplanInLightbox} asset={asset} analyticsCallback={analyticsCallback}/>;
            })}
        </CollateralBarContainer>
    );
};

const CollateralBarContainer = styled.div`
    width: 100%;
    margin: 25px 15px 0 15px;
    display: flex;
    flex-wrap: wrap;
    background: none;

    > div {
        margin: 3px;
    }

    @media screen and (max-width: 1024px) {
        margin: 25px 0 10px 0;
    }
`;

export default CollateralBar;
