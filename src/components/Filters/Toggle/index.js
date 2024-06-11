import React, { Component } from 'react';
import paramMap from '../../../utils/paramMap';
import { Checkbox } from 'react-bootstrap';

class ToggleFilter extends Component {
    constructor(props) {
        super(props);
        this.state = { checkboxChecked: false };
    }
    componentWillMount() {
        var isChecked = this._getValue();
        this.setState({
            checkboxChecked: isChecked
        });
    }
    _getValue() {
        var params = this.props.searchParams,
            filter = this.props.filter,
            mappedParam = paramMap.hasParam(params, filter.name);
        if (mappedParam) {
            return (
                params[mappedParam].split(/[,\^]/).indexOf(filter.value) != -1
            );
        }
    }
    appendValue(e) {
        var operator = this.props.filter.action === 'OR' ? ',' : '^';
        this.props.handleFilterChange(e, 'toggle', operator);
    }
    render() {
        var filter = this.props.filter;
        let labelText = filter.label ? filter.label : null;
        let groupClassName =
            this.props.type === 'group' ? 'checkbox-group' : null;

        // Render custom checkbox markup.
        return (
            <Checkbox
                name={filter.name}
                onChange={e => this.appendValue(e)}
                inputRef={ref => (this.myCheckbox = ref)}
                value={filter.value}
                className={groupClassName}
                defaultChecked={this.state.checkboxChecked}
            >
                <span className="control-label">{labelText}</span>
            </Checkbox>
        );
    }
}

export default ToggleFilter;
