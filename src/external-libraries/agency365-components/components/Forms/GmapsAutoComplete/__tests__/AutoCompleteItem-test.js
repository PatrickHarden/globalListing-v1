import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import AutoCompleteItem from '../AutoCompleteItem';

describe('Component', () => {
  describe('AutoCompleteItem', () => {
    const props = {
      suggestion: {
        label: 'suggestion'
      }
    };

    const highlighted = 'sug</span>';
    const regexHighlighted = 's(ug</span>';

    /** @test {AutoCompleteItem} **/
    describe('#render()', function () {
      /** @test {AutoCompleteItem#render()} **/
      it('renders a div component', () => {
        const wrapper = shallow(
          <AutoCompleteItem />
        );
        expect(wrapper.node.type).to.equal('div');
      });

      it('renders the label text from its suggestion prop', () => {
        const wrapper = shallow(
          <AutoCompleteItem {...props} />
        );
        expect(wrapper.node.props.dangerouslySetInnerHTML.__html).to.contain(props.suggestion.label);
      });

      it('highlights user input inside its text', () => {
        const wrapper = shallow(
          <AutoCompleteItem {...props} userInput="sug" />
        );
        expect(wrapper.node.props.dangerouslySetInnerHTML.__html).to.contain(highlighted);
      });

      it('handles regex control characters in input', () => {
        props.suggestion.label = 's(uggestion';
        const wrapper = shallow(
          <AutoCompleteItem {...props} userInput="s(ug" />
        );
        expect(wrapper.node.props.dangerouslySetInnerHTML.__html).to.contain(regexHighlighted);
      });

      it('calls its handler method on mouseDown', () => {
        const onSuggestionSelect = sinon.spy();
        const wrapper = mount(
          <AutoCompleteItem {...props} onSuggestionSelect={onSuggestionSelect} />
        );
        wrapper.simulate('mouseDown');
        expect(onSuggestionSelect.calledOnce).to.be.true;
      });
    });

  });

});
