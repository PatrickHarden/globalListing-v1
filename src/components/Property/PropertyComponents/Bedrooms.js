import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TranslateString from '../../../utils/TranslateString';

export default class Bedrooms extends Component {
    returnTokenString = bedroomCount => {
        return parseInt(bedroomCount) === 0 || parseInt(bedroomCount) > 1
            ? 'NumberOfBedroomsPlural'
            : 'NumberOfBedroomsSingular';
    };

    render() {
        const bedroomCount = this.props.bedrooms;
        let styling = {};
        if (this.props.displayStyling) {
            styling.className = 'property-bedrooms';
        }

        if (!this.props.bedrooms) {
            return <span {...styling}>{this.context.language.Studio}</span>;
        }

        const tokenString = this.returnTokenString(bedroomCount);
        if (this.props.displayStyling) {
            styling.component = 'p';
        }

        return (
            <TranslateString
                bedroomCount={bedroomCount}
                string={tokenString}
                {...styling}
            />
        );
    }
}

Bedrooms.propTypes = {
    bedrooms: PropTypes.any.isRequired,
    displayStyling: PropTypes.bool
};

Bedrooms.defaultProps = {
    displayStyling: true
};

Bedrooms.contextTypes = {
    language: PropTypes.object
};
