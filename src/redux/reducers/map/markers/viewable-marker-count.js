import { SET_VIEWABLE_MARKER_COUNT } from '../../../actions/map/markers/load-map-markers';

export default(state = [], action) => {
    switch(action.type){
        case SET_VIEWABLE_MARKER_COUNT:
            return action.payload;
        default:
            return state;
    }
};