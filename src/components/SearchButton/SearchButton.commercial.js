var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    LanguageMixin = require('../../mixins/LanguageMixin');

var createReactClass = require('create-react-class');

var SearchButton = createReactClass({
    displayName: 'SearchButton',
    mixins: [LanguageMixin, ComponentPathMixin],

    propTypes: {
        handleSubmit: PropTypes.func.isRequired,
        lettingsLink: PropTypes.string.isRequired,
        salesLink: PropTypes.string.isRequired
    },

    _handleClick: function(e) {
        e.preventDefault();
        this.props.handleSubmit('isLetting');
    },

    render: function() {
        return (
            <a
                className="btn btn-lg btn-block btn-primary"
                onClick={this._handleClick}
                href={this.props.lettingsLink}
            >
                {this.context.language.GenericSearchButton}

                <span className="cbre-icon cbre-circle-right" />
            </a>
        );
    }
});

module.exports = SearchButton;
