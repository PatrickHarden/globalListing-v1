import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ThemeWrapper
 * @example
 *  <ThemeWrapper theme={theme}>
 *    {...}
 *  </ThemeWrapper>
 */
class ThemeWrapper extends Component {
  getChildContext() {
    const { theme } = this.props;

    let finalTheme = {};

    // NOTE From Ryan: 7/17/20: The only theme below that is in use is residential (commercial returns blank, and commercialr3 isn't represented)
    // Browserify does not support injecting themes in this manner.  We need to investigate if this will
    // throw residential websites off

    /*
    switch (theme) {
      case 'testtheme':
        finalTheme = require('../../theme/testtheme/theme');
        break;
      case 'residential':
        finalTheme = require('../../theme/residential/theme');
        break;
      case 'commercial':
        finalTheme = require('../../theme/commercial/theme');
        break;
      default:
    }
    */

    return { reactComponentLibraryTheme: finalTheme };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

ThemeWrapper.propTypes = {
  theme: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

ThemeWrapper.childContextTypes = {
  reactComponentLibraryTheme: PropTypes.object
};

export default ThemeWrapper;
