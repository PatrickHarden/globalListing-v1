import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * ThemeableComponent
 * @example
 * <ThemeWrapper theme="themename">
 *  <ThemeableComponent />
 * </ThemeWrapper>
 * @param {Object} props
 * @returns {Element}
 */
function ThemeableComponent(props) {

  const { theme, className, ...other } = props;

  const classes = classNames(theme && theme.self, className);

  return <div className={classes} {...other} />;
}

ThemeableComponent.propTypes = {
  theme: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ThemeableComponent;
