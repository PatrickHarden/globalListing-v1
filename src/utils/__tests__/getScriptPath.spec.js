var getScriptPath = require('../getScriptPath');

describe('Retrieve actual path to script', function () {
    var scriptPath = getScriptPath('http://www.test.com/test/1.0/js/file.js'),
        expectedPath = 'http://www.test.com/test/1.0';

    it('should return a stripped down path', function () {
        expect(scriptPath).toEqual(expectedPath);
    });
});
describe('Retrieve actual path to script when in gzip folder', function () {
    var scriptPath = getScriptPath('http://www.test.com/test/1.0/gzip/js/file.js'),
        expectedPath = 'http://www.test.com/test/1.0';

    it('should return a stripped down path', function () {
        expect(scriptPath).toEqual(expectedPath);
    });
});
