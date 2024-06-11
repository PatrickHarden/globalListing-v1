import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * List
 * @example
 * <List>
 *   <li>list item</li>
 * </List>
 * @param {Object} props
 * @param {!node} props.children
 * @param {string} props.type - One of `ul`, `ol` or `dl`. Default `ul`
 * @param {number} props.columns - Default 1
 * @param {number} props.limit
 * @returns {Element}
 */
function List(props) {

  const { columns, children, className, limit, ...other } = props;

  const Type = props.type;
  const classes = classNames(
    'external-libraries-list-container',
    'external-libraries-list-cols-' + columns,
    className
  );

  let items = children;
  if (limit) {
    items = items.slice(0, limit);
  }

  return (
    <Type className={classes} {...other}>
      {items}
    </Type>
  );
}

List.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['ul', 'ol', 'dl']),
  columns: PropTypes.number,
  Type: PropTypes.node,
  limit: PropTypes.number,
  className: PropTypes.string
};

List.defaultProps = {
  type: 'ul',
  columns: 1
};

export default List;
