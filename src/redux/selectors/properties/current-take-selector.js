export const currentTakeSelector = (state) => {
    return state && state.properties ? state.properties.take : undefined;
};