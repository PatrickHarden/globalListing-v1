import { expect } from 'chai';
import { evalTemplateString } from 'utils';

describe('Util', () => {
  /** @test {evalTemplateString} **/
  describe('evalTemplateString', () => {
    describe('#evalTemplateString()', () => {
      it('Replaces tokens in string', () => {
        const string = '%(token1)s and %(token2)s replaced';
        const tokens = {
          token1: 'Token one',
          token2: 'token two'
        };
        const expected = 'Token one and token two replaced';
        expect(evalTemplateString(string, tokens)).to.equal(expected);
      });

      it('Can use custom token formats', () => {
        const string = '*token1* and *token2* replaced';
        const tokens = {
          token1: 'Token one',
          token2: 'token two'
        };
        const tokenformat = {
          open: '*',
          close: '*'
        };
        const expected = 'Token one and token two replaced';
        expect(evalTemplateString(string, tokens, tokenformat)).to.equal(expected);
      });
    });
  });
});
