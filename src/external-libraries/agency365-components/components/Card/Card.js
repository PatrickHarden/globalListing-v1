import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Card
 * @example
 *
 * <Card>
 *    <div>content</div>
 * </Card>
 * @param {Object} props
 * @param {!node} props.children
 * @param {boolean} props.isHidden
 * @param {boolean} props.asListItem
 * @returns {Element}
 */
function Card(props) {

  const { className, children, isHidden, asListItem } = props;

  const classes = [
    'external-libraries-card-container',
    'card',
    isHidden && 'external-libraries-card-isHidden',
    className
  ];

  const Type = asListItem ? 'li' : 'div';

  return <Type className={classNames(classes)}>{children}</Type>;
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  isHidden: PropTypes.bool,
  asListItem: PropTypes.bool,
  className: PropTypes.string
};

Card.defaultProps = {
  // children: {},
  isHidden: false,
  asListItem: false,
  className: ''
};

export default Card;
