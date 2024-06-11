import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultValues from '../../../constants/DefaultValues';
import TranslateString from '../../../utils/TranslateString';
import formatArea from '../../../utils/getFormattedArea';

export default class Size_R3 extends Component {
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
        const { property, displayStyling, displayLabel,disableLabel } = this.props;

        const { culture, uom } = this.state;

        const { language, stores } = this.context;

        let shouldDisplayHectares = false;
        if (property.LandSize) {
            shouldDisplayHectares =
                property.LandSize.units === 'hectare' &&
                property.ActualAddress.country === 'Australia';
        }
        let styling = {};
        if (displayStyling) {
            styling.className = 'property-size';
        }
        const features = stores.ConfigStore.getFeatures();
        const displaySizeLabel = features.displaySizeLabel;
        const displaylandArea = features.displayLandSizeInHeader && property.LandSize && property.LandSize.area;
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

        const landAreaProps = displaylandArea ?  {
            string: 'PropertySize',
            unit: language[displayedUnit]|| language[property.LandSize.units]|| language[uom] || uom,
            size: landSize ,
            component: 'span'
        } : {};

        const landAreaMarkUp = displaylandArea ? (
            <React.Fragment>
                <h4 className="headerH4" style={(window.cbreSiteTheme === 'commercialr4') ? {} : {textTransform: 'uppercase'}}>
                    {language.landArea || 'Land Area'}
                </h4>
                <span {...styling}>
                    <TranslateString {...landAreaProps} />
                </span>
            </React.Fragment>
        ) : null;

        if (
            (!property.TotalSize && !property.MaximumSize) ||
            !property.MinimumSize
        ) {       
            return displaylandArea ? (<div>{landAreaMarkUp}</div>):null;
          
        }

        // const numberFormat = new Intl.NumberFormat(culture, {
        //     style: 'decimal',
        //     maximumFractionDigits: 0
        // });
        const minimumSizeUnit=property.MinimumSize && property.MinimumSize.area
            ?property.MinimumSize.area
             :null;

        const maximumSizeUnit=property.MaximumSize && property.MaximumSize.area
        ?property.MaximumSize.area
         :null;
         
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
        let totalSizeUnit= property.TotalSize && property.TotalSize.area
            ?property.TotalSize.area
            : maximumSizeUnit;

        let totalSize =
            property.TotalSize && property.TotalSize.area
                ? formatArea(
                    culture,
                    property.TotalSize.units || uom,
                    property.TotalSize.area || '',
                    language,
                    false
                )
                : maximumSize;

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

       
        if (
            features.useMaxSizeRatherThanTotalSize &
            !property.ParentPropertyId
        ) {
            totalSize = maximumSize;
            totalSizeUnit=property.MaximumSize.area
        }
        if (!totalSize && unitSize) {
            totalSize = unitSize;
            totalSizeUnit=property.UnitSize.area
        }



        let size = minimumSize ? minimumSize : null;
        size = !size ? (totalSize ? totalSize : null) : size;
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
        // if (shouldDisplayHectares) {
        //     totalUnits = "ha";
        // }

        const translateStringProps = {
            string: 'PropertySize',
            unit: language[totalUnits] || language[minUnits] || language[uom] || uom,
            size: size,
            minimumSize: minimumSize ? minimumSize : null,
            totalSize: totalSize ? totalSize : null,
            component: 'span'
        };
  

        const label = displayLabel ? `${language.Size}: ` : null;
        let sizeLabel = language.Size ? language.Size  : 'Size';
        if(!displaySizeLabel){
            if (property.Aspect.includes('isSale') && property.Aspect.includes('isLetting')){
                sizeLabel = language.ForSaleLease ? language.ForSaleLease : sizeLabel;
            } else if (property.Aspect.includes('isSale')){
                sizeLabel = language.ForSale ? language.ForSale : sizeLabel;
            } else if (property.Aspect.includes('isLetting')){
                sizeLabel = language.ForLease ? language.ForLease : sizeLabel;
            }
        }
        
        //const sizeLabel = property.Aspect.includes('isSale') && property.Aspect.includes('isLetting') ? 
        if (!size) {
            return  displaylandArea ? (<div>{landAreaMarkUp}</div>):null;
        } else if (!totalSize || !minimumSize || minimumSize == totalSize) {
            return (
                <React.Fragment>
                <div>
                {!disableLabel &&
                    <h4 className="headerH4" style={(window.cbreSiteTheme === 'commercialr4') ? {} : {textTransform: 'uppercase'}}>
                        {sizeLabel}
                    </h4>}
                    <span {...styling}>
                        {label}
                        <TranslateString {...translateStringProps} />
                    </span>
                </div>
                {displaylandArea && <div style={{ marginTop: '12px' }}>{landAreaMarkUp}</div>}
                </React.Fragment>
            );
        } else {
            translateStringProps.string = 'PropertySizeRange';
            return (
                <React.Fragment>
                <div>
                    {!disableLabel &&
                    <h4 className="headerH4" style={(window.cbreSiteTheme === 'commercialr4') ? {} : {textTransform: 'uppercase'}}>
                        {sizeLabel}
                    </h4>}
                    <span {...styling}>
                        {label}
                        <TranslateString {...translateStringProps} />
                    </span>
                </div>
                {displaylandArea && <div style={{ marginTop: '12px' }}>{landAreaMarkUp}</div>}
                </React.Fragment>
            );
        }
    }
}

Size_R3.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

Size_R3.propTypes = {
    property: PropTypes.object.isRequired,
    displayLabel: PropTypes.bool,
    displayStyling: PropTypes.bool,
    disableLabel: PropTypes.bool
};

Size_R3.defaultProps = {
    displayStyling: false,
    disableLabel: false
};