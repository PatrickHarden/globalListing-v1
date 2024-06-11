import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormGroup, GmapsAutoComplete, Select } from '../../external-libraries/agency365-components/components';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import InputRange from '../InputRange/InputRange';
import SelectRange from '../SelectRange/SelectRange';
import TranslateString from '../../utils/TranslateString';
import checkConditional from '../../utils/checkConditional';
import DefaultValues from '../../constants/DefaultValues';
import classNames from 'classnames';

const LatLng = window.google ? window.google.maps.LatLng : {};

class Filter extends Component {
    renderSearchComponent() {
        const {
            onFilterChanged,
            onFilterUpdated,
            onInitCallback,
            disabled
        } = this.props;

        const {
            searchLocationName,
            searchBias,
            biasRadius,
            restrictToCountry,
            searchPlaceTypes
        } = this.context.stores.SearchStateStore.getAll();

        const location = searchBias
            ? new LatLng(searchBias.lat, searchBias.lon)
            : null;
        const radius = parseFloat(biasRadius || DefaultValues.searchBiasRadius);
        const componentRestrictions = restrictToCountry
            ? { country: restrictToCountry }
            : null;
        const types = searchPlaceTypes || null;

        const subscribe = (enable, handler) => {
            const { ParamStore, SearchStateStore } = this.context.stores;
            const handlerWrapper = () => {
                handler({
                    label: SearchStateStore.getItem('searchLocationName'),
                    placeId: ParamStore.getParam('placeId')
                });
            };

            ParamStore[enable ? 'onChange' : 'off'](
                'PARAMS_UPDATED',
                handlerWrapper
            );
            SearchStateStore[enable ? 'onChange' : 'off'](
                'SEARCH_STATE_UPDATED',
                handlerWrapper
            );
        };

        const onInit = suggestion => {
            onFilterUpdated(suggestion);
            onInitCallback();
        };

        const selectAllText = () => {
            document.getElementsByClassName('geosuggest__input')[0].select();
        };

        return (
            <GmapsAutoComplete
                gmaps={window.google.maps}
                subscribe={subscribe}
                placeholder={
                    <TranslateString string="SearchLocationPlaceholder" />
                }
                initialValue={searchLocationName}
                onInit={onInit}
                onFocus={selectAllText}
                onSuggestionSelected={onFilterChanged}
                location={location}
                radius={parseFloat(radius)}
                componentRestrictions={componentRestrictions}
                types={types}
                ParamStore={this.context.stores.ParamStore}
                ConfigStore={this.context.stores.ConfigStore}
                className="Select Select__large is-searchable Select--single cbre_icon cbre_icon_loupe"
                disabled={disabled}
            />
        );
    }

    getRangeFilterState() {
        const paramStore = this.context.stores.ParamStore;

        let prependValue = '';
        let appendValue = '';

        if (
            this.props.filter.settings &&
            this.props.filter.settings.prependValue
        ) {
            prependValue = this.props.filter.settings.prependValue;
        }

        if (
            this.props.filter.settings &&
            this.props.filter.settings.appendValue
        ) {
            appendValue = this.props.filter.settings.appendValue;
        }

        let paramValue;
        let minValue;
        let maxValue;

        if (this.props.filter.name.split('|').length > 1) {
            paramValue = this.getParamsForRangeFilter(this.props.filter.name);
        } else {
            paramValue = paramStore.getParam(this.props.filter.name);

            if (paramValue) {
                paramValue = decodeURI(paramValue);
            }
        }

        paramValue = this.splitRange(paramValue);

        minValue = paramValue[0]
            ? paramValue[0].replace(prependValue, '').replace(appendValue, '')
            : '';
        maxValue = paramValue[1]
            ? paramValue[1].replace(prependValue, '').replace(appendValue, '')
            : '';

        return {
            min: minValue || '',
            max: maxValue || '',
            includePOA: paramValue[2] || ''
        };
    }

    getParamsForRangeFilter(filter) {
        const paramStore = this.context.stores.ParamStore;

        var paramNames = filter.split('|'),
            paramArray = [],
            params = 'range[';

        paramArray[0] = this.splitRange(paramStore.getParam(paramNames[0]));
        paramArray[1] = this.splitRange(paramStore.getParam(paramNames[1]));

        params +=
            (paramArray[1][0] || '') +
            '|' +
            (paramArray[0][1] || '') +
            '|' +
            (paramArray[0][2] || '') +
            ']';

        return params;
    }

    splitRange(val) {
        var _param;
        // range[1|10|include]
        _param = val
            ? decodeURI(val)
                  .replace('range[', '')
                  .replace(']', '')
            : '';
        _param = _param ? _param.split('|') : '';
        return _param;
    }

    render() {
        const {
            filter,
            placement,
            filterIndex,
            isFormGroup,
            isCollapsible,
            renderSearch,
            onFilterChanged,
            currentValue,
            showLabel,
            className,
            disabled
        } = this.props;

        if (!LatLng) {
            return null;
        }

        if (renderSearch) {
            return this.renderSearchComponent();
        } else if (
            placement !== filter.placement ||
            !checkConditional(
                filter,
                this.context.stores.ParamStore.getParams()
            )
        ) {
            return null;
        }

        const key = `${placement}-filter-${filterIndex}`;

        let filterMarkup;

        // If you need a form label add...
        // <div className="formLabel" key={labelKey}>{filter.label}</div>

        switch (filter.type) {
            case 'range': {
                var { minValues, maxValues } = filter;

                // get default

                const minDefault = minValues.find(value => value.default);
                const maxDefault = maxValues.find(value => value.default);

                let min = minDefault
                    ? minDefault
                    : minValues[minValues.length - 1];
                let max = maxDefault
                    ? maxDefault
                    : maxValues[maxValues.length - 1];

                // override from url?

                const filterState = this.getRangeFilterState();
                const minFromFilterState = minValues.find(
                    obj => obj.value === filterState.min
                );
                const maxFromFilterState = maxValues.find(
                    obj => obj.value === filterState.max
                );

                if (minFromFilterState) {
                    min = minFromFilterState;
                }

                if (maxFromFilterState) {
                    max = maxFromFilterState;
                }

                // get markup

                filterMarkup = (
                    <SelectRange
                        minLabel={filter.minLabel || filter.label}
                        maxLabel={filter.maxLabel || filter.label}
                        minValues={minValues}
                        maxValues={maxValues}
                        onChangeComplete={onFilterChanged}
                        value={{ min, max }}
                        showLabel={showLabel}
                        filter={filter}
                        disabled={disabled}
                    />
                );
                break;
            }

            case 'rangeSlider': {
                var { min, max, step } = filter.settings;
                var minVal = Number(min);
                var maxVal = Number(max);
                var stepVal = Number(step);
                var currentMin = minVal;
                var currentMax = maxVal;
                var includePOA = filter.includePOA;

                var filterState = this.getRangeFilterState();
                if (filterState.min !== '') {
                    currentMin = Number(filterState.min);
                }
                if (filterState.max !== '') {
                    currentMax = Number(filterState.max);
                }
                if (filterState.includePOA !== '') {
                    includePOA = filterState.includePOA;
                }

                filterMarkup = (
                    <InputRange
                        label={filter.label}
                        minValue={Number(minVal)}
                        maxValue={Number(maxVal)}
                        onChangeComplete={onFilterChanged}
                        step={stepVal}
                        value={{ min: currentMin, max: currentMax }}
                        fullWidth={!showLabel}
                        showLabel={showLabel}
                        filter={filter}
                        includePOA={includePOA}
                        disabled={disabled}
                    />
                );
                break;
            }

            case 'group': {
                filterMarkup = (
                    <CheckboxGroup
                        key={key}
                        onFilterChanged={onFilterChanged}
                        options={filter.children}
                        disabled={disabled}
                    />
                );
                break;
            }

            case 'select': {
                var changeHandler = opt => {
                    var e = {
                        target: {
                            name: filter.name,
                            value: opt.value
                        }
                    };

                    onFilterChanged(e, 'select');
                };

                var selectedValue = filter.options.find(
                    opt => opt.value === currentValue
                );
                var selectClasses = ['Select', 'Select--single', className];

                filterMarkup = (
                    <Select
                        key={key}
                        name={filter.name}
                        value={selectedValue}
                        placeholder={filter.label}
                        onChange={changeHandler}
                        onMouseOverClass="is-focused"
                        optionsArray={filter.options}
                        className={classNames(selectClasses)}
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
                        showLabel={!!showLabel}
                        disabled={disabled}
                    />
                );
                break;
            }

            default: {
                filterMarkup = <input key={key} disabled={disabled} />;
            }
        }

        const viewMoreText = {
            more: <TranslateString string="LMfilterGroupShow" />,
            less: <TranslateString string="LMfilterGroupHide" />
        };

        const classes = ['formGroup', isCollapsible && 'is_collapsable'];

        let groupMarkup;

        if (isFormGroup) {
            groupMarkup = (
                <FormGroup
                    className={classNames(classes)}
                    legend={filter.label}
                    key={key}
                    viewMoreText={viewMoreText}
                    isCollapsibled
                >
                    {filterMarkup}
                </FormGroup>
            );
        }

        return groupMarkup || filterMarkup;
    }
}

Filter.contextTypes = {
    stores: PropTypes.object
};

Filter.propTypes = {
    filter: PropTypes.object,
    onFilterChanged: PropTypes.func.isRequired,
    onFilterUpdated: PropTypes.func,
    placement: PropTypes.string,
    filterIndex: PropTypes.number,
    isFormGroup: PropTypes.bool,
    isCollapsible: PropTypes.bool,
    showLabel: PropTypes.bool,
    renderSearch: PropTypes.bool,
    currentValue: PropTypes.string,
    breakpoints: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

export default Filter;
