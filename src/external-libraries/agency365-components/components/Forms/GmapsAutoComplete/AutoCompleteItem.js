import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeStringRegexp from 'escape-string-regexp';
import classNames from 'classnames';

/**
 * AutoCompleteItem
 * Sub-component of GmapsAutoComplete
 */
class AutoCompleteItem extends Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.highlightInputText = this.highlightInputText.bind(this);
    this.state = {
      isFocused: false
    };
  }

  onMouseEnter() {
    this.setState({ isFocused: true });
  }

  onMouseLeave() {
    this.setState({ isFocused: false });
  }

  onMouseDown = (e) => {
    const { onSuggestionSelect, suggestion } = this.props;
    e.preventDefault(this);
    onSuggestionSelect(suggestion);
  };

  highlightInputText(text) {
    const inputString = escapeStringRegexp(this.props.userInput);
    const regexp = new RegExp(`(${inputString})`, 'i');
    return {
      __html: text.replace(
        regexp,
        '<span class="external-libraries-auto-complete-item-highlighted highlight">$1</span>'
      )
    };
  }

  render() {
    const { className, suggestion, isActive } = this.props;

    const { isFocused } = this.state;

    const classes = [
      'external-libraries-auto-complete-item-container',
      className,
      isActive && 'external-libraries-auto-complete-item-isActive',
      isFocused && 'external-libraries-auto-complete-item-isFocused',
      isActive && 'is-selected',
      isFocused && 'is-focused'
    ];

    let content = {
      dangerouslySetInnerHTML: this.highlightInputText(suggestion.label)
    };

    let label;
    if (isActive) {
      content = {};
      label = suggestion.label;
    }

    return (
      <div
        className={classNames(classes)}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onFocus={this.onMouseEnter}
        onBlur={this.onMouseLeave}
        {...content}
      >
        {label}
      </div>
    );
  }
}

AutoCompleteItem.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
  suggestion: PropTypes.object,
  onSuggestionSelect: PropTypes.func,
  userInput: PropTypes.string
};

AutoCompleteItem.defaultProps = {
  isActive: false,
  userInput: '',
  suggestion: {
    label: ''
  },
  onSuggestionSelect: () => {},
  className: ''
};

export default AutoCompleteItem;
