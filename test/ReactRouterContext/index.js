var PropTypes = require('prop-types');
var React = require('react'),
    getAppContext = require('../../src/utils/getAppContext');

var ReactRouterContext = function ReactRouterContext(
    Component,
    props,
    context
) {
    context = context || getAppContext();

    return class extends React.Component {
        static propTypes = {
            configUrl: PropTypes.string
        };

        static childContextTypes = {
            stores: PropTypes.object,
            actions: PropTypes.object,
            language: PropTypes.object,
            router: PropTypes.object,
            routeDepth: PropTypes.number,
            params: PropTypes.object,
            location: PropTypes.object
        };

        getChildContext() {
            return {
                stores: context.stores,
                actions: context.actions,
                language: require('../../src/config/sample/master/translatables.json')
                    .i18n,
                router: {
                    isActivePath: function() {
                        return false;
                    },
                    createHref: function() {},
                    push: function() {}
                },
                routeDepth: 0,
                params: {},
                location: {}
            };
        }

        render() {
            return React.createElement(Component, props);
        }
    };
};

module.exports = ReactRouterContext;
