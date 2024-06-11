var buildRangeValue = require('../buildRangeValue');

describe('Building range value', function () {
    var minValue = 'test-value-1',
        maxValue = 'test-value-2',
        str;

    describe('When min and max value arguments are passed in then the returned value', function () {
        beforeEach(function () {
            str = buildRangeValue(minValue, maxValue);
        });

        it('should contain the min value', function () {
            expect(str).toContain(minValue);
        });

        it('should contain the max value', function () {
            expect(str).toContain(maxValue);
        });

        it('should contain the includePOA value set to exclude', function () {
            expect(str).toContain('exclude');
        });
    });

    describe('When the includePOA argument is passed', function () {
        it('should have the includePOA set to include', function () {
            str = buildRangeValue(minValue, maxValue, true);
            expect(str).toContain('include');
        });
    });
});
