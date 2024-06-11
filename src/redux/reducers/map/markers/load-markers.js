import { LOADING_MARKERS } from '../../../actions/map/markers/load-map-markers';

export default(state = [], action) => {
    switch(action.type){
        case LOADING_MARKERS:
            return action.payload;
        default:
            return state;
    }
};