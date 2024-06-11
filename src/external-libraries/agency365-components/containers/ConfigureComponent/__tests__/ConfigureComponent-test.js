import React, { Component } from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { configureComponent } from 'containers';

function getComponent(path){
  class TestComponent extends Component {
    static displayName = 'TestComponent';
    render() {
      return (<div />);
    }
  }
  return configureComponent(TestComponent, path);
}

describe('Container', function () {
  describe('ComponentPath', () => {

    describe('#render()', function () {
      /** @test {ComponentPath#render()} **/

      it('renders its child component', () => {
        const Comp = getComponent();
        const wrapper = mount(
          <Comp />
        );
        const div = wrapper.find('div');
        expect(div).to.have.length(1);
      });

      it('adds a data attribute to the component element equivalent to the component display name', () => {
        const Comp = getComponent();
        const wrapper = mount(
          <Comp />
        );
        const div = wrapper.find('div');
        expect(div.node.dataset).to.have.property('componentPath', 'TestComponent');
      });

      it('adds the filepath to the data attribute if received as an argument', () => {
        const Comp = getComponent('file/path');
        const wrapper = mount(
          <Comp />
        );
        const div = wrapper.find('div');
        expect(div.node.dataset).to.have.property('componentPath', 'file/path/TestComponent');
      });

      it('adds a suffix to the data attribute if the wrapped component contains a componentContext property', () => {
        const Comp = getComponent();
        const wrapper = mount(
          <Comp componentContext="context" />
        );
        const div = wrapper.find('div');
        expect(div.node.dataset).to.have.property('componentPath', 'TestComponent-context');
      });
    });

  });
});
