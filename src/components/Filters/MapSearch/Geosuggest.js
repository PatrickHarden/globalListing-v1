var React = require('react'),
    ReactDOM = require('react-dom'),
    GeosuggestItem = require('./GeosuggestItem'),
    StoresMixin = require('../../../mixins/StoresMixin'),
    createReactClass = require('create-react-class'),
    { debounce } = require('../../../external-libraries/agency365-components/components');

var Geosuggest = createReactClass({
    displayName: 'Geosuggest',

    mixins: [StoresMixin],

    /**
     * Get the default props
     * @return {Object} The state
     */
    getDefaultProps: function () {
        return {
            fixtures: [],
            initialValue: '',
            placeholder: 'Search places',
            className: '',
            onSuggestSelect: function onSuggestSelect() { },
            onSuggest: function onSuggest() { },
            location: null,
            radius: 0,
            googleMaps: window.google ? google.maps : { maps: {} }
        };
    },

    /**
     * Get the initial state
     * @return {Object} The state
     */
    getInitialState: function () {
        return {
            isSuggestsHidden: true,
            userInput: this.props.initialValue,
            activeSuggest: null,
            suggests: [],
            geocoder: new this.props.googleMaps.Geocoder(),
            autocompleteService: new this.props.googleMaps.places.AutocompleteService(),
            searchSuggestDebounce: this.getSearchSuggestDebounce()
        }
    },

    componentDidMount() {
        if (!context.stores.ConfigStore.getFeatures().enablePropertyIdSearch) {
            this.showSuggests = debounce(this.showSuggests, 300);
            this.getPropertiesById = debounce(this.getPropertiesById, 500);
            this.searchSuggests = debounce(this.searchSuggests, this.state.searchSuggestDebounce);
        }
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            userInput: nextProps.initialValue
        });
    },

    /**
     * Get SearchSuggestDebounce from config or return default
     */
    getSearchSuggestDebounce: function () {
        var _default = 300;

        // Attempt to get config, return if found
        var _configSearchSuggestDebounce = this.getSearchStateStore().getItem('searchSuggestDebounce');
        if (_configSearchSuggestDebounce !== undefined && _configSearchSuggestDebounce !== null) {
            return _configSearchSuggestDebounce;
        }

        // No config was found, return the default
        return _default;
    },

    /**
     * When the input got changed
     */
    onInputChange: function () {
        var userInput = ReactDOM.findDOMNode(this.refs.geosuggestInput).value;
        const features = context.stores.ConfigStore.getFeatures();

        const defaultRegex = '^([a-zA-Z0-9]){6,}$';
        const isPropertyId = new RegExp(defaultRegex, 'i');

        if (features.enablePropertyIdSearch && isPropertyId.test(userInput)) {
            const suffixes = context.stores.ParamStore.getParam('PropertyDefaultEnumerationSuffixes') || [''];
            const countryPrefix = context.stores.ConfigStore.getItem('siteId').substring(0, 3).toUpperCase();
            const propertyIds = userInput.toLowerCase().includes(countryPrefix.toLowerCase())
                ? suffixes.map(suffix => `${userInput}${suffix}`).join()
                : suffixes.map(suffix => `${countryPrefix}${userInput}${suffix}`).join();

            this.setState(
                { userInput: userInput },
                function () {
                    this.getPropertiesById(propertyIds);
                }.bind(this)
            );
        } else {
            this.setState(
                { userInput: userInput },
                function () {
                    this.showSuggests();
                }.bind(this)
            );
        }

        if (this.props.inputChangeCallback) {
            this.props.inputChangeCallback(userInput);
        }
    },

    /**
     * Search for new suggests
     */
    searchSuggests: function () {
        if (!this.state.userInput) {
            this.updateSuggests();
            return;
        }

        this.state.autocompleteService.getPlacePredictions(
            {
                input: this.state.userInput,
                types: this.props.types,
                componentRestrictions: this.props.componentRestrictions,
                location:
                    this.props.location ||
                    new this.props.googleMaps.LatLng(0, 0),
                radius: this.props.radius
            },
            function (suggestsGoogle) {
                this.updateSuggests(suggestsGoogle);
            }.bind(this)
        );
    },

    /**
     * Update the suggests
     * @param  {Object} suggestsGoogle The new google suggests
     */
    updateSuggests: function (suggestsGoogle) {
        if (!suggestsGoogle) {
            suggestsGoogle = [];
        }

        var suggests = [],
            regex = new RegExp(this.state.userInput, 'gim');

        this.props.fixtures.forEach(function (suggest) {
            if (suggest.label.match(regex)) {
                suggest.placeId = suggest.label;
                suggests.push(suggest);
            }
        });

        suggestsGoogle.forEach(function (suggest) {
            suggests.push({
                label: suggest.description,
                placeId: suggest.place_id
            });
        });

        if (suggests.length) {
            this.geocodeSuggest(suggests[0], true);
        } else {
            this.props.onSuggest();
        }

        this.setState({ suggests: suggests });
    },

    /**
     * When the input gets focused
     */
    selectAllText: function () {
        document.getElementsByClassName('geosuggest__input')[0].select();
    },

    /**
     * When input is changed
     */
    showSuggests: function () {
        this.searchSuggests();
        this.setState({ isSuggestsHidden: false });
    },

    /**
     * When the input loses focused
     */
    hideSuggests: function () {
        setTimeout(
            function () {
                this.setState({ isSuggestsHidden: true });
            }.bind(this),
            100
        );
    },

    /**
     * When a key gets pressed in the input
     * @param  {Event} event The keypress event
     */
    onInputKeyDown: function (event) {
        switch (event.which) {
            case 40:
                // DOWN
                event.preventDefault();
                this.activateSuggest('next');
                break;
            case 38:
                // UP
                event.preventDefault();
                this.activateSuggest('prev');
                break;
            case 13:
                // ENTER
                this.selectSuggest(this.state.activeSuggest);
                break;
            case 9:
                // TAB
                this.selectSuggest(this.state.activeSuggest);
                break;
            case 27:
                // ESC
                this.hideSuggests();
                break;
            default:
                break;
        }
    },

    /**
     * Activate a new suggest
     * @param {String} direction The direction in which to activate new suggest
     */
    activateSuggest: function (direction) {
        if (this.state.isSuggestsHidden) {
            this.showSuggests();
            return;
        }

        var suggestsCount = this.state.suggests.length - 1,
            next = direction === 'next',
            newActiveSuggest = null,
            newIndex = 0,
            i = 0;

        for (i; i <= suggestsCount; i++) {
            if (this.state.suggests[i] === this.state.activeSuggest) {
                newIndex = next ? i + 1 : i - 1;
            }
        }

        if (!this.state.activeSuggest) {
            newIndex = next ? 0 : suggestsCount;
        }

        if (newIndex >= 0 && newIndex <= suggestsCount) {
            newActiveSuggest = this.state.suggests[newIndex];
        }

        this.setState({ activeSuggest: newActiveSuggest });
    },

    /**
     * When an item got selected
     * @param {GeosuggestItem} suggest The selected suggest item
     */
    selectSuggest: function (suggest) {
        document.getElementsByClassName('geosuggest__input')[0].blur();
        if (!suggest) {
            suggest = {
                label: this.state.userInput
            };
        }

        this.setState({
            isSuggestsHidden: true,
            userInput: suggest.label
        });

        if (suggest.location || suggest.propertyId) {
            this.props.onSuggestSelect(suggest);
            return;
        }

        this.geocodeSuggest(suggest);
    },

    /**
     * Geocode a suggest
     * @param  {Object} suggest The suggest
     */
    geocodeSuggest: function (suggest, silent) {
        this.state.geocoder.geocode(
            { placeId: suggest.placeId },
            function (results, status) {
                if (status !== this.props.googleMaps.GeocoderStatus.OK) {
                    return;
                }

                var gmaps = results[0],
                    location = gmaps.geometry.location;

                suggest.gmaps = gmaps;
                suggest.location = {
                    lat: encodeURIComponent(location.lat()),
                    lng: encodeURIComponent(location.lng())
                };

                if (silent) {
                    this.props.onSuggest(suggest);
                } else {
                    this.props.onSuggestSelect(suggest);
                }
            }.bind(this)
        );
    },

    /**
     * Render the view
     * @return {Function} The React element to render
     */
    render() {
        return (
            // eslint-disable-line no-extra-parens
            React.createElement(
                'div',
                {
                    className: 'geosuggest ' + this.props.className,
                    onClick: this.onClick
                },
                React.createElement('input', {
                    className: 'geosuggest__input form-control input-lg',
                    ref: 'geosuggestInput',
                    type: 'text',
                    value: this.state.userInput,
                    placeholder: this.props.placeholder,
                    onKeyDown: this.onInputKeyDown,
                    onInput: this.onInputChange,
                    onChange: this.showSuggests,
                    onBlur: this.hideSuggests,
                    onFocus: this.selectAllText,
                    'data-test': 'search-geosuggest'
                }),
                React.createElement(
                    'ul',
                    { className: this.getSuggestsClasses() },
                    this.getSuggestItems()
                )
            )
        );
    },

    /**
     * Get the suggest items for the list
     * @return {Array} The suggestions
     */
    getSuggestItems: function () {
        return this.state.suggests.map(
            function (suggest) {
                var isActive =
                    this.state.activeSuggest &&
                    suggest.placeId === this.state.activeSuggest.placeId;

                return (
                    // eslint-disable-line no-extra-parens
                    React.createElement(GeosuggestItem, {
                        key: suggest.placeId,
                        suggest: suggest,
                        isActive: isActive,
                        onSuggestSelect: this.selectSuggest
                    })
                );
            }.bind(this)
        );
    },

    /**
     * The classes for the suggests list
     * @return {String} The classes
     */
    getSuggestsClasses: function () {
        var classes = 'geosuggest__suggests';

        classes +=
            this.state.isSuggestsHidden || this.state.suggests.length === 0
                ? ' geosuggest__suggests--hidden'
                : '';

        return classes;
    },

    getPropertiesById: function (propertyId) {
        var api = context.stores.ConfigStore.getItem('api');
        var searchPaths = context.stores.SearchStateStore.getItem(
            'searchPathSelector'
        );
        var siteId = context.stores.ConfigStore.getItem('siteId');
        return fetch(`${api}/propertylistings/query?site=${siteId}&Common.PrimaryKey=${propertyId}`)
            .then(response => response.json())
            .then(data => {
                if (data.DocumentCount > 0) {
                    const suggestions = this.normalizeSearchResponse(searchPaths, data.Documents[0]);
                    this.setState({ suggests: suggestions });
                }
            });
    },

    normalizeSearchResponse: function (searchPaths, documents) {
        const suggestions = documents.map((document) => {
            const primaryKey = document['Common.PrimaryKey'];
            const aspects = document['Common.Aspects'];
            const usageType = document['Common.UsageType'];

            const searchPath = searchPaths ? searchPaths.find(path => path.usageType === usageType) : [];
            const label = searchPath && searchPath.label ? searchPath.label : usageType;

            var suggestion = {
                label: `${primaryKey} (${label})`,
                propertyId: `${primaryKey}`,
                propertyResult: {
                    propertyPartialPath: `${primaryKey}`,
                    propertyAspects: aspects,
                    searchPath: `${searchPath ? searchPath.value : ''}`,
                },
            };
            return suggestion;
        });

        return suggestions;
    }
});

module.exports = Geosuggest;
