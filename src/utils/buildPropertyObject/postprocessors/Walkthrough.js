import _ from 'lodash';

module.exports = item => {
    var _tmp = _.clone(item);
    var _interactivePlan = '';
    // Massive hack until we do this the correct way passing it back from the API as a node
    //checks to see if walkthrough url is a floored url, if so clears the walkthrough and adds value to InteractivePlan node
    if (item.includes('floored.com/')) {
        _interactivePlan = item;
        _tmp = '';
    } else if (_.isEmpty(_tmp)) {
        _tmp = '';
    }
    return [
        {
            prop: 'InteractivePlan',
            val: _interactivePlan
        },
        {
            prop: 'Walkthrough',
            val: _tmp
        }
    ];
};
