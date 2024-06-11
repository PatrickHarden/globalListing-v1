import React, { Component } from 'react';
import { createDataTestAttribute } from '../../utils/automationTesting';

export default class MultiUsageStrapline extends Component {    
    constructor(props) {
        super(props);
        this.state = { usage1: "", usage2: "", usage3: "" };
    }

    componentDidMount() {
        // set usage type for property in url
        this.setStateUsageProvidedFromProps();

        const matchingProperties = this.props.matchingProperties;

        // set usage types for additional matching properties
        matchingProperties.forEach(property => {
            if(property.UsageType)
                this.updateState(property);
        });
    }

    updateState(property) {
        switch(property.PropertyId.slice(-2)) {
            case "-1":
                this.setState({ usage1: property.UsageType });
                break;
            case "-2":
                this.setState({ usage2: property.UsageType });
                break;
            case "-3":
                this.setState({ usage3: property.UsageType });
        }
    }

    setStateUsageProvidedFromProps() {
        switch(this.props.propertyId.slice(-2)) {
            case "-1":
                this.setState({ usage1: this.props.usageType });
                break;
            case "-2":
                this.setState({ usage2: this.props.usageType });
                break;
            case "-3":
                this.setState({ usage3: this.props.usageType });
        }
    }

    renderHyphen(usageType1, usageType2, usageType3) {
        if (usageType1 || usageType2 || usageType3) {
            return " - ";
        }
    }

    renderCommaAfterFirstUsageType(usageType1, usageType2, usageType3) {
        if (usageType1 && usageType2) {
            return ", ";
        }

        if (usageType1 && usageType3) {
            return ", ";
        }
    }

    renderCommaAfter2ndUsageType(usageType2, usageType3) {
        if (usageType2 && usageType3) {
            return ", ";
        }
    }

    renderAspects(aspects, language) {
        if (aspects.length < 2) {
            return language[`detailsStrapline_${aspects[0]}`];
        }
        else if(aspects.includes("isUnderOffer"))
        {
            if(aspects.length == 2)
            {
                return language[`detailsStrapline_${aspects[1]}`];
            }
            else if(aspects.length > 2)
            {
                return language['detailsStrapline_isBoth'];
            }
        }
        return language['detailsStrapline_isBoth'];
    }

    render() {
        const { aspects, language } = this.props;
        const usageType1 = language[`PDPPropertyType${this.state.usage1}`];
        const usageType2 = language[`PDPPropertyType${this.state.usage2}`];
        const usageType3 = language[`PDPPropertyType${this.state.usage3}`];
 
        return(
            <div className="propertyDetailsStrapline" data-test={createDataTestAttribute('pdp','property-details-strapline')}>
                {this.renderAspects(aspects, language)}
                {this.renderHyphen(usageType1, usageType2, usageType3)}
                {usageType1}
                {this.renderCommaAfterFirstUsageType(usageType1, usageType2, usageType3)}
                {usageType2}
                {this.renderCommaAfter2ndUsageType(usageType2, usageType3)}
                {usageType3}
            </div>
        );
    }
}