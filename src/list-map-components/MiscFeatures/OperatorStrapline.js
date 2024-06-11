import React, { Component } from 'react';
import { createDataTestAttribute } from '../../utils/automationTesting';

export default class OperatorStrapline extends Component {
	constructor(props) {
		super(props);
	}


	
	render() {
		const { operator } = this.props;
		if (operator) {
			return <div className="propertyDetailsStrapline" data-test={createDataTestAttribute('pdp','property-details-operator-strapline')}>Operator: {operator}</div>;
		} else {
			return null
		}
	}
}
