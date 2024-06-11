var writeMetaTag = require('../utils/writeMetaTag');
var removeMetaTag = require('../utils/removeMetaTag');

module.exports =  {
    componentDidMount: function () {
        var metaTags;
        const disableMetaTags = this.getConfigStore().getItem('disableMetaData');

        if (this.hasDisableAutoMetaTags() || disableMetaTags) {
            return;
        }

        if (!this.hasBuildMetaTags()) {
            return console.warn('Please implement method \'buildMetaTags\' on ' + this.constructor.displayName); // eslint-disable-line
        }

        metaTags = this.buildMetaTags();

        if (Array.isArray(metaTags) && metaTags.length > 0) {
            this.setMetaTags(metaTags);
        }
    },

    componentDidUpdate: function() {
        var metaTags;
        const disableMetaTags = this.getConfigStore().getItem('disableMetaData');

        if (this.hasDisableAutoMetaTags() || disableMetaTags) {
            return;
        }

        if (!this.hasBuildMetaTags()) {
            return console.warn('Please implement method \'buildMetaTags\' on ' + this.constructor.displayName); // eslint-disable-line
        }

        metaTags = this.buildMetaTags();

        if (Array.isArray(metaTags) && metaTags.length > 0) {
            this.setMetaTags(metaTags);
        }
    },

    componentWillUnmount: function () {
        if (!this.hasDisableAutoMetaTags() && this.hasBuildMetaTags()) {
            this.removeMetaTags();
        }
    },

    setMetaTags: function(metaTags) {
        this.metaTags = metaTags;
        for (var i = 0; i < metaTags.length; i++) {
            writeMetaTag(metaTags[i].property, metaTags[i].value, metaTags[i].type);
        }
    },

    removeMetaTags: function() {
        if ( typeof this.metaTags === 'undefined' || this.metaTags === null ) {
            return; // if we haven't stored any metatags yet, then early out, we've nothing to do
        }

        for (var i = 0; i < this.metaTags.length; i++) {
            removeMetaTag(this.metaTags[i].property, this.metaTags[i].type);
        }

        this.metaTags = null;
    },

    hasBuildMetaTags: function () {
        return (this.buildMetaTags);
    },

    hasDisableAutoMetaTags: function () {
        return (this.disableAutoMetaTags);
    }
};
