import PropTypes from 'prop-types';
import React, { Component } from 'react';
import DefaultValues from '../../constants/DefaultValues';
import propertiesContainer from '../../containers/propertiesContainer';
import { responsiveContainer } from '../../external-libraries/agency365-components/components';
import modalContainer from '../../containers/modalContainer';
import APIMapping from '../../constants/APIMapping';
import ListMapPage_V2 from './ListMap.v2';
import ListMapR3 from '../../r3/PLP/ListMap/ListMap.r3';
import PaginatedListMap from '../PaginatedListMap/PaginatedListMap.jsx';
import { createGlobalStyle } from 'styled-components';
import { onCbreUS } from '../../utils/determineDomain';
import { fireAnalyticsTracking } from '../../ga4-analytics/send-event';
import { eventTypes } from '../../ga4-analytics/event-types';
import { ConvertMapPagePropsForPLPPageView } from '../../ga4-analytics/converters/plp-pageview';

const R4Styling = createGlobalStyle`
    html, body {
        -ms-overflow-style: none; 
        scrollbar-width: none;
    }
    body::-webkit-scrollbar{ 
        display: none;
    }
`;

const R4_US_Styling = createGlobalStyle`
    .us-comm {
        .content-section__landing-teaser {
            display: none;
        }
    }
`;

const R4_COM_Styling = createGlobalStyle`
    .component.cbre-c-title-hero {
        display: none;
    }
`;

const MobileBodyStyling = createGlobalStyle`
    body {
        height: 100vh;
        width: auto !important;
    }
`;

const HideFooter = createGlobalStyle`
    @media screen and (max-width: 767px){
        #content  > .row  > #ph_LandingPageHero {
            display: none !important;
        }
    }
    @media (hover: none) and (pointer: coarse) {
        #content  > .row  > #ph_LandingPageHero {
            display: none !important;
        } 
    }
    footer {
        display:none !important;
    }
    @media screen and (max-width: 1023px){
        .cbre-c-globalHeader__content {
            overflow: visible !important;
            .cbre-c-globalHeader__navWrapper {
                background: #fff !important;
            }
        }
    }
`;

class ListMapPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fireAnalyticsTracking(this.context.stores.ConfigStore.getItem('features'), this.context, eventTypes.PLP_PAGE_VIEW, ConvertMapPagePropsForPLPPageView(this.props), false);
    }

    render() {

        const siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;
        const useListMapPagination = this.context.stores.ConfigStore.getFeatures().listMapPagination || false;

        return (
            <React.Fragment>
                {siteTheme === 'commercialr4' &&
                    <React.Fragment>
                        {!this.props.breakpoints.isMobile && <R4Styling />}
                        {this.props.breakpoints.isMobile && <MobileBodyStyling />}
                        <HideFooter />
                    </React.Fragment>
                }
                {
                    onCbreUS ? <R4_US_Styling /> : <R4_COM_Styling />
                }
                { /* use paginated list map if r3 and pagination feature flag is turned on, if r4, use paginated list map  */}
                {((siteTheme === 'commercialr3' && useListMapPagination) || siteTheme === 'commercialr4') && <PaginatedListMap {...this.props} context={this.context} />}
                { /* if the theme is r4 and we aren't using pagination, load the ListMapR4  */}
                { /* siteTheme === 'commercialr4' && !useListMapPagination && <ListMapR4 {...this.props} /> */}
                { /* if the theme is r3 and we aren't using pagination, load the ListMapR4  */}
                {siteTheme === 'commercialr3' && !useListMapPagination && <ListMapR3 {...this.props} />}
                { /* if it's anything else, load the old v2 version  */}
                {siteTheme !== 'commercialr3' && siteTheme !== 'commercialr4' && <ListMapPage_V2 {...this.props} />}
            </React.Fragment>
        );
    }
}

ListMapPage.contextTypes = {
    actions: PropTypes.object,
    stores: PropTypes.object,
    language: PropTypes.object,
    spaPath: PropTypes.object,
    location: PropTypes.object,
    router: PropTypes.object,
    renderOmissions: PropTypes.object
};

ListMapPage.propTypes = {
    config: PropTypes.object.isRequired,
    properties: PropTypes.array
};

export default
    propertiesContainer(
        responsiveContainer(modalContainer(ListMapPage)),
        {
            bypassLoader: true,
            loadOnMount: true,
            fetchAllProperties: true,
            propertiesMap: [
                APIMapping.ContactGroup._key,
                APIMapping.Highlights._key,
                APIMapping.Walkthrough,
                APIMapping.MinimumSize._key,
                APIMapping.MaximumSize._key,
                APIMapping.TotalSize._key,
                APIMapping.GeoLocation._key,
                APIMapping.Sizes._key
            ]
        }
    );

export const ListMapPageTest = ListMapPage;