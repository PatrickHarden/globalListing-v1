export const currentMapMarkersSelector = (state) => {
    return state && state.map && state.map.markers ? state.map.markers.current : [];
};