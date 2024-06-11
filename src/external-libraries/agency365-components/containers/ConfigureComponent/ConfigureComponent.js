import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

/**
 * configureComponent
 * @example
 *
 *  configureComponent(MyComponent, '../../');
 */
export default function configureComponent(WrappedComponent, path) {
  // TODO:
  // Why is this required? one of the tests causes WrappedComponent to be undefined
  // for no apparent reason
  if (!WrappedComponent) {
    return 'div';
  }

  return class extends Component {
    static themeName = WrappedComponent.displayName || WrappedComponent.name;

    static propTypes = {
      componentContext: PropTypes.string,
      children: PropTypes.node
    };

    componentDidMount() {
      this.DOMNode = findDOMNode(this);
      const name = WrappedComponent.displayName || WrappedComponent.name;

      if (name && this.DOMNode) {
        this.DOMNode.setAttribute(
          'data-component-path',
          this.getComponentPathAttribute(name)
        );
      }
    }

    getComponentPathAttribute(name) {
      const prefix = path ? `${path}/` : '';
      const suffix = this.props.componentContext
        ? `-${this.props.componentContext}`
        : '';
      return prefix + name + suffix;
    }

    /**
     * @param {Object} props
     * @param {string} props.componentContext
     * @returns {Element}
     */
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
