import { combineReducers } from 'redux';
import currentMarkersReducer from './current-markers';
import allMarkersReducer from './all-markers';
import idLookupMarkersReducer from './id-lookup';
import aspectLookupMarkersReducer from './aspect-lookup';
import loadingMarkersReducer from './load-markers';
import viewableMarkerCountReducer from './viewable-marker-count';

export default combineReducers({
    current: currentMarkersReducer,
    loading: loadingMarkersReducer,
    data: allMarkersReducer,
    idLookup: idLookupMarkersReducer,
    aspectLookup: aspectLookupMarkersReducer,
    viewableMarkerCount: viewableMarkerCountReducer
});