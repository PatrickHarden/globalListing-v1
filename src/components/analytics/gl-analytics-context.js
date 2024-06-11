import {createContext} from 'react';

// form context using context API to pass around functions and any other values we need
export const GLAnalyticsContext = createContext({
    fireEvent: (...eventData) => {
        // fire some event
    },
    fireTracking: () => {
        // fire pageview
    }
});