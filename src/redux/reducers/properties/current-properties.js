import { SET_CURRENT_PROPERTIES } from '../../actions/properties/load-properties';

export default(state = [], action) => {
    switch(action.type){
        case SET_CURRENT_PROPERTIES:
            return [...action.payload];
        default:
            return state;
    }
};