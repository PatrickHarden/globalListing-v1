export const markersLoadingSelector = (state) => {
    return state && state.map && state.map.markers ? state.map.markers.loading : false;
};