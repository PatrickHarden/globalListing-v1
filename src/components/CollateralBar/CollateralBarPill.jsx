import React from 'react';
import styled from 'styled-components';
import { SvgIcon } from '@mui/material';
import CollateralBarDropdown from './CollateralBarDropdown.jsx';
import getPath from 'getpath';

/* 
    asset data model
    -------------------------------------------
    - id: unique id for the asset
    - type: anchor, link, dropdown, lightbox
    - icon (optional): pass in a reference to an MUI 
        - component : reference to the MUI component
        - alt: the alt tag for the icon
    - label (required): string
    - alt (optional): string - the alt tag for the container
    - target: (mimics href target) _blank, _self
    - anchor: string - if it's an anchor tag, this is the anchor tag to use
    - link: string - the url to link to (for 'link' & 'lighbox' types)
    - items: for "dropdown" type, will be a list of additional assets for the dropdown using the same data model
    - cta: boolean if it's a call to action
*/

const CollateralBarPill = props => {

    const { asset, analyticsCallback, handleOpenFloorplanInLightbox } = props;

    const iconStyle = {
        width: 20,
        height: 20,
        fill: '#003F2D'
    };

    const dispatchAnalytics = (asset) => {
        if(analyticsCallback){
            analyticsCallback(asset);
        }
    };


    const clickLink = () => {
        if(asset.type === 'anchor'){
            const ele = document.querySelector(asset.anchor);
            const topPos = ele.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: topPos, 
                behavior: 'smooth'
            });
        } else if(asset.type === 'lightbox'){
            handleOpenFloorplanInLightbox(findLightboxIndex(asset));
        } else if(asset.type === 'link') {
            window.open(asset.link, asset.target ? asset.target : '_self');
        }
        dispatchAnalytics(asset);
    };

    const getDropdownOptions = () => {
        return asset.items.map(asset => {
            return {
                label: asset.label,
                value: asset
            };
        });
    };

    const findLightboxIndex = (FloorPlan) => {
        const { PropertyStore } = context.stores;

        const lightboxItems = PropertyStore.getPropertyLightboxData();

        if(lightboxItems){
            return lightboxItems.findIndex(
                item => item.src === getPath(FloorPlan, '.link')
            );
        }
        return -1;
    }

    const selectDropdownOption = (option) => {
        if (option && option.value && option.value.type === 'lightbox' && option.value.link) {
            handleOpenFloorplanInLightbox(findLightboxIndex(option.value));
            dispatchAnalytics(asset.items.find(item => item === option.value));
        } else if (option && option.value && option.value.link && option.value.type === 'link') {
            window.open(option.value.link, option.value.target);
            dispatchAnalytics(asset.items.find(item => item === option.value));
        }
    };

    return (
        <ButtonContainer>
            { asset.type === 'dropdown' && 
                <CollateralBarDropdown icon={asset.icon} placeholder={asset.label} options={getDropdownOptions()} changeHandler={selectDropdownOption} />
            }
            { asset.type !== 'dropdown' && 
                <Link alt={asset.alt} onClick={clickLink}>
                    { asset.icon && <SvgIcon component={asset.icon.component} style={iconStyle} alt={asset.icon.alt}/> }
                    <Label>{asset.label}</Label>
                </Link>
            }
        </ButtonContainer>
        
    );
};

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;

    height: 32px;
    width: fit-content;

    background: rgba(0, 63, 45, 0.1) !important;
    border-radius: 16px;

    flex: none;
    order: 0;
    flex-grow: 0;
    
    :hover {
        background: rgba(0, 63, 45, 0.2) !important;
    }
`;

const Link = styled.a`
    cursor: pointer;
    display: inline-flex;
`;

const Label = styled.div`

    font-family: Calibre Regular;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;

    display: flex;
    align-items: flex-end;
    letter-spacing: 0.005em;
    color: #003F2D;

    flex: none;
    order: 1;
    flex-grow: 0;
    margin: 0px 6px;
`;

export default CollateralBarPill;
