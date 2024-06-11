import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const ShareButton = (props, context) => {
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
            <span className="cbre_icon_social cbre_icon"></span>
            <span className={!showText && 'sr-only'}>{context.language.SrOnlyShareButton}</span>
        </a>
    );
};

ShareButton.propTypes = {
    buttonClass: PropTypes.string,
    modal: PropTypes.object.isRequired,
    showText: PropTypes.bool
};

ShareButton.contextTypes = {
    language: PropTypes.object,
    stores: PropTypes.object
};

export default ShareButton;