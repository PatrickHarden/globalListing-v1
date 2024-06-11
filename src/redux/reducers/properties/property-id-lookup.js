import { SET_PROPERTY_ID_LOOKUP } from '../../actions/properties/load-properties';

export default(state = [], action) => {
    switch(action.type){
        case SET_PROPERTY_ID_LOOKUP:
            return [action.payload];
        default:
            return state;
    }
};