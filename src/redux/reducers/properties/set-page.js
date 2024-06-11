import { CHANGE_PAGE } from '../../actions/properties/change-paging';

export default(state = [], action) => {
    switch(action.type){
        case CHANGE_PAGE:
            return action.payload;
        default:
            return state;
    }
};