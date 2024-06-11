import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Image
 * @example
 *
 * <Image>
 *  src="http://dummyimage.com/60x60/000/fff"
 *  fallback=
 *  />
 */
class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoaded: false,
      imgError: false
    };
  }

  setImageError = (onError) => {
    this.setState(
      {
        imgError: true
      },
      onError
    );
  };

  setImageLoaded = () => {
    this.setState({
      imgLoaded: true
    });
  };

  renderImgFallback() {
    const { imgFallback, width, height } = this.props;

    if (imgFallback) {
      return imgFallback;
    }

    // Some default fallback dimensions.
    let imgWidth = 600;
    let imgHeight = 450;

    if (width && height) {
      imgWidth = width;
      imgHeight = height;
    }

    return (
      <img
        alt={'No asset available'}
        src={`https://dummyimage.com/${imgWidth}x${imgHeight}/cccccc/ffffff.jpg&text=No+Image`}
      />
    );
  }

  render() {
    const { src, alt, onError, ...other } = this.props;

    const { imgError, imgLoaded } = this.state;

    if (imgError) {
      return this.renderImgFallback();
    }

    const imgStyle = imgLoaded
      ? {}
      : { marginTop: '-100%', textIndent: '-9999px' };

    return (
      <div>
        {imgLoaded ? null : this.renderImgFallback()}
        <img
          style={imgStyle}
          src={src}
          alt={alt}
          onError={() => this.setImageError(onError)}
          onLoad={this.setImageLoaded}
        />
      </div>
    );
  }
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onError: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  imgFallback: PropTypes.node
};

Image.defaultProps = {
  onError: () => {}
};

export default Image;
