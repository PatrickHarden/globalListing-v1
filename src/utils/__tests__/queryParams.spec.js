var queryParams = require('../queryParams');

describe('queryParams', function () {
  describe('#parseQueryString(queryString)', function () {
    beforeEach(() => {
      this.input = 'test=true&numbers=123456';
    });

    afterEach(() => {
      this.input = undefined;
    });

    it('should return a queryObject', () => {
      var result = queryParams.parseQueryString(this.input);
      expect(result).toEqual({ test: 'true', numbers: '123456' });
    });

    it('should return false if string is invalid', () => {
      var result = queryParams.parseQueryString();
      expect(result).toEqual(false);
    });

    it('should remove question mark if prefixed on input string', () => {
      var result = queryParams.parseQueryString('?' + this.input);
      expect(result).toEqual({ test: 'true', numbers: '123456' });
    });
  });

  describe('#parseQueryObject(queryObject)', function () {
    beforeEach(() => {
      this.input = {
        test: 'true',
        numbers: '123456'
      };

      this.output = 'test=true&numbers=123456';
    });

    afterEach(() => {
      this.input = undefined;
      this.output = undefined;
    });

    it('should return a query string', () => {
      var result = queryParams.parseQueryObject(this.input);
      expect(result).toEqual(this.output);
    });

    it('should return false if object is malformed', () => {
      var result = queryParams.parseQueryObject();
      expect(result).toEqual(false);
    });

    it('should offer option to prefix with question mark', () => {
      var result = queryParams.parseQueryObject(this.input, true);
      expect(result).toEqual('?' + this.output);
    });
  });
});