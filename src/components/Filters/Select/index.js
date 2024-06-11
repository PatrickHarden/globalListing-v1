import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { FormControl, FormGroup } from 'react-bootstrap';
var ComponentPathMixin = require('../../../mixins/ComponentPathMixin')(
        __dirname
    ),
    CustomSelectMixin = require('../../../mixins/CustomSelectMixin'),
    StoresMixin = require('../../../mixins/StoresMixin');

var SelectFilter = createReactClass({
    displayName: 'SelectFilter',
    mixins: [StoresMixin, ComponentPathMixin, CustomSelectMixin],

    propTypes: {
        filter: PropTypes.object.isRequired,
        handleFilterChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool
    },

    _returnValue: function(value, index, concat, comparator) {
        if (typeof value === 'object') {
            if (comparator) {
                var paramArray = [];
                for (var i = 0; i < value.length; i++) {
                    paramArray.push(comparator[value[i]] || null);
                }
                return concat
                    ? paramArray.join('')
                    : comparator[value[index]] || null;
            } else {
                return concat ? value.join('') : value[index] || null;
            }
        } else {
            return index === 0 ? value : null;
        }
    },

    _getOptions: function() {
        return this.props.filter.options.map(
            function(option) {
                return (
                    <option
                        key={
                            this.props.filter.name +
                            '_' +
                            this._returnValue(option.value, 0, true)
                        }
                        value={this._returnValue(option.value, 0, true)}
                        data-primary={this._returnValue(option.value, 0)}
                        data-secondary={this._returnValue(option.value, 1)}
                        data-tertiary={this._returnValue(option.value, 2)}
                        data-quaternary={this._returnValue(option.value, 3)}
                    >
                        {option.label}
                    </option>
                );
            }.bind(this)
        );
    },

    _handleFilterChange: function(e) {
        this.props.handleFilterChange(e);
    },

    render: function() {
        var filter = this.props.filter,
            filterValue,
            label = filter.label ? filter.label : null;

        if (typeof filter.name === 'object') {
            filterValue = this._returnValue(
                filter.name,
                0,
                true,
                this.props.searchParams
            );
        } else {
            filterValue = this.props.searchParams[filter.name];
        }

        return (
            <FormGroup>
                <FormControl
                    type="select"
                    componentClass="select"
                    label={label}
                    name={this._returnValue(filter.name, 0)}
                    data-primary={this._returnValue(filter.name, 0)}
                    data-secondary={this._returnValue(filter.name, 1)}
                    data-tertiary={this._returnValue(filter.name, 2)}
                    data-quaternary={this._returnValue(filter.name, 3)}
                    value={filterValue}
                    onChange={this._handleFilterChange}
                >
                    {this._getOptions()}
                </FormControl>
            </FormGroup>
        );
    }
});

module.exports = SelectFilter;
