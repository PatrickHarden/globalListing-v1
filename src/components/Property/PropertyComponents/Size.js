import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultValues from '../../../constants/DefaultValues';
import TranslateString from '../../../utils/TranslateString';
import formatArea from '../../../utils/getFormattedArea';
import { createDataTestAttribute } from '../../../utils/automationTesting';

export default class Size extends Component {
    state = {
        culture: this.context.stores.ConfigStore.getItem('language'),
        uom:
            this.context.stores.ParamStore.getParam('Unit') || defaultValues.uom
    };

    getUnitsToDisplay(property, displayOpts, uom) {
        const { shouldDisplayHectares } = displayOpts;
        return shouldDisplayHectares ? "ha" : property.LandSize.units ? property.LandSize.units : uom;
    }

    render() {
        const { property, displayStyling, displayLabel } = this.props;

        const { culture, uom } = this.state;

        const { language, stores } = this.context;

        let shouldDisplayHectares = false;
        if (property.LandSize) {
            shouldDisplayHectares =
            property.LandSize.units === 'hectare' &&
            property.ActualAddress.country === 'Australia';
        }

        if (
            (!property.TotalSize && !property.MaximumSize) ||
            !property.MinimumSize
        ) {
            return null;
        }

        // const numberFormat = new Intl.NumberFormat(culture, {
        //     style: 'decimal',
        //     maximumFractionDigits: 0
        // });
        const minimumSizeUnit=property.MinimumSize && property.MinimumSize.area
                            ?property.MinimumSize.area
                            : null;
        const minimumSize =
            property.MinimumSize && property.MinimumSize.area
                ? formatArea(
                      culture,
                      property.MinimumSize.units || uom,
                      property.MinimumSize.area || '',
                      language,
                      false
                  )
                : null;
        const maximumSize =
            property.MaximumSize && property.MaximumSize.area
                ? formatArea(
                      culture,
                      property.MaximumSize.units || uom,
                      property.MaximumSize.area || '',
                      language,
                      false
                  )
                : null;
        let totalSizeUnit=property.TotalSize && property.TotalSize.area
               ?property.TotalSize.area
               : null;        
        let totalSize =
            property.TotalSize && property.TotalSize.area
                ? formatArea(
                      culture,
                      property.TotalSize.units || uom,
                      property.TotalSize.area || '',
                      language,
                      false
                  )
                : null;
        const unitSize =
            property.UnitSize && property.UnitSize.area
                ? formatArea(
                      culture,
                      property.UnitSize.units || uom,
                      property.UnitSize.area || '',
                      language,
                      false
                  )
                : null;

        const displayedUnit = this.getUnitsToDisplay(property, { shouldDisplayHectares }, uom);
        const landSize =
            property.LandSize && property.LandSize.area
                ? formatArea(
                      culture,
                      displayedUnit,
                      property.LandSize.area || '',
                      language,
                      false
                  )
                : null;

                if (
                    stores.ConfigStore.getFeatures().useMaxSizeRatherThanTotalSize &
                    !property.ParentPropertyId
                ) {
                    totalSize = maximumSize;
                    totalSizeUnit=property.MaximumSize.area
                }
                if (!totalSize && unitSize) {
                    totalSize = unitSize;
                    totalSizeUnit=property.UnitSize.area
                }
        
                if (shouldDisplayHectares) {
                    totalSize = landSize;
                    totalSizeUnit=property.LandSize.area
                }

        let size = minimumSize ? minimumSize : null;
        size = !size ? (totalSize ? totalSize : null) : size;
        size = !size ? (maximumSize ? maximumSize : null) : size;
        let minUnits = property.MinimumSize.units;
        if (
            property.MinimumSize.units === 'acre' &&
            parseFloat(minimumSizeUnit) !== 1
        ) {
            minUnits = property.MinimumSize.units + 'Plural';
        }
        if (property.MinimumSize.units === 'pp') {
            if (parseFloat(minimumSizeUnit) !== 1) {
                minUnits = 'deskPlural';
            } else {
                minUnits = 'desk';
            }
        }
        let totalUnits = property.TotalSize.units;

        if (
            property.TotalSize.units === 'acre' &&
            parseFloat(totalSizeUnit) !== 1
        ) {
            totalUnits = property.TotalSize.units + 'Plural';
        }
        if (property.TotalSize.units === 'pp') {
            if (totalSizeUnit && parseFloat(totalSizeUnit) !== 1) {
                    totalUnits = 'deskPlural';
                } else {
                    totalUnits = 'desk';
                }
            }
        if (shouldDisplayHectares) {
            totalUnits = "ha";
        }

        const translateStringProps = {
            string: 'PropertySize',
            unit: language[totalUnits] || language[minUnits] || language[uom] || uom,
            size: size,
            minimumSize: minimumSize ? minimumSize : null,
            totalSize: totalSize ? totalSize : null,
            component: 'span'
        };
        let styling = {};
        if (displayStyling) {
            styling.className = 'property-size';
        }

        const label = displayLabel ? `${language.Size}: ` : null;

        if (!size) {
            return null;
        } else if (!totalSize || !minimumSize || minimumSize == totalSize) {
            return (
                <span {...styling} data-test={createDataTestAttribute(null,'property-size')}>
                    {label}
                    <TranslateString {...translateStringProps} />
                </span>
            );
        } else {
            translateStringProps.string = 'PropertySizeRange';
            return (
                <span {...styling} data-test={createDataTestAttribute(null,'property-size')}>
                    {label}
                    <TranslateString {...translateStringProps} />
                </span>
            );
        }
    }
}

Size.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

Size.propTypes = {
    property: PropTypes.object.isRequired,
    displayLabel: PropTypes.bool,
    displayStyling: PropTypes.bool
};

Size.defaultProps = {
    displayStyling: false
};
