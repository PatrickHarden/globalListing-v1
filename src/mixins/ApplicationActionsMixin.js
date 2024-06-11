var PropTypes = require('prop-types');

var ApplicationActionsMixin = {
    contextTypes: {
        actions: PropTypes.object
    },

    getActions: function(context) {
        context = context || this.context;
        return context.actions;
    }
};

module.exports = ApplicationActionsMixin;
