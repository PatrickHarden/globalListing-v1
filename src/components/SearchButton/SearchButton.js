var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin');

var createReactClass = require('create-react-class');

var SearchButton = createReactClass({
    displayName: 'SearchButton',
    mixins: [StoresMixin, LanguageMixin, ComponentPathMixin],

    propTypes: {
        handleSubmit: PropTypes.func.isRequired,
        lettingsLink: PropTypes.string.isRequired,
        salesLink: PropTypes.string.isRequired
    },

    _handleClick: function(type, e) {
        e.preventDefault();
        this.props.handleSubmit(type);
    },

    _renderBtnContainer: function(btn, type) {
        if (
            !this.getSearchStateStore().getItem('hideSearchToLet') &&
            !this.getSearchStateStore().getItem('hideSearchToBuy')
        ) {
            return (
                <div className={`btn--${type}`}>
                    <div className="inner">{btn}</div>
                </div>
            );
        } else {
            return btn;
        }
    },

    _renderBuyBtn: function() {
        if (this.getSearchStateStore().getItem('hideSearchToBuy')) {
            return false;
        }

        return this._renderBtnContainer(
            <a
                className="btn btn-lg btn-block btn-primary"
                onClick={this._handleClick.bind(this, 'isSale')}
                href={this.props.salesLink}
            >
                {this.getSearchStateStore().getItem('hideSearchToLet') ||
                this.getSearchStateStore().getItem('hideSearchToBuy')
                    ? this.context.language.GenericSearchButton
                    : this.context.language.SearchToBuyButton}
                <span className="cbre-icon cbre-chevron-right" />
            </a>,
            'buy'
        );
    },

    _renderLetBtn: function() {
        if (this.getSearchStateStore().getItem('hideSearchToLet')) {
            return false;
        }
        return this._renderBtnContainer(
            <a
                className="btn btn-lg btn-block btn-primary"
                onClick={this._handleClick.bind(this, 'isLetting')}
                href={this.props.lettingsLink}
            >
                {this.getSearchStateStore().getItem('hideSearchToLet') ||
                this.getSearchStateStore().getItem('hideSearchToBuy')
                    ? this.context.language.GenericSearchButton
                    : this.context.language.SearchToLetButton}
                <span className="cbre-icon cbre-chevron-right" />
            </a>,
            'let'
        );
    },

    render: function() {
        return (
            <div className="cbre-spa--search_button-group">
                {this._renderBuyBtn()}
                {this._renderLetBtn()}
            </div>
        );
    }
});

module.exports = SearchButton;
