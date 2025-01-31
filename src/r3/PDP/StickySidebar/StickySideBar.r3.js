import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SideBarHeader from '../../../list-map-components/PropertyDetailsPage/PDPComponents/SideBarHeader';
import SideBarContent_R3 from '../SidebarContent/SideBarContent.r3';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';
import Favourite_R3 from '../FavouriteStar/Favourite.r3';
import ShareButton_R3 from '../../components/ShareButton/ShareButton.r3';
import DefaultValues from '../../../constants/DefaultValues';

class StickySideBar_R3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSticking: false,
            affiliate: false,
            affiliateLogo: ''
        };
    }

    handleStickyStateChange = () => {
        const { isSticking } = this.state;

        this.setState({
            isSticking: !isSticking
        });
    };

    componentWillReceiveProps = nextProps => {
        if (
            nextProps.stampDutyTaxCalculatorOpen !==
            this.props.stampDutyTaxCalculatorOpen
        ) {
            this.refs.stickyElem.recomputeState();
        }
    };

    componentDidMount() {
        if (this.props.property.Agents[0] && this.props.displayAffiliateLogos && this.props.affiliates) { // if agent exists and feature flag is enabled and affiliates object exists in config
            var agentOffice = this.props.property.Agents[0].office;
            var affiliates = this.props.affiliates;
            
            // do a key comparison between agent data and config object keys
            if (agentOffice && agentOffice != '' && typeof affiliates === 'object') { // and isn't an empty string
                for (var prop in affiliates) { // for every key inside object
                    if (Object.prototype.hasOwnProperty.call(affiliates, prop)) {
                        if (agentOffice.toLowerCase().includes(prop.toLowerCase())) { // if agent office data contains key
                            this.setState({ affiliate: true, affiliateLogo: affiliates[prop] }); // enable affilate logo display and set image
                        }
                    }
                }
            }
        }
    }

    render() {
        const { isSticking } = this.state;
        const siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

        const { stickyOffset, marginBottom } = this.props;

        const stickyClasses = isSticking ? 'has_animation' : '';

        const stickyStyles = isSticking ?
            { top: '85px', marginBottom: `${marginBottom}px` }
            : { top: `${stickyOffset}px` };

        return (
            <Sticky
                ref="stickyElem"
                stickyStyle={{ pointerEvents: 'none' }}
                topOffset={stickyOffset}
                onStickyStateChange={this.handleStickyStateChange}
            >
                <div className={'sidebar-wrapper'}>
                    <div
                        style={stickyStyles}
                        className={classNames(
                            stickyClasses,
                            'cbre_sidebar',
                            'cbre_sidebar__tabletLandscapeAndUp',
                            'cbre_sidebar__overlapHero'
                        )}
                    >
                        {siteTheme !== 'commercialv2' && siteTheme !== 'commercialr3' ? (
                            <SideBarHeader {...this.props} />
                        ) : (
                                <div className="fav_share_column_R3">
                                    <Favourite_R3
                                        propertyId={this.props.propertyId}
                                        buttonClass="cbre_button__secondary cbre_button__flat cbre_button_fav_R3"
                                        showText={true}
                                    />
                                    <div className="fav_share_column_space_R3"></div>
                                    <ShareButton_R3
                                        modal={this.props.modal}
                                        buttonClass="cbre_button__secondary cbre_button__flat cbre_button_share_R3"
                                        showText={true}
                                    />
                                </div>
                            )}
                        <SideBarContent_R3 {...this.props} />
                        {this.state.affiliate &&
                            <div style={{ padding: '15px 0', textAlign: 'center' }}>
                                <img style={{ width: 'auto', margin: '0 auto' }} src={this.state.affiliateLogo} />
                            </div>
                        }
                    </div>
                </div>
            </Sticky>
        );
    }
}

StickySideBar_R3.propTypes = {
    stickyOffset: PropTypes.number,
    stampDutyTaxCalculatorOpen: PropTypes.bool
};

StickySideBar_R3.defaultProps = {
    marginBottom: 0,
    stickyOffset: 0
};

export default StickySideBar_R3;
