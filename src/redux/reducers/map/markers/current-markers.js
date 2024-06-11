import { SET_CURRENT_MARKERS } from '../../../actions/map/markers/load-map-markers';

export default(state = [], action) => {
    switch(action.type){
        case SET_CURRENT_MARKERS:
            return [...action.payload];
        default:
            return state;
    }
};