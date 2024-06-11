import styled, {createGlobalStyle} from 'styled-components';
import { onCbreUS } from '../../utils/determineDomain';

/* used for both ListMap.r4.js and PaginatedListMap */

// background: linear-gradient(45deg,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 51%,rgba(255,255,255,0) 100%) #fff;
//     box-shadow: -2px 2px 2px 0 rgb(178 178 178 / 40%);
//     content: "";
//     height: 15px;
//     left: 0;
//     position: absolute;
//     top: 0;
//     transform: translate(-50%,-50%) rotate(-45deg);
//     width: 15px;

export const GlobalOverflowYFix = createGlobalStyle`

    @media screen and (max-width:520px){
        html {
            overflow-y: hidden !important;
        }
    }
`;

export const GlobalSearchBarMaxWidth = createGlobalStyle`
    @media screen and (min-width: 1025px){
        .external-libraries-gmaps-autocomplete-container.Select.Select__large {
            max-width: calc(50vw - 9px);
        }
    }
`;

export const PLPContainer = styled.div`
    ${window.cbreSiteTheme === 'commercialr4' &&
    `      
        overflow: hidden;
        position: relative !important;
        height: 100%;
        top: 0 !important;

        .hide-search-bar{
            display: none !important;
        }
        
        .MuiTooltip-tooltip {
            background: #538184 !important;
        }

        .pCardgroup {
            margin-bottom: 15px;
        }

        .propertyCount > p {
            font-family: "Financier Regular" !important;
            color: #003F2D !important;
            font-weight: normal !important;
            font-size:30px !important;
        }
        .sortBar-right {
            .filters-wrapper {
                > filter-label {
                    font-family: Calibre !important;
                }
            }
        }

        .searchBar {
            @media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
                position: absolute;
                width: 100%;
                top: 0;
            }
        }

        .r4PropertyCard {
            margin-bottom: 15px;
        }

        @media screen and (min-width: 768px) and (max-width: 1024px){
            .card_list {
                > div {
                    padding-right: 0 !important;
                    margin-right: 0 !important;
                    > div {
                        padding: 0 3%;
                        column-count: 2;
                        break-inside: avoid-column;
                        .r4PropertyCard {
                            height: 390px;
                            margin-bottom: 30px;
                            width:100%;
                            page-break-inside: avoid;
                            break-inside: avoid;
                            display: flex;
                            .card_body {
                                margin-top: 153px !important;
                                margin-bottom: 0 !important;
                            }
                        }
                    }
                }
            }
        }
    `
    }

    .r3-list-map-container {
        @media (min-width: 768px) {
            .propertyResults_content {
                margin-top: 70px !important;
            }
        }
    }

    @media (max-width: 1024px){
        .pCardgroup {
            margin-left: -21px;
            margin-right: 21px;
        }
    }

    @media screen and (max-width: 520px){
        margin-right: 0;
    }

    @media screen and (max-width: 520px){
        .pCardgroup {
            margin-right:0;
        }
    }

    .r4-list-map-container {

        width: 100%;

        .r4-sidebar {

            background: #F5F7F7 !important;

            @media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
                overflow: hidden !important;
                width: 100%;
            }

            .propertyResults {

                background: #F5F7F7 !important;
                width: 100%;

                @media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
                    position: absolute;
                    top: 70px;
                    width: auto !important;
                    overflow-x: hidden !important;
                    overflow-y: hidden !important;
                }
            }

            .propertyResults_content {
                background: #F5F7F7 !important;
                min-height: calc(100vh - 200px);
                
                @media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
                    margin-top: 0 !important;
                    min-height: calc(100vh - 120px);
                    overflow-x: hidden !important;
                    overflow-y: hidden;
                    width: auto !important;
                }   

                .card_list {
                    max-height: calc(100vh - ${props => props.includePagingControls ? onCbreUS() ? '285px' : props.searchIncluded ? '200px' : '200px' : '240px'});
                    overflow-y: scroll;
                    overflow-x: hidden;
                    padding-top:6px;
                    .cardGroup_list {
                        > .cardItem.r4PropertyCard {
                            margin: 0 !important;
                        }
                    }
                    .r4_control_bar {
                        padding-bottom:5px;
                        margin-bottom: 0 !important;
                    }
                    .searchControlBar.sortBar, .searchControlBar.sortBar .sortBar {
                        border: none !important;
                        box-shadow: none !important
                    }
                    .searchControlBar.sortBar {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        margin-top: 3px;
                        margin-bottom: 7px;
                        span.r4_summary{
                            @supports (-webkit-line-clamp: 3) {
                                overflow: hidden;                            
                                text-overflow: ellipsis;
                                white-space: initial;
                                display: -webkit-box;                            
                                -webkit-line-clamp: 3;                            
                                word-break: break-word;                            
                                -webkit-box-orient: vertical;                            
                            }
                        }
                    }
                    @media only screen and (min-device-width : 320px) and (max-device-width : 1024px) {
                        max-height: calc(100vh - ${props => props.includePagingControls ? '120px' : 'none'});
                        padding-bottom: 150px !important;
                        ::-webkit-scrollbar{ 
                            display: none
                        }
                    }
                }
                @media screen and (max-width: 1024px){
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    .cardGroup {
                        margin-left: 0 !important;
                        margin-right: 0 !important;
                        .cardItem {
                            margin-right: 0 !important;
                        }
                    }
                }
                @media screen and (max-width: 520px){
                    .cardGroup {
                        margin-right: -21px !important;
                    }
                }
                @media screen and (max-width: 1023px){
                    span.r4_summary, .r4_control_bar {
                        display: none !important;
                    }
                }
            }
        }

        .r4-select, .selectControl, .Select-control, .Select-control-selected{
            background: transparent !important;
        }

        .cbre_map {
            max-height: calc(100vh - 70px) !important;
            position: sticky !important;
            top: 0 !important;

            @media screen and (max-width:1024px){
                position: absolute !important;
            }
        }

        @media screen and (max-width:1024px){
            overflow:visible;
            min-height: calc(100vh - 70px);
        }
    }
`;

export const ListMapContainer = styled.div`
    display: flex;
    width: 100%;
`;

export const SidebarContainer = styled.div`
    display: block;
    background: #F5F7F7;

    .r4-mobile-filters {
        height: 100px;
        background: #fff;
        width: 100%;
        display: flex-grow;
    }
`;

export const PageBarContainer = styled.div`
    ${window.cbreSiteTheme === 'commercialr4' &&
        `background: #F5F7F7;
        .lm-pagination {
            > li > a, span {
                background: #F5F7F7 !important;
            }
        }
    `}

    display: flex;
    width: 100%;
    height: 55px;
    border-top: 1px solid #F5F5F5;
    position: sticky;
    z-index: 11;
    bottom: ${ onCbreUS() ? '20px' : '0'};

    @media screen and (max-width: 1024px){
        position: relative;
        z-index: 0;
    }
`;

export const PageBarLeft = styled.div`
`;

export const PageBarRight = styled.div`
    margin-left: auto;
`;