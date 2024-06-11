var PropTypes = require('prop-types');
var React = require('react'),
    getAppContext = require('./getAppContext'),
    ContactFormModal = require('../components/ContactForm/ContactFormModal');

module.exports = function (Component, context) {
    if (typeof context === 'undefined') {
        context = getAppContext();
    }

    return class extends React.Component {
        static displayName = 'Wrapper';

        static propTypes = {
            configUrl: PropTypes.string.isRequired,
            spaPath: PropTypes.object,
            staticQuery: PropTypes.object,
            location: PropTypes.object,
            carouselConfig:PropTypes.object
        };

        static childContextTypes = {
            stores: PropTypes.object,
            actions: PropTypes.object,
            location: PropTypes.object,
            ContactModal: PropTypes.func
        };

        getChildContext() {
            return {
                stores: context.stores,
                actions: context.actions,
                location: this.props.location,
                ContactModal : ContactFormModal
            };
        }

        render() {
            return (
                <Component {...this.props}/>
            );
        }
    };
};