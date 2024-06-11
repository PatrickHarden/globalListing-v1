import _ from 'lodash';

module.exports = (item) => {
    var _tmp = item;
    for (var i = 0; i < item.length; i++) {
        if (item[i].hasOwnProperty('highlight') && _.isPlainObject(item[i].highlight) && item[i].highlight.hasOwnProperty('content')) {
            _tmp[i] = item[i].highlight.content;
        }
    }
    return [
        {
            prop: 'Highlights',
            val: _tmp
        }
    ];
};
