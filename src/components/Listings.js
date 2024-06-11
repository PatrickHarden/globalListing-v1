var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../mixins/ApplicationActionsMixin'),
    DefaultValues = require('../constants/DefaultValues'),
    ReactBootstrap = require('react-bootstrap'),
    ErrorView = require('./ErrorView'),
    Grid = ReactBootstrap.Grid,
    Spinner = require('react-spinner'),
    writeMetaTag = require('../utils/writeMetaTag'),
    deepEqual = require('deep-equal'),
    _ = require('lodash'),
    DispatchCustomEvent = require('../utils/dispatchCustomEvent');

var createReactClass = require('create-react-class');

import CaptureError from '../utils/captureError';
var Listings = createReactClass({
    displayName: 'Listings',
    mixins: [StoresMixin, ApplicationActionsMixin, ComponentPathMixin],

    childContextTypes: {
        language: PropTypes.object,
        spaPath: PropTypes.object
    },

    getChildContext: function() {
        return {
            language: this.state.language,
            spaPath: this.props.spaPath
        };
    },

    getInitialState: function() {
        var incomingParams =
            this.props.location && this.props.location.query
                ? this.props.location.query
                : {};
        return {
            incomingParams: incomingParams,
            language: this.getLanguageStore().getLanguage(),
            searchType:
                this.getSearchStateStore().getItem('searchType') ||
                DefaultValues.searchType,
            fatalError: false,
            error: false,
            loading: true
        };
    },

    componentDidMount: function() {
        // Handle errors.
        this.getApplicationStore().onChange(
            'CONFIG_ERROR',
            this._throwFatalError
        );
        this.getApplicationStore().onChange(
            'APPLICATION_ERROR',
            this._throwApplicationError
        );
        this.getApplicationStore().onChange('PLACES_ERROR', this._throwError);

        // Handle changes.
        this.getApplicationStore().onChange(
            'BOOTSTRAP_COMPLETE',
            this._onChange
        );

        // Bootstrap the application.
        this.getActions().bootstrap(
            this.props.configUrl,
            this.state.incomingParams
        );
    },

    componentDidUpdate: function(prevProps) {
        // Emits a routing object.
        if (!deepEqual(this.props.location, prevProps.location)) {
            var _loc = _.clone(this.props.location);
            _loc.spaRoute = this.props.location.pathname.replace(
                this.props.spaPath.path,
                ''
            );

            var eventToDispatch = new DispatchCustomEvent();
            eventToDispatch.routeEvent(this.getActions(), _loc);
        }

        // Are we coming back from the PDP page to the listings page?
        if (
            prevProps.params &&
            prevProps.params.hasOwnProperty('propertyId') &&
            !this.props.params.hasOwnProperty('propertyId')
        ) {
            // If so we ned to reconfigure the app with qs values
            this.getActions().updateQueryParams(this.state.incomingParams);
        }
    },

    componentWillUnmount: function() {
        this.getApplicationStore().off('CONFIG_ERROR', this._throwFatalError);
        this.getApplicationStore().off(
            'APPLICATION_ERROR',
            this._throwApplicationError
        );
        this.getApplicationStore().off('PLACES_ERROR', this._throwError);
        this.getApplicationStore().off('BOOTSTRAP_COMPLETE', this._onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            incomingParams:
                nextProps.location && nextProps.location.query
                    ? nextProps.location.query
                    : {}
        });
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
        const config = this.getConfigStore().getConfig();
        CaptureError(
            'Component Error',
            {
                component: 'Listings',
                errorType: 'CONFIG_ERROR',
                config: config
            },
            { site: config.siteId }
        );
        this.setState({
            fatalError: true
        });
    },

    _throwApplicationError: function() {
        const config = this.getConfigStore().getConfig();
        CaptureError(
            'Component Error',
            {
                component: 'Listings',
                errorType: 'APPLICATION_ERROR',
                config: config
            },
            { site: config.siteId }
        );
        this.setState({
            applicationError: true
        });
    },

    _throwError: function() {
        const config = this.getConfigStore().getConfig();
        CaptureError(
            'Listings Component Error',
            {
                component: 'Listings',
                errorType: 'PLACES_ERROR',
                config: config
            },
            { site: config.siteId }
        );
        this.setState({
            error: true
        });
    },

    _renderContent: function() {
        if (this.state.applicationError) {
            var errorDetail = this.getApplicationStore().getApplicationError();

            writeMetaTag(
                'prerender-status-code',
                errorDetail.statusCode,
                'html'
            );
            window.prerenderReady = true;

            return (
                <ErrorView
                    title={errorDetail.message}
                    className="config-error container"
                >
                    <p>{errorDetail.detail}</p>
                </ErrorView>
            );
        }

        if (this.state.error) {
            return (
                <ErrorView
                    title={this.state.language.ErrorTitle}
                    className="api-error container"
                >
                    <h4>{this.state.language.ErrorSubTitle}</h4>
                    <p>{this.state.language.ErrorText}</p>
                </ErrorView>
            );
        }

        if (this.state.fatalError) {
            return (
                <ErrorView title="Sorry" className="config-error container">
                    <h4>We're sorry, there has been an error.</h4>

                    <p>Please try again later.</p>
                </ErrorView>
            );
        }

        // Inject searchType in to all children
        // We don't define them here, but we need to make it available.
        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    searchType: this.state.searchType
                });
            }.bind(this)
        );
    },

    render: function() {
        if (this.state.loading && !this.state.error && !this.state.fatalError) {
            return (
                <Grid>
                    <Spinner />
                </Grid>
            );
        }

        return <div className="cbre-spa--page">{this._renderContent()}</div>;
    }
});

module.exports = Listings;
