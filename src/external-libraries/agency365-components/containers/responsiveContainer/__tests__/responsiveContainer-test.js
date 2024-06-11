import React, { Component } from 'react';
import { expect } from 'chai';
import { mount, render } from 'enzyme';
import sinon from 'sinon';
import { responsiveContainer } from 'containers';

function getComponent() {
  class TestComponent extends Component {
    static displayName = 'TestComponent';
    render() {
      return (<div />);
    }
  }
  return responsiveContainer(TestComponent);
}

describe('Container', function () {
  /** @test {responsiveContainer#render()} **/
  describe('responsiveContainer', () => {
    let Comp = null;

    beforeEach(() => {
      Comp = getComponent();
    });

    afterEach(() => {
      Comp = undefined;
    });

    describe('#render()', function () {
      it('Ensure breakpoint isTablet, isTabletLandscape, isTabletLandscapeAndUp are set', () => {
        const width = window.innerWidth;
        // This should only work in headless browsers.
        // 1228 is the with set by PhantomJS in karma.conf.js.
        if (width !== 1228) {
          return;
        }

        const wrapper = mount(
          <Comp />
        );

        const breakpoints = wrapper.nodes[0].state.breakpoints;
        expect(breakpoints.isTablet).to.be.true;
        expect(breakpoints.isTabletLandscape).to.be.true;
        expect(breakpoints.isTabletLandscapeAndUp).to.be.true;
      });
    });
  });
});
