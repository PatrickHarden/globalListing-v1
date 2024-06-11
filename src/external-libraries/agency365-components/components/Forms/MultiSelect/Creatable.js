/* eslint-disable no-param-reassign */
// known working 3rd party code, no need to rewrite it for a rule

import React, { Component } from 'react'; import PropTypes from 'prop-types';
import Select from './Select';
import defaultFilterOptions from './utils/defaultFilterOptions';
import defaultMenuRenderer from './utils/defaultMenuRenderer';

export default class Creatable extends Component {
  static displayName = 'CreatableSelect';

  static propTypes = {
    // See Select.propTypes.filterOptions
    filterOptions: PropTypes.any,

    // Searches for any matching option within the set of options.
    // This function prevents duplicate options from being created.
    // ({ option: Object, options: Array, labelKey: string, valueKey: string }): boolean
    isOptionUnique: PropTypes.func,

    // Determines if the current input text represents a valid option.
    // ({ label: string }): boolean
    isValidNewOption: PropTypes.func,

    // See Select.propTypes.menuRenderer
    menuRenderer: PropTypes.any,

    // Factory to create new option.
    // ({ label: string, labelKey: string, valueKey: string }): Object
    newOptionCreator: PropTypes.func,

    // Creates prompt/placeholder option text.
    // (filterText: string): string
    promptTextCreator: PropTypes.func,

    // Decides if a keyDown event (eg its `keyCode`) should result in the creation of a new option.
    shouldKeyDownEventCreateNewOption: PropTypes.func,
  }

  static isOptionUnique({ option, options, labelKey, valueKey }) {
    return options
      .filter(existingOption =>
        existingOption[labelKey] === option[labelKey] ||
        existingOption[valueKey] === option[valueKey]
      )
      .length === 0;
  }

  static isValidNewOption({ label }) {
    return !!label;
  }

  static newOptionCreator({ label, labelKey, valueKey }) {
    const option = {};
    option[valueKey] = label;
    option[labelKey] = label;
    option.className = 'Select-create-option-placeholder';
    return option;
  }

  static promptTextCreator(label) {
    return `Create option "${label}"`;
  }

  static shouldKeyDownEventCreateNewOption({ keyCode }) {
    // 9: Tab
    // 13: Enter
    // 188: Comma
    return [9, 13, 188].includes(keyCode);
  }

  getDefaultProps() {
    return {
      filterOptions: defaultFilterOptions,
      isOptionUnique: this.isOptionUnique,
      isValidNewOption: this.isValidNewOption,
      menuRenderer: defaultMenuRenderer,
      newOptionCreator: this.newOptionCreator,
      promptTextCreator: this.promptTextCreator,
      shouldKeyDownEventCreateNewOption: this.shouldKeyDownEventCreateNewOption,
    };
  }

  onInputKeyDown(event) {
    const { shouldKeyDownEventCreateNewOption } = this.props;
    const focusedOption = this.select.getFocusedOption();

    if (
      focusedOption &&
      focusedOption === this._createPlaceholderOption &&
      shouldKeyDownEventCreateNewOption({ keyCode: event.keyCode })
    ) {
      this.createNewOption();

      // Prevent decorated Select from doing anything additional with this keyDown event
      event.preventDefault();
    }
  }

  onOptionSelect(option) {
    if (option === this._createPlaceholderOption) {
      this.createNewOption();
    } else {
      this.select.selectValue(option);
    }
  }

  createNewOption() {
    const { isValidNewOption, newOptionCreator } = this.props;
    const { labelKey, options, valueKey } = this.select.props;

    const inputValue = this.select.getInputValue();

    if (isValidNewOption({ label: inputValue })) {
      const option = newOptionCreator({ label: inputValue, labelKey, valueKey });
      const isOptionUnique = this.isOptionUnique({ option });

      // Don't add the same option twice.
      if (isOptionUnique) {
        options.unshift(option);

        this.select.selectValue(option);
      }
    }
  }

  filterOptions(...params) {
    const { filterOptions, isValidNewOption, promptTextCreator } = this.props;

    const filteredOptions = filterOptions(...params);

    const inputValue = this.select
      ? this.select.getInputValue()
      : '';

    if (isValidNewOption({ label: inputValue })) {
      const { newOptionCreator } = this.props;
      const { labelKey, options, valueKey } = this.select.props;

      const option = newOptionCreator({ label: inputValue, labelKey, valueKey });

      // TRICKY Compare to all options (not just filtered options) in case
      // option has already been selected).
      // For multi-selects, this would remove it from the filtered list.
      const isOptionUnique = this.isOptionUnique({ option, options });

      if (isOptionUnique) {
        const prompt = promptTextCreator(inputValue);

        this._createPlaceholderOption = newOptionCreator({ label: prompt, labelKey, valueKey });

        filteredOptions.unshift(this._createPlaceholderOption);
      }
    }

    return filteredOptions;
  }

  isOptionUnique({ option, options }) {
    if (!this.select) {
      return false;
    }

    const { isOptionUnique } = this.props;
    const { labelKey, valueKey } = this.select.props;

    options = options || this.select.filterOptions();

    return isOptionUnique({
      labelKey,
      option,
      options,
      valueKey
    });
  }

  menuRenderer(params) {
    const { menuRenderer } = this.props;

    return menuRenderer({
      ...params,
      onSelect: this.onOptionSelect
    });
  }

  render() {
    return (
      <Select
        {...this.props}
        allowCreate
        filterOptions={this.filterOptions}
        menuRenderer={this.menuRenderer}
        onInputKeyDown={this.onInputKeyDown}
        ref={(ref) => { this.select = ref; }}
      />
    );
  }
}
