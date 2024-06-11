import React, { Component } from 'react';
import { MultiSelect } from '../../external-libraries/agency365-components/components';
import TranslateString from '../../utils/TranslateString';

export default class MultiSelectFilter extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.returnValue = this.returnValue.bind(this);
  }

  componentDidMount() {
    this.props.onInitCallback();
  }

  onChange(vals) {
    let tempVals = vals;

    if (this.props.singlePolygonSearch){
      tempVals = vals.filter(val => !val.selected);
    }
    const placeNames = tempVals.map(v => v.label) || [];
    const polygons = tempVals.map(v => v.value).join(',') || '';

    this.props.handleFilterChange(polygons, placeNames);
  }

  returnValue() {
    const options = this.props.filter.options;
    let value = [];

    options.forEach(opt => {
      if (opt.selected) {
        value.push(opt.value);
      }
    });

    return value;
  }

  render() {
    return (
      <MultiSelect
        name="form-field-name"
        className="Select__large cbre_icon cbre_icon_loupe"
        placeholder={<TranslateString string="LMPolygonSearchPlaceholder" />}
        noResultsText={<TranslateString string="LMPolygonSearchNoResults" />}
        options={this.props.filter.options}
        multi={true}
        autosize={false}
        backspaceRemoves={false}
        onChange={this.onChange}
        value={this.returnValue()}
        clearable={false}
        openOnFocus={true}
        autoBlur={true}
        focusFirstOption={false}
        disabled={this.props.disabled}
      />
    );
  }
}
