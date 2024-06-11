var paramMapping = require('../constants/ParamMapping'),
  _ = require('lodash');

module.exports = {
  hasParam: function(object, param) {
    if (object.hasOwnProperty(param)) {
      return param;
    }

    if (paramMapping.hasOwnProperty(param)) {
      if (object.hasOwnProperty(paramMapping[param])) {
        return paramMapping[param];
      }
    }

    for (var map in paramMapping) {
      if (paramMapping.hasOwnProperty(map) && paramMapping[map] === param) {
        if (object.hasOwnProperty(map)) {
          return map;
        }
      }
    }

    return false;
  },

  getMappedParam: function(param) {
    if (paramMapping.hasOwnProperty(param)) {
      return paramMapping[param];
    } else {
      return param;
    }
  },

  mapParams: function(p, outgoing) {
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
  }
};
