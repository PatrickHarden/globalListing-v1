export const currentInfoWindowPropertySelector = (state) => {
    return state && state.map && state.map.infoWindow ? state.map.infoWindow.current : [];
};