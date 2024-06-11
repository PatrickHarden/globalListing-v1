import { SET_ALL_PROPERTIES } from '../../actions/properties/load-properties';

export default(state = [], action) => {
    switch(action.type){
        case SET_ALL_PROPERTIES:
            return action.payload;
        default:
            return state;
    }
};