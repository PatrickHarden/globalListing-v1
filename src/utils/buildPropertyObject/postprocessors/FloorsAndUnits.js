import _ from 'lodash';
import Charges from './Charges';

module.exports = (
    item,
    _comparators,
    _urlslug,
    _returnProperty,
    configStore
) => {
    var _tmp = item;
    var floorConfig;
    var detailsToDisplay = {};
    _tmp = _tmp.map(floor => {
        if (
            configStore &&
            configStore.getFloorsAndUnits() &&
            configStore.getFloorsAndUnits().showOnlyFloorFields
        ) {
            floorConfig =
                configStore.getFloorsAndUnits().showOnlyFloorFields || '';
            detailsToDisplay = {};
            if (
                floor['subdivisionName'] &&
                _.isPlainObject(floor['subdivisionName']) &&
                floor['subdivisionName'].hasOwnProperty('content')
            ) {
                detailsToDisplay['subdivisionName'] =
                    floor['subdivisionName'].content;
            } else {
                detailsToDisplay['subdivisionName'] = floor['subdivisionName'];
            }
            for (var key in floor) {
                if (floor.hasOwnProperty(key)) {
                    var obj = floor[key];
                    if (
                        floorConfig
                            .replace(' ', '')
                            .split(',')
                            .indexOf(key) !== -1
                    ) {
                        detailsToDisplay[key] = obj;
                    }
                    if (key === 'unitCharges') {
                        let floorConfigLowerCaseArray = floorConfig
                            .toLowerCase()
                            .replace(' ', '')
                            .split(',');
                        floor['unitCharges'].forEach(function(chargeType) {
                            if (
                                floorConfigLowerCaseArray.indexOf(
                                    chargeType.chargeType.toLowerCase()
                                ) !== -1
                            ) {
                                if (!detailsToDisplay['unitCharges']) {
                                    detailsToDisplay['unitCharges'] = [];
                                }
                                detailsToDisplay['unitCharges'].push(
                                    chargeType
                                );
                            }
                        });
                    }
                }
            }
            if (
                detailsToDisplay.unitCharges &&
                detailsToDisplay.unitCharges.length
            ) {
                detailsToDisplay.unitCharges = Charges(
                    detailsToDisplay.unitCharges,
                    _comparators
                )[0].val;
            }
        } else {
            detailsToDisplay = floor;
            if (
                configStore &&
                configStore.getFloorsAndUnits() &&
                configStore.getFloorsAndUnits().useDisplayName &&
                detailsToDisplay['subdivisionName'] &&
                _.isPlainObject(detailsToDisplay['subdivisionName']) &&
                detailsToDisplay['subdivisionName'].hasOwnProperty(
                    'displayName'
                )
            ) {
                detailsToDisplay['subdivisionName'] =
                    detailsToDisplay['subdivisionName'].displayName;
            } else if (
                detailsToDisplay['subdivisionName'] &&
                _.isPlainObject(detailsToDisplay['subdivisionName']) &&
                detailsToDisplay['subdivisionName'].hasOwnProperty('content')
            ) {
                detailsToDisplay['subdivisionName'] =
                    detailsToDisplay['subdivisionName'].content;
            }
            if (
                detailsToDisplay.unitCharges &&
                detailsToDisplay.unitCharges.length
            ) {
                detailsToDisplay.unitCharges = Charges(
                    detailsToDisplay.unitCharges,
                    _comparators
                )[0].val;
            }
        }
        return detailsToDisplay;
    });
    return [
        {
            prop: 'FloorsAndUnits',
            val: _tmp
        }
    ];
};
