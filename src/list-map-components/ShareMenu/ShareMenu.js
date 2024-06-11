import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import SocialWidgets from '../../external-libraries/social-media-widgets/components';

class ShareMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { isMenuOpen: false };
        this.toggleShareMenu = this.toggleShareMenu.bind(this);
    }

    toggleShareMenu(e) {
        e.preventDefault();
        this.setState({isMenuOpen: !this.state.isMenuOpen});
    }

    renderSocialWidgets(config) {
        let shareImg = '';
        let shareText = '';

        if (document.querySelector('meta[property="og:image"]')) {
            shareImg = document.querySelector('meta[property="og:image"]').content;
        }

        if (document.querySelector('meta[property="og:description"]')) {
            shareText = document.querySelector('meta[property="og:description"]').content;
        }

        return (
            <SocialWidgets
                {...config}
                url={window.location.href}
                shareText={shareText}
                media={shareImg}
            />
        );
    }

    enabledServices(config) {
        if (config && config.socialServices) {
            // Return true if any services are enabled.
            const obj = config.socialServices;
            const configValues = Object.keys(obj).map(key => obj[key]);
            return configValues.indexOf(true) > -1;
        }
    }

    render() {
        const {
            isEnabled,
            config,
            showDirectly
        } = this.props;

        const {
            language
        } = this.context;

        const enabledServices = this.enabledServices(config);

        if (!isEnabled || !enabledServices) {
            return null;
        }

        const isOpenClass = this.state.isMenuOpen ? 'is_open' : '';

        return showDirectly ? this.renderSocialWidgets(config) : (
            <div className='shareMenu'>
                <a href="#" onClick={this.toggleShareMenu.bind(this)} className='cbre_button cbre_button__icon'>
                    <span className='cbre_icon_social cbre_icon'></span>
                    <span className='sr-only'>{language.SrOnlyShareButton}</span>
                </a>
                <div className={classNames('cbre_popover', isOpenClass)}>
                    <div className='cbre_inlineList'>
                        {this.renderSocialWidgets(config)}
                    </div>
                </div>
            </div>
        );
    }
}

ShareMenu.propTypes = {
    config: PropTypes.object,
    isEnabled: PropTypes.bool.isRequired,
    showDirectly: PropTypes.bool
};

ShareMenu.defaultProps = {
    showDirectly: false
};

ShareMenu.contextTypes = {
    language: PropTypes.object
};

export default ShareMenu;