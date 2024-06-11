import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

const LazyLoader = ({ disable, ...inheritProps }) => disable ? <span {...inheritProps} /> : <LazyLoad {...inheritProps} />;

LazyLoader.propTypes = {
    disable: PropTypes.bool
};

LazyLoader.defaultProps = {
    disable: false
};

export default LazyLoader;
