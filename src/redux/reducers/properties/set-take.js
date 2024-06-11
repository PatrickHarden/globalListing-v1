import { CHANGE_TAKE } from '../../actions/properties/change-paging';

export default(state = [], action) => {
    switch(action.type){
        case CHANGE_TAKE:
            return action.payload;
        default:
            return state;
    }
};