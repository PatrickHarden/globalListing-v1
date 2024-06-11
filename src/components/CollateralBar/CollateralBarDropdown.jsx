import React, { useState } from 'react';
import styled from 'styled-components';
import Select, {components} from 'react-select';
import { SvgIcon } from '@mui/material';

const CollateralBarDropdown = props => {

    const { icon, placeholder, options, changeHandler } = props;

    const [value, setValue] = useState(null);

    const onDropdownOnChange = (value) => {
        if(changeHandler){
            changeHandler(value);
        }
        setValue(null);
    };

    const dropdownIconStyle = {
        width: 20,
        height: 20,
        fill: '#003F2D',
        marginTop: '8px'
    };

    const Control = (props) => {
        return (
            <Container>
                { icon && <SvgIcon component={icon.component} style={dropdownIconStyle} alt={icon.alt} /> }
                <StyledControl {...props} />
            </Container>
        
        );
    };

    const Placeholder = (props) => {
        return <StyledPlaceholder {...props} />;
    };

    const customStyles  = {
        control: (base) => {
            return {
                ...base,
                width: `${(8*placeholder.length)+10}px`,
                cursor: 'pointer'
            };
        },
        menu: (base) => {
            return {
                ...base,
                marginTop: '-1px',
                background: '#fff !important',
                width: '100%'
            };
        },
        option: (base, state) => {
            return {
                ...base,
                color: state.isFocused ? '#000' : '#003F2D',
                backgroundColor: base.highlightColor,
                cursor: 'pointer',
                '&:active': {
                    ...base[':active'],
                    backgroundColor: '#fff'
                }
            };
        }
    };

    return (
        <Select
            isSearchable={false}
            isClearable={false}
            options={options}
            onChange={onDropdownOnChange}
            placeholder={placeholder}
            styles={customStyles}
            components={{DropdownIndicator:() => null, IndicatorSeparator:() => null, Control, Placeholder }}
            value={value}
        />   
    );
};

const Container = styled.div`
    display: inline-flex;   
`;

const StyledControl = styled(components.Control)`
    background: none !important;
    border: none !important;
    box-shadow: none !important;
`;

const StyledPlaceholder = styled(components.Placeholder)`
    font-family: Calibre Regular;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #003F2D !important;
`;

export default CollateralBarDropdown;
