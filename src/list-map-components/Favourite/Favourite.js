import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import trackingEvent from '../../utils/trackingEvent';
import {
    addFavourite,
    removeFavourite,
    checkFavourite
} from '../../utils/favourites';

class Favourite extends Component {
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

        const {
            propertyId
        } = this.props;

        const {
            stores,
            actions,
            router
        } = this.context;

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

        trackingEvent(event, {
            propertyId: propertyId
        }, stores, actions);

        actions.updateFavourites(router);
    };

    checkFavouriteExists = () => {
        const {
            propertyId
        } = this.props;

        return checkFavourite(propertyId);
    };

    render() {
        const {
            stores,
            language
        } = this.context;

        const features = stores.ConfigStore.getItem('features');
        if (!features || !features.enableFavourites) {
            return null;
        }

        const {
            buttonClass,
            showText
        } = this.props;

        const isActiveClass = this.state.isActive ? 'is_selected' : '';

        return (
            <a
                href="#"
                onClick={this.toggleFavouritedStorage}
                className={classNames(isActiveClass, buttonClass, 'cbre_button', 'cbre_button__favourite')}>
                <span className={!showText && 'sr-only'}>{language.SrOnlyFavouriteButton}</span>
            </a>
        );
    }
}

Favourite.contextTypes = {
    actions: PropTypes.object,
    stores: PropTypes.object,
    language: PropTypes.object,
    router: PropTypes.object
};

Favourite.propTypes = {
    buttonClass: PropTypes.string,
    propertyId: PropTypes.string.isRequired,
    showText: PropTypes.bool
};

export default Favourite;