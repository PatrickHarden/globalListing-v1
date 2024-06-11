import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import GmapsAutoComplete from '../GmapsAutoComplete';

describe('Component', () => {
  describe('GmapsAutoComplete', () => {
    let props;

    const suggestion = {
      description: 'description',
      place_id: 'ab123'
    };
    let wrapper;

    /** @test {GmapsAutoComplete} **/
    describe('#render()', function () {
      props = {
        onSuggestion: sinon.spy(),
        onSuggestionSelected: sinon.spy(),
        onInit: sinon.spy()
      };

      beforeEach(function () {
        wrapper = mount(
          <GmapsAutoComplete {...props} />
        );
        sinon.stub(wrapper.node, 'searchSuggestions').returns([suggestion]);
      });

      afterEach(function () {
        wrapper = undefined;
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('renders an input component', () => {
        expect(wrapper.find('input').length).to.equal(1);
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('renders as disabled if disabled prop is true', () => {
        wrapper = mount(
          <GmapsAutoComplete disabled={true} />
        );

        expect(wrapper.find('.is-disabled').length).to.equal(1);
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('sets initial suggestions', () => {
        setTimeout(() => {
          expect(wrapper.node.state.suggestions).to.equal([suggestion]);
        });
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('calls the onSuggestion callback', () => {
        setTimeout(() => {
          expect(props.onSuggestion.called).to.equal(true);
        });
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('sets initialSearchDone to true', () => {
        setTimeout(() => {
          expect(wrapper.node.state.initialSearchDone).to.equal(true);
        });
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('calls onInit once', () => {
        setTimeout(() => {
          expect(wrapper.node.props.onInit.calledOnce).to.be(true);
        })
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('hides the dropdown component initially', () => {
        expect(wrapper.find('Select-menu-outer').length).to.equal(0);
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('on focus it renders a dropdown with suggestions', () => {
        wrapper.simulate('focus');
        setTimeout(() => {
          expect(wrapper.find('Select-menu-outer').length).to.equal(1);
        });
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('on focus it selects the input text', () => {
        const input = wrapper.find('input')
        input.value = 'test';
        wrapper.simulate('focus');
        setTimeout(() => {
          expect(input.selectionEnd).to.equal(4);
        });
      });

      /** @test {GmapsAutoComplete#render()} **/
      it('on blur it hides the dropdown after a delay', () => {
        expect(wrapper.find('Select-menu-outer').length).to.equal(0);
        wrapper.simulate('focus');
        setTimeout(() => {
          expect(wrapper.find('Select-menu-outer').length).to.equal(1);
          wrapper.simulate('blur');
          setTimeout(() => {
            expect(wrapper.find('Select-menu-outer').length).to.equal(0);
          }, 100);
        });
      });

      /** @test {GmapsAutoComplete#updateSuggestions()} **/
      it('populates the suggestions state item', () => {
        wrapper.node.updateSuggestions([suggestion]);
        setTimeout(() => {
          expect(wrapper.state.suggestions).to.equal([suggestion]);
        });
      });

    });

  });

});
