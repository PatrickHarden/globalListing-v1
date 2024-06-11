export const overrideDefaultSelector = (state) => {
    return state && state.map && state.map.overrideDefaults && state.map.overrideDefaults && state.map.overrideDefaults.override ? state.map.overrideDefaults : undefined;
};