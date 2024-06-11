import { SET_MARKER_ASPECT_LOOKUP } from '../../../actions/map/markers/load-map-markers';

export default(state = [], action) => {
    switch(action.type){
        case SET_MARKER_ASPECT_LOOKUP:
            return Object.assign({},action.payload);
        default:
            return state;
    }
};