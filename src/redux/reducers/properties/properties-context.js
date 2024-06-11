import { SET_PROPERTIES_CONTEXT } from '../../actions/properties/set-properties-context';

export default(state = [], action) => {
    switch(action.type){
        case SET_PROPERTIES_CONTEXT:
            return action.payload;
        default:
            return state;
    }
};