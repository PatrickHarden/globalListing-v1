import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollapsibleBlock from '../../CollapsibleBlock/CollapsibleBlock';
import classNames from 'classnames';
import { createDataTestAttribute } from '../../../utils/automationTesting';

class Specification extends Component {
    wrapList = Component => {
        const { language } = this.context;

        const { collapsibleBlock, breakpoints } = this.props;

        return collapsibleBlock ? (
            <CollapsibleBlock
                title={language.PdpSpecificationTitle}
                isCollapsible={breakpoints.isMobile}
                startExpanded={!breakpoints.isMobile}
                innerClassName="padding-xs-1"
            >
                {Component}
            </CollapsibleBlock>
        ) : (
            <div className="row">
                <div className="col-xs-12">{Component}</div>
            </div>
        );
    };

    render() {
        const { property, collapsibleBlock, siteType } = this.props;

        const { language } = this.context;

        if (!property.Highlights.length) {
            return null;
        }

        const classes = [
            'cbre_bulletList',
            collapsibleBlock ? 'textCol-xs-1 textCol-lg-2' : 'textCol-xs-3'
        ];

        const List = (
            <ul className={classNames(classes)}>
                {property.Highlights.map((spec, i) => (
                    spec && <li key={`spec_${i}`} data-test={createDataTestAttribute('pdp-specification', i)}>{spec}</li>
                ))}
            </ul>
        );

        const title =
            siteType !== 'residential'
                ? language.PdpSpecificationTitle
                : language.PdpFeaturesTitle;

        const header = collapsibleBlock ? null : (
            <div className="row avoidPageBreak">
                <div className="col-xs-8">
                    <div className="pdf_subheader">
                        <h2 className="cbre_h4">{title}</h2>
                    </div>
                </div>
            </div>
        );

        return header ? (
            <div>
                {header}
                {this.wrapList(List)}
            </div>
        ) : (
            this.wrapList(List)
        );
    }
}

Specification.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object
};

Specification.propTypes = {
    property: PropTypes.object.isRequired,
    collapsibleBlock: PropTypes.bool,
    breakpoints: PropTypes.object,
    siteType: PropTypes.string
};

export default Specification;
