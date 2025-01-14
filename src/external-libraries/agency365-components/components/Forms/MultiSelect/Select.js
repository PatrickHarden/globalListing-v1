/* eslint-disable react/sort-comp */
// because it's very broken and will never tell you to stop reorganizing the file

/* eslint-disable no-param-reassign */
// known working 3rd party code, no need to rewrite it for a rule

/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/react-select
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';

import defaultArrowRenderer from './utils/defaultArrowRenderer';
import defaultFilterOptions from './utils/defaultFilterOptions';
import defaultMenuRenderer from './utils/defaultMenuRenderer';

import Async from './Async';
import Creatable from './Creatable';
import Option from './Option';
import Value from './Value';

function stringifyValue(value) {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'object') {
    return JSON.stringify(value);
  } else if (value || value === 0) {
    return String(value);
  }
  return '';
}

const stringOrNode = PropTypes.oneOfType([PropTypes.string, PropTypes.node]);

let instanceId = 1;

export default class Select extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      isFocused: false,
      isOpen: false,
      isPseudoFocused: false,
      required: false
    };

    this._scrollToFocusedOptionOnUpdate = false;
    this.hasScrolledToOption = false;

    this.clearValue = this.clearValue.bind(this);
    this.selectValue = this.selectValue.bind(this);
    this.focusOption = this.focusOption.bind(this);
    this.getOptionLabel = this.getOptionLabel.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchEndClearValue = this.handleTouchEndClearValue.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchOutside = this.handleTouchOutside.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseDownOnArrow = this.handleMouseDownOnArrow.bind(this);
    this.handleMouseDownOnMenu = this.handleMouseDownOnMenu.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleValueClick = this.handleValueClick.bind(this);
    this.handleMenuScroll = this.handleMenuScroll.bind(this);
  }

  static propTypes = {
    /* eslint-disable max-len */
    addLabelText: PropTypes.string, // placeholder displayed when you want to add a label on a multi-value input
    'aria-label': PropTypes.string, // Aria label (for assistive tech)
    'aria-labelledby': PropTypes.string, // HTML ID of an element that should be used as the label (for assistive tech)
    arrowRenderer: PropTypes.func, // Create drop-down caret element
    autoBlur: PropTypes.bool, // automatically blur the component when an option is selected
    autofocus: PropTypes.bool, // autofocus the component on mount
    autosize: PropTypes.bool, // whether to enable autosizing or not
    backspaceRemoves: PropTypes.bool, // whether backspace removes an item if there is no text input
    backspaceToRemoveMessage: PropTypes.string, // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
    className: PropTypes.string, // className for the outer element
    clearAllText: stringOrNode, // title for the "clear" control when multi: true
    clearValueText: stringOrNode, // title for the "clear" control
    clearable: PropTypes.bool, // should it be possible to reset value
    delimiter: PropTypes.string, // delimiter to use to join multiple values for the hidden field value
    disabled: PropTypes.bool, // whether the Select is disabled or not
    escapeClearsValue: PropTypes.bool, // whether escape clears the value when the menu is closed
    focusFirstOption: PropTypes.bool, // whether or not to highlight the first option when menu opens
    filterOption: PropTypes.func, // method to filter a single option (option, filterString)
    filterOptions: PropTypes.any, // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
    ignoreAccents: PropTypes.bool, // whether to strip diacritics when filtering
    ignoreCase: PropTypes.bool, // whether to perform case-insensitive filtering
    inputProps: PropTypes.object, // custom attributes for the Input
    inputRenderer: PropTypes.func, // returns a custom input component
    instanceId: PropTypes.string, // set the components instanceId
    isLoading: PropTypes.bool, // whether the Select is loading externally or not (such as options being loaded)
    joinValues: PropTypes.bool, // joins multiple values into a single form field with the delimiter (legacy mode)
    labelKey: PropTypes.string, // path of the label value in option objects
    matchPos: PropTypes.string, // (any|start) match the start or entire string when filtering
    matchProp: PropTypes.string, // (any|label|value) which option property to filter on
    menuBuffer: PropTypes.number, // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
    menuContainerStyle: PropTypes.object, // optional style to apply to the menu container
    menuRenderer: PropTypes.func, // renders a custom menu with options
    menuStyle: PropTypes.object, // optional style to apply to the menu
    multi: PropTypes.bool, // multi-value input
    name: PropTypes.string, // generates a hidden <input /> tag with this field name for html forms
    noResultsText: stringOrNode, // placeholder displayed when there are no matching search results
    onBlur: PropTypes.func, // onBlur handler: function (event) {}
    onBlurResetsInput: PropTypes.bool, // whether input is cleared on blur
    onChange: PropTypes.func, // onChange handler: function (newValue) {}
    onClose: PropTypes.func, // fires when the menu is closed
    onCloseResetsInput: PropTypes.bool, // whether input is cleared when menu is closed through the arrow
    onFocus: PropTypes.func, // onFocus handler: function (event) {}
    onInputChange: PropTypes.func, // onInputChange handler: function (inputValue) {}
    onInputKeyDown: PropTypes.func, // input keyDown handler: function (event) {}
    onMenuScrollToBottom: PropTypes.func, // fires when the menu is scrolled to the bottom; can be used to paginate options
    onOpen: PropTypes.func, // fires when the menu is opened
    onValueClick: PropTypes.func, // onClick handler for value labels: function (value, event) {}
    openAfterFocus: PropTypes.bool, // boolean to enable opening dropdown when focused
    openOnFocus: PropTypes.bool, // always open options menu on focus
    optionClassName: PropTypes.string, // additional class(es) to apply to the <Option /> elements
    optionComponent: PropTypes.func, // option component to render in dropdown
    optionRenderer: PropTypes.func, // optionRenderer: function (option) {}
    options: PropTypes.array, // array of options
    pageSize: PropTypes.number, // number of entries to page when using page up/down keys
    placeholder: stringOrNode, // field placeholder, displayed when there's no value
    required: PropTypes.bool, // applies HTML5 required attribute when needed
    resetValue: PropTypes.any, // value to use when you clear the control
    scrollMenuIntoView: PropTypes.bool, // boolean to enable the viewport to shift so that the full menu fully visible when engaged
    searchable: PropTypes.bool, // whether to enable searching feature or not
    simpleValue: PropTypes.bool, // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
    style: PropTypes.object, // optional style to apply to the control
    tabIndex: PropTypes.string, // optional tab index of the control
    tabSelectsValue: PropTypes.bool, // whether to treat tabbing out while focused to be value selection
    value: PropTypes.any, // initial field value
    valueComponent: PropTypes.func, // value component to render
    valueKey: PropTypes.string, // path of the label value in option objects
    valueRenderer: PropTypes.func, // valueRenderer: function (option) {}
    wrapperStyle: PropTypes.object // optional style to apply to the component wrapper
    /* eslint-enable max-len */
  };

  static defaultProps = {
    addLabelText: 'Add "{label}"?',
    arrowRenderer: defaultArrowRenderer,
    autosize: true,
    backspaceRemoves: true,
    backspaceToRemoveMessage: 'Press backspace to remove {label}',
    clearable: true,
    clearAllText: 'Clear all',
    clearValueText: 'Clear value',
    delimiter: ',',
    disabled: false,
    escapeClearsValue: true,
    focusFirstOption: true,
    filterOptions: defaultFilterOptions,
    ignoreAccents: true,
    ignoreCase: true,
    inputProps: {},
    isLoading: false,
    joinValues: false,
    labelKey: 'label',
    matchPos: 'any',
    matchProp: 'any',
    menuBuffer: 0,
    menuRenderer: defaultMenuRenderer,
    multi: false,
    noResultsText: 'No results found',
    onBlurResetsInput: true,
    onCloseResetsInput: true,
    openAfterFocus: false,
    optionComponent: Option,
    pageSize: 5,
    placeholder: 'Select...',
    required: false,
    scrollMenuIntoView: true,
    searchable: true,
    simpleValue: false,
    tabSelectsValue: true,
    valueComponent: Value,
    valueKey: 'value'
  };

  static Async = Async;

  static Creatable = Creatable;

  componentWillMount() {
    this._instancePrefix = `react-select-${this.props.instanceId ||
      ++instanceId}-`;
    const valueArray = this.getValueArray(this.props.value);

    if (this.props.required) {
      this.setState({
        required: this.handleRequired(valueArray[0], this.props.multi)
      });
    }

    console.log('GmapsAutoComplete - MultiSelect - ComponentWillMount');
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const valueArray = this.getValueArray(nextProps.value, nextProps);

    if (nextProps.required) {
      this.setState({
        required: this.handleRequired(valueArray[0], nextProps.multi)
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isOpen !== this.state.isOpen) {
      this.toggleTouchOutsideEvent(nextState.isOpen);
      const handler = nextState.isOpen ? nextProps.onOpen : nextProps.onClose;
      if (handler) {
        handler();
      }
    }
  }

  componentDidUpdate(prevProps) {
    // focus to the selected option
    if (
      this.menu &&
      this.focused &&
      this.state.isOpen &&
      !this.hasScrolledToOption
    ) {
      const focusedOptionNode = ReactDOM.findDOMNode(this.focused);
      const menuNode = ReactDOM.findDOMNode(this.menu);
      menuNode.scrollTop = focusedOptionNode.offsetTop;
      this.hasScrolledToOption = true;
    } else if (!this.state.isOpen) {
      this.hasScrolledToOption = false;
    }

    if (this._scrollToFocusedOptionOnUpdate && this.focused && this.menu) {
      this._scrollToFocusedOptionOnUpdate = false;
      const focusedDOM = ReactDOM.findDOMNode(this.focused);
      const menuDOM = ReactDOM.findDOMNode(this.menu);
      const focusedRect = focusedDOM.getBoundingClientRect();
      const menuRect = menuDOM.getBoundingClientRect();
      if (
        focusedRect.bottom > menuRect.bottom ||
        focusedRect.top < menuRect.top
      ) {
        menuDOM.scrollTop =
          focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight;
      }
    }

    if (this.props.scrollMenuIntoView && this.menuContainer) {
      const menuContainerRect = this.menuContainer.getBoundingClientRect();
      if (
        window.innerHeight <
        menuContainerRect.bottom + this.props.menuBuffer
      ) {
        window.scrollBy(
          0,
          menuContainerRect.bottom + this.props.menuBuffer - window.innerHeight
        );
      }
    }

    if (!this.state.isOpen) {
      const container = this.refs.valuesContainer;
      const valueElems = container.getElementsByClassName('Select-value');
      const topBaseline = container.getBoundingClientRect().top;

      let count = 0;
      for (let i = 0; i < valueElems.length; i++) {
        if (valueElems[i].getBoundingClientRect().top > topBaseline) count++;
      }

      if (this.state.overflowingValues !== count) {
        //eslint-disable-next-line
        this.setState({
          overflowingValues: count
        });
      }
    }

    if (prevProps.disabled !== this.props.disabled) {
      this.setState({ isFocused: false }); // eslint-disable-line react/no-did-update-set-state
      this.closeMenu();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleTouchOutside);
  }

  getFocusableOptionIndex() {
    const options = this._visibleOptions;
    if (!options.length) return null;

    const focusedOption = this.state.focusedOption;
    if (focusedOption && !focusedOption.disabled) {
      const focusedOptionIndex = options.indexOf(focusedOption);
      if (focusedOptionIndex !== -1) {
        return focusedOptionIndex;
      }
    } else if (this.props.focusFirstOption) {
      for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled) return i;
      }
    }

    return null;
  }

  getFocusedOption() {
    return this._focusedOption;
  }

  getInputValue() {
    return this.state.inputValue;
  }

  getOptionLabel(op) {
    return op[this.props.labelKey];
  }

  getResetValue() {
    if (this.props.resetValue !== undefined) {
      return this.props.resetValue;
    } else if (this.props.multi) {
      return [];
    }
    return null;
  }

  /**
   * Turns a value into an array from the given options
   * @param  {String|Number|Array}  value    - the value of the select input
   * @param  {Object}    nextProps  - optionally specify the nextProps so the
   *   returned array uses the latest configuration
   * @returns  {Array}  the value of the select represented in an array
   */
  getValueArray(value, nextProps) {
    /** support optionally passing in the `nextProps` so `componentWillReceiveProps`
     * updates will function as expected */
    const props = typeof nextProps === 'object' ? nextProps : this.props;
    if (props.multi) {
      if (typeof value === 'string') value = value.split(props.delimiter);
      if (!Array.isArray(value)) {
        if (value === null || value === undefined) return [];
        value = [value];
      }
      return value.map(val => this.expandValue(val, props)).filter(i => i);
    }
    const expandedValue = this.expandValue(value, props);
    return expandedValue ? [expandedValue] : [];
  }

  setValue(value) {
    if (this.props.autoBlur) {
      this.blurInput();
    }
    if (!this.props.onChange) return;
    if (this.props.required) {
      const required = this.handleRequired(value, this.props.multi);
      this.setState({ required });
    }
    if (this.props.simpleValue && value) {
      if (this.props.multi) {
        value = value
          .map(i => i[this.props.valueKey])
          .join(this.props.delimiter);
      } else {
        value = value[this.props.valueKey];
      }
    }
    this.props.onChange(value);
  }

  addValue(value) {
    const valueArray = this.getValueArray(this.props.value);
    this.setValue(valueArray.concat(value));
  }

  blurInput() {
    if (!this.input) return;
    this.input.blur();
  }

  clearValue(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, ignore it.
    if (event && event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    console.log('GmapsAutoComplete = clearValue');
    event.stopPropagation();
    event.preventDefault();
    this.setValue(this.getResetValue());
    this.setState(
      {
        isOpen: false,
        inputValue: ''
      },
      this.focus
    );
  }

  closeMenu() {
    this._focusedOption = null;

    if (this.props.onCloseResetsInput) {
      this.setState({
        isOpen: false,
        focusedOption: this._focusedOption,
        isPseudoFocused: this.state.isFocused && !this.props.multi,
        inputValue: ''
      });
    } else {
      this.setState({
        isOpen: false,
        focusedOption: this._focusedOption,
        isPseudoFocused: this.state.isFocused && !this.props.multi,
        inputValue: this.state.inputValue
      });
    }
    this.hasScrolledToOption = false;
  }

  /**
   * Retrieve a value from the given options and valueKey
   * @param  {String|Number|Array}  value  - the selected value(s)
   * @param  {Object}    props  - the Select component's props (or nextProps)
   */
  expandValue(value, props) {
    if (typeof value !== 'string' && typeof value !== 'number') return value;
    const { options, valueKey } = props;
    if (!options) return undefined;
    for (let i = 0; i < options.length; i++) {
      if (options[i][valueKey] === value) return options[i];
    }
    return undefined;
  }

  filterOptions(excludeOptions) {
    const filterValue = this.state.inputValue;
    const options = this.props.options || [];
    if (this.props.filterOptions) {
      // Maintain backwards compatibility with boolean attribute
      const filterOptions =
        typeof this.props.filterOptions === 'function'
          ? this.props.filterOptions
          : defaultFilterOptions;

      return filterOptions(options, filterValue, excludeOptions, {
        filterOption: this.props.filterOption,
        ignoreAccents: this.props.ignoreAccents,
        ignoreCase: this.props.ignoreCase,
        labelKey: this.props.labelKey,
        matchPos: this.props.matchPos,
        matchProp: this.props.matchProp,
        valueKey: this.props.valueKey
      });
    }

    return options;
  }

  focus() {
    if (!this.input) return;
    this.input.focus();

    if (this.props.openAfterFocus) {
      this.setState({
        isOpen: true
      });
    }
  }

  focusAdjacentOption(dir) {
    const options = this._visibleOptions
      .map((option, index) => ({ option, index }))
      .filter(option => !option.option.disabled);

    this._scrollToFocusedOptionOnUpdate = true;
    if (!this.state.isOpen) {
      this.setState({
        isOpen: true,
        inputValue: '',
        focusedOption:
          this._focusedOption ||
          options[dir === 'next' ? 0 : options.length - 1].option
      });
      return;
    }
    if (!options.length) return;
    let focusedIndex = -1;
    for (let i = 0; i < options.length; i++) {
      if (this._focusedOption === options[i].option) {
        focusedIndex = i;
        break;
      }
    }
    if (dir === 'next' && focusedIndex !== -1) {
      focusedIndex = (focusedIndex + 1) % options.length;
    } else if (dir === 'previous') {
      if (focusedIndex > 0) {
        focusedIndex -= 1;
      } else {
        focusedIndex = options.length - 1;
      }
    } else if (dir === 'start') {
      focusedIndex = 0;
    } else if (dir === 'end') {
      focusedIndex = options.length - 1;
    } else if (dir === 'page_up') {
      const potentialIndex = focusedIndex - this.props.pageSize;
      if (potentialIndex < 0) {
        focusedIndex = 0;
      } else {
        focusedIndex = potentialIndex;
      }
    } else if (dir === 'page_down') {
      const potentialIndex = focusedIndex + this.props.pageSize;
      if (potentialIndex > options.length - 1) {
        focusedIndex = options.length - 1;
      } else {
        focusedIndex = potentialIndex;
      }
    }

    if (focusedIndex === -1) {
      focusedIndex = 0;
    }

    this.setState({
      focusedIndex: options[focusedIndex].index,
      focusedOption: options[focusedIndex].option
    });
  }

  focusEndOption() {
    this.focusAdjacentOption('end');
  }

  focusNextOption() {
    this.focusAdjacentOption('next');
  }

  focusOption(option) {
    this.setState({
      focusedOption: option
    });
  }

  focusPageUpOption() {
    this.focusAdjacentOption('page_up');
  }

  focusPageDownOption() {
    this.focusAdjacentOption('page_down');
  }

  focusPreviousOption() {
    this.focusAdjacentOption('previous');
  }

  focusStartOption() {
    this.focusAdjacentOption('start');
  }

  handleTouchEnd(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;

    // Fire the mouse events
    this.handleMouseDown(event);
  }

  handleTouchEndClearValue(event) {
    // Check if the view is being dragged, In this case
    // we don't want to fire the click event (because the user only wants to scroll)
    if (this.dragging) return;

    // Clear the value
    this.clearValue(event);
  }

  handleTouchMove() {
    // Set a flag that the view is being dragged
    this.dragging = true;
  }

  handleTouchOutside(event) {
    // handle touch outside on ios to dismiss menu
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeMenu();
    }
  }

  handleTouchStart() {
    // Set a flag that the view is not being dragged
    this.dragging = false;
  }

  handleMouseDown(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (
      this.props.disabled ||
      (event.type === 'mousedown' && event.button !== 0)
    ) {
      return undefined;
    }

    if (event.target.tagName === 'INPUT') {
      return undefined;
    }

    // prevent default event handlers
    event.stopPropagation();
    event.preventDefault();

    // for the non-searchable select, toggle the menu
    if (!this.props.searchable) {
      this.focus();
      return this.setState({
        isOpen: !this.state.isOpen
      });
    }

    if (this.state.isFocused) {
      // On iOS, we can get into a state where we think the input is focused but it isn't
      // really, since iOS ignores programmatic calls to input.focus() that weren't
      // triggered by a click event. Call focus() again here to be safe.
      this.focus();

      let input = this.input;
      if (typeof input.getInput === 'function') {
        // Get the actual DOM input if the ref is an <AutosizeInput /> component
        input = input.getInput();
      }

      // clears the value so that the cursor will be at the end of input when the
      // component re-renders
      input.value = '';

      // if the input is focused, ensure the menu is open
      this.setState({
        isOpen: true,
        isPseudoFocused: false
      });
    } else {
      // otherwise, focus the input and open the menu
      this._openAfterFocus = true;
      this.focus();
    }

    return undefined;
  }

  handleMouseDownOnArrow(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (
      this.props.disabled ||
      (event.type === 'mousedown' && event.button !== 0)
    ) {
      return;
    }
    // If the menu isn't open, let the event bubble to the main handleMouseDown
    if (!this.state.isOpen) {
      return;
    }
    // prevent default event handlers
    event.stopPropagation();
    event.preventDefault();
    // close the menu
    this.closeMenu();
  }

  handleMouseDownOnMenu(event) {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (
      this.props.disabled ||
      (event.type === 'mousedown' && event.button !== 0)
    ) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();

    this._openAfterFocus = true;
    this.focus();
  }

  handleInputBlur(event) {
    // The check for menu.contains(activeElement) is necessary to prevent IE11's
    // scrollbar from closing the menu in certain contexts.
    if (
      this.menu &&
      (this.menu === document.activeElement ||
        this.menu.contains(document.activeElement))
    ) {
      this.focus();
      return;
    }

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    this._focusedOption = null;
    const onBlurredState = {
      isFocused: false,
      isOpen: false,
      isPseudoFocused: false,
      focusedOption: this._focusedOption
    };
    if (this.props.onBlurResetsInput) {
      onBlurredState.inputValue = '';
    }
    this.setState(onBlurredState);
  }

  handleInputChange(event) {
    let newInputValue = event.target.value;

    if (
      this.state.inputValue !== event.target.value &&
      this.props.onInputChange
    ) {
      const nextState = this.props.onInputChange(newInputValue);
      // Note: != used deliberately here to catch undefined and null
      if (nextState != null && typeof nextState !== 'object') {
        // prefer-template disabled for performance
        newInputValue = '' + nextState; // eslint-disable-line prefer-template
      }
    }

    this.setState({
      isOpen: true,
      isPseudoFocused: false,
      inputValue: newInputValue
    });
  }

  handleInputFocus(event) {
    const isOpen =
      this.state.isOpen || this._openAfterFocus || this.props.openOnFocus;
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
    this.setState({
      isFocused: true,
      isOpen
    });
    this._openAfterFocus = false;
  }

  handleKeyDown(event) {
    if (this.props.disabled) return;

    if (typeof this.props.onInputKeyDown === 'function') {
      this.props.onInputKeyDown(event);
      if (event.defaultPrevented) {
        return;
      }
    }

    switch (event.keyCode) {
      case 8: // backspace
        if (!this.state.inputValue && this.props.backspaceRemoves) {
          event.preventDefault();
          this.popValue();
        }
        return;
      case 9: // tab
        if (
          event.shiftKey ||
          !this.state.isOpen ||
          !this.props.tabSelectsValue
        ) {
          return;
        }
        this.selectFocusedOption();
        return;
      case 13: // enter
        if (!this.state.isOpen) return;
        event.stopPropagation();
        this.selectFocusedOption();
        break;
      case 27: // escape
        if (this.state.isOpen) {
          this.closeMenu();
          event.stopPropagation();
        } else if (this.props.clearable && this.props.escapeClearsValue) {
          this.clearValue(event);
          event.stopPropagation();
        }
        break;
      case 38: // up
        this.focusPreviousOption();
        break;
      case 40: // down
        this.focusNextOption();
        break;
      case 33: // page up
        this.focusPageUpOption();
        break;
      case 34: // page down
        this.focusPageDownOption();
        break;
      case 35: // end key
        this.focusEndOption();
        break;
      case 36: // home key
        this.focusStartOption();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  handleValueClick(option, event) {
    if (!this.props.onValueClick) return;
    this.props.onValueClick(option, event);
  }

  handleMenuScroll(event) {
    if (!this.props.onMenuScrollToBottom) return;
    const { target } = event;
    if (
      target.scrollHeight > target.offsetHeight &&
      !(target.scrollHeight - target.offsetHeight - target.scrollTop)
    ) {
      this.props.onMenuScrollToBottom();
    }
  }

  handleRequired(value, multi) {
    if (!value) return true;
    return multi ? value.length === 0 : Object.keys(value).length === 0;
  }

  popValue() {
    const valueArray = this.getValueArray(this.props.value);
    if (!valueArray.length) return;
    if (valueArray[valueArray.length - 1].clearableValue === false) return;
    this.setValue(valueArray.slice(0, valueArray.length - 1));
  }

  removeValue(value) {
    const valueArray = this.getValueArray(this.props.value);
    this.setValue(valueArray.filter(i => i !== value));
    this.focus();
  }

  selectFocusedOption() {
    if (this._focusedOption) {
      return this.selectValue(this._focusedOption);
    }
    return undefined;
  }

  selectValue(value) {
    // NOTE: update value in the callback to make sure the input value is empty
    // so that there are no styling issues (Chrome had issue otherwise)
    this.hasScrolledToOption = false;
    if (this.props.multi) {
      this.setState(
        {
          inputValue: '',
          focusedIndex: null
        },
        () => {
          if (value.selected) {
            this.removeValue(value);
          } else {
            this.addValue(value);
          }
          if (this.props.autoBlur) {
            this.blurInput();
          }
        }
      );
    } else {
      this.setState(
        {
          isOpen: false,
          inputValue: '',
          isPseudoFocused: this.state.isFocused
        },
        () => {
          this.setValue(value);
        }
      );
    }
  }

  toggleTouchOutsideEvent(enabled) {
    if (enabled) {
      document.addEventListener('touchstart', this.handleTouchOutside);
    } else {
      document.removeEventListener('touchstart', this.handleTouchOutside);
    }
  }

  renderArrow() {
    const onMouseDown = this.handleMouseDownOnArrow;
    const arrow = this.props.arrowRenderer({ onMouseDown });

    return (
      <span className="Select-arrow-zone" onMouseDown={onMouseDown}>
        {arrow}
      </span>
    );
  }

  renderClear() {
    if (
      !this.props.clearable ||
      (!this.props.value || this.props.value === 0) ||
      (this.props.multi && !this.props.value.length) ||
      this.props.disabled ||
      this.props.isLoading
    ) {
      return undefined;
    }

    return (
      <span
        className="Select-clear-zone"
        title={
          this.props.multi ? this.props.clearAllText : this.props.clearValueText
        }
        aria-label={
          this.props.multi ? this.props.clearAllText : this.props.clearValueText
        }
        onMouseDown={this.clearValue}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEndClearValue}
      >
        <span
          className="Select-clear"
          dangerouslySetInnerHTML={{ __html: '&times;' }}
        />
      </span>
    );
  }

  renderHiddenField(valueArray) {
    if (!this.props.name) return undefined;
    if (this.props.joinValues) {
      const value = valueArray
        .map(i => stringifyValue(i[this.props.valueKey]))
        .join(this.props.delimiter);
      return (
        <input
          type="hidden"
          ref={ref => (this.value = ref)}
          name={this.props.name}
          value={value}
          disabled={this.props.disabled}
        />
      );
    }
    return valueArray.map((item, index) => (
      <input
        key={`hidden.${index}`}
        type="hidden"
        ref={`value${index}`}
        name={this.props.name}
        value={stringifyValue(item[this.props.valueKey])}
        disabled={this.props.disabled}
      />
    ));
  }

  renderInput(valueArray, focusedOptionIndex) {
    if (this.props.inputRenderer) {
      return this.props.inputRenderer();
    }

    const className = classNames(
      'Select-input',
      this.props.inputProps.className
    );
    const isOpen = !!this.state.isOpen;

    const ariaOwns = classNames({
      [`${this._instancePrefix}-list`]: isOpen,
      [`${this._instancePrefix}-backspace-remove-message`]:
        this.props.multi &&
        !this.props.disabled &&
        this.state.isFocused &&
        !this.state.inputValue
    });

    // TODO: Check how this project includes Object.assign()
    const inputProps = Object.assign({}, this.props.inputProps, {
      role: 'combobox',
      'aria-expanded': '' + isOpen, // eslint-disable-line prefer-template
      'aria-owns': ariaOwns,
      'aria-haspopup': '' + isOpen, // eslint-disable-line prefer-template
      'aria-activedescendant': isOpen
        ? `${this._instancePrefix}-option-${focusedOptionIndex}`
        : `${this._instancePrefix}-value`,
      'aria-labelledby': this.props['aria-labelledby'],
      'aria-label': this.props['aria-label'],
      className,
      tabIndex: this.props.tabIndex,
      onBlur: this.handleInputBlur,
      onChange: this.handleInputChange,
      onFocus: this.handleInputFocus,
      ref: ref => (this.input = ref),
      required: this.state.required,
      value: this.state.inputValue
    });

    if (this.props.disabled || !this.props.searchable) {
      const { ...divProps } = this.props.inputProps;
      /* eslint-disable */
      // because can't disable one line inside JSX :(
      return (
        <div
          {...divProps}
          role="combobox"
          aria-expanded={isOpen}
          aria-owns={
            isOpen
              ? `${this._instancePrefix}-list`
              : `${this._instancePrefix}-value`
          }
          aria-activedescendant={
            isOpen
              ? `${this._instancePrefix}-option-${focusedOptionIndex}`
              : `${this._instancePrefix}-value`
          }
          className={className}
          tabIndex={this.props.tabIndex || 0}
          onBlur={this.handleInputBlur}
          onFocus={this.handleInputFocus}
          ref={ref => (this.input = ref)}
          aria-readonly={'' + !!this.props.disabled}
          style={{ border: 0, width: 1, display: 'inline-block' }}
        />
      );
      /* eslint-enable */
    }

    if (this.props.autosize) {
      return <AutosizeInput {...inputProps} minWidth="5px" />;
    }

    return (
      <div className={className}>
        <input {...inputProps} />
      </div>
    );
  }

  renderLoading() {
    if (!this.props.isLoading) return undefined;
    return (
      <span className="Select-loading-zone" aria-hidden="true">
        <span className="Select-loading" />
      </span>
    );
  }

  renderMenu(options, valueArray, focusedOption) {
    if (options && options.length) {
      return this.props.menuRenderer({
        focusedOption,
        focusOption: this.focusOption,
        instancePrefix: this._instancePrefix,
        labelKey: this.props.labelKey,
        onFocus: this.focusOption,
        onSelect: this.selectValue,
        optionClassName: this.props.optionClassName,
        optionComponent: this.props.optionComponent,
        optionRenderer: this.props.optionRenderer || this.getOptionLabel,
        options,
        selectValue: this.selectValue,
        valueArray,
        valueKey: this.props.valueKey
      });
    } else if (this.props.noResultsText) {
      return <div className="Select-noresults">{this.props.noResultsText}</div>;
    }

    return null;
  }

  renderOuter(options, valueArray, focusedOption) {
    const menu = this.renderMenu(options, valueArray, focusedOption);
    if (!menu) {
      return null;
    }

    return (
      <div
        ref={ref => (this.menuContainer = ref)}
        className="Select-menu-outer"
        style={this.props.menuContainerStyle}
      >
        <div
          ref={ref => (this.menu = ref)}
          role="listbox"
          className="Select-menu"
          id={`${this._instancePrefix}-list`}
          style={this.props.menuStyle}
          onScroll={this.handleMenuScroll}
          onMouseDown={this.handleMouseDownOnMenu}
        >
          {menu}
        </div>
      </div>
    );
  }

  renderOverflow() {
    if (this.state.overflowingValues && !this.state.isOpen) {
      return (
        <span className="SelectSuffix SelectSuffix--inline">
          {`+${this.state.overflowingValues} more`}
        </span>
      );
    }
    return null;
  }

  renderValue(valueArray, isOpen) {
    const renderLabel = this.props.valueRenderer || this.getOptionLabel;
    const ValueComponent = this.props.valueComponent;
    if (!valueArray.length) {
      return !this.state.inputValue ? (
        <div className="Select-placeholder">{this.props.placeholder}</div>
      ) : null;
    }
    let onClick = this.props.onValueClick ? this.handleValueClick : null;
    if (this.props.multi) {
      return valueArray.map((value, i) => (
        <ValueComponent
          id={`${this._instancePrefix}-value-${i}`}
          instancePrefix={this._instancePrefix}
          disabled={this.props.disabled || value.clearableValue === false}
          key={`value-${i}-${value[this.props.valueKey]}`}
          onClick={onClick}
          onRemove={this.removeValue}
          value={value}
        >
          {renderLabel(value, i)}
          <span className="Select-aria-only">&nbsp;</span>
        </ValueComponent>
      ));
    } else if (!this.state.inputValue) {
      if (isOpen) onClick = null;
      return (
        <ValueComponent
          id={`${this._instancePrefix}-value-item`}
          disabled={this.props.disabled}
          instancePrefix={this._instancePrefix}
          onClick={onClick}
          value={valueArray[0]}
        >
          {renderLabel(valueArray[0])}
        </ValueComponent>
      );
    }

    return undefined;
  }

  render() {
    const valueArray = this.getValueArray(this.props.value);
    const fOpts = this.props.multi
      ? this.getValueArray(this.props.value)
      : null;
    const options = (this._visibleOptions = this.filterOptions(fOpts));
    let isOpen = this.state.isOpen;
    if (
      this.props.multi &&
      !options.length &&
      valueArray.length &&
      !this.state.inputValue
    ) {
      isOpen = false;
    }
    const focusedOptionIndex = this.getFocusableOptionIndex();

    let focusedOption = null;
    if (focusedOptionIndex !== null) {
      focusedOption = this._focusedOption = options[focusedOptionIndex];
    } else {
      focusedOption = this._focusedOption = null;
    }
    const className = classNames('Select', this.props.className, {
      'Select--multi': this.props.multi,
      'Select--single': !this.props.multi,
      'is-disabled': this.props.disabled,
      'is-focused': this.state.isFocused,
      'is-loading': this.props.isLoading,
      'is-open': isOpen,
      'is-pseudo-focused': this.state.isPseudoFocused,
      'is-searchable': this.props.searchable,
      'has-value': valueArray.length
    });

    let removeMessage = null;
    if (
      this.props.multi &&
      !this.props.disabled &&
      valueArray.length &&
      !this.state.inputValue &&
      this.state.isFocused &&
      this.props.backspaceRemoves
    ) {
      removeMessage = (
        <span
          id={`${this._instancePrefix}-backspace-remove-message`}
          className="Select-aria-only"
          aria-live="assertive"
        >
          {this.props.backspaceToRemoveMessage.replace(
            '{label}',
            valueArray[valueArray.length - 1][this.props.labelKey]
          )}
        </span>
      );
    }

    return (
      <div
        ref={ref => (this.wrapper = ref)}
        className={className}
        style={this.props.wrapperStyle}
      >
        {this.renderHiddenField(valueArray)}
        <div
          ref={ref => (this.control = ref)}
          className="Select-control"
          style={this.props.style}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          onTouchEnd={this.handleTouchEnd}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
        >
          <span
            ref="valuesContainer"
            className="Select-multi-value-wrapper"
            style={{
              paddingRight: this.state.overflowingValues ? '100px' : '0px'
            }}
            id={`${this._instancePrefix}-value`}
          >
            {this.renderValue(valueArray, isOpen)}
            {this.state.overflowingValues ? this.renderOverflow() : ''}
            {this.renderInput(valueArray, focusedOptionIndex)}
          </span>
          {removeMessage}
          {this.renderLoading()}
          {this.renderClear()}
          {this.renderArrow()}
        </div>
        {isOpen
          ? this.renderOuter(
              options,
              !this.props.multi ? valueArray : null,
              focusedOption
            )
          : null}
      </div>
    );
  }
}
