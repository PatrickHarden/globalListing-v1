var React = require('react');

var createReactClass = require('create-react-class');

module.exports = function stub(mount, unmount) {
    var mixins = [];

    if (mount) {
        mixins.push({
            componentDidMount: function() {
                mount.call(this);
            }
        });
    }

    if (unmount) {
        mixins.push({
            componentWillUnmount: function() {
                unmount.call(this);
            }
        });
    }

    return createReactClass({
        displayName: 'StubComponent',
        mixins: mixins,
        render: function() {
            return React.DOM.div();
        }
    });
};
