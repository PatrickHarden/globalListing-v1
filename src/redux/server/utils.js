import _ from 'lodash';
import paramMapping from '../../constants/ParamMapping';
import createQueryString from '../../utils/createQueryString';
import haversine from '../../utils/haversine';

const mapParams = (p, outgoing) => {
    var params = _.clone(p) || {};

    for (var param in paramMapping) {
      if (paramMapping.hasOwnProperty(param)) {
        if (outgoing) {
          if (params.hasOwnProperty(param)) {
            if (paramMapping[param] && paramMapping[param] !== param) {
              params[paramMapping[param]] = params[param];
              delete params[param];
            }

            if (!paramMapping[param]) {
              delete params[param];
            }
          }
        } else {
          if (params.hasOwnProperty(paramMapping[param])) {
            if (paramMapping[param] && paramMapping[param] !== param) {
              params[param] = params[paramMapping[param]];
              delete params[paramMapping[param]];
            }
          }
        }
      }
    }
    return params;
};

// construct a url that loads a list of properties
// param: paging should be a string in form (as an example): '&PageSize=100&Page=1;
// param: overrideSelect should be a string in form (as an example): '&_select=Common.PrimaryKey,Common.Coordinate,Common.GeoLocation'
export const constructPropertiesListURL = (context, params, paging, overrideSelect, overrideParams) => {

    const mode = context.stores.ParamStore.getParam('searchMode');

    if (context.stores.SearchStateStore.getItem('extendedSearch')) {
        params.Sort = 'asc(_distance)';
        switch (mode) {
            case 'bounding':
                delete params.polygons;
                delete params.radius;
                break;
            case 'pin':
                delete params.radius;
                break;
        }
    }

    if(params && params.radius && !parseFloat(params.radius)){
        delete params.radius;
    }

    // If we're in bounding mode and we're passing a radius
    // We need to work out the actual required radius by adding the user defined value to the distance between the polygon centre and it's Northeast corner
    if (mode === 'bounding') {
        if (params && params.radius) {
            const polygon = context.stores.SearchStateStore.getItem(
                'searchLocationPolygon'
            );

            if (polygon) {
                params.radius = haversine(
                    polygon,
                    params.radius,
                    params.RadiusType
                );
            }
        }
    }

    if(overrideParams){
        params = mapParams(overrideParams, true);
    }else{
        // if we're in deeplinked favourites view we need to discard all the previous logic and fix the result set
        if (context.stores.SearchStateStore.getAll().isFavourites) {
            // fetchAll = true;
            params = {
                Site: context.stores.ParamStore.getParam('Site'),
                propertyId: params.propertyId
            };

            const requireParams = ['CurrencyCode', 'Unit', 'Interval'];
            requireParams.forEach(param => {
                let val;
                if (val === context.stores.ParamStore.getParam(param)) {
                    params[param] = val;
                }
            });
        }
        
        params = mapParams(params, true);
    }
    delete params.initialPolygons;
    delete params.initialRadius;
    let queryString = createQueryString(params);

    if(paging && paging.length > 0){
        queryString += paging;
    }

    const selectFields = context.stores.PropertyStore.getPropertiesMap();
    if(overrideSelect && overrideSelect.length > 0){
        queryString += overrideSelect;
    }else if(selectFields !== null && selectFields !== undefined){
        queryString += '&_select=' + selectFields.join();
    }

    return context.stores.ConfigStore.getItem('api') + '/propertylistings/query' + queryString;
};


// construct a URL to post a single property
export const constructSinglePropertyURL = (context, propertyId) => {

    const params = createQueryString(_.pick(context.stores.ParamStore.getParams(), ['CurrencyCode','Unit','Interval','Site']));

    return context.stores.ConfigStore.getItem('api') + '/propertylisting/' + propertyId + params;

};