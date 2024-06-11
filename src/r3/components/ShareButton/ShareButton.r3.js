import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const ShareButton_R3 = (props, context) => {
    const { modal, showText, buttonClass } = props;
    const { stores: { FavouritesStore } } = context;
    const showModal = e => modal.getModal('share').show(e);
    const favsMode = FavouritesStore.isActive();
    const favsCount = FavouritesStore.getCount();
    const hideButton = (favsMode && !favsCount);

    return hideButton ? null : (
        <a
            onClick={showModal}
            className={classNames(buttonClass, 'cbre_button cbre_button__icon')}
        >
            <div className="share_button_text_R3">
                <img alt="Share This Property" src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/icon-share.png" />
                {showText && <span className='share-button-text'>{context.language.SrOnlyShareButton}</span>}
                {!showText && <span className='sr-only'>{context.language.SrOnlyShareButton}</span>}
            </div>
        </a>
    );
};

ShareButton_R3.propTypes = {
    buttonClass: PropTypes.string,
    modal: PropTypes.object.isRequired,
    showText: PropTypes.bool
};

ShareButton_R3.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};

export default ShareButton_R3;