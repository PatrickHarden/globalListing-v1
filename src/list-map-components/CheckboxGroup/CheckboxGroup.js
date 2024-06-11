import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Checkbox } from '../../external-libraries/agency365-components/components';
import checkConditional from '../../utils/checkConditional';
import paramMap from '../../utils/paramMap';

class CheckboxGroup extends Component {
    onCheckBoxChanged(e, filter){
        const {
            onFilterChanged
        } = this.props;
        switch (filter.type) {
            case 'toggle': {
                const operator = filter.action === 'OR' ? ',' : '^';
                onFilterChanged(e, 'toggle', operator);
                break;
            }
            case 'checkbox': {
                e.target.uncheckedValue = filter.hasOwnProperty('uncheckedValue') ? filter.uncheckedValue : false;
                e.target.checkAction = filter.hasOwnProperty('action') ? filter.action : 'TOGGLE';
                onFilterChanged(e, 'bool');
                break;
            }
        }
    }

    getFilterState(filter){
        const params = this.context.stores.ParamStore.getParams();
        const mappedParam = paramMap.hasParam(params, filter.name);
        let returnVal;
        if (mappedParam) {
            const paramVal = decodeURIComponent(params[mappedParam]);
            switch (filter.type) {
                case 'toggle': {
                    // or if the url param is an aspect. and that aspect is equal to the filter value (e.g. (isSale^hasSwimmingPool) === (isSale^hasSwimmingPool)), return true
                    returnVal = (paramVal.split(/[,\^]/).indexOf(filter.value) != -1) || ((mappedParam === 'aspects') && (paramVal.includes(filter.value)));
                    break;
                }
                case 'checkbox': {
                    returnVal = !!(paramVal === filter.value || paramVal === 'true');
                    break;
                }
            }
        }

        return returnVal;
        
    }

    renderCheckbox(opt) {
        if(opt.hasOwnProperty('conditional')){
            if(!checkConditional(opt, this.context.stores.ParamStore.getParams())){
                return null;
            }
        }


        return (
            <Checkbox
                key={`${opt.name}:${opt.value}`}
                name={opt.name}
                value={opt.value}
                label={opt.label}
                checked={this.getFilterState(opt)}
                onChange={(e) => this.onCheckBoxChanged(e, opt)}
                className="formField formField__checkbox"
                checkboxSpanClass="cbre_checkbox"
                labelElementClass="checkboxWrap"
                labelSpanClass="formLabel"
            />
        );
    }

    render() {
        return (
            <div className="checkboxGroup">
                {this.props.options.map(opt => this.renderCheckbox(opt))}
            </div>
        );
    }
}

CheckboxGroup.contextTypes = {
    stores: PropTypes.object
};

CheckboxGroup.propTypes = {
    options: PropTypes.array.isRequired,
    onFilterChanged: PropTypes.func.isRequired
};

export default CheckboxGroup;