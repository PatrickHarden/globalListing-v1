import { combineReducers } from 'redux';
import currentInfoWindowProperty from './current-iw-property';
import currentInfoWindowGroup from './current-iw-group';

export default combineReducers({
    current: currentInfoWindowProperty,
    currentGroup: currentInfoWindowGroup
});