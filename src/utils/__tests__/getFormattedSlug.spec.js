var getFormattedSlug = require('../getFormattedSlug');

describe('getFormattedSlug', function () {
    var property = {
            "PropertyId": "123",
            "ActualAddress": {
                "line1": "prop1 line 1",
                "line2": "prop1 line 2",
                "postCode": "test\\!#$&;=? []~|tes't--tes`t/"
            }
        },
        testFormat1 = '%(Line1)s-%(Line2)s',
        testResult1 = 'prop1-line-1-prop1-line-2',
        testFormat2 = '%(nope)s-%(Line1)s-%(nope)s',
        testResult2 = 'prop1-line-1',
        testFormat3 = '%(Line1)s-%(postCode)s',
        testResult3 = 'prop1-line-1-test-test-test';

    describe('When Formatting an address', function () {
        describe('If the address object contains all token properties', function () {
            it('should return a complete address summary', function() {
                var formattedAddress = getFormattedSlug(property, testFormat1);
                expect(formattedAddress).toBe(testResult1);
            });
        });

        describe('If the address object contains some token properties', function () {
            it('should return a partial address summary', function() {
                var formattedAddress = getFormattedSlug(property, testFormat2);
                expect(formattedAddress).toBe(testResult2);
            });
        });

        describe('If the address object contains certain characters', function () {
            it('should either replace those characters with a hyphen or remove them', function() {
                var formattedAddress = getFormattedSlug(property, testFormat3);
                expect(formattedAddress).toBe(testResult3);
            });
        });
    });
});
