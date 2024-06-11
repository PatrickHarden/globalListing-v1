import _ from 'lodash';
import APIMapping from  '../../constants/APIMapping';

// Helper functions

// Get mapped property name
const getMappedProp = (map, prop) => {
    var _match = {
        original: prop,
        mapped: null
    };
    // Loop through map properties
    _.forOwn(map, function (value, key) {
        // Compare property value to the property we're mapping
        if (value === prop || (value.hasOwnProperty('_key') && value._key === prop)) {
            // Save match if found
            _match.mapped = key;
        }
    });
    // Pass it back to caller
    return _match;
};

// For export

// Build an object with some properties used by all three main traversal methods
export const Options = (prop, opts) => {
    var _opts = _.clone(opts) || {};
    // If we have a contextual map use that otherwise use the default API mapping
    _opts.map = _opts.map || APIMapping;
    // Get the mapped name of the item we're processing
    _opts.prop = getMappedProp(_opts.map, prop);
    // If no context has been built set to an empty object
    _opts.context = _opts.context || {};
    return _opts;
};

// Get type of object being processed
export const getType = (item) => {
    if (_.isPlainObject(item)) {
        return 'object';
    }
    if (_.isArray(item)) {
        return 'array';
    }
    return 'string';
};

// Build context of item for our new, mapped, object
export const getContext = (context, prop, i, slice) => {
    // If item is part of an array set its index
    var _indexString = _.isNumber(i) ? '[' + i + ']' : '',
        _mapped = prop.mapped + _indexString,
        _original = '["' + prop.original + '"]' + _indexString;

    // If we are building an array slice we need to remove the original item from the context
    if (slice) {
        context.original = context.original.replace('["' + prop.original + '"]', '');
        context.mapped = context.mapped.replace(prop.mapped, '');
    }

    // Build the rest of the item context
    if (
        (prop.mapped !== (context.mapped ? context.mapped.replace(/(\[.*?])/, '') : context.mapped) || slice) && !isPrivateProp(prop.mapped)
    ) {
        return {
            original: (context.original ? context.original + '.' : '') + _original,
            mapped: (context.mapped ? context.mapped + '.' : '') + _mapped
        };
    } else {
        return context;
    }
};

// Return true if this property is a reserved, functional, property
export const isPrivateProp = (prop) => {
    var _isPrivate = false;
    if (prop.charAt(0) === '_') {
        _isPrivate = true;
    }
    return _isPrivate;
};

// Return a default property value based on type
export const getDefaultValue = (type, val) => {
    if(val){
        return val;
    }
    switch (type) {
        case 'object':
            return {};
        case 'array':
            return [];
        case 'boolean':
            return false;
        default:
            return '';
    }
};
