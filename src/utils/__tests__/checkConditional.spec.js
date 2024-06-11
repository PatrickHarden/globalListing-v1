var checkConditional = require('../checkConditional');

describe('checkConditional', function () {
    const params = {
        conditional1: 'condition1',
        conditional2: 'condition2'
    };
    const noCondition = {};
    const conditionNotMet = {
        conditional: {
            conditional1: 'nope'
        }
    };
    const conditionMet = {
        conditional: {
            conditional1: 'condition1'
        }
    };
    const MultipleConditionsMet = {
        conditional: {
            conditional1: 'condition1',
            conditional2: 'condition2'
        }
    };

    describe('When checking conditional params', function () {
        it('should return true if no condition exists', function () {
            expect(checkConditional(noCondition, params)).toBe(true);
        });

        it('should return false if a condition exists but it is not met', function () {
            expect(checkConditional(conditionNotMet, params)).toBe(false);
        });

        it('should return true if a condition exists and it is met', function () {
            expect(checkConditional(conditionMet, params)).toBe(true);
        });

        it('should handle multiple conditions', function () {
            expect(checkConditional(MultipleConditionsMet, params)).toBe(true);
        });
    });
});
