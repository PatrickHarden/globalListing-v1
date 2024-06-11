var APIMapping = require('../../constants/APIMapping'),
  DOMPurify = require('dompurify'),
  he = require('he'),
  _ = require('lodash'),
  _returnProperty,
  _receivedProperty,
  _comparators;

import postprocessors from './postprocessors';
import pickItem from './pickItem';
import {
  Options,
  getType,
  getContext,
  isPrivateProp,
  getDefaultValue
} from './helpers';

module.exports = function(
  property,
  culture,
  units,
  currency,
  _urlslug,
  configStore
) {
  // Exit if some conditional params don't exist
  if (
    typeof property === 'undefined' ||
    typeof culture === 'undefined' ||
    typeof units === 'undefined'
  ) {
    return null;
  }
  // Set up some initial vars
  _returnProperty = {};
  _comparators = {};
  _receivedProperty = _.clone(property);
  _comparators.culture = culture.toLowerCase();
  _comparators.units = units.toLowerCase();
  _comparators.currency = currency.toLowerCase();
  // Loop through all properties and start mapping values into new object
  _.forOwn(_receivedProperty, function(value, key) {
    _traverseItem[getType(value)](value, key);
  });
  // Final backfill of missing root properties
  _.forOwn(APIMapping, function(value, key) {
    _backFill(key);
  });

  // Postprocess special cases in our new object
  _.forOwn(_returnProperty, function(value, key) {
    if (postprocessors.hasOwnProperty(key)) {
      const items = postprocessors[key](
        value,
        _comparators,
        _urlslug,
        _returnProperty,
        configStore
      );
      if (items && items.length) {
        for (var i = 0; i < items.length; i++) {
          _returnProperty[items[i].prop] = items[i].val;
        }
      }
    }
  });

  // Return the new object
  return _returnProperty;
};
/*
 Core functionality
 */
// Functions for traversing the different types of property values in the main Property object
var _traverseItem = {
  string: function(item, prop, opts) {
    // When we hit this point we are just writing the value from the old to the new
    var _opts = new Options(prop, opts),
      _item;
    // Format property value
    if (_opts.prop.mapped) {
      if (_.isString(item)) {
        _item = he.decode(DOMPurify.sanitize(item));
      } else {
        _item = item;
      }
    }
    // Build context path
    var _path = _opts.prop.mapped;
    if (_opts.context.mapped && _opts.context.mapped !== _opts.prop.mapped) {
      _path =
        _opts.context.mapped + (_opts.isArray ? '' : '.' + _opts.prop.mapped);
    }
    // Insert value
    if (_item || typeof _item === 'boolean' || typeof _item === 'number') {
      _.set(_returnProperty, _path, _item);
    }
  },
  object: function(item, prop, opts) {
    var _opts = new Options(prop, opts);

    if (_opts.prop.mapped) {
      _.forOwn(item, function(value, key) {
        // Set properties to standard values
        var _item = value,
          // Set default context - if this object is part of an array of objects use existing context otherwise create new context
          _context =
            _opts.isArray || _opts.collapsed
              ? _opts.context
              : getContext(_opts.context, _opts.prop),
          _map = _opts.map[_opts.prop.mapped];
        // If this is traversing a collapsible or sliced array object
        if (_opts.collapseArray || (_opts.sliceArray && !_opts.sliced)) {
          // Set the map and prop to belong to the parent item
          _map = _opts.map;
          key = prop;
          // Pick the correct item/s
          _item = pickItem(
            _map[_opts.prop.mapped],
            _context,
            _receivedProperty,
            _comparators
          );
        }
        if (_item || typeof _item === 'boolean' || typeof _item === 'number') {
          _traverseItem[getType(_item)](_item, key, {
            map: _map,
            context: _context,
            collapsed: _opts.collapsed || _opts.collapseArray,
            sliced: _opts.sliced || _opts.sliceArray
          });
        }
        // If this is traversing a collapsible object we only need to process its content once so jump out of loop
        if (_opts.collapseArray) {
          return false;
        }
      });
    }
  },
  array: function(item, prop, opts) {
    var _opts = new Options(prop, opts);

    if (_opts.prop.mapped) {
      for (var i = 0; i < item.length; i++) {
        var _collapseArray = _opts.map[_opts.prop.mapped].hasOwnProperty(
          '_collapseArray'
        );
        var _sliceArray = _opts.map[_opts.prop.mapped].hasOwnProperty(
          '_sliceArray'
        );
        _traverseItem[getType(item[i])](item[i], prop, {
          map: _opts.map,
          isArray: true,
          context: getContext(
            _opts.context,
            _opts.prop,
            _collapseArray || (_sliceArray && !_opts.sliced) ? null : i,
            _opts.sliced
          ),
          collapseArray: _collapseArray,
          sliceArray: _sliceArray,
          sliced: _opts.sliced
        });

        // If this is traversing a collapsible array object we only need to process its content once so jump out of loop
        if (_collapseArray || (_sliceArray && !_opts.sliced)) {
          return false;
        }
      }
    }
  }
};
// Replace undefined properties with empty defaults
function _backFill(key, context) {
  // Create a context for getting / setting value
  context = (context ? context + '.' : '') + key;
  // If this property is a candidate for backfilling
  if (!isPrivateProp(key)) {
    // Get the expected type from the API map (need to remove any array indexes from the context)
    var _map = _.get(APIMapping, context.replace(/(\[.*?])/, '')),
      _expected = _map && _map._expectedType ? _map._expectedType : null,
      _value = _map && _map._backfillValue ? _map._backfillValue : null,
      _prop = _.get(_returnProperty, context);

    if (_prop || typeof _prop === 'boolean' || typeof _prop === 'number') {
      // If the property is populated check its children
      // If it's an object we can just run through the map again
      if (_.isPlainObject(_prop)) {
        _.forOwn(_map, function(value, key) {
          _backFill(key, context);
        });
      }
      // Else if it's an array we loop through the array items and run the mapping for each one
      if (_.isArray(_prop)) {
        for (var i = 0; i < _prop.length; i++) {
          _.forOwn(_map, recurse.bind(this, i));
        }
      }
    } else {
      // If the property has no value fill it with its default
      _.set(_returnProperty, context, getDefaultValue(_expected, _value));
      if (_expected === 'object') {
        _.forOwn(_map, function(value, key) {
          _backFill(key, context);
        });
      }
    }
  }
  function recurse(i, value, key) {
    // We don't want to backfill this if the item is just a string in an array
    if (isNaN(key)) {
      _backFill(key, context + '[' + i + ']');
    }
  }
}
