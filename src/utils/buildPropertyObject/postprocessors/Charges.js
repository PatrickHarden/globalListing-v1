import _ from 'lodash';

module.exports = (
  item,
  _comparators,
  _urlslug,
  _returnProperty,
  configStore
) => {
  var currency = _comparators['currency'],
    chargeTypes = [
      'SalePrice',
      'Rent',
      'BusinessRates',
      'ServiceCharge',
      'AdditionalRent',
      'NetRent',
      'EstateCharge',
      'OperatingCost',
      'BrokerageFees',
      'Deposit',
      'InternaParkingSpaceCost',
      'InternalParkingSpaceCost',
      'ExternalParkingSpaceCost',
      'FlexRent'
    ],
    processedCharges = item,
    renderedCharges = [],
    leasesAndChargesSettings = null,
    chargesToDisplay = chargeTypes;
  if (configStore) {
    leasesAndChargesSettings = configStore.getLeasesAndCharges();
    let chargesToHide = _.keys(_.pickBy(leasesAndChargesSettings, _.identity));
    chargesToHide.forEach(function(value, index) {
      chargesToHide[index] = value.replace('hide', '');
      if (value === 'hideInternalParkingSpaceCost') {
        chargesToHide.push('InternaParkingSpaceCost');
      }
    });
    chargesToDisplay = _.difference(chargeTypes, chargesToHide);
  }

  // For each type of charge kind, extract from charges any objects that relate to it in the request format.
  chargesToDisplay.forEach(function(chargeType) {
    // Get the relevant charges.
    var chargesOfType = _.filter(processedCharges, { chargeType: chargeType });
    if (chargesOfType.length) {
      // Get a translated charge, if available.
      var translatedCharge = _.remove(chargesOfType, {
          currencyCode: currency.toUpperCase()
        }),
        renderedCharge = null;
      // If charges still has a length (theoretically, a maximum of 1).
      if (chargesOfType.length) {
        // Set the charge to be remaining array member.
        renderedCharge = chargesOfType;

        // And if the translated charge exists
        if (translatedCharge.length) {
          renderedCharge.translated = translatedCharge;
        }
      } else if (translatedCharge.length) {
        // Otherwise if we have a translated charge
        renderedCharge = translatedCharge;
      }
      // Finally, push the charge.
      if (Array.isArray(renderedCharge)) {
        renderedCharge.forEach(charge => {
          renderedCharges.push(charge);
        })
      } else {
        renderedCharges.push(renderedCharge);
      }
    }
  });

  // Set charges to rendered charges
  return [
    {
      prop: 'Charges',
      val: renderedCharges
    }
  ];
};
