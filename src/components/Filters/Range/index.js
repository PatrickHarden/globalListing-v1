var React = require('react'),
    PropTypes = require('prop-types'),
    ComponentPathMixin = require('../../../mixins/ComponentPathMixin')(
        __dirname
    ),
    CustomSelectMixin = require('../../../mixins/CustomSelectMixin'),
    StoresMixin = require('../../../mixins/StoresMixin'),
    buildRangeValue = require('../../../utils/buildRangeValue'),
    FormControl = require('react-bootstrap').FormControl,
    FormGroup = require('react-bootstrap').FormGroup;

var createReactClass = require('create-react-class');

var RangeFilter = createReactClass({
    displayName: 'RangeFilter',
    mixins: [StoresMixin, ComponentPathMixin, CustomSelectMixin],

    propTypes: {
        filter: PropTypes.object.isRequired,
        handleFilterChange: PropTypes.func.isRequired
    },

    getInitialState: function() {
        return this._getState();
    },

    componentDidMount: function() {
        this.getParamStore().onChange('PARAMS_UPDATED', this._onChange);
    },

    componentWillUnmount: function() {
        this.getParamStore().off('PARAMS_UPDATED', this._onChange);
    },

    _getState: function() {
        var paramValue;

        if (this.props.filter.name.split('|').length > 1) {
            paramValue = this._getParamsForRangeFilter(this.props.filter.name);
        } else {
            paramValue = this.getParamStore().getParam(this.props.filter.name);
        }

        paramValue = this._splitRange(paramValue);

        return {
            minValue: paramValue[0] || '',
            maxValue: paramValue[1] || '',
            includePOA: paramValue[2] || ''
        };
    },

    _getParamsForRangeFilter: function(filter) {
        var paramNames = filter.split('|'),
            paramArray = [],
            params = 'range[';

        paramArray[0] = this._splitRange(
            this.getParamStore().getParam(paramNames[0])
        );
        paramArray[1] = this._splitRange(
            this.getParamStore().getParam(paramNames[1])
        );

        params +=
            (paramArray[1][0] || '') +
            '|' +
            (paramArray[0][1] || '') +
            '|' +
            (paramArray[0][2] || '') +
            ']';

        return params;
    },

    _splitRange: function(val) {
        var _param;
        // range[1|10|include]
        _param = val ? val.replace('range[', '').replace(']', '') : '';
        _param = _param ? _param.split('|') : '';
        return _param;
    },

    _onChange: function() {
        this.setState(this._getState());
    },

    _getOptions: function(type) {
        var filter = this.props.filter;

        return filter[type].map(
            function(option) {
                var opts = {
                    key: type.concat(option.value || ''),
                    value: option.value || ''
                };

                return <option {...opts}>{option.label}</option>;
            }.bind(this)
        );
    },

    _validateRange: function() {
        var minValue = this.state.minValue,
            maxValue = this.state.maxValue;

        if (maxValue !== '' && parseInt(minValue) > parseInt(maxValue)) {
            minValue = maxValue;
        }

        this.setState(
            {
                minValue: minValue,
                maxValue: maxValue
            },
            this._changeFilter
        );
    },

    _changeFilter: function() {
        var params = this.props.filter.name.split('|'),
            dummyEvent = {
                target: []
            };

        if (params.length === 1) {
            dummyEvent.target.push({
                name: params[0],
                value: buildRangeValue(
                    this.state.minValue,
                    this.state.maxValue,
                    this.state.includePOA
                )
            });
        } else {
            // Swap values and create separate params
            var _min = '',
                _max = '';

            if (this.state.maxValue !== '') {
                _min = buildRangeValue(
                    '',
                    this.state.maxValue,
                    this.state.includePOA
                );
            }

            if (this.state.minValue !== '') {
                _max = buildRangeValue(
                    this.state.minValue,
                    '',
                    this.state.includePOA
                );
            }

            dummyEvent.target.push(
                {
                    name: params[0],
                    value: _min
                },
                {
                    name: params[1],
                    value: _max
                }
            );
        }

        this.props.handleFilterChange(dummyEvent);
    },

    _handleFilterChange: function() {
        let minValue = this.minValue.value;
        let maxValue = this.maxValue.value;

        this.setState(
            {
                minValue: minValue,
                maxValue: maxValue
            },
            this._validateRange
        );
    },

    render: function() {
        var filter = this.props.filter,
            label = filter.label ? (
                <label className="control-label">{filter.label}</label>
            ) : null;

        return (
            <div className="spa-range-filter">
                <div className="spa-range-filter--range">
                    {label}
                    <FormGroup>
                        <FormControl
                            type="select"
                            componentClass="select"
                            value={this.state.minValue}
                            onChange={this._handleFilterChange}
                            inputRef={input => (this.minValue = input)}
                        >
                            {this._getOptions('minValues')}
                        </FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormControl
                            type="select"
                            componentClass="select"
                            value={this.state.maxValue}
                            onChange={this._handleFilterChange}
                            inputRef={input => (this.maxValue = input)}
                        >
                            {this._getOptions('maxValues')}
                        </FormControl>
                    </FormGroup>
                </div>
            </div>
        );
    }
});

module.exports = RangeFilter;
