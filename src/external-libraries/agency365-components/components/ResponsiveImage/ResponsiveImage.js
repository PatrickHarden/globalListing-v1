import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image/Image';

/**
 * ResponsiveImage
 * @example
 *
 * <ResponsiveImage
 *    srcSetArray=[
 *      {
 *        breakpoint: 'small',
 *        width: 500,
 *        uri: 'http://...'
 *      },
 *      {
 *        breakpoint: 'medium',
 *        width: 1000,
 *        uri: 'http://...'
 *      },
 *      {
 *        breakpoint: 'large',
 *        width: 2000,
 *        uri: 'http://...'
 *      }
 *    ]
 *    alt="image"
 * />
 * @param {Object} props
 * @param {!array} props.srcSetArray
 * @param {!string} props.alt
 * @param {object} props.breakpoints
 * @returns {Element}
 */
function ResponsiveImage(props) {
  const { srcSetArray, breakpoints, alt, ...other } = props;

  let srcSet = [];
  let sizes = [];
  let smallSize;
  let smallImg = srcSetArray[0] || {};

  srcSetArray.forEach((img) => {
    // srcset images
    srcSet.push(`${img.uri} ${img.width}w`);

    // sizes values
    if (breakpoints) {
      sizes.push(`(min-width: ${breakpoints[img.breakpoint]}) ${img.width}px`);
    }

    if (img.breakpoint === 'small') {
      // fallback src
      smallImg = img;

      if (breakpoints) {
        smallSize = `, ${img.width}px`;
      }
    }
  });

  srcSet = srcSet.join();
  sizes = sizes.length ? sizes.join().concat(smallSize) : null;

  return (
    <Image
      src={smallImg.uri}
      srcSet={srcSet}
      alt={alt}
      sizes={sizes}
      {...other}
    />
  );
}

ResponsiveImage.propTypes = {
  srcSetArray: PropTypes.arrayOf(
    PropTypes.shape({
      breakpoint: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
      width: PropTypes.number.isRequired,
      uri: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  alt: PropTypes.string.isRequired,
  breakpoints: PropTypes.shape({
    small: PropTypes.string.isRequired,
    medium: PropTypes.string.isRequired,
    large: PropTypes.string.isRequired
  })
};

export default ResponsiveImage;
