import Ajax from '../../../../utils/ajax';
import { constructPropertiesListURL } from '../../../server/utils';
import { loadProperties, setPropertiesLoading } from '../../properties/load-properties';
import { setMapOverrides } from '../overrides/override-defaults';

// constants and events that are used by reducers to capture data changes

// loading markers
export const LOADING_MARKERS = 'LOADING_MARKERS';

export const setMarkersLoading = (payload) => ({
    type: LOADING_MARKERS,
    payload
});

// current markers
export const SET_CURRENT_MARKERS = 'SET_CURRENT_MARKERS';

export const setCurrentMarkers = (payload) => ({
    type: SET_CURRENT_MARKERS,
    payload
});

// all markers
export const SET_ALL_MARKERS = 'SET_ALL_MARKERS';

export const setAllMarkers = (payload) => ({
    type: SET_ALL_MARKERS,
    payload
});

// id lookup
export const SET_MARKER_ID_LOOKUP = 'SET_MARKER_ID_LOOKUP';

export const setIdLookup = (payload) => ({
    type: SET_MARKER_ID_LOOKUP,
    payload
});

// aspect lookup
export const SET_MARKER_ASPECT_LOOKUP = 'SET_MARKER_ASPECT_LOOKUP';

export const setAspectLookup = (payload) => ({
    type: SET_MARKER_ASPECT_LOOKUP,
    payload
});

// viewable marker count
export const SET_VIEWABLE_MARKER_COUNT = 'SET_VIEWABLE_MARKER_COUNT';

export const setStoreViewableMarkerCount = (payload) => ({
    type: SET_VIEWABLE_MARKER_COUNT,
    payload
});

export const loadCurrentMarkers = (context, params) => (dispatch, getState) => { 

    dispatch(setPropertiesLoading(true));
    dispatch(setMarkersLoading(true));

    const paramsCopy = Object.assign({}, params);

    if(!paramsCopy.radius){
        paramsCopy.radius = 8000;
    }

    delete paramsCopy.polygons;
    delete paramsCopy.initialPolygons;
    delete paramsCopy.initialRadius;

    if(!paramsCopy.broker && !paramsCopy['Common.Agents.Common.AgentOffice']){   
    
        const overrides = {
            override: true,
            center: {lat: paramsCopy.lat, lng: paramsCopy.lon ? paramsCopy.lon : paramsCopy.lng},
            radius: params.radius,
            bounds: params.polygons
        };

        dispatch(setMapOverrides(overrides));
    }
    
    const paging = '&PageSize=1000000&Page=1';
    const selectQuery = '&_select=Common.PrimaryKey,Common.Coordinate,Common.GeoLocation';
    const url = constructPropertiesListURL(context, paramsCopy, paging, selectQuery);

    Ajax.call(
        url,
        function(data){
            const formattedMapMarkers = formatMapMarkers(data.Documents[0]);
            mergeMapMarkers(formattedMapMarkers, getState(), dispatch);
            // dispatch(loadProperties(context, params));    // load the first chunk of properties
        }
    );
};

const formatMapMarkers = (markers) => {
    // convert the data
    return markers.map(marker => {
        return {
            'id': marker['Common.PrimaryKey'],
            'Coordinates': {
                'lat': parseFloat(marker['Common.Coordinate'].lat),
                'lon': parseFloat(marker['Common.Coordinate'].lon)
            },
            'GeoLocation': {
                'exact': marker['Common.GeoLocation'] ? marker['Common.GeoLocation']['Common.Exact'] : true
            },
            'showInfo': true,
            'active': true
        };
    });
};

const mergeMapMarkers = (markers, state, dispatch) => {

    dispatch(setCurrentMarkers(markers));
    dispatch(setMarkersLoading(false));
};