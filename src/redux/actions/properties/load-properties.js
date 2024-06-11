import Ajax from '../../../utils/ajax';
import buildPropertyObject from '../../../utils/buildPropertyObject';
import DefaultValues from '../../../constants/DefaultValues';
import { constructPropertiesListURL } from '../../server/utils';
import { setPropertiesContext } from './set-properties-context';
import { checkPolygonForAntiMeridianIntersection } from '../../../utils/checkParamsForAntiMeridian';
import { setStoreViewableMarkerCount } from '../../../redux/actions/map/markers/load-map-markers';
import { isPrerender } from '../../../utils/browser';

// constants
export const SET_CURRENT_PROPERTIES = 'SET_CURRENT_PROPERTIES';

export const setCurrentProperties = (payload) => ({
    type: SET_CURRENT_PROPERTIES,
    payload
});

export const SET_ALL_PROPERTIES = 'SET_ALL_PROPERTIES';

export const setAllProperties = (payload) => ({
    type: SET_ALL_PROPERTIES,
    payload
});

export const LOADING_PROPERTIES = 'LOADING_PROPERTIES';

export const setPropertiesLoading = (payload) => ({
    type: LOADING_PROPERTIES,
    payload
});

export const SET_PROPERTY_ID_LOOKUP = 'SET_PROPERTY_ID_LOOKUP';

export const setPropertyIdLookup = (payload) => ({
    type: SET_PROPERTY_ID_LOOKUP,
    payload
});

export const loadProperties = (context, params, page, take, overrideParams) => (dispatch, getState) => { 


    // current properties is what we are trying to figure out based on the current take
    let currentProperties = [];
    const allProperties = getState().properties.allProperties || {};
    let serverPullRequired = true;

    if(!page || page <= 0){
        page = 1;
    }

    // determine our take (records per page)
    if(!take || take <= 0){
        take = getState().properties.take;
    }    

    // first, check the property id lookup stored in state to figure out if we've already loaded the properties requested in the take
    // if we have, then we'll pull those properties in directly instead of going out to the server
    const propertyIdLookup = getState().properties.propertyIdLookup || [];

    if(propertyIdLookup.length > (take * page)){
        serverPullRequired = false;
        // if this is true, we have all the properties already cached, so we'll go ahead and just pull them from the redux store
        const startIdx = ((take - 1) * page);   // find the start idx
        const pullTo = (take * page);    
        for(let x = startIdx; x < pullTo; x++){
            const propertyId = propertyIdLookup[x];
            currentProperties.push(allProperties[propertyId]); 
            dispatch(setCurrentProperties(currentProperties));
        }
    }


    if (isPrerender){
        const culture = context.stores.ConfigStore.getItem('language') || DefaultValues.culture;
        const units = context.stores.ParamStore.getParam('Unit') || DefaultValues.uom;
        const currency = context.stores.ParamStore.getParam('CurrencyCode') || DefaultValues.currency;
        const urlSlug = context.stores.ConfigStore.getItem('urlPropertyAddressFormat') || DefaultValues.urlPropertyAddressFormat;
        var siteId = context.stores.ConfigStore.getItem('siteId');
        const url = context.stores.ConfigStore.getItem('api') + '/propertylistings/query?Site=' + siteId + '&PageSize=400&Page=1';
        Ajax.call(
            url,
            function(data){
                const properties = data.Documents[0].map(doc =>
                    buildPropertyObject(
                        doc,
                        culture,
                        units,
                        currency,
                        urlSlug,
                        context.stores.ConfigStore
                    )
                );

                // ensure we record the id lookup for future caching
                const idLookups = properties.map((property) => {return property.PropertyId;});
                dispatch(setPropertyIdLookup(propertyIdLookup.concat(idLookups)));
                // likewise, store the property reference off in all properties so we can pull from memory later
                const allPropertiesNewData = {};
                properties.forEach(property => allPropertiesNewData[property.PropertyId] = property);
                dispatch(setAllProperties(Object.assign(allProperties, allPropertiesNewData)));
                // finally, dispatch the current set of properties that will be displayed in the list view
                currentProperties = currentProperties.concat(properties);

                const propertyContext = findPropertiesContext(params ? params : overrideParams, currentProperties);

                if(propertyContext && propertyContext.length > 0){

                    dispatch(setPropertiesContext(propertyContext));
                }

                dispatch(setCurrentProperties(currentProperties));
                dispatch(setPropertiesLoading(false)); 
                
                if(currentProperties.length === 0)
                {
                    dispatch(setStoreViewableMarkerCount(currentProperties.length));
                }
            }
        );
    }


    if(serverPullRequired && !isPrerender){

        if(getState() && getState().properties && !getState().properties.loading){
            dispatch(setPropertiesLoading(true));
        }

        const paging = '&PageSize=' + take + '&Page=' + page;

        let urlParams = params;
        let urlOverrideParams = overrideParams;

        if(urlParams){
            urlParams = checkPolygonForAntiMeridianIntersection(urlParams);
        }
        if(urlOverrideParams){
            urlOverrideParams = checkPolygonForAntiMeridianIntersection(urlOverrideParams);
        }

        const url = constructPropertiesListURL(context, urlParams, paging, undefined, urlOverrideParams);

        const culture = context.stores.ConfigStore.getItem('language') || DefaultValues.culture;
        const units = context.stores.ParamStore.getParam('Unit') || DefaultValues.uom;
        const currency = context.stores.ParamStore.getParam('CurrencyCode') || DefaultValues.currency;
        const urlSlug = context.stores.ConfigStore.getItem('urlPropertyAddressFormat') || DefaultValues.urlPropertyAddressFormat;

        Ajax.call(
            url,
            function(data){
                const properties = data.Documents[0].map(doc =>
                    buildPropertyObject(
                        doc,
                        culture,
                        units,
                        currency,
                        urlSlug,
                        context.stores.ConfigStore
                    )
                );

                // ensure we record the id lookup for future caching
                const idLookups = properties.map((property) => {return property.PropertyId;});
                dispatch(setPropertyIdLookup(propertyIdLookup.concat(idLookups)));
                // likewise, store the property reference off in all properties so we can pull from memory later
                const allPropertiesNewData = {};
                properties.forEach(property => allPropertiesNewData[property.PropertyId] = property);
                dispatch(setAllProperties(Object.assign(allProperties, allPropertiesNewData)));
                // finally, dispatch the current set of properties that will be displayed in the list view
                currentProperties = currentProperties.concat(properties);

                const propertyContext = findPropertiesContext(params ? params : overrideParams, currentProperties);

                if(propertyContext && propertyContext.length > 0){

                    dispatch(setPropertiesContext(propertyContext));
                }

                dispatch(setCurrentProperties(currentProperties));
                dispatch(setPropertiesLoading(false)); 
                
                if(currentProperties.length === 0)
                {
                    dispatch(setStoreViewableMarkerCount(currentProperties.length));
                }
            }
        );
    }else{
        dispatch(setPropertiesLoading(false));
    }
};

// find the "context" or "who" the listings are for, generally only used on the broker page
const findPropertiesContext = (params, properties) => {
    // for now, use the broker e-mail stored in params and match it to the first contact / property found, then pull the name from that data
    let propertiesContext = undefined;
    if(params && params.broker && params.broker.length > 0){
        for(let p = 0; p < properties.length; p++){
            const property = properties[p];
            if(property && property.ContactGroup && property.ContactGroup.contacts){
                for(let c = 0; c < property.ContactGroup.contacts.length; c++){
                    const contact = property.ContactGroup.contacts[c];
                    if(contact.email && String(contact.email).toLowerCase().trim() === String(params.broker).toLowerCase().trim()){
                        propertiesContext = contact.name;
                        break;
                    }
                }
                if(propertiesContext){
                    break;
                }
            }
        }
    }else if(params && params['Common.Agents.Common.AgentOffice']){
        // agent office broken up with ^, i.e., NEW^YORK^Albany, grab the last item and make it the context
        const agentOffice = params['Common.Agents.Common.AgentOffice'];
        if(agentOffice && agentOffice.length > 0){
            const agentOfficeParts = agentOffice.split('^');
            propertiesContext = agentOfficeParts[agentOfficeParts.length - 1];
        }
    }
    return propertiesContext;
};