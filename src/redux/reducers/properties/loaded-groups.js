import { GROUP_LOADED } from '../../actions/properties/group-loaded';

export default(state = {}, action) => {
    switch(action.type){
        case GROUP_LOADED:
            // an integer group id will be passed
            return Object.assign(state, action.payload);
        default:
            return state;
    }
};