import PropTypes from 'prop-types';
import React from 'react';

class CardLoader extends React.Component {
    render() {
        return (
            <div className="card is_placeholder">
                <div className="card_image">
                    <div className="placeholder__image"></div>
                </div>
                <div className="card_body">
                    <div className="card_content">
                        <div className="placeholder__h3"></div>
                        <div className="placeholder__cbre_subh1"></div>
                        <div className="placeholder__cbre_subh2"></div>
                        <ul className="placeholder__list">
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>
                    <div className="contacts">
                        <div className="placeholder__contacts"></div>
                    </div>
                </div>
            </div>
        );
    }
}

CardLoader.contextTypes = {
    stores: PropTypes.object
};

export default CardLoader;