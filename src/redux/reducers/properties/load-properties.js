import { LOADING_PROPERTIES } from '../../actions/properties/load-properties';

export default(state = [], action) => {
    switch(action.type){
        case LOADING_PROPERTIES:
            return action.payload;
        default:
            return state;
    }
};