// properties context is "who" the listings belong to, i.e., if it's a broker or team this might be used
export const SET_PROPERTIES_CONTEXT = 'SET_PROPERTIES_CONTEXT';

export const setPropertiesContext = (payload) => ({
    type: SET_PROPERTIES_CONTEXT,
    payload
});