import { eventTypes } from '../event-types';
import { glPDPPageView } from './gl-pdp-pageview';
import { glPLPPageView } from './gl-plp-pageview';
import { glInteraction } from './gl-interaction';
import { glFormStarted } from './gl-form-started';
import { glFormLoaded } from './gl-form-loaded';
import { glFormSubmitted } from './gl-form-submitted';
import { glSearch } from './gl-search';

export const findEventModel = (eventType) => {
    if(eventType === eventTypes.PDP_PAGE_VIEW){
        return glPDPPageView;
    }else if(eventType === eventTypes.PLP_PAGE_VIEW){
        return glPLPPageView;
    }else if(eventType === eventTypes.INTERACTION){
        return glInteraction;
    }else if(eventType === eventTypes.SEARCH){
        return glSearch;
    }else if(eventType === eventTypes.FORM_LOADED){
        return glFormLoaded;
    }else if(eventType === eventTypes.FORM_STARTED){
        return glFormStarted;
    }else if(eventType === eventTypes.FORM_SUBMITTED){
        return glFormSubmitted;
    }
    return {};
};