import React from 'react';
import styled from "styled-components";
import { fireEvent } from '../analytics/gl-analytics';


const SearchIcon = styled.div`
    background: url('https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-searcharea.png')
    width: 10px;
    height: 10px;
`;

const SearchWrapper = styled.div`
    background: #006A4D;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 24px;
    cursor: pointer;
    width: 145px;
    height: 30px;
    text-align: center;
`;

const SearchButton = styled.div`
    color: #fff;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 30px;
    align-items: center
    text-align: center;
    text-transform: uppercase;
`;

export default class MapSearchControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapReference: this.props.mapRef,
            getProperties: this.props.getProperties,
            buttonText: this.props.buttonText
        };
    }

    render() {
        return (
            <div>
                <SearchWrapper>
                    <SearchButton onClick={() => {
                        this.state.getProperties();
                        if (window && window.dataLayer && window.dataLayer.push) {
                            window.dataLayer.push({
                                'event': 'search_this_area',
                                'gl_property_search': 'click'
                            });
                        }
                    }}>
                        {this.state.buttonText}
                    </SearchButton>
                </SearchWrapper>
            </div>
        );
    }
}