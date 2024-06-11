import { SET_CURRENT_INFO_WINDOW_GROUP } from '../../../actions/map/infoWindow/load-info-window-map-marker';

export default(state = {}, action) => {
    switch(action.type){
        case SET_CURRENT_INFO_WINDOW_GROUP:
            return Object.assign({},action.payload);
        default:
            return state;
    }
};