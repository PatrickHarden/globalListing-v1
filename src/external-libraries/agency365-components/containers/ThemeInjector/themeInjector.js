import React, { Component } from 'react';
import PropTypes from 'prop-types';

function themeInjectorDecorator(ChildComponent) {
  class ThemeInjector extends Component {
    static defaultProps = {
      theme: {}
    };

    render() {
      const compName =
        ChildComponent.themeName ||
        ChildComponent.displayName ||
        ChildComponent.name;

      const { reactComponentLibraryTheme } = this.context;
      let themeFromContext = {};

      if (
        reactComponentLibraryTheme &&
        reactComponentLibraryTheme[compName] !== undefined
      ) {
        themeFromContext = reactComponentLibraryTheme[compName];
      }

      const styles = Object.assign({}, themeFromContext, this.props.theme);
      const props = Object.assign({}, this.props, { theme: styles });

      return <ChildComponent {...props} />;
    }
  }

  ThemeInjector.propTypes = {
    theme: PropTypes.object
  };

  ThemeInjector.contextTypes = {
    reactComponentLibraryTheme: PropTypes.object
  };

  return ThemeInjector;
}

export default themeInjectorDecorator;
