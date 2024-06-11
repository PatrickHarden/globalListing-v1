import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * CardBody
 * @example
 *
 * <CardBody>
 *    <div>content</div>
 * </CardBody>
 * @param {Object} props
 * @param {!node} props.children
 * @returns {Element}
 */
function CardBody(props) {

  const { className, children, ...other } = props;

  const classes = ['external-libraries-card-body-container', className];

  return (
    <div className={classNames(classes)} {...other}>
      {children}
    </div>
  );
}

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

CardBody.defaultProps = {
  className: ''
};

export default CardBody;
