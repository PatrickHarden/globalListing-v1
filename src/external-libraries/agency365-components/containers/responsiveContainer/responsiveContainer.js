import React, { Component } from 'react';
import debounce from '../../utils/debounce';

export default function ResponsiveContainer(WrappedComponent) {
  class Breakpoints extends Component {
    constructor(props) {
      super(props);
      this.handleResize = this.handleResize.bind(this);
      this.setBreakpointState = this.setBreakpointState.bind(this);
    }

    componentWillMount() {
      window.addEventListener('resize', this.handleResize);
      this.setBreakpointState();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    setBreakpointState() {
      const isMobile = !!window.matchMedia('(max-width: 767px)').matches;
      const isMobilePortrait = !!window.matchMedia('(max-width: 567px)').matches;
      const isMobileLandscape = !!window.matchMedia(
        '(min-width: 568px) and (max-width: 768px)').matches;
      const isMobileLandscapeAndUp = !!window.matchMedia('min-width: 568px').matches;
      const isTablet = !!window.matchMedia('(min-width: 768px) and (max-width: 1440px)').matches;
      const isTabletAndUp = !!window.matchMedia('(min-width: 768px)').matches;
      const isTabletAndDown = !!window.matchMedia('(max-width: 1024px)').matches;
      const isTabletLandscape = !!window.matchMedia(
        '(min-width: 768px) and (max-width: 1024px)').matches;
      const isTabletLandscapeAndUp = !!window.matchMedia('(min-width: 1024px)').matches;
      const isDesktop = !!window.matchMedia('(min-width: 1024px)').matches;

      this.setState({
        breakpoints: {
          isMobile,
          isMobilePortrait,
          isMobileLandscape,
          isMobileLandscapeAndUp,
          isTablet,
          isTabletAndUp,
          isTabletAndDown,
          isTabletLandscape,
          isTabletLandscapeAndUp,
          isDesktop
        }
      }, this.forceUpdate.bind(this));
    }

    handleResize = debounce(() => {
      this.setBreakpointState();
    }, 250)

    render() {
      return <WrappedComponent {...this.state} {...this.props} />;
    }
  }

  return Breakpoints;
}
