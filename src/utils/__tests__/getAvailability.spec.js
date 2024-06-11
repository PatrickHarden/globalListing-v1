import getAvailability from '../getAvailability';

describe('getAvailability', function() {
  let result;
  let expected;
  let returnedSearchType;
  let object;
  let context;

  beforeEach(() => {
    returnedSearchType = 'isSale';

    context = {
      language: require('../../config/sample/master/translatables.json').i18n,
      stores: {
        ConfigStore: {
          getItem: () => {
            return 'en-GB';
          }
        },
        SearchStateStore: {
          getItem: () => {
            return returnedSearchType;
          }
        }
      }
    };

    expected = {
      id: 'availableFrom',
      title: context.language['LMPDPAvailableFrom']
    };
  });

  afterEach(() => {
    result = undefined;
    expected = undefined;
    returnedSearchType = undefined;
    object = undefined;
    context = undefined;
  });

  describe('When compiling a query string', function() {
    describe('IF the passed object contains the AvailableFrom attribute', function() {
      describe('AND the passed object does not contain the Availability attribute', function() {
        describe('AND the AvailableFrom date is in the past', function() {
          it('should return the correct object value', function() {
            object = { AvailableFrom: '2015-08-09' };
            expected.value = context.language['AvailableFromNow'];
            result = getAvailability(object, context);
            expect(result).toEqual(expected);
          });
        });

        describe('AND the AvailableFrom date is in the future', function() {
          it('should return the correct object value', function() {
            object = { AvailableFrom: '3000-01-01' };
            expected.value = 'January 3000';
            result = getAvailability(object, context);
            expect(result).toEqual(expected);
          });
        });
      });
    });

    describe('IF the passed object contains the Availability attribute', function() {
      describe('AND the Availability kind is AvailableNow', function() {
        it('should return the correct object value', function() {
          object = {
            Availability: {
              kind: 'AvailableNow'
            }
          };
          expected.value = context.language['AvailableNow'];
          result = getAvailability(object, context);
          expect(result).toEqual(expected);
        });
      });

      describe('AND the Availability kind is AvailableNeg', function() {
        it('should return the correct object value', function() {
          object = {
            Availability: {
              kind: 'AvailableNeg'
            }
          };
          expected.value = context.language['AvailableNeg'];
          result = getAvailability(object, context);
          expect(result).toEqual(expected);
        });
      });

      describe('AND the Availability kind is AvailableSoon', function() {
        it('should return the correct object value', function() {
          object = {
            Availability: {
              kind: 'AvailableSoon'
            }
          };
          expected.value = context.language['AvailableSoon'];
          result = getAvailability(object, context);
          expect(result).toEqual(expected);
        });
      });

      describe('AND the Availability kind is AvailableFromKnownDate', function() {
        it('should return the correct object value', function() {
          object = {
            Availability: {
              kind: 'AvailableFromKnownDate',
              date: '3000-01-01'
            }
          };
          expected.value = 'January 3000';
          result = getAvailability(object, context);
          expect(result).toEqual(expected);
        });
      });

      describe('AND the Availability kind is AvailableFromKnownQtr', function() {
        it('should return the correct object value', function() {
          object = {
            Availability: {
              kind: 'AvailableFromKnownQtr',
              date: '2017-01-01'
            }
          };
          result = getAvailability(object, context);
          expect(result.value.props.string).toEqual('AvailableFromKnownQtr');
          expect(result.value.props.quarter).toEqual(1);
          expect(result.value.props.year).toEqual(2017);
        });
      });

      describe('AND the Availability kind is AvailableNMonthsAfterLeaseOrSale', function() {
        beforeEach(() => {
          object = {
            Availability: {
              kind: 'AvailableNMonthsAfterLeaseOrSale',
              months: 6
            }
          };
        });

        describe('AND the searchType is isSale', function() {
          it('should return the correct object value', function() {
            result = getAvailability(object, context);
            expect(result.value.props.string).toEqual(
              'AvailableNMonthsAfterSale'
            );
            expect(result.value.props.numberOfMonths).toEqual(6);
          });
        });

        describe('AND the searchType is isLetting', function() {
          it('should return the correct object value', function() {
            returnedSearchType = 'isLetting';
            result = getAvailability(object, context);
            expect(result.value.props.string).toEqual(
              'AvailableNMonthsAfterLease'
            );
            expect(result.value.props.numberOfMonths).toEqual(6);
          });
        });
      });

      describe('The Availability description is set', function() {
        beforeEach(() => {
          object = {
            Availability: {
              kind: 'AvailableNMonthsAfterLeaseOrSale',
              months: 6,
              description: 'available description'
            },
            AvailableFrom: '2016-06-28T00:00:00'
          };
        });

        describe('AND AvailableFrom is set', function() {
          it('should return the correct object value', function() {
            result = getAvailability(object, context);
            expect(result.value.props.string).toEqual(
              'AvailableNMonthsAfterSale'
            );
            expect(result.value.props.numberOfMonths).toEqual(6);
          });
        });
        describe('AND AvailableFrom is NOT set', function() {
          it('should return the correct object value', function() {
            object.AvailableFrom = '';
            object.Availability.kind = '';
            result = getAvailability(object, context);
            expect(result.value).toEqual('available description');
          });
        });
      });
    });
  });
});
