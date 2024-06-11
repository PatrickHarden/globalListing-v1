var React = require('react');
var createReactClass = require('create-react-class');
var Spinner = require('react-spinner');
var StoresMixin = require('../mixins/StoresMixin');
var BootstrapMixin = require('../mixins/BootstrapMixin');
var ApplicationActionsMixin = require('../mixins/ApplicationActionsMixin');
var DefaultValues = require('../constants/DefaultValues');

module.exports = function(Component, conf, options) {
    conf = conf || {};

    return createReactClass({
        displayName: 'ConfigContainer',
        mixins: [StoresMixin, ApplicationActionsMixin, BootstrapMixin],

        getInitialState: function() {
            return {
                hasLoaded: false
            };
        },

        componentDidMount: function() {
            const hasConfigLoaded = this.getApplicationStore().hasConfigLoaded();
            if (hasConfigLoaded) {
                return this.handleBootstrapComplete();
            } else {
                this.getApplicationStore().onChange(
                    'BOOTSTRAP_COMPLETE',
                    this.handleBootstrapComplete
                );
            }
        },

        componentWillUnmount: function() {
            this.getApplicationStore().off(
                'BOOTSTRAP_COMPLETE',
                this.onBootstrapComplete
            );
        },

        handleBootstrapComplete: function() {
            const _config = Object.assign(
                {},
                this.getConfigStore().getConfig()
            );
            _config.siteType =
                window.cbreSiteType || DefaultValues.cbreSiteType;
            //if (this.isMounted()) {
            this.setState({
                config: _config,
                hasLoaded: true
            });
            //}
        },

        renderLoadingState: function() {
            if (conf.hideLoadingState) {
                return false;
            }

            return <Spinner />;
        },

        render: function() {
            if (!conf.bypassLoader && !this.state.hasLoaded) {
                return this.renderLoadingState();
            }

            return (
                <Component {...this.state} {...this.props} options={options} />
            );
        }
    });
};
