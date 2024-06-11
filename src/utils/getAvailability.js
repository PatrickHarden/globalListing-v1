import React from 'react';
import defaultValues from '../constants/DefaultValues';
import TranslateString from './TranslateString';
import moment from 'moment/min/moment-with-locales.min';
import getAvailabilityByCultureCode from './getAvailabilityByCultureCode';

module.exports = (property = {}, context = {}) => {
    const { language, stores: { ConfigStore, SearchStateStore } } = context;

    const {
        AvailableFrom,
        availableFrom,
        Availability,
        availability
    } = property;

    const _availability = Availability || availability;
    const currentLanguage = ConfigStore.getItem('language');
    
    // CA new node is added priority for this
    if(ConfigStore.getFeatures().useAvailabilityDescription && _availability && _availability.availabilityDescription && _availability.availabilityDescription.length > 0 ){
        return {
            id: 'availableFrom',
            title: language['LMPDPAvailableFrom'],
            value: getAvailabilityByCultureCode(_availability.availabilityDescription,currentLanguage)
        }
        
    }

  
    const searchType = SearchStateStore.getItem('searchType');
    let availableFromString = language['AvailableFromNow'];
    let availableFromDate = AvailableFrom || availableFrom;
    if (
        _availability &&
        _availability.description &&
        !_availability.kind &&
        !availableFrom
    ) {
        availableFromString = _availability.description;
        availableFromDate = undefined;
    } else if (_availability && _availability.kind) {
        switch (_availability.kind) {
            case 'AvailableNow':
            case 'AvailableNeg':
            case 'AvailableSoon': {
                availableFromString = language[_availability.kind];
                availableFromDate = undefined;
                break;
            }
            case 'AvailableFromKnownDate': {
                availableFromString = language.AvailableNow;
                availableFromDate = _availability.date;
                break;
            }
            case 'AvailableFromKnownQtr': {
                const date = new moment(_availability.date);
                availableFromString = (
                    <TranslateString
                        string="AvailableFromKnownQtr"
                        quarter={date.quarter()}
                        year={date.year()}
                    />
                );
                availableFromDate = undefined;
                break;
            }
            case 'AvailableNMonthsAfterLeaseOrSale': {
                const string =
                    searchType === 'isSale'
                        ? 'AvailableNMonthsAfterSale'
                        : 'AvailableNMonthsAfterLease';
                availableFromString = (
                    <TranslateString
                        string={string}
                        numberOfMonths={_availability.months}
                    />
                );
                availableFromDate = undefined;
                break;
            }
        }
    }
    if (availableFromDate) {
        const _diff = new moment().diff(availableFromDate, 'days');
        if (_diff < 0 || _diff === 0) {
            availableFromString = new moment(availableFromDate);
            availableFromString = availableFromString
                .locale(currentLanguage)
                .format(defaultValues.dateFormat);
        }
    }

    return {
        id: 'availableFrom',
        title: language['LMPDPAvailableFrom'],
        value: availableFromString
    };
};


