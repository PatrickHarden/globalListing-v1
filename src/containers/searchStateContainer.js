var React = require('react');
var createReactClass = require('create-react-class');
var StoresMixin = require('../mixins/StoresMixin');

module.exports = function(Component) {
    return createReactClass({
        displayName: 'SearchStateContainer',
        mixins: [StoresMixin],

        getInitialState: function() {
            return {
                extendedSearch: false
            };
        },

        componentDidMount: function() {
            this.getSearchStateStore().onChange(
                'SEARCH_STATE_UPDATED',
                this.onSearchStateUpdated
            );
        },

        componentWillUnmount: function() {
            this.getSearchStateStore().off(
                'SEARCH_STATE_UPDATED',
                this.onSearchStateUpdated
            );
        },

        onSearchStateUpdated: function() {
            //if (this.isMounted()) {
            var extendedSearch = this.getSearchStateStore().getItem(
                'extendedSearch'
            );
            this.setState({
                extendedSearch: !!extendedSearch
            });
            //}
        },

        render: function() {
            return <Component {...this.state} {...this.props} />;
        }
    });
};
