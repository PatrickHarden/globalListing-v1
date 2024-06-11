import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import AutoCompleteItem from './AutoCompleteItem';
import classNames from 'classnames';
import debounce from '../../../utils/debounce';
import CachedPlaces from '../../../../../utils/cachedPlaces'

let _ = require('lodash');

/**
 * GmapsAutoComplete - requires the google maps API to be preloaded
 * @example
 * <GmapsAutoComplete />
 *
 * @param {Object} props
 * @param {string} props.className
 * @param {string} props.initialValue
 * @param {string} props.placeholder - Default: 'Search places'
 * @param {object} props.location - a Gmaps LatLng or equivalent
 * @param {function} props.onInit
 * @param {function} props.onSuggestionSelected
 * @param {object} props.componentRestrictions
 * @param {array} props.types
 * @param {number} props.radius
 * @param {boolean} props.autoSelect - Default: true
 * @returns {Element}
 */
class GmapsAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.debouncedShowSuggestions = debounce(this.showSuggestions, 500);
    this.state = {
      isSuggestionsHidden: true,
      isFocused: false,
      userInput: props.initialValue,
      activeSuggestion: null,
      selectedSuggestion: null,
      initialSearchDone: !props.initialValue.length,
      suggestions: [],
      geocoder: new props.gmaps.Geocoder(),
      autocompleteService: new props.gmaps.places.AutocompleteService()
    };
  }

  componentDidMount() {
    this.searchSuggestions();
    this.props.subscribe(true, this.onSubscribedChange);
  }

  componentWillUnmount() {
    this.props.subscribe(false, this.onSubscribedChange);
  }

  onSubscribedChange = (newLocation) => {
    const { initialSearchDone, selectedSuggestion } = this.state;
    if (!initialSearchDone && selectedSuggestion && (newLocation.label !== selectedSuggestion.label)) {
      this.selectSuggestion(newLocation);
    }
  };

  onInputChange = () => {
    const userInput = this.geosuggestInput.value;
    this.setState(
      {
        userInput
      },
      this.debouncedShowSuggestions
    );
  };

  onInputKeyDown = (e) => {
    switch (e.which) {
      case 40:
        // DOWN
        e.preventDefault();
        this.activateSuggestion('next');
        break;
      case 38:
        // UP
        e.preventDefault();
        this.activateSuggestion('prev');
        break;
      case 13:
        // ENTER
        this.selectSuggestion(this.state.activeSuggestion);
        break;
      case 9:
        // TAB
        this.selectSuggestion(this.state.activeSuggestion);
        break;
      case 27:
        // ESC
        this.hideSuggestions();
        break;
      default:
        break;
    }
  };

  setInputRef = (ref) => {
    this.geosuggestInput = findDOMNode(ref);
  };

  getSuggestionItems = () => {
    const {
      suggestions,
      activeSuggestion,
      selectedSuggestion,
      userInput
    } = this.state;

    return suggestions.map((suggestion) => {
      let isActive =
        activeSuggestion && suggestion.placeId === activeSuggestion.placeId;
      if (!isActive) {
        isActive =
          selectedSuggestion &&
          suggestion.placeId === selectedSuggestion.placeId;
      }

      return (
        <AutoCompleteItem
          key={suggestion.placeId}
          suggestion={suggestion}
          isActive={isActive}
          userInput={userInput}
          onSuggestionSelect={this.selectSuggestion}
          className="Select-option"
        />
      );
    });
  };
   
  cachedLookup = (query, useCachedPlaces, suggestion, callback) => {

    let cached = this;
    const config = this.props.ConfigStore.getConfig();

    const placeEndPoint = useCachedPlaces.placeEndpoint;
    const locationEndPoint = useCachedPlaces.locationEndPoint;
    
    const countryCode = config.hasOwnProperty("countryCode") ? config.countryCode : ""

    let lookUp = { address: query.placeId };
    lookUp = useCachedPlaces ? { address: query.address, endpoint: placeEndPoint + "?placeId=" + query.placeId + "&countryCode=" + countryCode } : lookUp;


    CachedPlaces.lookup(lookUp, function (result) {
      
      if (typeof result.location !== 'undefined') {
        const mapsObject = result;
        const location = mapsObject.location;

        const _suggestion = suggestion;
        _suggestion.gmaps = mapsObject.gmaps;
        _suggestion.location = {
          lat: location.lat,
          lng: location.lng
        };          

        cached.setState(
          {
            initialSearchDone: true,
            isFocused: false,
            isSuggestionsHidden: true,
            userInput: _suggestion.label,
            selectedSuggestion: _suggestion
          }
        );
        // If fav properties screen geosuggestinput will not be visible, thrown null pointer exception
        if(cached.geosuggestInput){
        cached.geosuggestInput.blur();
        }
        callback(_suggestion);
      }
    });

  }

  geocoderLookup = (gmaps, query, suggestion, callback) => {
    const { geocoder } = this.state;

    geocoder.geocode(query, (results, status) => {
      if (status !== gmaps.GeocoderStatus.OK) {
        return;
      }

      const mapsObject = results[0];
      const location = mapsObject.geometry.location;

      const _suggestion = suggestion;
      _suggestion.gmaps = mapsObject;
      _suggestion.location = {
        lat: encodeURIComponent(location.lat()),
        lng: encodeURIComponent(location.lng())
      };

      this.setState(
        {
          initialSearchDone: true,
          isFocused: false,
          isSuggestionsHidden: true,
          userInput: _suggestion.label,
          selectedSuggestion: _suggestion
        },
        () => {
          this.geosuggestInput && this.geosuggestInput.blur();
          callback(_suggestion);
        }
      );
    });    
  }

  selectSuggestion = (
    suggestion = {
      label: this.state.userInput
    },
    init
  ) => {

    const { gmaps, onInit, onSuggestionSelected } = this.props;
    const { placeId, label } = suggestion;
    const config = this.props.ConfigStore.getConfig();
    const features = config.features;
    const useCachedPlaces = features && features.hasOwnProperty("useCachedPlaces") && features.useCachedPlaces.enabled == true ? features.useCachedPlaces : null;
    const callback = init ? onInit : onSuggestionSelected;

    if (!placeId && !label) {
      return;
    }

    const query = placeId
      ? {
        placeId
      }
      : {
        address: label
      };

    if (useCachedPlaces) {
      this.cachedLookup(query, useCachedPlaces, suggestion, callback);
    } else { // fallback to geocoder      
      this.geocoderLookup(gmaps, query, suggestion, callback);
    }
  };

  activateSuggestion = (direction) => {
    const { isSuggestionsHidden, suggestions, activeSuggestion } = this.state;

    if (isSuggestionsHidden) {
      this.showSuggestions();
      return;
    }

    const suggestionsCount = suggestions.length - 1;
    const next = direction === 'next';
    let newActiveSuggestion = null;
    let newIndex = 0;
    let i = 0;

    for (i; i <= suggestionsCount; i++) {
      if (suggestions[i] === activeSuggestion) {
        newIndex = next ? i + 1 : i - 1;
      }
    }

    if (!activeSuggestion) {
      newIndex = next ? 0 : suggestionsCount;
    }

    if (newIndex >= 0 && newIndex <= suggestionsCount) {
      newActiveSuggestion = suggestions[newIndex];
    }

    this.setState({
      activeSuggestion: newActiveSuggestion
    });
  };

  showSuggestions = (select) => {
    this.searchSuggestions(() => {
      this.setState(
        {
          isFocused: true,
          isSuggestionsHidden: !this.state.suggestions.length
        },
        () => {
          if (select && this.props.autoSelect) {
            const input = this.geosuggestInput;
            input.focus();
            setTimeout(() => {
              input.setSelectionRange(0, input.value.length);
            }, 10);
          }
        }
      );
    });
  };

  hideSuggestions = () => {
    setTimeout(() => {
      this.setState({
        isFocused: false,
        isSuggestionsHidden: true
      });
      this.geosuggestInput.value = '';
    }, 100);
  };

  updateSuggestions = (gSuggestions = [], callback = () => { }) => {
    const suggestions = [];

    gSuggestions.forEach((suggestion) => {
      suggestions.push({
        label: suggestion.description,
        placeId: suggestion.place_id
      });
    });

    if (!this.state.initialSearchDone) {
      this.selectSuggestion(suggestions[0], true);
    }

    this.setState(
      {
        suggestions
      },
      callback
    );
  };

  searchSuggestions = (callback = () => { }) => {
    const { userInput: input, autocompleteService } = this.state;

    const {
      location,
      radius,
      gmaps,
      types,
      componentRestrictions
    } = this.props;

    if (!input) {
      this.updateSuggestions([], callback);
      return;
    }

    autocompleteService.getPlacePredictions(
      {
        input,
        types,
        componentRestrictions,
        location: location || new gmaps.LatLng(0, 0),
        radius
      },
      (suggestions) => {
        if (suggestions) {
          this.updateSuggestions(suggestions, callback);
        } else {
          callback();
        }
      }
    );
  };

  render() {

    const { className, placeholder, disabled } = this.props;

    const {
      isSuggestionsHidden,
      isFocused,
      userInput,
      initialSearchDone
    } = this.state;

    const hidePlaceholder = !placeholder || userInput || isFocused;
    const hideValue = (placeholder && !userInput) || isFocused;

    const placeholderMarkup =
      !initialSearchDone || hidePlaceholder ? null : (
        <div className={classNames(['external-libraries-gmaps-autocomplete-placeholder', 'Select-placeholder'])}>
          {placeholder}{' '}
        </div>
      );

    const valueMarkup =
      !initialSearchDone || hideValue ? null : (
        <div className={classNames(['external-libraries-gmaps-autocomplete-value', 'Select-value'])}>
          <span
            className={classNames(['external-libraries-gmaps-autocomplete-value-label', 'Select-value-label'])}
          >
            {userInput}{' '}
          </span>{' '}
        </div>
      );

    const selectMenuMarkup = isSuggestionsHidden ? null : (
      <div className={classNames(['external-libraries-gmaps-autocomplete-menu_outer', 'Select-menu-outer'])}>
        <div className={classNames(['external-libraries-gmaps-autocomplete-menu', 'Select-menu'])}>
          {this.getSuggestionItems()}{' '}
        </div>{' '}
      </div>
    );

    const classes = [
      'external-libraries-gmaps-autocomplete-container',
      className,
      isFocused && 'is-focused',
      !isSuggestionsHidden && 'is-open',
      disabled && 'is-disabled'
    ];

    const inputVal = isFocused ? userInput : '';

    return (
      <div className={classNames(classes)}>
        <div
          className={classNames(['external-libraries-gmaps-autocomplete-control', 'Select-control'])}
          onClick={() => this.geosuggestInput.focus()}
        >
          <span className="Select-multi-value-wrapper">
            {placeholderMarkup}
            {valueMarkup}
            <div className={classNames(['external-libraries-gmaps-autocomplete-input', 'Select-input'])}>
              <input
                ref={ref => this.setInputRef(ref)}
                onChange={this.onInputChange}
                onFocus={() => {
                  this.showSuggestions(true);
                }}
                onBlur={this.hideSuggestions}
                onKeyDown={this.onInputKeyDown}
                type="text"
                value={inputVal}
                disabled={disabled}
              />{' '}
            </div>{' '}
          </span>{' '}
        </div>

        {selectMenuMarkup}
      </div>
    );
  }
}
GmapsAutoComplete.propTypes = {
  className: PropTypes.string,
  gmaps: PropTypes.object,
  initialValue: PropTypes.string,
  placeholder: PropTypes.node,
  location: PropTypes.object,
  radius: PropTypes.number,
  onInit: PropTypes.func,
  onSuggestionSelected: PropTypes.func,
  types: PropTypes.array,
  componentRestrictions: PropTypes.object,
  subscribe: PropTypes.func,
  autoSelect: PropTypes.bool,
  disabled: PropTypes.bool
};

GmapsAutoComplete.defaultProps = {
  gmaps: google && google.maps, // eslint-disable-line
  radius: 0,
  initialValue: '',
  placeholder: 'Search places',
  onInit: () => { },
  onSuggestionSelected: () => { },
  subscribe: () => { },
  autoSelect: true,
  disabled: false,
  location: {},
  className: '',
  types: [],
  componentRestrictions: {}
};

export default GmapsAutoComplete;
