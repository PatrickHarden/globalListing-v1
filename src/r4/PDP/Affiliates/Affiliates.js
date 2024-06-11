import React from 'react';
import styled from 'styled-components';

export const Affiliates = (props) => {
    const { property, affiliates } = props;
    const { Agents } = property;
    const renderAffiliate = (agents) => {
        let temp = '';
        if (affiliates && agents) {
            for (const [key, value] of Object.entries(affiliates)) {
                agents.forEach(agent => {
                    if (agent.office === key) {
                        temp = value;
                    }
                })
            }
        }
        return temp;
    }

    const affiliateLogo = renderAffiliate(Agents);

    if (affiliateLogo) {
        return (
            <AffiliateLogoContainer>
                <AffiliateImageLogo src={affiliateLogo} />
            </AffiliateLogoContainer>
        )
    } else {
        return <React.Fragment></React.Fragment>;
    }
}

const AffiliateImageLogo = styled.img`
    max-width: 310px;
    margin: 32px 40px 32px 40px;       
`;

const AffiliateLogoContainer = styled.div`
    border-top: solid 30px #fff;
    background-color: #CAD1D3;
    min-height:118px;
    max-width:400px;
    width:100%;
    margin-top: 30px;
    margin-right:40px;
    @media screen and (max-width: 767px){
        margin: 0;
        margin-top: 30px;
    }
`;

export default Affiliates;