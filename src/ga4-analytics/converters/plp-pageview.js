import { get } from "lodash";

const addParam = (params, props, find, paramName) => {
    const extract = get(props, find);
    if(extract){
        return params += paramName + '&' + extract;
    }
    return params;
};

export const ConvertMapPagePropsForPLPPageView = (mapPageProps) => {

    // take the props passed to a map page and populate our page view model
    const data = {};

    // create the map initial params string
    let map_initial_params = '';
    map_initial_params = addParam(map_initial_params, mapPageProps, 'config.params.Lat', 'Lat');
    map_initial_params = addParam(map_initial_params, mapPageProps, 'config.params.Lon', 'Lon');
    map_initial_params = addParam(map_initial_params, mapPageProps, 'config.mapZoom.detailsMapInitialZoom', 'zoom');

    data.glMarketId = get(mapPageProps,'config.params.Site');
    data.search_url = get(mapPageProps,'location.pathname');
    data.property_type = get(mapPageProps,'config.params') ? mapPageProps.config.params['Common.UsageType'] : undefined;
    data.listing_type = get(mapPageProps,'config.params') ? mapPageProps.config.params['Common.Aspects'] : undefined;
    data.search_parameters = get(mapPageProps,'location.search');
    data.map_initial_parameters = map_initial_params;
    data.sort_order = get(mapPageProps, 'config.params.Sort');
    data.polygons = get(mapPageProps,'config.params.PolygonFilters');

    return data;
};