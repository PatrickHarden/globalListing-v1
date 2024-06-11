var PropTypes = require('prop-types');
var React = require('react'),
    StoresMixin = require('../../mixins/StoresMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname);

var createReactClass = require('create-react-class');

var EventButton = createReactClass({
    displayName: 'EventButton',
    mixins: [StoresMixin, LanguageMixin, ComponentPathMixin],

    propTypes: {
        onClick: PropTypes.func.isRequired,
        listenFor: PropTypes.string,
        store: PropTypes.object
    },

    getStore: function() {
        return this.props.store || this.getApplicationStore();
    },

    getInitialState: function() {
        return {
            loading: false
        };
    },

    componentDidMount: function() {
        if (this.props.listenFor) {
            this.getStore().onChange(this.props.listenFor, this.eventFired);
        }
    },

    componentWillUnmount: function() {
        if (this.props.listenFor) {
            this.getStore().off(this.props.listenFor, this.eventFired);
        }
    },

    eventFired: function() {
        //if (this.isMounted()) {
        this.setState({ loading: false });
        //}
    },

    _handleClick: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.onClick();

        //if (this.isMounted()) {
        this.setState({ loading: this.props.listenFor ? true : false });
        //}
    },

    render: function() {
        var isLoading = this.state.loading;
        // Add default button classes
        var className = this.props.className + ' btn btn-default';
        var href = '#';

        // Additional classes if block specified
        if (this.props.block) {
            className += ' btn-block';
            if (this.props.bsSize == 'large') {
                className += ' btn-lg';
            }
        }
        if (this.props.href) {
            href = this.props.href;
        }

        return (
            <a
                className={className}
                href={href}
                disabled={isLoading}
                onClick={this._handleClick}
            >
                {!isLoading
                    ? this.props.children
                    : this.context.language.EventButtonLoadingText}
            </a>
        );
    }
});

module.exports = EventButton;
