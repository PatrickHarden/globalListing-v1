import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import trackingEvent from '../../../utils/trackingEvent';
import { addFavourite, removeFavourite, checkFavourite } from '../../../utils/favourites';

class Favourite_R4 extends Component {
    constructor(props) {
        super(props);
        this.state = { isActive: false };
    }


    componentWillMount() {
        if (this.checkFavouriteExists()) {
            this.setState({ isActive: true });
        }
    }

    toggleFavouritedStorage = (e) => {
        e.preventDefault();

        const { propertyId } = this.props;

        const { stores, actions, router } = this.context;

        let event = 'favouritePropertyAdded';

        // Toggle favourite button state.
        if (!this.checkFavouriteExists()) {
            this.setState({ isActive: true });
            addFavourite(propertyId);
        } else {
            event = 'favouritePropertyRemoved';
            this.setState({ isActive: false });
            removeFavourite(propertyId);
        }

        trackingEvent(event, { propertyId: propertyId }, stores, actions);

        actions.updateFavourites(router);
    };


    checkFavouriteExists = () => {
        const { propertyId } = this.props;

        return checkFavourite(propertyId);
    };


    render() {
        const { stores, language } = this.context;

        const features = stores.ConfigStore.getItem('features');

        if (!features || !features.enableFavourites) {
            return null;
        }

        const { buttonClass, showText } = this.props;

        const isActiveClass = this.state.isActive ? 'is_selected' : '';

        return (
            <a
                href="#"
                onClick={this.toggleFavouritedStorage}
                className={classNames(isActiveClass, buttonClass, 'cbre_button')}>
                <div className='fav_icon_text_R3'>
                    {isActiveClass ?
                        <img alt="Favorite this Property" src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/r4-favorite-icon-dark.png" style={{marginRight: "15px"}}/> :
                        <img alt="Favorite this Property" src="https://uatlistingssearchcbreeun.blob.core.windows.net/images/GL-Icons/heart.png" style={{marginRight: "15px",width: "18px",height: "auto"}}/>
                    }
                    <span className={!showText ? 'sr-only' : ''}>{language.SrOnlyFavouriteButton}</span>
                </div>
            </a>
        );
    }
}

Favourite_R4.contextTypes = {
    actions: PropTypes.object,
    stores: PropTypes.object,
    language: PropTypes.object,
    router: PropTypes.object
};

Favourite_R4.propTypes = {
    buttonClass: PropTypes.string,
    propertyId: PropTypes.string.isRequired,
    showText: PropTypes.bool
};

export default Favourite_R4;