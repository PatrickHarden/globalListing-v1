export const currentInfoWindowGroupSelector = (state) => {
    return state && state.map && state.map.infoWindow ? state.map.infoWindow.currentGroup : [];
};