import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { fireAnalyticsTracking } from '../../../ga4-analytics/send-event';
import { eventTypes } from '../../../ga4-analytics/event-types';
import { CreateBasicInteraction } from '../../../ga4-analytics/converters/interaction';

const ShareButton_R4 = (props, context) => {
    const { modal, showText, buttonClass, property, page } = props;
    const { stores: { FavouritesStore } } = context;

    const favsMode = FavouritesStore.isActive();
    const favsCount = FavouritesStore.getCount();
    const hideButton = (favsMode && !favsCount);

    const handleClick = (e) => {
        modal.getModal('share').show(e);
        const features = context.stores.ConfigStore.getItem('features');
        const interactionDetails = {
            source: page,
            interaction_type: 'click',
            interaction_target: 'share',
            interaction_target_type: 'button', 
            cta_link_text: '',
            cta_title: '',
            cta_link_destination: '#',
            interaction_id: null,
            is_cta: 'false'
        };
        fireAnalyticsTracking(features, context, eventTypes.INTERACTION, CreateBasicInteraction(property ? property : {}, interactionDetails));
    };

    return hideButton ? null : (
        <a
            onClick={handleClick}
            className={classNames(buttonClass, 'cbre_button cbre_button__icon', 'grey_circle_button_r4')}
        >
            <div className="share_button_text_R4">
                <img alt="Share This Property" src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-share-icon.png" />
                {showText && <span className='share-button-text'>{context.language.SrOnlyShareButton}</span>}
                {!showText && <span className='sr-only'>{context.language.SrOnlyShareButton}</span>}
            </div>
        </a>
    );
};

ShareButton_R4.propTypes = {
    buttonClass: PropTypes.string,
    modal: PropTypes.object.isRequired,
    showText: PropTypes.bool
};

ShareButton_R4.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};

export default ShareButton_R4;