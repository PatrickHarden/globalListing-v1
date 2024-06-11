import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon } from '../../components';
import classNames from 'classnames';

/**
 * CardMedia
 * @example
 *
 * <CardMedia>
 *    <img src="" />
 * </CardMedia>
 * @param {Object} props
 * @param {!node} props.children
 * @param {node} props.bannerText
 * @param {FontIcon} props.topLeftIcon
 * @param {string} props.className
 * @returns {Element}
 */
function CardMedia(props) {

  const { children, bannerText, topLeftIcon, className, ...other } = props;

  const bannerClasses = ['external-libraries-card-media-banner', 'flag', 'flag__text'];
  const bannerMarkup = bannerText ? (
    <div className={classNames(bannerClasses)}>{bannerText}</div>
  ) : null;

  const iconClasses = ['external-libraries-card-media-iconTopLeft', 'flag', 'flag__vr'];
  const topLeftIconMarkup = topLeftIcon ? (
    <div className={classNames(iconClasses)}>{topLeftIcon}</div>
  ) : null;

  const containerClasses = ['external-libraries-card-media', className];

  return (
    <div className={classNames(containerClasses)} {...other}>
      {children}
      {bannerMarkup}
      {topLeftIconMarkup}
    </div>
  );
}

CardMedia.propTypes = {
  children: PropTypes.node.isRequired,
  bannerText: PropTypes.node,
  topLeftIcon: PropTypes.any,
  className: PropTypes.string
};

export default CardMedia;
