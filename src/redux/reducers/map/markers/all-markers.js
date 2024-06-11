import { SET_ALL_MARKERS } from '../../../actions/map/markers/load-map-markers';

export default(state = [], action) => {
    switch(action.type){
        case SET_ALL_MARKERS:
            return [...action.payload];
        default:
            return state;
    }
};