import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Button
 * @example
 *
 * <Button>
 *    Button text
 * </Button>
 * @param {Object} props
 * @param {!node} props.children
 * @param {string} props.className
 * @param {boolean} props.disabled
 * @param {string} props.link
 * @param {function} props.onClick
 * @returns {Element}
 */
function Button(props) {
  const {
    children,
    className,
    disabled = false,
    link,
    onClick,
    ...other
  } = props;

  const classes = ['external-libraries-button', className, disabled && 'external-libraries-button-disabled'];

  const clickAction = (e) => {
    if (!disabled) {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    } else {
      e.preventDefault();
    }
  };

  return (
    <a
      href={link || '#'}
      disabled={disabled}
      className={classnames(classes)}
      onClick={clickAction}
      {...other}
    >
      {children}
    </a>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  link: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
