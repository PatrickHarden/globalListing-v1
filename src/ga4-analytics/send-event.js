import { verifyEventModel } from './verify-event-model';

/*
The functions here are responsible for the actual dispatch of an event

Since we don't yet have typescript available, here's what everything means:

eventType : we need to specify what event we are going to dispatch, since we have several available to us

data : this is the actual data that we want to report on, raw

overrides : if we are using a default adapter, then there may be some properties that are not 1 to 1 in name.  in this case, we pass in the overrides, 
which is a Map (string, any) that can take values from our data and tell the adapter how to construct the event model

adapter : this is a separate function used to convert the data into the event model required.  
if an adapter is not supplied, then we use the event type to try to find a default adapter.

*/

// use these functions to effectively "wrap" the old event firing mechanisms so we don't have to do conditional logic everywhere
export const fireAnalyticsTracking = (features, context, eventType, data, fireUA) => {

    // ga4 event
    sendGA4Analytics(eventType, data);
    // ua event
    if(fireUA){
        context.analytics.fireTracking();
    }
};

export const fireAnalyticsEvent = (features, context, eventType, data) => {

    // ga4 event
    sendGA4Analytics(eventType, data);
    // ua event
    context.analytics.fireEvent(data);
};

export const sendGA4Analytics = (eventType, data) => {
    // use the event type to ensure our final event data is formatted according to what GA4 is expecting
    const eventData = verifyEventModel(eventType, data);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);

    if (eventData && eventData.event && window.analytics && window.analytics.track){
        window.analytics.track(eventType, eventData);
    }
};