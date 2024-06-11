import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Checkbox
 * @example
 * <Checkbox
 *     checked
 *     name="cbName"
 *     label="Checkbox label"
 * />
 *
 * @param {Object} props
 * @param {string} props.checkboxSpanClass
 * @param {boolean} props.checked - Default `false`
 * @param {string} props.className
 * @param {boolean} props.disabled - Default `false`
 * @param {string} props.label
 * @param {string} props.labelSpanClass
 * @param {!string} props.name
 * @param {function} props.onChange
 * @returns {Element}
 */
function Checkbox(props) {
  const {
    className,
    checkboxSpanClass,
    labelElementClass,
    labelSpanClass,
    label,
    disabled,
    ...other
  } = props;

  const classes = [className];
  const checkboxSpanClasses = [checkboxSpanClass];
  const labelElementClasses = [labelElementClass];
  const labelSpanClasses = [labelSpanClass];

  return (
    <div className={classNames(classes)}>
      <label className={classNames(labelElementClasses)}>
        <input type="checkbox" {...other} />

        <span className={classNames(checkboxSpanClasses)} />

        <span className={classNames(labelSpanClasses)}>{label}</span>
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  checkboxSpanClass: PropTypes.string,
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  labelElementClass: PropTypes.string,
  labelSpanClass: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default Checkbox;
