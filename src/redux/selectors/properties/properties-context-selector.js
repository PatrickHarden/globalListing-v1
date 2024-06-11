export const propertiesContextSelector = (state) => {
    return state && state.properties ? state.properties.propertiesContext : '';
};