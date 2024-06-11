import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CollapsibleBlock from '../CollapsibleBlock/CollapsibleBlock';
import { ExpandableContent } from '../../external-libraries/agency365-components/components';
import PropertyCard from '../PropertyCard/PropertyCard';
import PropertyCard_R3 from '../../r3/PLP/PropertyCard/PropertyCard.r3';
import classNames from 'classnames';
import CardLoader from '../CardLoader/CardLoader';
import DefaultValues from '../../constants/DefaultValues';

let siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

class ChildProperties extends Component {
    renderCardLoader() {
        const { isMobile } = this.props.breakpoints;
        const cardCount = isMobile ? 1 : 3;

        let cardLoaders = [];
        for (let i = 0; i < cardCount; i++) {
            cardLoaders.push(<CardLoader key={`card_loader_${i}`} />);
        }

        return <div className={'card_list card-loader'}>{cardLoaders}</div>;
    }

    renderComponent = component => {
        return (
            <div>
                <a name="child-properties" />
                <CollapsibleBlock
                    title={this.context.language.PropertiesInLocation}
                    isCollapsible={false}
                    startExpanded={true}
                    headerClassName="has_lightBorder"
                    innerClassName="padding-xs-1"
                >
                    {component}
                </CollapsibleBlock>
            </div>
        );
    };

    render() {
        const {
            className,
            cardProps,
            childProperties = {},
            breakpoints = {}
        } = this.props;

        const classes = ['child-properties-container', className];
        const { language, stores } = this.context;
        const features = stores.ConfigStore.getFeatures();
        let listingsLimit = 10;
        if (
            features.childListings &&
            features.childListings.limitChildListings
        ) {
            listingsLimit = features.childListings.limitChildListings;
        }

        const callComplete = childProperties.hasOwnProperty('properties');
        const callFailed = callComplete && !childProperties.status;

        if (!callComplete) {
            return this.renderCardLoader();
        }

        if (callFailed) {
            return null;
        }
        var hasMissingValue = Number.MAX_SAFE_INTEGER;

        const childComponent = breakpoints.isMobile ? (
            <ExpandableContent
                contentClassName="cbre_multiCarousel"
                showMoreString={language.LMExpandableTextMore}
                showLessString={language.LMExpandableTextLess}
                showHideClassName="showHideToggle has_arrow cbre_smallText"
                mode="items"
                limit={2}
            >
                {childProperties.properties
                    .sort(function (a, b) {
                        return (
                            (a.ListingOrder || hasMissingValue) -
                            (b.ListingOrder || hasMissingValue)
                        );
                    })
                    .map(p => (
                        (siteTheme == 'commercialr3') ?
                            <PropertyCard_R3
                                showFavourites={false}
                                property={p}
                                {...cardProps}
                            />
                            :
                            <PropertyCard
                                showFavourites={false}
                                property={p}
                                {...cardProps}
                            />
                    ))}
            </ExpandableContent>
        ) : (
                <div className={classNames(classes)}>
                    <ExpandableContent
                        contentClassName="overflow-visible"
                        showMoreString={language.LMExpandableTextMore}
                        showLessString={language.LMExpandableTextLess}
                        showHideClassName="showHideToggle has_arrow cbre_smallText"
                        mode="items"
                        limit={listingsLimit}
                    >
                        {childProperties.properties
                            .sort(function (a, b) {
                                return (
                                    (a.ListingOrder || hasMissingValue) -
                                    (b.ListingOrder || hasMissingValue)
                                );
                            })
                            .map(p => (
                                (siteTheme == 'commercialr3') ?
                                    <PropertyCard_R3
                                        showFavourites={false}
                                        property={p}
                                        pdpLocationCard={true}
                                        {...cardProps}
                                    />
                                    :
                                    <PropertyCard
                                        showFavourites={false}
                                        property={p}
                                        {...cardProps}
                                    />
                            ))}
                    </ExpandableContent>
                </div>
            );

        return this.renderComponent(childComponent);
    }
}

ChildProperties.contextTypes = {
    stores: PropTypes.object,
    language: PropTypes.object,
    actions: PropTypes.object
};

ChildProperties.propTypes = {
    childProperties: PropTypes.object.isRequired,
    className: PropTypes.string,
    breakpoints: PropTypes.object,
    cardProps: PropTypes.object
};

export default ChildProperties;
