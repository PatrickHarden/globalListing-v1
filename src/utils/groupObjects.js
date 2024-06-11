import _ from 'lodash';
import hash from 'object-hash';
//grouping on properties

export default function (arr, property) {
    let newArray = [];
    const groups = _(arr)
        .map((e, i) => {
            e.hash = hash(e[property]);
            e.arrIndex = i;
            return e;
        })
        .groupBy('hash')
        .value();
    let i = 0;

    for (var key in groups) {
        if (groups.hasOwnProperty(key)) {
            if (groups[key].length > 1) {
                var group = {
                    key: 'group_' + i,
                    items: []
                };
                group[property] = groups[key][0][property];
                for (var a = 0; a < groups[key].length; a++) {
                    delete groups[key][a].hash;
                    group.items.push(groups[key][a]);
                }
                newArray.push(group);
                i++;
            } else {
                delete groups[key][0].hash;
                newArray.push(groups[key][0]);
            }
        }
    }

    return newArray;
}
