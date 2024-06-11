import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { currentMapMarkersSelector } from '../../../redux/selectors/map/markers/current-map-markers-selector.js';
import MobileFilterActionButton from './MobileFilterActionButton.jsx';
import { getVerticalSelector, getFilter, extractFilter } from './filters/IndividualFilters.js';
import normalizeSearchType from '../../../utils/normalizeSearchType';
import normalizeSearchTypeExtended from '../../../utils/normalizeSearchTypeExtended';
import createQueryString from '../../../utils/createQueryString.js';

const MobileFilterView = (props) => {

    const { context, filterChangeCallback } = props;

    const currentMarkers = useSelector(currentMapMarkersSelector);
    const filters = context.stores.ConfigStore.getItem('filters') || [];

    const paths = context.stores.SearchStateStore.getItem('searchPathSelector');    // vertical selector paths

    const getStoreSearchResultsPage = () => {
        return context.stores.SearchStateStore.getItem('searchResultsPage');
    };

    const getStoreParams = () => {
        return Object.assign({}, context.stores.ParamStore.getParams());
    };

    const [ searchPage, setSearchPage ] = useState(getStoreSearchResultsPage);   // vertical selector selected item
    const [ params, setParams ] = useState(getStoreParams); // all other selected items

    const getSearchUrl = (type) => {
        const features = context.stores.ConfigStore.getItem('features');
        const searchMode = context.stores.ConfigStore.getItem('searchMode');
        if(searchMode){
            params['searchMode'] = searchMode;
        }
        params.aspects = type;
        delete params.usageType;

        if(context.stores.ParamStore.getParam('searchRadius')){
            params.radius = context.stores.ParamStore.getParam('searchRadius');
        }
        if(context.stores.SearchStateStore.getItem('currentPlaceId')) {
            params.placeId = context.stores.SearchStateStore.getItem('currentPlaceId');
        }
        /*
        if (features.clearFilterPropTypeNav) {
            const minimalParams = (({ aspects }) => ({ aspects }))(params);
            return searchPage + createQueryString(minimalParams);
        }
        */

        return searchPage + createQueryString(params);
    };

    const done = () => {

        const searchResultsPage = context.stores.SearchStateStore.getItem('searchResultsPage');
        const remainOnCurrentListing = context.stores.SearchStateStore.getItem('remainOnCurrentListing');
        const spaPath = context.spaPath || {};

        if (
            !remainOnCurrentListing &&
            searchResultsPage &&
            searchResultsPage !== '/' &&
            spaPath.path !== searchPage
        ) {
            context.stores.SearchStateStore.setItem('searchResultsPage', searchResultsPage);
            const siteType = context.stores.SearchStateStore.getItem('searchType');
            window.location.assign(getSearchUrl(siteType));
        }else{
            context.actions.setSearchStateItem('extendedSearch', false);
            context.actions.setSearchStateItem('mapState', {});

            const newParams = Object.assign(
                {},
                context.stores.ParamStore.getParams(),
                params
            );

            const newSearchType = normalizeSearchType(newParams['aspects']);
            if (newSearchType) {
                context.actions.setSearchStateItem('searchType', newSearchType);
            }

            const newSearchTypeExtended = normalizeSearchTypeExtended(newParams['aspects']);
            if (newSearchTypeExtended) {
                context.actions.setSearchStateItem('searchTypeExtended', newSearchTypeExtended);
            }

            setParams(newParams);
            context.stores.ParamStore.setParams(newParams);
            context.actions.updateParams(context.location.pathname, newParams, context.router);

            if(filterChangeCallback){
                filterChangeCallback(newParams);
            }
        }
    };

    const reset = () => {
        setSearchPage(getStoreSearchResultsPage());
        setParams(getStoreParams());

    };

    const pathFilterChange = (selectedItem) => {
        const newSearchPage = selectedItem.value;
        setSearchPage(newSearchPage);
    };

    const setNewParamValue = (placement, selectedItem) => {
        const newParams = Object.assign({}, params);
        const filterCandidates = extractFilter(filters, placement, params);
        if(filterCandidates && filterCandidates.length === 1){
            const filter = filterCandidates[0];
            if(filter.type === 'range'){
                const currentParamValue = params[filter.name];
                let min;
                let max;
                if(currentParamValue){
                    let currentParamValStripped = currentParamValue.replaceAll('range[', '');
                    currentParamValStripped = currentParamValStripped.replaceAll(']','');
                    const filterValues = currentParamValStripped.split('|');
                    min = selectedItem.type === 'min' ? selectedItem.value : filterValues[0];
                    max = selectedItem.type === 'max' ? selectedItem.value : filterValues[1];
                }else{
                    min = selectedItem.type === 'min' ? selectedItem.value : '';
                    max = selectedItem.type === 'max' ? selectedItem.value : '';
                }
                newParams[filter.name] = 'range[' + min + '|' + max + '|include]';
            }else{
                newParams[filter.name] = selectedItem.value;
            }
        }
        setParams(newParams);
    };

    const locationFilterChange = (selectedItem) => {
        setNewParamValue('lm_locationFilter', selectedItem);
    };

    const primaryFilterChange = (selectedItem) => {
        setNewParamValue('lm_primaryFilter', selectedItem);
    };

    const secondaryFilterChange = (selectedItem) => {
        setNewParamValue('lm_secondaryFilter', selectedItem);
    };

    return (
        <MobileFilterViewContainer>
            <TopBar>
                <MobileFilterActionButton clickHandler={() => reset()} bgColor={'#fff'} textColor={'#003F2D'} label='Reset'/>
                <ListingCount>{currentMarkers ? currentMarkers.length : '0'} Results</ListingCount>
                <MobileFilterActionButton clickHandler={() => done()} bgColor={'#003F2D'} textColor={'#fff'} label='Done'/>
            </TopBar>
            <FiltersContainer>
                { getVerticalSelector(paths, searchPage, context.language, pathFilterChange)}
                { getFilter('lm_locationFilter', filters, params, locationFilterChange) }
                { getFilter('lm_primaryFilter', filters, params, primaryFilterChange) }
                { getFilter('lm_secondaryFilter', filters, params, secondaryFilterChange) }
            </FiltersContainer>
        </MobileFilterViewContainer>
    ); 
};

const MobileFilterViewContainer = styled.div`
    background: #fff;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
`;

const TopBar = styled.div`
    display: flex;
    height: 84px;
    border: 1px solid rgba(0, 63, 45, 0.15);
    padding: 5px 15px 5px 15px;
    justify-content: center;
    align-items: center;
    font-family: Calibre Regular;
`;

const ListingCount = styled.div`
    width: 100%;
    font-size: 16px;
    color: #003F2D;
    text-align: center;
`;

const FiltersContainer = styled.div`
    
`;

export const FilterItem = styled.div`
    margin-bottom: 10px;
    padding-top: 5px;
    border-bottom: 1px solid #ccc;
    font-family: Calibre Regular !important;
    color: #000;
`;

export const FilterLabel = styled.div`
    font-size: 14px;
    font-family: Calibre Regular;
    line-height: 16px;
    font-weight: 600;
    color: #000;
    margin-left: 16px;
`;

export const FilterControl = styled.div`
    .Select-control {
        border: none !important;
        box-shadow: none !important;
        background: none !important;

        .Select-arrow:after {
            color: #003F2D !important;
        }
    }
    .SelectRangeWrap {
        width: 100%;
    }
    .ribbon_item {
        display: block !important;
    }
    .Select-value-label, .selectPlaceholder {
        font-size: 16px !important;
        font-family: Calibre Regular !important;
        color: #000;
    }
    .Select-option, .Select-placeholder {
        font-family: Calibre Regular !important;
        color: #000 !important;
    }
`;

export default MobileFilterView;