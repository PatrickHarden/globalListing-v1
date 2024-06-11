import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollapsibleBlock from '../../CollapsibleBlock/CollapsibleBlock';
import TranslateString from '../../../utils/TranslateString';
import { createDataTestAttribute } from '../../../utils/automationTesting';

class PointsOfInterest extends Component {
    getPOIs = () => {
        const { language, stores: { ConfigStore } } = this.context;

        const { property } = this.props;

        const numberFormat = new Intl.NumberFormat(
            ConfigStore.getItem('features').sizeCultureCode? ConfigStore.getItem('features').sizeCultureCode: ConfigStore.getItem('language'),
            {
                maximumFractionDigits: 1
            }
        );

        return property.PointsOfInterest.map(poi => {
            const {
                name: { content: name },
                distance: [{ amount, units }]
            } = poi;
            let distanceUnit = `DistanceUnits_${units}`;
            distanceUnit = amount != 1.0 ? `${distanceUnit}s` : distanceUnit;
            return (
                <li key={name} data-test={createDataTestAttribute('pdp-poi',name)}> 
                    <TranslateString
                        string="LMPoiDistance"
                        name={name}
                        amount={numberFormat.format(amount)}
                        units={language[distanceUnit] || units}
                    />
                </li>
            );
        });
    };

    wrapList = Component => {
        const { language } = this.context;

        const { collapsibleBlock, breakpoints } = this.props;

        return collapsibleBlock ? (
            <CollapsibleBlock
                className="points-of-interest"
                title={language.LMPdpPointsOfInterest}
                isCollapsible={breakpoints.isMobile}
                startExpanded={!breakpoints.isMobile}
                innerClassName="padding-xs-1"
            >
                {Component}
            </CollapsibleBlock>
        ) : (
            <div className="row">
                <div className="col-xs-5">
                    <div className="pdf_subheader">
                        <h2 className="cbre_h4">
                            {language.LMPdpPointsOfInterest}
                        </h2>
                    </div>
                    {Component}
                </div>
            </div>
        );
    };

    render() {
        const pointsOfInterest = this.getPOIs();

        if (!pointsOfInterest.length) {
            return null;
        }

        const List = <ul className="cbre_bulletList">{pointsOfInterest}</ul>;

        return this.wrapList(List);
    }
}

PointsOfInterest.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

PointsOfInterest.propTypes = {
    property: PropTypes.object.isRequired,
    collapsibleBlock: PropTypes.bool,
    breakpoints: PropTypes.object
};

export default PointsOfInterest;
