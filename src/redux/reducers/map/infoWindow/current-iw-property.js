import { SET_CURRENT_INFO_WINDOW_PROPERTY } from '../../../actions/map/infoWindow/load-info-window-map-marker';

export default(state = [], action) => {
    switch(action.type){
        case SET_CURRENT_INFO_WINDOW_PROPERTY:
            return Object.assign({},action.payload);
        default:
            return state;
    }
};