import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

function menuRenderer({
  focusedOption,
  instancePrefix,
  onFocus,
  onSelect,
  optionClassName,
  optionComponent,
  optionRenderer,
  options,
  valueKey
}) {
  const Option = optionComponent;

  return options.map((option, i) => {
    const isSelected = option.selected; // valueArray && valueArray.indexOf(option) > -1;
    const isFocused = option === focusedOption;
    const optionRef = isFocused ? 'focused' : null;
    const optionClass = classNames(optionClassName, {
      'Select-option': true,
      'is-selected': isSelected,
      'is-focused': isFocused,
      'is-disabled': option.disabled
    });

    return (
      <Option
        className={optionClass}
        instancePrefix={instancePrefix}
        isDisabled={option.disabled}
        isFocused={isFocused}
        isSelected={isSelected}
        key={`option-${i}-${option[valueKey]}`}
        onFocus={onFocus}
        onSelect={onSelect}
        option={option}
        optionIndex={i}
        ref={optionRef}
      >
        {optionRenderer(option, i)}
      </Option>
    );
  });
}

menuRenderer.propTypes = {
  focusedOption: PropTypes.number,
  instancePrefix: PropTypes.string,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  optionClassName: PropTypes.string,
  optionComponent: PropTypes.func,
  optionRenderer: PropTypes.func,
  options: PropTypes.array,
  valueArray: PropTypes.array,
  valueKey: PropTypes.number
};

export default menuRenderer;
