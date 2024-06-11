var PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../../mixins/ComponentPathMixin')(
        __dirname
    ),
    MultiSelect = require('react-select');

var createReactClass = require('create-react-class');

var MultiSelectFilter = createReactClass({
    displayName: 'MultiSelectFilter',
    mixins: [ComponentPathMixin],

    propTypes: {
        filter: PropTypes.object,
        handleFilterChange: PropTypes.func
    },

    _onChange: function(val, opt) {
        opt = opt || [];
        var placeNames = [];
        for (var i = 0; i < opt.length; i++) {
            placeNames.push(opt[i].label);
        }
        this.props.handleFilterChange(val, placeNames);
    },

    _returnValue: function() {
        var options = this.props.filter.options,
            value = [];

        for (var i = 0; i < options.length; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }

        return value;
    },

    render: function() {
        return (
            <div className="cbre-multiselect">
                <MultiSelect
                    name="form-field-name"
                    placeholder={this.props.filter.label}
                    noResultsText={this.props.filter.noResultsText}
                    options={this.props.filter.options}
                    multi={true}
                    onChange={this._onChange}
                    value={this._returnValue()}
                />
            </div>
        );
    }
});

module.exports = MultiSelectFilter;
