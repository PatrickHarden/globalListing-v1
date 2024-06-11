import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';

/**
 * Select
 * @example
 * <Select
 *     optionsArray=[{label: 10, value: 10}, {label: 30, value: 30, default: true}]
 * />
 *
 * @param {Object} props
 * @param {Object} props.value - specifying this will instantiate an externally controlled component
 * @param {Object} props.initialValue - this will allow the component to handle its own state
 * @param {string} props.className
 * @param {string} props.name
 * @param {array} props.optionsArray
 * @param {string} props.optionClass
 * @param {string} props.outerClass
 * @param {string} props.placeholder
 * @param {string} props.placeholderClass
 * @param {string} props.selectArrowClass
 * @param {string} props.selectArrowZoneClass
 * @param {string} props.selectValueClass
 * @param {string} props.selectMenuClass
 * @param {string} props.selectOptionClass
 * @param {string} props.selectControlClass
 * @param {string} props.selectInputClass
 * @param {function} props.onChange
 * @returns {Element}
 */

class Select extends Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.object,
    initialValue: PropTypes.object,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    formLabelClass: PropTypes.string,
    onMouseOverClass: PropTypes.string,
    optionsArray: PropTypes.array.isRequired,
    optionClass: PropTypes.string,
    outerClass: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderClass: PropTypes.string,
    selectArrowZoneClass: PropTypes.string,
    selectArrowClass: PropTypes.string,
    selectValueClass: PropTypes.string,
    selectMenuClass: PropTypes.string,
    selectOptionClass: PropTypes.string,
    selectControlClass: PropTypes.string,
    selectInputClass: PropTypes.string,
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    sortAlphabetical: PropTypes.bool
  };

  constructor(props) {
    super(props);
    const defaultOption = props.optionsArray
      ? props.optionsArray.find(option => option.default)
      : [];

    this.state = {
      isExpanded: false,
      internalState: !!props.value,
      isSelected: props.initialValue || defaultOption || null,
      isHovered: -1
    };
    this.toggleSelect = this.toggleSelect.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.handleOuterMenu = this.handleOuterMenu.bind(this);
  }

  selectOption(option) {
    this.setState({ isSelected: option });
    if (this.props.onChange) {
      this.props.onChange(option);
    }
  }

  toggleSelect() {
    if (this.props.disabled) {
      return;
    }

    this.setState({ isExpanded: !this.state.isExpanded });
  }

  handleHover(i) {
    this.setState({ isHovered: i });
  }

  handleOuterMenu() {
    const menuOuter = findDOMNode(this.refs.menuOuter);
    if (!document.activeElement.isEqualNode(menuOuter)) {
      this.setState({ isExpanded: false });
    }
  }

  render() {
    const {
      className,
      optionsArray,
      name,
      value,
      initialValue,
      placeholder,
      formLabelClass,
      onMouseOverClass,
      optionClass,
      outerClass,
      placeholderClass,
      selectArrowZoneClass,
      selectArrowClass,
      selectValueClass,
      selectMenuClass,
      selectOptionClass,
      selectControlClass,
      selectInputClass,
      showLabel,
      disabled,
      sortAlphabetical
    } = this.props;

    const { isExpanded, isHovered, isSelected: _isSelected } = this.state;

    const isSelected = value || _isSelected || initialValue;

    const classes = [
      className,
      isExpanded ? 'is-open is-focused' : '',
      'external-libraries-select-container',
      disabled ? 'is-disabled' : ''
    ];
    const placeholderClasses = [
      placeholderClass,
      isSelected ? 'external-libraries-select-hide' : 'external-libraries-select-show'
    ];
    const optionClasses = [
      optionClass,
      isSelected ? 'external-libraries-select-show' : 'external-libraries-select-hide'
    ];
    const outerClasses = [
      'external-libraries-select-selectMenuOuter',
      outerClass,
      isExpanded ? 'external-libraries-select-show' : 'external-libraries-select-hide'
    ];
    const selectOptionClasses = ['external-libraries-select-selectOption', selectOptionClass];
    const selectValueClasses = [selectValueClass];
    const selectArrowZoneClasses = ['external-libraries-select-selectArrowZone', selectArrowZoneClass];
    const selectArrowClasses = ['external-libraries-select-selectArrow', selectArrowClass];
    const selectMenuClasses = ['external-libraries-select-selectMenu', selectMenuClass];
    const selectControlClasses = ['external-libraries-select-selectControl', selectControlClass];
    const selectInputClasses = ['external-libraries-select-selectInput', selectInputClass];
    const formLabelClasses = [
      'external-libraries-select-formLabel',
      formLabelClass,
      showLabel ? 'external-libraries-select-show' : 'external-libraries-select-hide'
    ];

    const inputVal = isSelected || '';
    const inputMarkup = <input type="hidden" name={name} value={inputVal} />;

    let selectArrow;
    selectArrow = (
      <span className={classNames(selectArrowZoneClasses)}>
        <span className={classNames(selectArrowClasses)} />
      </span>
    );

    let placeholderMarkup;
    placeholderMarkup = (
      <div className={classNames(placeholderClasses)}>
        {placeholder || 'Select Option'}
      </div>
    );

    const label = isSelected ? isSelected.label : '';
    let optionsMarkup;
    optionsMarkup = (
      <div className={classNames(optionClasses)}>
        <span className={classNames(selectValueClasses)}>{label}</span>
      </div>
    );

    let selectInputMarkup;
    selectInputMarkup = <div className={classNames(selectInputClasses)} />;

    // sort the options alphabetically by label if the sortAlphabetical flag is set
    sortAlphabetical && optionsArray && optionsArray.sort((a, b) => a.label.localeCompare(b.label, undefined, {sensitivity: 'base'}));

    let selectMenuOuter;
    selectMenuOuter = (
      <div className={classNames(outerClasses)}>
        <div className={classNames(selectMenuClasses)} ref="menuOuter">
          <div className={classNames(formLabelClasses)}>
            {placeholder || 'Select Option'}
          </div>
          {optionsArray.map((option, i) => (
            <div
              key={`option_${i}`}
              className={classNames([
                ...selectOptionClasses,
                i === isHovered ? onMouseOverClass : ''
              ])}
              onMouseOver={() => this.handleHover(i)}
              onMouseOut={() => this.handleHover(-1)}
              onMouseDown={e => e.preventDefault()}
              onClick={() => {
                this.selectOption(option);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div
        className={classNames(classes)}
        onClick={this.toggleSelect}
        tabIndex={-1}
        onBlur={this.handleOuterMenu}
      >
        {inputMarkup}
        <div className={classNames(selectControlClasses)}>
          {placeholderMarkup}
          {optionsMarkup}
          {selectInputMarkup}
          {selectArrow}
        </div>
        {selectMenuOuter}
      </div>
    );
  }
}

export default Select;
