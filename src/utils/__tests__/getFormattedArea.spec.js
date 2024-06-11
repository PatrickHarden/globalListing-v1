import formatArea from '../getFormattedArea';

const language = {
    acre: 'acre',
    acrePlural: 'acre',
    hectare: 'hectare',
    sqm: 'm²',
    sqft: 'sqft'
};

describe('getFormattedArea', () => {
    describe('sqm', () => {
        it('should round acres to 0 DP', () => {
            expect(formatArea('en-GB', 'sqm', 1044.880041, language)).toEqual(
                '1,045m²'
            );
        });
    });
    describe('acre', () => {
        it('should round acres to 2 DP', () => {
            expect(formatArea('en-GB', 'acre', 1044.880041, language)).toEqual(
                '1,044.88acre'
            );
        });
    });
    describe('hectare', () => {
        it('should round hectares to 2 DP', () => {
            expect(
                formatArea('en-GB', 'hectare', 1044.880041, language)
            ).toEqual('1,044.88hectare');
        });
    });
    describe('sqm', () => {
        it('should round sqft to 0 DP', () => {
            expect(formatArea('en-GB', 'sqft', 1044.880041, language)).toEqual(
                '1,045sqft'
            );
        });
    });
    describe('unknown units', () => {
        it('should round flibbities to 0 DP', () => {
            expect(
                formatArea('en-GB', 'flibbities', 1044.880041, language)
            ).toEqual('1,045flibbities');
        });
    });
    describe('no Units', () => {
        it('should not return units', () => {
            expect(
                formatArea('en-GB', 'sqm', 1044.880041, language, false)
            ).toEqual('1,045');
        });
    });

    // describe('unknown units', () => {
    //     it('should return the unaltered amount and unit', () => {
    //         const units = 'flibbities'

    //         expect(formatSize(10, units)).toEqual('10 flibbities')
    //         expect(formatSize(11.111, units)).toEqual('11.111 flibbities')
    //     })
    // })
});
