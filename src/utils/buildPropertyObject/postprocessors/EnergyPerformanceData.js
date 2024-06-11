import _ from 'lodash';
module.exports = (item, _comparators, _urlslug, _returnProperty) => {
    let _tmp = _.clone(item);
    let _ecp = _.clone(_returnProperty.EPC);
    if (_tmp.ukuri == '' && _ecp.url !== ''){
        _tmp.ukuri = _ecp.uri;
    }
    if (_ecp.uri == '' && _tmp.ukuri !== ''){
        _ecp.uri = _tmp.ukuri;
    }
    return [
        {
            prop: 'EnergyPerformanceData',
            val: _tmp
        },
        {
            prop: 'EPC',
            val: _ecp
        }
    ];
};