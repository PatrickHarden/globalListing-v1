var getFormattedString = require('../getFormattedString');

describe('getFormattedString', function () {
    var inputString = "Test string to format %(Token1)s then %(Token2)s",
    	testToken1 = 'replacement1',
    	testToken2 = 'replacement2',
    	outputStringAllTokens = "Test string to format replacement1 then replacement2",
    	outputStringPartialTokens = "Test string to format replacement1 then ";

    describe('When Formatting a string', function () {
        describe('If the string contains all replacment tokens', function () {
            it('should return a complete replacement string', function() {
            	var formattedString = getFormattedString({Token1: testToken1, Token2: testToken2}, inputString);
            	expect(formattedString).toBe(outputStringAllTokens);
            });
        });

        describe('If the string contains some token properties', function () {
            it('should return a partially replaced string', function() {
            	var formattedString = getFormattedString({Token1: testToken1}, inputString);
            	expect(formattedString).toBe(outputStringPartialTokens);
            });
        });

    });
});
