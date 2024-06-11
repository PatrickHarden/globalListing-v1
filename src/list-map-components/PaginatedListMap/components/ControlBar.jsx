import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShareButton_R3 from '../../../r3/components/ShareButton/ShareButton.r3';
import ShareButton_R4 from '../../../r4/components/ShareButton/ShareButton.r4';
import Filters_R3 from '../../../r3/PLP/Filters';
import Select_R3 from '../../../r3/external/agency365-components/Select/Select.r3';
import Filters_R4 from '../../../r4/PLP/Filters';
import Select_R4 from '../../../r4/external/agency365-components/Select/Select.r4';
import checkConditional from '../../../utils/checkConditional';
import classNames from 'classnames';
import { changeTakeAndLoadProperties } from '../../../redux/actions/properties/change-paging';
import styled from 'styled-components';
import { viewableMarkerCountSelector } from '../../../redux/selectors/map/markers/viewable-marker-count-selector';
import { markersLoadingSelector } from '../../../redux/selectors/map/markers/markers-loading-selector';
import { propertiesContextSelector } from '../../../redux/selectors/properties/properties-context-selector';
import TranslateString from '../../../utils/TranslateString';
import matchTypeStrings from '../../../utils/matchTypeStrings';

const ListControlBar = (props) => {

    const { context, share, sort, modal, language, view, sortChangeCallback, r4, includePagingControls, ignoreRedux, propertyCount } = props;

    const dispatch = useDispatch();
    const markersLoading = useSelector(markersLoadingSelector);
    const viewableMarkerCount = useSelector(viewableMarkerCountSelector);
    const propertiesContext = useSelector(propertiesContextSelector);

    const r3 = !r4;
    const isBrokerPage = context.stores.ConfigStore.getFeatures().isBrokerPage;

    //view
    const takeOptions = [{ 'label': '25', 'value': 25 }, { 'label': '50', 'value': 50 }, { 'label': '100', 'value': 100 }, { 'label': '500', 'value': 500 }];
    const [take, setTake] = useState(takeOptions[0]);
    const [initialPropertyCount, setInitialPropertyCount] = useState(0);

    // sort
    let sortLabel = '';
    let viewLabel = r4 ? '' : 'VIEW';       // todo internationalize

    const filters = context.stores.ConfigStore.getItem('filters') || [];
    filters.forEach(filter => {
        if (checkConditional(filter, context.stores.ParamStore.getParams())
            && filter.placement === 'lm_sortFilter') {
            sortLabel = filter.label;
        }
    });

    const selectClasses = ['Select', 'Select-Small', 'Select--single', 'Select__small'];

    const changeTakeHandler = (val) => {
        dispatch(changeTakeAndLoadProperties(context, val.value));
        setTake(val);
    };

    const FilterComponent = r4 ? Filters_R4 : Filters_R3;
    const SelectComponent = r4 ? Select_R4 : Select_R3;

    if (viewableMarkerCount > 0 && initialPropertyCount === 0 && isBrokerPage) {
        setInitialPropertyCount(viewableMarkerCount)
    }

    return (
        <ControlBarContainer className={r4 ? 'r4_control_bar' : ''}>
            <ControlBar className="propertyResults_sortBar searchControlBar sortBar">
                <div className="sortBar">
                    <ControlBarLeft>
                        {(!markersLoading || ignoreRedux) &&
                            <Summary>
                                {ignoreRedux && propertyCount > 0 && generateControlBarMessage(context, language, propertyCount, r4 ? 'r4_summary' : 'r3_summary')}
                                {!ignoreRedux && generateControlBarMessage(context, language, viewableMarkerCount, r4 ? 'r4_summary' : 'r3_summary', propertiesContext)}
                                {isBrokerPage && viewableMarkerCount === 0 && initialPropertyCount !== 0 && generateControlBarMessage(context, language, initialPropertyCount, r4 ? 'r4_summary' : 'r3_summary')}
                            </Summary>
                        }
                    </ControlBarLeft>
                    {r3 &&
                        <ControlBarShareR3>
                            {share && (!markersLoading || ignoreRedux) && <ShareButton><ShareButton_R3 modal={modal} showText={true} /></ShareButton>}
                        </ControlBarShareR3>
                    }
                    <ControlBarRight>
                        <div className="sortBar-right">
                            {view && (!markersLoading || ignoreRedux) && includePagingControls &&
                                <SelectWrapper className={r4 ? 'r4-select-wrapper' : 'r3-select-wrapper'}>
                                    {r4 && <SelectLabel>View</SelectLabel>}
                                    {r3 && <span className="filter-label">{viewLabel}</span>}
                                    <SelectComponent
                                        key="controlbartake"
                                        name="view"
                                        value={take}
                                        onChange={changeTakeHandler}
                                        onMouseOverClass="is-focused"
                                        optionsArray={takeOptions}
                                        className={classNames(selectClasses)}
                                        optionClass="Select-value"
                                        outerClass="Select-menu-outer"
                                        extraPlaceholderClass="Select-value-label"
                                        selectArrowZoneClass="Select-arrow-zone"
                                        selectArrowClass="Select-arrow"
                                        selectValueClass="Select-value-label"
                                        selectMenuClass="Select-menu"
                                        selectOptionClass="Select-option"
                                        selectControlClass="Select-control r4-select"
                                        selectInputClass="Select-input"
                                        showLabel={false}
                                        disabled={false} />
                                </SelectWrapper>
                            }
                            {sort && (!markersLoading || ignoreRedux) &&
                                <SelectWrapper className={r4 ? '' : 'r3-select-wrapper'}>
                                    {r4 && <SelectLabel>{sortLabel}</SelectLabel>}
                                    {r3 && <span className="filter-label">{sortLabel}</span>}
                                    <FilterComponent
                                        key="controlbarsort"
                                        type="auto"
                                        view="map-list"
                                        className="Select__small"
                                        placement="lm_sortFilter"
                                        disabled={false}
                                        filterChangeCallback={sortChangeCallback ? sortChangeCallback : undefined}
                                        r4={r4} />
                                </SelectWrapper>
                            }
                            {r4 && (!markersLoading || ignoreRedux) &&
                                <ControlBarShareR4>
                                    <ShareButton_R4 modal={modal} showText={false} />
                                </ControlBarShareR4>
                            }
                        </div>
                    </ControlBarRight>
                </div>
            </ControlBar>
        </ControlBarContainer>

    );
};

export const generateControlBarMessage = (context, language, propertyCount, textStyle, propertiesContext) => {

    // build the property count message : note - this has been changed for pagination.  Logic in the other list maps was pretty bloated.
    // we might want to find a better way to handle the multiple scenarios here

    let searchType = context.stores.SearchStateStore.getItem('searchType');
    // searchTypeExtended is the same as searchType except it has 'isSaleLetting' as an option as well rather than defaulting to 'isSale'
    const searchTypeExtended = context.stores.SearchStateStore.getItem('searchTypeExtended');
    var searchTypeString =
        searchTypeExtended === 'isSaleLetting'
            ? language['saleLetSearchType'] : null;
    if (!searchTypeString || searchTypeString.trim().length == 0) {
        searchTypeString = language[searchType === 'isLetting' ? 'letSearchType' : 'saleSearchType'];
    }
    if (context.stores.ConfigStore.getItem('features').enableSearchType) {
        if (window.location.href.includes('aspects')) {
            searchType = context.stores.ParamStore.getParam('aspects');
        }
        searchTypeString = searchType ? language[searchType + 'SearchType'] : null;
    }
    const propertyTypePlural = matchTypeStrings(
        language,
        context.stores.ParamStore.getParams().propertySubType,
        context.stores.ParamStore.getParams().usageType
    );


    if (propertyCount > 0) {
        let searchLocationName = context.stores.SearchStateStore.getItem('searchLocationName') || '';
        searchLocationName = searchLocationName.includes(',') ? searchLocationName.substr(0, searchLocationName.lastIndexOf(",")) : searchLocationName; // Remove country

        const stringToUse = propertiesContext && propertiesContext.length > 0 ? 'PropertiesFoundWithContext' : 'PropertiesFound';
        return (
            <TranslateString
                className={textStyle}
                propertyCount={propertyCount}
                propertiesContext={propertiesContext}
                location={searchLocationName}
                searchResultLimit={undefined}
                searchType={searchTypeString}
                string={stringToUse}
                propertyTypePlural={propertyTypePlural}
                component={'span'}
            />
        );
    }
    return '';
};

const ControlBarContainer = styled.div``;

const ControlBar = styled.div`
    background: #F5F7F7;

    @media (max-width: 767px) {
        display: block !important;
        padding: 0 5px 0 15px !important;
    }
    .r3-select-wrapper{
        display: inline-flex;
        align-items: center;
        justify-items: center;
        margin-left: 15px;
    }

    .filter-label{
        text-transform: uppercase;
    }
`;

const ControlBarLeft = styled.div`
    font-size: 16px;
    font-weight: bold;
    width: 100%;
`;

const ControlBarShareR3 = styled.div`
    margin: 9px 40px 0 20px;

    @media (max-width: 767px) {
        margin: 2px 10px 0 0;
    }
`;

const ControlBarShareR4 = styled.div`
    margin-left: 20px;
`;

const ControlBarRight = styled.div`
    @media (max-width: 767px) {
        display: none !important;
    }
`;

const ShareButton = styled.div``;

const Summary = styled.h2`
    .r4_summary {
        font-size: 26px !important;
        color: #003F2D;
        font-family: Financier Display !important;
        display:block;
        height:auto;
        overflow: hidden;
        position:relative;
        top: -2px;
        line-height: 28px;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3; /* number of lines to show */
        line-clamp: 3; 
        -webkit-box-orient: vertical;
        @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
            display:none;
        }
    }
    .r3_summary {
        font-family: "Futura", helvetica, arial, sans-serif;
        font-size: 26px !important;
        font-weight: 700 !important;
        margin-bottom: 0px;
        color: #333 !important;

        @media (min-width: 768px) {
            margin-bottom: 10px;
            font-size: 28px !important;
        }
    }
`;

const SelectWrapper = styled.div`
    .r4-select-wrapper{
        display: block;  
    }
`;

const SelectLabel = styled.div`
    font-size: 14px;
    font-family: Calibre;
    line-height: 16px;
    font-weight: 600;
    text-decoration: underline;
    color: #003F2D;
    margin-left: 40px;

    @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        margin-left: 35px;
    }
`;

export default ListControlBar;