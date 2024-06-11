export const initialState = {
    map: {
        overrideDefaults: {
            override: false,
            center: undefined,
            radius: undefined,
            bounds: undefined
        },
        markers: {
            current: [],
            data: [],
            idLookup: {},
            aspectLookup: {},
            loading: true,
            viewableMarkerCount: -1
        },
        infoWindow: {
            current: {},
            currentGroup: {}
        }
    },
    properties : {
        page: 1,
        take: 25,
        current: [],
        data: [],
        propertyIdLookup: [],
        loadedGroups: {},
        loading: true,
        propertiesContext: ''
    }
};