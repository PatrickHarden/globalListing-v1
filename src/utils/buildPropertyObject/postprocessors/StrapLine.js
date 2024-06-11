import _ from 'lodash';

module.exports = (item) => {
    var _tmp = _.clone(item);
    if (item.hasOwnProperty('content')) {
        _tmp = item.content;
    } else if (_.isEmpty(_tmp) || _.isEmpty(item.content)) {
        _tmp = '';
    }

    return [
        {
            prop: 'StrapLine',
            val: _tmp
        }
    ];
};
