import React, { useEffect } from 'react';
import { GLAnalyticsContext } from './gl-analytics-context';
import ReactGA from 'react-ga';
import { isPrerender } from '../../utils/browser';


let analyticsEnabled = false;
const isBrowser = (typeof window !== 'undefined' && !isPrerender);
const gaFunctionExists = (typeof ga !== 'undefined' && typeof ga == 'function');

// using Sitecore/Drupal global analytics is defaulted. Use local analytics instead via the useLocalGoogleAnalytics feature flag
let localizeAnalytics = false;


const GLAnalytics = (props) => {

    const { config, children } = props;
    const url = window.location.href;

    if (config.useLocalGoogleAnalytics) {
        localizeAnalytics = true;
    }

    const initializeAnalytics = (id) => {
        if (!url.includes('localhost')) {
            if (gaFunctionExists) {
                ga('create', id, 'auto', String(window.location.origin));
            }
            ReactGA.initialize([
                {
                    trackingId: id,
                    gaOptions: { name: 'globalListings' },
                    alwaysSendToDefaultTracker: false
                }
            ]);
            ReactGA.set({ userId: 123 }, ['globalListings']);
        }
    };

    // Initialize analytics, set global boolean to true if analytics id exists
    useEffect(() => {
        if (!analyticsEnabled && config && config.trackingIds && (config.trackingIds.length > 0) && isBrowser) {
            config.trackingIds.map((id) => {
                initializeAnalytics(String(id));
            });
            analyticsEnabled = true;
        }
    }, []);

    return (
        <GLAnalyticsContext.Provider value={{
            'fireEvent': fireEvent,
            'fireTracking': fireTracking
        }}>
            {children}
        </GLAnalyticsContext.Provider>
    );
};

export default GLAnalytics;






export const fireEvent = (...eventData) => {
    if (isBrowser) {
        analyticsEvent(...eventData);
    }
};


export const fireTracking = () => {
    if (isBrowser) {
        const page = window.location.href;
        if (gaFunctionExists) {
            ga('send', 'pageview', page);
        }
        if (analyticsEnabled) {
            ReactGA.pageview(page, ['globalListings']);
        }
    }
};


// arguments passed in: (eventCategory, eventAction, eventLabel, transport, noninteraction)
// example: analyticsEvent('propertyClick', 'click', 'Property clickthrough', 'beacon', true)
// beacon is useful for click events that trigger route change
// noninteraction: true sends an event when a user doesn't do something
export const analyticsEvent = (...eventData) => {

    if (eventData.length > 0 && eventData.length < 6) {

        // setup the eventModel object to replicate
        const eventModel = localizeAnalytics ? {
            category: '',
            action: '',
            label: '',
            transport: '',
            nonInteraction: false
        } : {
                eventCategory: '',
                eventAction: '',
                eventLabel: ''
            }

        // slice the object above depending on the amount of arguments passed in
        const event = Object.keys(eventModel).slice(0, eventData.length).reduce((result, key) => {
            result[key] = eventModel[key];
            return result;
        }, {});

        // set the new sliced object equal to values passed in
        for (const key in event) {
            if (event.hasOwnProperty(key)) {
                // get the index of the key (eg. 0,1,2) to set the data of the array passed in equal to the current object key. 
                const index = Object.keys(event).indexOf(key);
                event[key] = eventData[index];
            }
        }

        // send the new sliced object to google analytics
        if (gaFunctionExists) {
            event.hitType = 'event';
            ga('send', event);
        } else {
            ReactGA.event(event);
        }

    } else {
        console.log('Event Analytics Error: No arguments, too many arguments, or a boolean was provided in the wrong index.');
    }

};