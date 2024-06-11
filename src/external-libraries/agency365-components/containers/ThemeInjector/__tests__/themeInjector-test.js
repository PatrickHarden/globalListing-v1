import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { themeInjector } from 'containers';

describe('Container', function() {
  describe('themeInjector', () => {
    const theme = {
      TestComponent: {
        addedClass: {}
      },
      OtherComponent: {
        notAddedClass: {}
      }
    };

    describe('#render()', function() {
      /** @test {themeInjector#render()} **/

      beforeEach(() => {
        this.Comp = themeInjector(
          class TestComponent extends Component {
            static displayName = 'TestComponent';
            render() {
              return <span />;
            }
          }
        );

        this.WrapperComponent = class extends Component {
          static childContextTypes = {
            reactComponentLibraryTheme: PropTypes.object
          };

          getChildContext() {
            return { reactComponentLibraryTheme: theme };
          }

          render() {
            return <div>{this.props.children}</div>;
          }
        };

        this.wrapper = mount(
          <this.WrapperComponent>
            <this.Comp />
          </this.WrapperComponent>
        );
        this.el = this.wrapper.find('span');
      });

      afterEach(() => {
        this.Comp = undefined;
        this.WrapperComponent = undefined;
        this.wrapper = undefined;
        this.el = undefined;
      });

      it('renders its child component', () => {
        expect(this.el).to.have.length(1);
      });

      it('adds the relevant components theme as a prop', () => {
        const themedComponent = this.wrapper.find('TestComponent').node;
        expect(themedComponent.props.theme).to.deep.equal(theme.TestComponent);
      });
    });
  });
});
