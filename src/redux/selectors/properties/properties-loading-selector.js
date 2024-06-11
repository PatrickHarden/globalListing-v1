export const propertiesLoadingSelector = (state) => {
    return state && state.properties ? state.properties.loading : false;
};