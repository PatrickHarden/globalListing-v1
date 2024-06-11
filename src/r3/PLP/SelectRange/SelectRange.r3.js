import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select_R3 from '../../external/agency365-components/Select/Select.r3';
import classNames from 'classnames';
import buildRangeValue from '../../../utils/buildRangeValue';

class SelectRange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value
            });
        }
    }

    handleChange(value) {
        const { includePOA } = this.props.filter;
        const newValue = Object.assign({}, this.state.value);
        newValue[value.type] = value;

        this.setState({
            value: newValue,
            isExpanded: false
        });

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }

        if (this.props.onChangeComplete) {
            const params = this.props.filter.name.split('|');
            const dummyEvent = {
                target: []
            };

            const min = newValue.min.value;
            const max = newValue.max.value;

            if (params.length === 1) {
                dummyEvent.target.push({
                    name: params[0],
                    value: buildRangeValue(min, max, includePOA)
                });
            } else {
                // Swap values and create separate params
                let _min = '';
                let _max = '';

                if (max !== '') {
                    _min = buildRangeValue('', max, includePOA);
                }

                if (min !== '') {
                    _max = buildRangeValue(min, '', includePOA);
                }

                dummyEvent.target.push({
                    name: params[0],
                    value: _min
                }, {
                    name: params[1],
                    value: _max
                });
            }

            this.props.onChangeComplete(dummyEvent, 'range');
        }
    }

    render() {
        const minObj = this.state.value.min;
        const maxObj = this.state.value.max;

        const minLabel = this.props.minLabel || this.props.label || minObj.label;
        const maxLabel = this.props.maxLabel || this.props.label || maxObj.label;

        return (
            <div className="ribbon_item">
                <div className={window.cbreSiteTheme === 'commercialr3' ? 'SelectRangeWrap ribbon_item_divider' : 'SelectRangeWrap'}>
                    <Select_R3
                        name="SelectRange-value-min"
                        value={minObj}
                        placeholder={minLabel}
                        onChange={this.handleChange}
                        onMouseOverClass="is-focused"
                        optionsArray={this.props.minValues}
                        className={classNames(['Select', 'Select--single'])}
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
                        showLabel={!!this.props.showLabel}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className="SelectRangeWrap">
                    <Select_R3
                        name="SelectRange-value-max"
                        value={maxObj}
                        placeholder={maxLabel}
                        onChange={this.handleChange}
                        onMouseOverClass="is-focused"
                        optionsArray={this.props.maxValues}
                        className={classNames(['Select', 'Select--single'])}
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
                        showLabel={!!this.props.showLabel}
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        );
    }
}

SelectRange.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

SelectRange.defaultProps = {
    showLabel: true
};

export default SelectRange;