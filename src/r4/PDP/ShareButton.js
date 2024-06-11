import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

const ShareButton = (props, context) => {
    const { modal, showText, buttonClass } = props;
    const { stores: { FavouritesStore } } = context;
    const showModal = e => modal.getModal('share').show(e);
    const favsMode = FavouritesStore.isActive();
    const favsCount = FavouritesStore.getCount();
    const hideButton = (favsMode && !favsCount);

    return hideButton ? null : (
        <Wrapper>
            <a
                onClick={showModal}
                className={classNames(buttonClass, 'cbre_button cbre_button__icon')}
            >
                <div className="pdp_share_button_text">
                    <img alt="Share This Property" src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-share-icon.png" style={{marginRight: "15px"}}/>
                    {showText && <span className='share-button-text'>{context.language.SrOnlyShareButton}</span>}
                    {!showText && <span className='sr-only'>{context.language.SrOnlyShareButton}</span>}
                </div>
            </a>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: inherit;
    a {
        &:hover 
        {
            background-color: #CAD1D3!important;
            filter: brightness(85%)!important;
            color: #435254!important;
        }
    }
`;

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