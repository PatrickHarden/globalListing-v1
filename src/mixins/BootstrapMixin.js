var DefaultValues = require('../constants/DefaultValues'),
    DispatchCustomEvent = require('../utils/dispatchCustomEvent');

var BootstrapMixin = {
    getInitialState: function() {
        return {
            language: this.getLanguageStore().getLanguage(),
            fatalError: false,
            error: false,
            loading: true,
            dispatchCustomEvent: new DispatchCustomEvent()
        };
    },

    componentDidMount: function() {
        // Handle errors.
        this.getApplicationStore().onChange(
            'CONFIG_ERROR',
            this._throwFatalError
        );
        this.getApplicationStore().onChange('API_ERROR', this._throwFatalError);
        this.getParamStore().onChange('PLACES_ERROR', this._throwError);

        // Handle changes.
        this.getApplicationStore().onChange(
            'BOOTSTRAP_COMPLETE',
            this._onChange
        );

        // Bootstrap the application.
        this.getActions().bootstrap(this.props.configUrl);
    },

    componentWillUnmount: function() {
        this.getApplicationStore().off('CONFIG_ERROR', this._throwFatalError);
        this.getApplicationStore().off('API_ERROR', this._throwFatalError);
        this.getParamStore().off('PLACES_ERROR', this._throwError);
        this.getApplicationStore().off('BOOTSTRAP_COMPLETE', this._onChange);
    },

    _onChange: function() {
        this.setState({
            language: this.getLanguageStore().getLanguage(),
            searchType:
                this.getSearchStateStore().getItem('searchType') ||
                DefaultValues.searchType,
            fatalError: false,
            error: false,
            loading: false
        });
    },

    _loading: function() {
        this.setState({
            loading: true
        });
    },

    _throwFatalError: function() {
        this.setState({
            fatalError: true
        });
    },

    _throwError: function() {
        this.setState({
            error: true
        });
    }
};

module.exports = BootstrapMixin;
