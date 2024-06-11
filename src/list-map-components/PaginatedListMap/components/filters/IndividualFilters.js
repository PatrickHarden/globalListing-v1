import React from 'react';
import Select_R4 from '../../../../r4/external/agency365-components/Select/Select.r4';
import { FilterItem, FilterLabel, FilterControl } from '../MobileFilterView.jsx';
import checkConditional from '../../../../utils/checkConditional';

export const extractFilter = (filters, placement, params) => {
    const filterCandidates = filters.filter(filter => {
        if(filter.placement === placement && checkConditional(filter, params)){
            // filter matches placement code
            return filter;
        }
    });
    return filterCandidates;    
};

const extractParam = (params, filterName) => {

    if(params[filterName]){
        return params[filterName];
    }
    if(params[filterName.toLowerCase()]){
        return params[filterName.toLowerCase()];
    }
    return null;
};

const getOptionValue = (selectedValue, options) => {

    const vals = options.filter(option => {
        if(option.value === selectedValue){
            return option;
        }
    });

    if(vals && vals.length === 1){
        return vals[0];
    }
    return null;
};

const createFilterItem = (name, value, label, placeholder, options, filterChangeHandler) => {
    return (
        <FilterItem>
            <FilterLabel>{label}</FilterLabel>
            <FilterControl>
                <Select_R4
                    key={name}
                    name={name}
                    className="Select Select--single"
                    value={value}
                    placeholder={placeholder}
                    onChange={filterChangeHandler}
                    onMouseOverClass="is-focused"
                    optionsArray={options}
                    optionClass="Select-value"
                    outerClass="Select-menu-outer"
                    placeholderClass="Select-placeholder"
                    selectArrowZoneClass="Select-arrow-zone"
                    selectArrowClass="Select-arrow"
                    selectValueClass="Select-value-label"
                    selectMenuClass="Select-menu"
                    selectOptionClass="Select-option"
                    selectControlClass="Select-control"
                    selectInputClass="Select-input"
                    showLabel={false}
                    r4={true} /> 
            </FilterControl>
        </FilterItem>
    );
};

export const getVerticalSelector = (paths, searchPage, language, filterChangeHandler) => {
    if(paths){
        const selectedValue = paths.find(
            path => path.value === searchPage
        );
        return createFilterItem('path-selector',selectedValue,language.searchPathSelectorLabel,language.searchPathSelectorLabel,paths,filterChangeHandler);
    }
    return <React.Fragment></React.Fragment>;
}; 

const getParamsForRangeFilter = (filter, stateParams) => {

    var paramNames = filter.split('|'),
        paramArray = [],
        params = 'range[';

    paramArray[0] = splitRange(
        stateParams[paramNames[0]]
    );
    paramArray[1] = splitRange(
        stateParams[paramNames[1]]
    );

    params +=
        (paramArray[1][0] || '') +
        '|' +
        (paramArray[0][1] || '') +
        '|' +
        (paramArray[0][2] || '') +
        ']';

    return params;
};

const splitRange = (val) => {
    let valueString = val ? val.replaceAll('range[', '') : '';
    valueString = valueString.replaceAll(']','');
    const params = valueString.split('|');
    return params;
};

export const getFilter = (placement, filters, params, filterChangeHandler) => {

    const filterCandidates = extractFilter(filters, placement, params);

    if(filterCandidates && filterCandidates.length > 0){
        return filterCandidates.map(filter => {
            if(filter.type === 'range'){
                // range filters need to be split up into a range of params
                let minValue;
                let minName;
                let maxValue;
                let maxName;
            
                if (filter.name.split('|').length > 1) {
                    const paramValues = getParamsForRangeFilter(filter.name, params);
                    const minMaxValues = splitRange(paramValues);
                    minValue = minMaxValues[0] || '';
                    minName = filter.name.split('|')[0];
                    maxValue = minMaxValues[1] || '';
                    maxName = filter.name.split('|')[1];
                } else {
                    // if the name itself isn't split, we need to manually pull apart the param value and find the min and max
                    // find the min value
                    const currentValue = extractParam(params, filter.name);
                    const paramValues = splitRange(currentValue);
                    minValue = getOptionValue(paramValues[0], filter.minValues);
                    minName = filter.name + '-Min';
                    maxValue = getOptionValue(paramValues[1], filter.maxValues);
                    maxName = filter.name + '-Max';
                }
                // const includePOA = paramValue[2] || '';
                return (
                    <React.Fragment>
                        { createFilterItem(minName, minValue, filter.minLabel, filter.minLabel, filter.minValues, filterChangeHandler) }
                        { createFilterItem(maxName, maxValue, filter.maxLabel, filter.maxLabel, filter.maxValues, filterChangeHandler) }
                    </React.Fragment>
                );
            }else{
                const selectedValue = getOptionValue(extractParam(params, filter.name), filter.options);
                return createFilterItem(filter.name, selectedValue, filter.label, filter.placeholder, filter.options, filterChangeHandler);
            }
        });
    }else{
        return <React.Fragment></React.Fragment>;
    }
};
