var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ErrorView = require('../ErrorView'),
    writeMetaTag = require('../../utils/writeMetaTag');

var createReactClass = require('create-react-class');

var ErrorPage = createReactClass({
    displayName: 'ErrorPage',
    mixins: [LanguageMixin, ComponentPathMixin],

    render: function() {
        writeMetaTag('prerender-status-code', 404, 'html');
        window.prerenderReady = true;
        return (
            <ErrorView
                title={this.context.language.ErrorSubTitle}
                className="container"
            >
                <h4>{this.context.language.ErrorBadRequest}</h4>
            </ErrorView>
        );
    }
});

module.exports = ErrorPage;
