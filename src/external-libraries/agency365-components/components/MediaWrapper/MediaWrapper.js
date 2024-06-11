import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * MediaWrapper
 * @example
 *
 * <MediaWrapper>
 *    <img src="" />
 * </MediaWrapper>
 * @param {Object} props
 * @param {!node} props.children
 * @param {boolean} props.fitHeight
 * @param {boolean} props.fitWidth
 * @param {string} props.className
 * @returns {Element}
 */
function MediaWrapper(props) {

  const { children, fitHeight, fitWidth, className, ...other } = props;

  const classes = [
    'external-libraries-media-wrapper-container',
    'imageWrap',
    fitHeight && 'external-libraries-media-wrapper-container__fitHeight',
    fitHeight && 'imageWrap__fitHeight',
    fitWidth && 'external-libraries-media-wrapper-container__fitWidth',
    fitWidth && 'imageWrap__fitWidth',
    className
  ];

  return (
    <div className={classNames(classes)} {...other}>
      {children}
    </div>
  );
}

MediaWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  fitHeight: PropTypes.bool,
  fitWidth: PropTypes.bool,
  className: PropTypes.string
};

export default MediaWrapper;
