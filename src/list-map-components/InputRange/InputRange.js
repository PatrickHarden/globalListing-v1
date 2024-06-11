import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { InputRange as _InputRange } from '../../external-libraries/agency365-components/components';
import classNames from 'classnames';
import DefaultValues from '../../constants/DefaultValues';
import buildRangeValue from '../../utils/buildRangeValue';
import TranslateString from '../../utils/TranslateString';

class InputRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
            value: props.value
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.wrapWithDropdown = this.wrapWithDropdown.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    handleChange(values) {
        this.setState({
            value: values
        });

        if (this.props.onChange) {
            this.props.onChange(values);
        }
    }

    handleChangeComplete() {
        const { prependValue, appendValue } = this.props.filter.settings;
        const { includePOA } = this.props;

        const params = this.props.filter.name.split('|'),
            dummyEvent = {
                target: []
            },
            min = `${prependValue}${this.state.value.min}${appendValue}`,
            max = `${prependValue}${this.state.value.max}${appendValue}`;

        if (params.length === 1) {
            dummyEvent.target.push({
                name: params[0],
                value: buildRangeValue(min, max, includePOA)
            });
        } else {
            // Swap values and create separate params
            let _min = '',
                _max = '';

            if (max !== '') {
                _min = buildRangeValue('', max, includePOA);
            }

            if (min !== '') {
                _max = buildRangeValue(min, '', includePOA);
            }

            dummyEvent.target.push(
                {
                    name: params[0],
                    value: _min
                },
                {
                    name: params[1],
                    value: _max
                }
            );
        }

        this.props.onChangeComplete(dummyEvent, 'range');
    }

    handleClick(e) {
        if (this.props.disabled) {
            return;
        }

        e.preventDefault();
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    handleBlur() {
        this.setState({ isExpanded: false });
    }

    internationalize(value, type) {
        const methods = {
            area: value => {
                const culture =
                    this.context.stores.ConfigStore.getItem('features').sizeCultureCode ? this.context.stores.ConfigStore.getItem('features').sizeCultureCode :
                    this.context.stores.ConfigStore.getItem('language') ||
                    DefaultValues.culture;
                const unit =
                    this.context.stores.ParamStore.getParam('Unit') ||
                    DefaultValues.uom;
                const numberFormat = new Intl.NumberFormat(culture, {
                    maximumFractionDigits: 0
                });

                const translateStringProps = {
                    string: 'RangeSliderArea',
                    unit: this.context.language[unit],
                    size: numberFormat.format(value),
                    component: 'span'
                };

                return <TranslateString {...translateStringProps} />;
            },
            currency: value => {
                const culture =
                    this.context.stores.ConfigStore.getItem('features').sizeCultureCode ? this.context.stores.ConfigStore.getItem('features').sizeCultureCode :
                    this.context.stores.ConfigStore.getItem('language') ||
                    DefaultValues.culture;
                const currency =
                    this.context.stores.ConfigStore.getConfig().params
                        .CurrencyCode || DefaultValues.currency;

                value = parseFloat(value);
                const numberFormat = new Intl.NumberFormat(culture, {
                    style: 'currency',
                    currency: currency,
                    minimumFractionDigits:
                        value % Math.round(value) === 0 ? 0 : 2,
                    maximumFractionDigits: 2
                });

                return numberFormat.format(value);
            }
        };

        if (methods[type]) {
            return methods[type](value);
        }

        return value;
    }

    getLabel(value) {
        const { intl, prependText, appendText } = this.props.filter.settings;

        if (intl && intl.length) {
            return this.internationalize(value, intl);
        }

        return `${prependText}${value}${appendText}`;
    }

    renderRibbon() {
        const outerClass = [
            'ribbon_item_link cbre_dropdown_link',
            this.state.isExpanded ? 'is_selected' : '',
            this.props.disabled ? 'is-disabled' : ''
        ];

        const currentMinLabel = this.getLabel(this.state.value.min);
        const currentMaxLabel = this.getLabel(this.state.value.max);
        const minLabel = this.getLabel(this.props.minValue);
        const maxLabel = this.getLabel(this.props.maxValue);

        return (
            <a
                href="#"
                className={classNames(outerClass)}
                onClick={this.handleClick}
                onBlur={this.handleBlur}
            >
                <span className="min has_value">
                    <span className="min_val">{currentMinLabel}</span>
                    <span className="min_placeholder">{minLabel}</span>
                </span>
                <span className="conjunction">to</span>
                <span className="max has_value">
                    <span className="max_val">{currentMaxLabel}</span>
                    <span className="max_placeholder">{maxLabel}</span>
                </span>
            </a>
        );
    }

    wrapWithDropdown(content) {
        const dropdownClass = [
            'cbre_dropdown',
            this.state.isExpanded || this.props.fullWidth ? 'is_open' : '',
            this.props.fullWidth ? 'is_fullWidth' : ''
        ];

        return (
            <div>
                {!this.props.fullWidth ? this.renderRibbon() : null}
                <div className={classNames(dropdownClass)}>
                    <div className="cbre_dropdown_body">
                        <div className="cbre_container">{content}</div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const currentMinLabel = this.getLabel(this.state.value.min);
        const currentMaxLabel = this.getLabel(this.state.value.max);

        const content = (

            <div className="InputRangeWrap">
                <div className={window.cbreSiteTheme === 'commercialr3' ? 
                    'input-range__label input-range__label--value input-range__label--value--min ribbon_item_divider' :
                    'input-range__label input-range__label--value input-range__label--value--min'    
                }>
                    <span className="input-range__label-container">
                        {currentMinLabel}
                    </span>
                </div>
                <div className="input-range__label input-range__label--value input-range__label--value--max">
                    <span className="input-range__label-container">
                        {currentMaxLabel}
                    </span>
                </div>
                <_InputRange
                    {...this.props}
                    labelClass="formLabel"
                    showLabel={this.props.showLabel}
                    showMinMax={this.props.fullWidth}
                    value={this.state.value}
                    onChange={this.handleChange}
                    onChangeComplete={this.handleChangeComplete}
                />
            </div>
        );

        if (this.props.fullWidth) {
            return content;
        }

        return this.wrapWithDropdown(content);
    }
}

InputRange.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

export default InputRange;
