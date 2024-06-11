import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Image from '../Image/Image';

/**
 * Avatar
 * @example{
 *
 * renderFallbackNode() {return <p>No image</p>}
 *
 * <Avatar>
 *  src="http://dummyimage.com/60x60/000/fff",
 *  alt='some alt text'
 *  imgFallback={this.renderFallbackNode}
 *  size={60}
 *  />
 * @param {string} props.src
 * @param {string} props.altText
 * @imgFallback {function}
 * @returns {Element}
 */
class Avatar extends Component {
  getAvatarImageOrFallbackText(src, altText) {
    return (
      <Image
        src={src}
        alt={altText}
        imgFallback={this.renderImgFallback(altText)}
      />
    );
  }

  getAvatarInitials(name) {
    const words = name.split(' ');
    const firstChar = words[0].charAt(0);
    const secondChar = words[1] ? words[1].charAt(0) : words[0].charAt(1);
    return firstChar + secondChar;
  }

  renderImgFallback(name) {
    return (
      <span className="cbre_placeholder">{this.getAvatarInitials(name)}</span>
    );
  }

  render() {

    const { src, altText, className, cssClass, ...other } = this.props;
    const classes = classNames('external-libraries-avatar-container', cssClass, className);
   

    if (!src && !altText) {
      return null;
    }

    return (
      <div className={classes} {...other}>
        {this.getAvatarImageOrFallbackText(src, altText)}
      </div>
    );
  }
}

Avatar.propTypes = {
  src: PropTypes.string,
  altText: PropTypes.string,
  className: PropTypes.string,
  cssClass: PropTypes.string
};

Avatar.defaultProps = {
  altText: 'avatar',
  cssClass: 'cbre_avatar'
};

export default Avatar;
