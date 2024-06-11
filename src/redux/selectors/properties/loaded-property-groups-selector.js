export const loadedGroupsSelector = (state) => {
    return state && state.properties && state.properties.loadedGroups ? state.properties.loadedGroups : {};
};