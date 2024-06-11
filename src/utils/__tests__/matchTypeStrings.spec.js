var matchTypeStrings = require('../matchTypeStrings');
var translationStrings = require('../../config/sample/master/translatables').i18n;

describe('matchTypeStrings', function () {
  it('should throw a TypeError if no translationStrings are given', function () {
    try {
       matchTypeStrings();
    } catch (e) {
      expect(e.name).toBe('TypeError');
    }
  });

  it('should return a default translation string if no PropertySubTypes are given', function () {
    var string = matchTypeStrings(translationStrings);
    expect(string).toBe('Properties');
  });

  it('should return default translation string if multiple PropertySubTypes are given', function () {
    var string = matchTypeStrings(translationStrings, 'Apartment,House,Studio');
    expect(string).toBe('Properties');
  });

  it('should return a translated property type if a single PropertySubType is given', function () {
    var string = matchTypeStrings(translationStrings, 'Apartment');
    expect(string).toBe('Apartments');
  });

  it('should return a translated usage type if multiple PropertySubTypes are given', function () {
    var string = matchTypeStrings(translationStrings, 'Apartment,House', 'Land');
    expect(string).toBe('Land');
  });

  it('should return a translated property type if no translation is found', function () {
    var string = matchTypeStrings(translationStrings, '');
    expect(string).toBe('Properties');
  });
});