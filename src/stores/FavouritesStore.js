import ActionTypes from '../constants/ActionTypes';
import BaseStore from './BaseStore';
import buildPropertyObject  from '../utils/buildPropertyObject';
import DefaultValues from '../constants/DefaultValues';

const FavouritesStore = function(stores, Dispatcher) {
    let favourites = [];
    let pdfProperties = [];
    let staticMaps = [];
    let favouritesIsActive = false;
    let currentIndex = 0;

    this.stores = stores;
    let culture = DefaultValues.culture;
    let currency = DefaultValues.currency;
    let units = DefaultValues.uom;
    let urlslug = DefaultValues.urlPropertyAddressFormat;


    this.dispatchToken = Dispatcher.register((action) => {
        culture = this.stores.ConfigStore.getItem('language') || DefaultValues.culture;
        units = this.stores.ParamStore.getParam('Unit') || DefaultValues.uom;
        currency = this.stores.ParamStore.getParam('CurrencyCode') || DefaultValues.currency;
        urlslug = this.stores.ConfigStore.getItem('urlPropertyAddressFormat') || DefaultValues.urlPropertyAddressFormat;

        switch (action.type) {
            case ActionTypes.SET_PDF_PROPERTIES:
                this.setPdfProperties(action.payload);
                break;
            case ActionTypes.SET_STATIC_MAPS:
                this.setStaticMaps(action.payload);
                break;
            case ActionTypes.SET_FAVOURITES:
                this.setFavourites(action.payload);
                break;
            case ActionTypes.TOGGLE_FAVOURITES:
                this.toggleFavourites(action.isActive);
                break;
            case ActionTypes.CLEAR_FAVOURITES:
                this.clearAll();
                break;
            default:
            // Do nothing
        }
    });

    this.setStaticMaps = (payload) => {
        staticMaps = payload;
        this.emitChange('STATIC_MAPS_UPDATED', staticMaps);
    };

    this.setPdfProperties = (payload) => {
        if (!payload) {
            return;
        }

        // Clear all first.
        pdfProperties = [];

        payload.Documents[0].map((document) => {
            pdfProperties.push(
                buildPropertyObject(document, culture, units, currency, urlslug)
            );
        });

        this.emitChange('PDF_PROPERTIES_UPDATED', pdfProperties);
    };

    this.toggleFavourites = (isActive) => {
        favouritesIsActive = isActive;
        this.emitChange('TOGGLE_FAVOURITES', isActive);
    };

    this.setFavourites = (payload) => {
        if (!payload) {
            return;
        }

        // Clear all first.
        favourites = [];

        const aspects = stores.ParamStore.getParam('aspects');
        const filters = aspects ? aspects.split(',').filter(p => ['isSale', 'isLetting'].includes(p)) : [];

        favourites = payload.Documents[0].map(doc => (
            buildPropertyObject(doc, culture, units, currency, urlslug)
        )).filter(doc => {
            if (!filters.length || !doc.Aspect.length) {
                // nothing to filter on - invalid scanario, let's be safe
                return false;
            }
            // check for any matches between property aspects and current aspect(s)
            return doc.Aspect.reduce((last, next) => last || filters.includes(next), false);
        });

        this.emitChange('FAVOURITES_UPDATED', favourites);
    };

    this.isActive = () => {
        return favouritesIsActive;
    };

    this.getCount = () => {
        return favourites.length;
    };

    this.getAll = () => {
        return favourites;
    };

    this.clearAll = () => {
        favourites = [];
        this.emitChange('FAVOURITES_UPDATED', { data: [] });
    };

    this.getProperty = () => {
        return favourites[currentIndex] || {};
    };

    this.nextProperty = () => {
        currentIndex++;
        this.emitChange('ACTIVE_FAVOURITE_UPDATED');
    };

    this.prevProperty = () => {
        currentIndex--;
        this.emitChange('ACTIVE_FAVOURITE_UPDATED');
    };

    this.getCurrentIndex= () => {
        return currentIndex;
    };

    this.getIndexByPropertyId = propertyId => {
        // caller can handle not found (-1) result
        return favourites.findIndex(p => p.PropertyId === propertyId);
    };

    this.setIndex = index => {
        currentIndex = index;
        this.emitChange('ACTIVE_FAVOURITE_UPDATED');
    };

    this.setIndexByPropertyId = propertyId => {
        const index = favourites.findIndex(p => p.PropertyId === propertyId);
        if (index !== -1) {
            currentIndex = index;
            this.emitChange('ACTIVE_FAVOURITE_UPDATED');
        }
    };
};

FavouritesStore.prototype = Object.create(BaseStore.prototype);

module.exports = FavouritesStore;
