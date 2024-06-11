export const currentPropertiesSelector = (state) => {
    return state && state.properties ? state.properties.current : [];
};