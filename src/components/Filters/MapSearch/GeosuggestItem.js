var React = require('react');

class GeosuggestItem extends React.Component {
    static displayName = 'GeosuggestItem';

    /**
     * Get the default props
     * @return {Object} The props
     */
    static defaultProps = {
        isActive: false,
        suggest: {
            label: ''
        },
        onSuggestSelect: function onSuggestSelect() {}
    };

    /**
     * When the element gets clicked
     * @param  {Event} event The click event
     */
    onMouseDown = (event) => {
        event.preventDefault();
        this.props.onSuggestSelect(this.props.suggest);
    };

    /**
     * Render the view
     * @return {Function} The React element to render
     */
    render() {
        return ( // eslint-disable-line no-extra-parens
            React.createElement(
                'li',
                { className: this.getSuggestClasses(),
                    onMouseDown: this.onMouseDown },
                this.props.suggest.label
            )
        );
    }

    /**
     * The classes for the suggest item
     * @return {String} The classes
     */
    getSuggestClasses = () => {
        var classes = 'geosuggest-item';

        classes += this.props.isActive ? ' geosuggest-item--active' : '';

        return classes;
    };
}

module.exports = GeosuggestItem;