var React = require('react'),
    PropTypes = require('prop-types'),
    getAppContext = require('../../src/utils/getAppContext');

var testWrapper = function(Component, context) {
    context = context || getAppContext();

    return class extends React.Component {
        static displayName = 'TestWrapper';

        static propTypes = {
            configUrl: PropTypes.string
        };

        static childContextTypes = {
            stores: PropTypes.object,
            actions: PropTypes.object,
            language: PropTypes.object
        };

        getChildContext() {
            return {
                stores: context.stores,
                actions: context.actions,
                language: require('../../src/config/sample/master/translatables.json')
                    .i18n
            };
        }

        render() {
            return <Component {...this.props} />;
        }
    };
};

module.exports = testWrapper;
