import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SideBarHeader from './SideBarHeader';
import SideBarContent from './SideBarContent';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';
import Favourite from '../../Favourite/Favourite';
import ShareButton from '../../ShareButton/ShareButton';
import DefaultValues from '../../../constants/DefaultValues';
class StickySideBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSticking: false
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

    render() {
        const { isSticking } = this.state;
        const siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

        const { stickyOffset, marginBottom} = this.props;

        const stickyClasses = isSticking ? 'has_animation' : '';

        const stickyStyles = isSticking
            ? {
                  top: '0px',
                  marginBottom: `${marginBottom}px`
              }
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
                            <div className="flex-two-column">
                                <Favourite
                                    propertyId={this.props.propertyId}
                                    buttonClass="cbre_button__secondary cbre_button__flat"
                                    showText={true}
                                />
                                <ShareButton
                                    modal={this.props.modal}
                                    buttonClass="cbre_button__secondary cbre_button__flat"
                                    showText={true}
                                />
                            </div>
                        )}
                        <SideBarContent {...this.props} />
                    </div>
                </div>
            </Sticky>
        );
    }
}

StickySideBar.propTypes = {
    stickyOffset: PropTypes.number,
    stampDutyTaxCalculatorOpen: PropTypes.bool
};

StickySideBar.defaultProps = {
    marginBottom: 0,
    stickyOffset: 0
};

export default StickySideBar;
