export const viewableMarkerCountSelector = (state) => {
    return state && state.map && state.map.markers ? state.map.markers.viewableMarkerCount : 0;
};