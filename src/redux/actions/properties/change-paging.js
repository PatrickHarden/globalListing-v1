import { loadProperties } from "./load-properties";

// constants
export const CHANGE_PAGE = 'CHANGE_PAGE';

export const changePage = (payload) => ({
    type: CHANGE_PAGE,
    payload
});

export const CHANGE_TAKE = 'CHANGE_TAKE';

export const changeTake = (payload) => ({
    type: CHANGE_TAKE,
    payload
});

export const changeTakeAndLoadProperties = (context, take) => (dispatch, getState) => {
    dispatch(loadProperties(context, context.stores.ParamStore.getParams(), 1, take));
    dispatch(changeTake(take));
    dispatch(changePage(1));    // reset page to 1
};

export const changePageAndLoadProperties = (context, page) => (dispatch, getState) => {
    let params = context.stores.ParamStore.getParams();
    params.polygons = '[[' +
        context.stores.SearchStateStore.getItem('searchLocationPolygon')
            .polygon +
        ']]';
    dispatch(loadProperties(context, params, page, getState().properties.take));
    dispatch(changePage(page));
};