import React from 'react';
import { use100vh } from 'react-div-100vh';
import styled from 'styled-components';

const MobileContainer = ({ children, heightReduction }) => {
    const height = use100vh();
    const newHeight = height - heightReduction;
    return <ContainerDiv height={newHeight}>{children}</ContainerDiv>;
};

const ContainerDiv = styled.div`
    height: ${props => props.height ? props.height + 'px' : '50vh'};
    max-height: ${props => props.height ? props.height + 'px' : '50vh'};
    position: relative;
    width: 100%;
    overflow-y: hidden;
`;

export default MobileContainer;