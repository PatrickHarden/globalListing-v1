module.exports = item => {
  // If we have a sizeKind that has no dimensions associated we can remove it from the property object
  const checkHasValue = item => {
    let response = false;  
    const badValues = [null, undefined, ''];
    if (!badValues.includes(item.dimensions.area) && !badValues.includes(item.dimensions.units)) {
        response = true;
    }
    return response;
  }
  const _tmp = item.filter(checkHasValue);
  const returnArray = [
    {
      prop: 'Sizes',
      val: _tmp
    }
  ];

    // If any of the following properties exist in the Sizes array we can overwrite (or create) these properties
    // in the root object. This will satisfy requirements of both new and legacy codebase

    for (var i = 0; i < _tmp.length; i++) {
        if (_tmp[i].sizeKind === 'MinimumSize') {
            returnArray.push({
                prop: 'MinimumSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'MaximumSize') {
            returnArray.push({
                prop: 'MaximumSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'TotalSize') {
            returnArray.push({
                prop: 'TotalSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'UnitSize') {
            returnArray.push({
                prop: 'UnitSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'LandSize') {
            returnArray.push({
                prop: 'LandSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'LotDepthSize') {
            returnArray.push({
                prop: 'LotDepthSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'LotFrontSize') {
            returnArray.push({
                prop: 'LotFrontSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'OfficeSize') {
            returnArray.push({
                prop: 'OfficeSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'Other') {
            returnArray.push({
                prop: 'Other',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'RetailSize') {
            returnArray.push({
                prop: 'RetailSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'TotalBuildingSize') {
            returnArray.push({
                prop: 'TotalBuildingSize',
                val: _tmp[i].dimensions
            });
        }
        if (_tmp[i].sizeKind === 'WarehouseSize') {
            returnArray.push({
                prop: 'WarehouseSize',
                val: _tmp[i].dimensions
            });
        }
    }

    return returnArray;
};
