import 'chosen-js';
var ReactDOM = require('react-dom'),
    $ = require('jQuery'),
    hasTouch = require('has-touch');

function shouldImplement(inst) {
    var breakpoints = inst.getConfigStore().getAllBreakpointValues() || {
        small: '768',
        medium: '992',
        large: '1200'
    };

    return !hasTouch && $(window).width() >= breakpoints.medium;
}

var CustomSelectMixin = {
    $selectBox: null,

    componentDidMount: function() {
        if (shouldImplement(this)) {
            /*
             Grab a jQuery reference to the created select box and use the plug-in to replace it
             with more easily styleable elements.
             */
            this.$selectBox = $(ReactDOM.findDOMNode(this)).find('select');

            this.$selectBox.chosen({
                disable_search: true,
                width: '100%'
            });

            /*
             Because we're using proxy elements, we need to call the change handler this way
             instead of the usual React way.
             */
            this.$selectBox.on('change', this._handleFilterChange);
        }
    },

    componentDidUpdate: function() {
        if (shouldImplement(this)) {
            this.$selectBox.trigger('chosen:updated');
        }
    }
};

module.exports = CustomSelectMixin;
