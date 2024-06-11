import createQueryString from '../createQueryString';

describe('createQueryString', function () {
    var inputObject = {
        param1: 'param1',
        param2: 'param2'
        },
        outputString = '?param1=param1&param2=param2';

    describe('When compiling a query string', function () {
        describe('If the passed object contains params', function () {
            it('should return compiled query string', function() {
                var qs = createQueryString(inputObject);
                expect(qs).toBe(outputString);
            });
        });
        describe('If the passed object is empty', function () {
            it('should return null', function() {
                var qs = createQueryString({});
                expect(qs).toBe(null);
            });
        });
    });
});
