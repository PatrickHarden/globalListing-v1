import { SET_OVERRIDES } from '../../../actions/map/overrides/override-defaults';

export default(state = {}, action) => {
    switch(action.type){
        case SET_OVERRIDES:
            return Object.assign({}, action.payload);
        default:
            return state;
    }
};