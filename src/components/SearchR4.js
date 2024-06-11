import React, { useEffect } from 'react';
import styled from 'styled-components';
import Filters from '../r3/PLP/Filters';
import { clone } from 'lodash';
import createQueryString from '../utils/createQueryString';
import Select, { components } from 'react-select';
import { fireAnalyticsTracking } from '../ga4-analytics/send-event';
import { eventTypes } from '../ga4-analytics/event-types';
import { CreateGLSearchEvent } from '../ga4-analytics/converters/search-event';
import { isPrerender } from '../utils/browser';
 
export const SearchR4 = (props) => {
    const { context } = props;

    const searchPathOptions = context.stores.SearchStateStore.getItem('searchPathSelector');
    const searchAspectOptions = context.stores.SearchStateStore.getItem('searchAspectSelector');
    const stateOptions = context.stores.SearchStateStore.getItem('stateSelector');
    const features = context.stores.ConfigStore.getFeatures();

    let searchPath = searchPathOptions && Array.isArray(searchPathOptions) ? searchPathOptions[0] : null;
    let aspectType;
    let selectedState;
    let userSearchTerm = '';
    let selectedSuggestion = '';

    useEffect(() => {
        // Auto focus the input on desktop mode only
        if (window.innerWidth > 636 && !isPrerender) {
            document.getElementsByClassName("geosuggest__input")[0].focus();
        }
    }, []);

    const updateSearchPathValue = (value) => {
        searchPath = value;
    };

    const updateSearchAspectValue = (value) => {
        aspectType = value;
    };

    const updateStateValue = (value) => {
        selectedState = value;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            goToPLP();
        }
    };

    const handleOnClick = (e) => {
        e.preventDefault();
        goToPLP();
    };

    const onSuggestSelect = (suggestion) => {
        selectedSuggestion = suggestion;
        if (!features.disableAutoSearch) {
            goToPLP();
        }
    };

    const goToPLP = () => {
        // search completed
        const searchURL = getSearchUrl();

        // ga4 analytics event
        const searchEvent = CreateGLSearchEvent('searchPage', context.stores.ParamStore.getParams(), userSearchTerm, searchPath, aspectType, selectedSuggestion, searchURL);
        fireAnalyticsTracking(features, context, eventTypes.SEARCH, searchEvent, false);

        if (selectedSuggestion.propertyId) {
            const searchPage = (selectedSuggestion.propertyResult && selectedSuggestion.propertyResult.searchPath) ? selectedSuggestion.propertyResult.searchPath : context.stores.SearchStateStore.getItem('searchResultsPage');
            window.location.assign(searchPage + '/details/' + selectedSuggestion.propertyId)
        } else {
            if (features.useShortURL) {
                let params = clone(context.stores.ParamStore.getParams());
                if (params.location && params.location.length > 0) {
                    window.location.assign(searchURL);
                } else if (aspectType) {
                    if (selectedState) {
                        // maybe use &location instead for state
                        window.location.assign(searchPath.value + '?aspects=' + aspectType.value + '&Common.ActualAddress.Common.PostalAddresses.Common.Region=' + selectedState.value);
                    } else {
                        window.location.assign(searchPath.value + '?aspects=' + aspectType.value)
                    }
                } else {
                    if (selectedState) {
                        window.location.assign(searchPath.value + '?Common.ActualAddress.Common.PostalAddresses.Common.Region=' + selectedState.value);
                    } else {
                        window.location.assign(searchPath.value);
                    }
                }
            } else {
                window.location.assign(searchURL);
            }
        }
    };

    const addDataTestAttribute = (Component, testId) => (
        props => (
            <Component
                {...props}
                innerProps={Object.assign({}, props.innerProps, { 'data-test': testId })}
            />
        )
    );

    const formatOptionTestLabel = (label) => {
        return label && label.length > 0 ? '-' + label.replace(/\s+/g, '-').toLowerCase() : '';
    };

    const CustomDropdownOption = (parentTestId) => (
        props => (
            components.Option && (
                <components.Option {...props}>
                    <div data-test={parentTestId + formatOptionTestLabel(props.label)}>{props.label}</div>
                </components.Option>
            )
        )
    );

    const onInputChange = (value) => (
        // setUserSearchTerm(value)
        userSearchTerm = value
    );

    const getSearchUrl = () => {
        let params = clone(context.stores.ParamStore.getParams());
        params.searchMode = context.stores.ConfigStore.getItem('searchMode');

        if (aspectType) {
            params.aspects = aspectType.value;
        }

        delete params.usageType;
        delete params.radius;
        delete params.PropertyDefaultEnumerationSuffixes;

        if (features.useShortURL) {
            delete params.Interval;
            delete params.CurrencyCode;
            delete params.usageType;
            delete params.searchMode;
            delete params.Unit;
            delete params.lat;
            delete params.lon;
        }

        if (context.stores.ParamStore.getParam('searchRadius')) {
            params.radius = context.stores.ParamStore.getParam('searchRadius');
        }

        if (context.stores.SearchStateStore.getItem('currentPlaceId')) {
            params.placeId = context.stores.SearchStateStore.getItem('currentPlaceId');
        }

        if (selectedState) {
            params["Common.ActualAddress.Common.PostalAddresses.Common.Region"] = selectedState.value;
        }

        let searchPage = context.stores.SearchStateStore.getItem('searchResultsPage');

        // Use different path (usage type) if user selected one
        if (searchPath && context.stores.SearchStateStore.getItem('useSearchPathSelector')) {
            searchPage = searchPath.value;
        }

        return encodeURI(searchPage + createQueryString(params));
    };

    const renderSearchPathSelector = () => {
        if (searchPathOptions && searchPathOptions.length) {
            const propertyType = context.stores.ConfigStore.getItem('i18n').PropertyType || 'Property Type'
            return (
                <PathSelector>
                    <Select
                        id="path-selector"
                        name="path-selector"
                        placeholder={propertyType}
                        searchable={false}
                        isSearchable={false}
                        clearable={true}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        simpleValue
                        options={searchPathOptions}
                        // value={searchPath}
                        onChange={updateSearchPathValue}
                        components={
                            {
                                SelectContainer: addDataTestAttribute(components.SelectContainer, 'property-type-select'),
                                Control: addDataTestAttribute(components.Control, 'property-type-control'),
                                Input: addDataTestAttribute(components.Input, 'property-type-input'),
                                Menu: addDataTestAttribute(components.Menu, 'property-type-menu'),
                                Option: CustomDropdownOption('property-type')
                            }
                        }
                    />
                </PathSelector>
            );
        }
    };

    const getDefaultAspect = () => {
        searchAspectOptions.forEach(aspect => {
            if (window.location.href.includes(aspect.value)) {
                if ((aspect.value.includes('^') && window.location.href.includes('^')) || (!aspect.value.includes('^') && !window.location.href.includes('^')) || (aspect.value.includes(',') && window.location.href.includes(',')) || (!aspect.value.includes(',') && !window.location.href.includes(','))) {
                    aspectType = aspect;
                }
            }
        });
        return aspectType;
    }

    const renderAspectSelector = () => {
        if (searchAspectOptions && searchAspectOptions.length) {
            const transactionType = context.stores.ConfigStore.getItem('i18n').TransactionType || 'Transaction Type'
            return (
                <AspectSelector>
                    <Select
                        id="aspect-selector"
                        name="aspect-selector"
                        placeholder={transactionType}
                        searchable={false}
                        isSearchable={false}
                        clearable={true}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        simpleValue
                        options={searchAspectOptions}
                        defaultValue={getDefaultAspect()}
                        // value={aspectType}
                        onChange={updateSearchAspectValue}
                        components={
                            {
                                SelectContainer: addDataTestAttribute(components.SelectContainer, 'transaction-type-select'),
                                Control: addDataTestAttribute(components.Control, 'transaction-type-control'),
                                Input: addDataTestAttribute(components.Input, 'transaction-type-input'),
                                Menu: addDataTestAttribute(components.Menu, 'transaction-type-menu'),
                                Option: CustomDropdownOption('transaction-type')
                            }
                        }
                    />
                </AspectSelector>
            );
        }
    };

    const renderStateSelector = () => {
        if (stateOptions && stateOptions.length) {
            const propertyType = context.stores.ConfigStore.getItem('i18n').States || 'States'
            return (
                <StateSelector>
                    <Select
                        id="state-selector"
                        name="state-selector"
                        placeholder={propertyType}
                        searchable={false}
                        isSearchable={false}
                        clearable={true}
                        onBlurResetsInput={false}
                        onSelectResetsInput={false}
                        simpleValue
                        options={stateOptions}
                        onChange={updateStateValue}
                        components={
                            {
                                SelectContainer: addDataTestAttribute(components.SelectContainer, 'state-select'),
                                Control: addDataTestAttribute(components.Control, 'state-control'),
                                Input: addDataTestAttribute(components.Input, 'state-input'),
                                Menu: addDataTestAttribute(components.Menu, 'state-menu'),
                                Option: CustomDropdownOption('state')
                            }
                        }
                    />
                </StateSelector>
            );
        }
    };

    if (isPrerender){
        return (
            <div style={{marginLeft: '150px'}}>
                {searchPathOptions.map((path, index) => (
                    <a style={{marginLeft: '5px'}} key={String(index)} href={path.value}>{path.label}</a>
                ))}
            </div>
        )
    } else {
        return (
            <Wrapper>
                <form onKeyDown={handleKeyPress}>
                    <Textbox>
                        <Filters renderSearch={true} onSuggestSelect={onSuggestSelect} onInputChange={onInputChange} />
                        <ImageWrapper>
                            <a href={searchPath && searchPath.value} data-test="search-button" onClick={handleOnClick}>
                                <img src="/resources/images/GL-Icons/R4MagnifyingGlass.png" alt="Click to Search" />
                            </a>
                        </ImageWrapper>
                    </Textbox>
                    <SelectorWrapper>
                        {renderAspectSelector()}
                        {context.stores.SearchStateStore.getItem('useSearchPathSelector') && renderSearchPathSelector()}
                        {renderStateSelector()}
                    </SelectorWrapper>
                </form>
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    margin: auto;
    max-width: 755px;
    padding-top: 50px;
    padding-bottom: 50px;
    padding-left: 20px;
    padding-right: 20px;
    background: #fff;
    @font-face {
        font-family: 'Calibre Regular';
        src: url('/resources/fonts/calibre-r-web-regular.woff2') format('woff2');
        font-display:auto;font-style:normal;
    }
    @media screen and (max-width: 400px) {
        padding-top: 10px;
    }
`;

const Textbox = styled.div`
    width: 100%;
    height: 65px;
    position: relative;
    border-bottom: 2px solid #003F2D;
    > .filter-wrap-container {
        > .map-search {
            width: calc(100% - 30px);
            > .geosuggest {
                > input {
                    background-color: white;
                    border-top: 0;
                    border-left: 0;
                    border-right: 0;
                    border-bottom: 0;
                    color: #333333;
                    font-size: 40px;
                    font-style: normal;
                    font-weight: 400;
                    font-family: Calibre Regular;
                    line-height: 48px;
                    letter-spacing: -0.01em;
                    text-align: left;
                    padding-left: 0;
                    height: 55px;
                    
                    @media screen and (max-width: 400px) {
                        font-size: 20px;
                    }
                }
                > input[placeholder] {
                    text-overflow:ellipsis;
                    @media screen and (max-width: 636px) {
                        :focus::-webkit-input-placeholder { color: transparent; }
                        :focus::-moz-placeholder { color: transparent; }
                        :focus::-ms-input-placeholder { color: transparent; }
                        :focus::-moz-placeholder { color: transparent; }
                    }
                }
                > ul {
                    margin-top: 10px;
                    font-size: 16px;
                    box-shadow:2px 3px 5px #999;
                    border: 0;
                    
                    > li {
                        padding-top: 20px;
                        padding-bottom: 20px;
                        color: black;
                    }
                }
                > .geosuggest__suggests--hidden{ 
                    padding-top: 0px;
                }
            }
        }
    }
`;

const ImageWrapper = styled.div`
    position: absolute; 
    right: 0; 
    top: 15px;
    > button {
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;
        cursor:pointer;
        overflow: hidden;
        outline:none;
    }
`;

const SelectorWrapper = styled.div`
    position: relative;
    margin-top: 20px;
    > div {
        > div {
            // Normal selector
            > div {
                border: 0;
                border-radius: 25px;
                background-color: #F5F7F7;
                font-size: 16px;
                font-family: Calibre Regular;
                min-height: 32px;
                height: 32px;
                > div {
                    > span {
                        width: 0px;
                    }
                    > div{
                        top: 48%;
                        color: #003F2D;
                    }
                }
            }
            // Active selector
             > span ~ [class*="css"][class*="control"] {
                border-color: #003F2D !important;
                box-shadow: 0 0 0 1px #003F2D !important;
                background-color: #003F2D;
                > div {
                    > div {
                        color: white !important;
                        font-size: 16px;
                    }
                }
            }
            // Drop down menu
            > span ~ [class*="css"][class*="control"] ~ [class*="css"][class*="menu"] {
                height: unset;
                border-radius: unset;
                min-width:200px;
                box-shadow:2px 3px 5px #999;
                border: 0;
                background-color: white;
                > div {
                    // List item
                    > div {
                        color: black;
                        padding-top: 20px;
                        padding-bottom: 20px;
                        background-color: white;
                        &:hover, &:active { background-color: #F5F7F7; }
                    }
                }
            }
        }
    }
`;

const AspectSelector = styled.div`
    float: left;
    height: 33px;
    min-width: 200px;
    margin-right:10px;
    @media screen and (max-width: 400px) {
        float: none;
        margin-right:0px;
        margin-bottom: 20px;
    }
`;

const PathSelector = styled.div`
    float: left;
    height: 33px;
    min-width: 185px;
    width: 30%;
    margin-right:10px;
    @media screen and (max-width: 400px) {
        float: none;
    }
`;

const StateSelector = styled.div`
    float: left;
    height: 33px;
    min-width: 150px;
    @media screen and (max-width: 400px) {
        float: none;
    }
`;

export default SearchR4;