/* eslint-disable no-param-reassign */
// known working 3rd party code
// no need to rewrite it for a rule

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from './Select';
import stripDiacritics from './utils/stripDiacritics';

let requestId = 0;

function initCache(cache) {
  if (cache && typeof cache !== 'object') {
    cache = {};
  }
  return cache || null;
}

function updateCache(cache, input, data) {
  if (!cache) return;
  cache[input] = data;
}

function getFromCache(cache, input) {
  if (cache) {
    for (let i = input.length; i >= 0; --i) {
      const cacheKey = input.slice(0, i);
      if (cache[cacheKey] && (input === cacheKey || cache[cacheKey].complete)) {
        return cache[cacheKey];
      }
    }
  }

  return undefined;
}

function thenPromise(promise, callback) {
  if (!promise || typeof promise.then !== 'function') return undefined;
  return promise.then(
    (data) => {
      callback(null, data);
    },
    (err) => {
      callback(err);
    }
  );
}

const stringOrNode = PropTypes.oneOfType([PropTypes.string, PropTypes.node]);

class Async extends Component {
  getInitialState() {
    return {
      cache: initCache(this.props.cache),
      isLoading: false,
      options: []
    };
  }

  componentWillMount() {
    this._lastInput = '';
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadOptions('');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cache !== this.props.cache) {
      this.setState({
        cache: initCache(nextProps.cache)
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getResponseHandler(input) {
    const _requestId = (this._currentRequestId = requestId++);
    return (err, data) => {
      if (err) throw err;
      if (!this._isMounted) return;
      updateCache(this.state.cache, input, data);
      if (_requestId !== this._currentRequestId) return;
      this.setState({
        isLoading: false,
        options: (data && data.options) || []
      });
    };
  }

  resetState() {
    this._currentRequestId = -1;
    this.setState({
      isLoading: false,
      options: []
    });
  }

  focus() {
    this.select.focus();
  }

  loadOptions(input) {
    if (this.props.onInputChange) {
      const nextState = this.props.onInputChange(input);
      // Note: != used deliberately here to catch undefined and null
      if (nextState != null) {
        input = '' + nextState; // eslint-disable-line prefer-template
      }
    }
    if (this.props.ignoreAccents) input = stripDiacritics(input);
    if (this.props.ignoreCase) input = input.toLowerCase();

    this._lastInput = input;
    if (input.length < this.props.minimumInput) {
      return this.resetState();
    }
    const cacheResult = getFromCache(this.state.cache, input);
    if (cacheResult) {
      return this.setState({
        options: cacheResult.options
      });
    }
    this.setState({
      isLoading: true
    });
    const responseHandler = this.getResponseHandler(input);
    const inputPromise = thenPromise(
      this.props.loadOptions(input, responseHandler),
      responseHandler
    );
    return inputPromise ? inputPromise.then(() => input) : input;
  }

  render() {
    let { noResultsText } = this.props;
    let { isLoading } = this.state;
    const { options } = this.state;
    if (this.props.isLoading) isLoading = true;
    const placeholder = isLoading
      ? this.props.loadingPlaceholder
      : this.props.placeholder;
    if (isLoading) {
      noResultsText = this.props.searchingText;
    } else if (
      !options.length &&
      this._lastInput.length < this.props.minimumInput
    ) {
      noResultsText = this.props.searchPromptText;
    }
    return (
      <Select
        {...this.props}
        ref={(ref) => {
          this.select = ref;
        }}
        isLoading={isLoading}
        noResultsText={noResultsText}
        onInputChange={this.loadOptions}
        options={options}
        placeholder={placeholder}
      />
    );
  }
}

Async.propTypes = {
  cache: PropTypes.any, // object to use to cache results, can be null to disable cache
  ignoreAccents: PropTypes.bool, // whether to strip diacritics when filtering (shared w/ Select)
  ignoreCase: PropTypes.bool, // whether to perform case-insensitive filtering (shared w/ Select)
  isLoading: PropTypes.bool, // overrides the isLoading state when set to true
  loadOptions: PropTypes.func.isRequired, // function to call to load options asynchronously
  loadingPlaceholder: PropTypes.string, // replaces the placeholder while options are loading
  minimumInput: PropTypes.number, // the minimum number of characters that trigger loadOptions
  noResultsText: stringOrNode, // placeholder when no matching search results (shared w/ Select)
  onInputChange: PropTypes.func, // onInputChange handler: function (inputValue) {}
  placeholder: stringOrNode, // field placeholder when there's no value (shared w/ Select)
  searchPromptText: stringOrNode, // label to prompt for search input
  searchingText: PropTypes.string // message to display while options are loading
};

Async.defaultProps = {
  cache: true,
  ignoreAccents: true,
  ignoreCase: true,
  loadingPlaceholder: 'Loading...',
  minimumInput: 0,
  searchingText: 'Searching...',
  searchPromptText: 'Type to search',
  isLoading: false,
  noResultsText: '',
  onInputChange: () => {},
  placeholder: ''
};

export default Async;
