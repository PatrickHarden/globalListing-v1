import { combineReducers } from 'redux';

import markers from './markers';
import infoWindow from './infoWindow';
import overrideDefaultsReducer from './overrides/override-defaults';

export default combineReducers({
    markers: markers,
    infoWindow: infoWindow,
    overrideDefaults: overrideDefaultsReducer
});