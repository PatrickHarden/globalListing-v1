import React from 'react';
import styled from 'styled-components';

const MobileFilterActionButton = (props) => {

    const { clickHandler, label } = props;

    const click = () => {
        if(clickHandler){
            clickHandler();
        }
    };

    return (
        <ActionButton onClick={click} {...props}>{label}</ActionButton>
    ); 
};

const ActionButton = styled.a`
    justify-content: center;
    align-items: center;
    padding: 6px 16px 6px 12px;
    background-color: ${props => props.bgColor ? props.bgColor : '#fff'} !important;
    color: ${props => props.textColor ? props.textColor : '#000'} !important;
    border-radius: 0;
    border: 1px solid #003F2D;
    width: 91px;
    height: 44px;
    font-family: Calibre Regular;
    font-weight: 500;
    font-size: 18px;
`;




export default MobileFilterActionButton;