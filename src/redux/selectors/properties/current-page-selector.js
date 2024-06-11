export const currentPageSelector = (state) => {
    return state && state.properties ? state.properties.page : undefined;
};