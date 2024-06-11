import { combineReducers } from 'redux';

import pageReducer from './set-page';
import takeReducer from './set-take';
import currentPropertiesReducer from './current-properties';
import allPropertiesReducer from './all-properties';
import propertiesLoadingReducer from './load-properties';
import propertyIdLookupReducer from './property-id-lookup';
import groupsLoadedReducer from './loaded-groups';
import propertiesContextReducer from './properties-context';

export default combineReducers({
    page: pageReducer,
    take: takeReducer,
    current: currentPropertiesReducer,
    loading: propertiesLoadingReducer,
    data: allPropertiesReducer,
    propertyIdLookup: propertyIdLookupReducer,
    loadedGroups: groupsLoadedReducer,
    propertiesContext: propertiesContextReducer
});