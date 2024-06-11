var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../../mixins/ComponentPathMixin')(
        __dirname
    ),
    CustomCheckboxMixin = require('../../../mixins/CustomCheckboxMixin'),
    FormControl = require('react-bootstrap').FormControl;

var createReactClass = require('create-react-class');

var InputFilter = createReactClass({
    displayName: 'InputFilter',
    mixins: [ComponentPathMixin, CustomCheckboxMixin],

    propTypes: {
        filter: PropTypes.object.isRequired,
        handleFilterChange: PropTypes.func.isRequired
    },

    _getValue: function(filter) {
        if (filter.hasOwnProperty('defaultValue')) {
            return filter[filter.defaultValue];
        }
        return this.props.searchParams[filter.name];
    },

    _handleFilterChange: function(e) {
        var type = null;

        if (e.target.type === 'checkbox') {
            type = 'bool';
            e.target.uncheckedValue = this.props.filter.hasOwnProperty(
                'uncheckedValue'
            )
                ? this.props.filter.uncheckedValue
                : false;
            e.target.checkAction = this.props.filter.hasOwnProperty('action')
                ? this.props.filter.action
                : 'TOGGLE';
        }

        this.props.handleFilterChange(e, type);
    },

    render: function() {
        var filter = this.props.filter,
            labelText = filter.label ? filter.label : null,
            opts = {
                type: filter.type,
                label: labelText,
                key: filter.name,
                name: filter.name,
                value: this._getValue(filter),
                onChange: this._handleFilterChange
            };

        if (filter.type === 'checkbox') {
            opts['value'] = filter.value;
            opts['checked'] =
                this.props.searchParams[filter.name] === filter.value ||
                //this.state.isChecked ||
                this.props.searchParams[filter.name] === 'true'
                    ? true
                    : false;

            // Render custom checkbox markup.
            return this.renderCustomCheckbox(opts);
        } else {
            // Render standard boostrap input.
            return <FormControl {...opts} />;
        }
    }
});

module.exports = InputFilter;
