import Ajax from '../../../../utils/ajax';
import { setPropertyIdLookup } from '../../properties/load-properties';
import buildPropertyObject from '../../../../utils/buildPropertyObject';
import DefaultValues from '../../../../constants/DefaultValues';
import { constructSinglePropertyURL } from '../../../server/utils';
import { setGroupLoaded } from '../../properties/group-loaded';

// loading markers
export const SET_CURRENT_INFO_WINDOW_PROPERTY = 'SET_CURRENT_INFO_WINDOW_PROPERTY';

export const setCurrentInfoWindowProperty = (payload) => ({
    type: SET_CURRENT_INFO_WINDOW_PROPERTY,
    payload
});

export const SET_CURRENT_INFO_WINDOW_GROUP = 'SET_CURRENT_INFO_WINDOW_GROUP';

export const setCurrentInfoWindowGroup = (payload) => ({
    type: SET_CURRENT_INFO_WINDOW_GROUP,
    payload
});

export const loadCurrentInfoWindowProperty = (context, propertyId) => (dispatch, getState) => { 

    const propertyIdLookup = getState().properties.propertyIdLookup;

    if(propertyIdLookup && propertyIdLookup[propertyId]){
        // property is cached, so set our store and set it as the current property
        dispatch(setCurrentInfoWindowProperty(propertyIdLookup[propertyId]));
    }else{

        const url = constructSinglePropertyURL(context, propertyId);

        Ajax.call(
            url,
            function(data){
                const property = buildPropertyObject(
                    data.Document,
                    context.stores.ConfigStore.getItem('language') || DefaultValues.culture,
                    context.stores.ParamStore.getParam('Unit') || DefaultValues.uom,
                    context.stores.ParamStore.getParam('CurrencyCode') || DefaultValues.currency,
                    context.stores.ConfigStore.getItem('urlPropertyAddressFormat') || DefaultValues.urlPropertyAddressFormat,
                    context.stores.configStore
                );
                propertyIdLookup[propertyId] = property;
                dispatch(setPropertyIdLookup(propertyIdLookup));
                dispatch(setCurrentInfoWindowProperty(property));      // update the property lookup so its cached
            }
        );
    }    
};

export const loadCurrentInfoWindowGroup = (context, groupedProperties, groupId) => (dispatch, getState) => { 
    const propertyIdLookup = getState().properties.propertyIdLookup;
    const loadedGroups = getState().properties.loadedGroups;

    if(loadedGroups && loadedGroups[groupId]){
        // the group has already been loaded
        dispatch(setCurrentInfoWindowGroup(loadedGroups[groupId]));
    }else{
        // load the group and it's properties (if not already loaded)
        const propertyReferences = [];
        let loadedCount = 0;
        if(groupedProperties && groupedProperties.length > 0){
            groupedProperties.forEach(groupedProperty => {
                const property = groupedProperty.property;
                if(propertyIdLookup && !propertyIdLookup[property.id]){
                    const url = constructSinglePropertyURL(context, property.id);
                    Ajax.call(
                        url,
                        function(data){
                            const propObj = buildPropertyObject(
                                data.Document,
                                context.stores.ConfigStore.getItem('language') || DefaultValues.culture,
                                context.stores.ParamStore.getParam('Unit') || DefaultValues.uom,
                                context.stores.ParamStore.getParam('CurrencyCode') || DefaultValues.currency,
                                context.stores.ConfigStore.getItem('urlPropertyAddressFormat') || DefaultValues.urlPropertyAddressFormat,
                                context.stores.configStore
                            );
                            loadedCount++;
                            propertyIdLookup[property.id] = propObj;
                            dispatch(setPropertyIdLookup(propertyIdLookup));    
                            propertyReferences.push(propObj);

                            if(loadedCount === groupedProperties.length){
                                
                                const group = {
                                    groupId: groupId,
                                    properties: propertyReferences 
                                };
                                dispatch(setPropertyIdLookup(propertyIdLookup));
                                dispatch(setGroupLoaded(loadedGroups[groupId] = group));
                                dispatch(setCurrentInfoWindowGroup(group));
                            }
                        }
                    );
                }
            });
        }
    }
};