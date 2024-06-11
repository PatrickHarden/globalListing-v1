import { getQueryParameters, mergeParameters }  from '../getQueryParameters';

describe('getQueryParameters helper', () => {
    describe('When string contains &', () => {
        it('should return the correct array', () => {
            let correctOutput = {
                aspects: 'isLetting',
                location: 'Manchester,+UK'
            };
            let output = getQueryParameters(
                '?aspects=isLetting&location=Manchester%2C+UK'
            );
            expect(output).toEqual(correctOutput);
        });
    });

    describe('When string contains &amp; instead of &', () => {
        it('should return the correct array', () => {
            let correctOutput = {
                aspects: 'isLetting',
                location: 'Manchester,+UK'
            };
            let output = getQueryParameters(
                '?aspects=isLetting&amp;location=Manchester%2C+UK'
            );
            expect(output).toEqual(correctOutput);
        });
    });

    //no longer needed as Sitemap.xml will no longer include %26
    // describe('When string contains %26 instead of &', () => {
    //     it('should return the correct array', () => {
    //         let correctOutput = {
    //             aspects: 'isLetting',
    //             location: 'Manchester%2C+United+Kingdom'
    //         };
    //         let output = getQueryParameters(
    //             '?aspects%3DisLetting%26location%3DManchester%252C%2BUnited%2BKingdom'
    //         );
    //         expect(output).toEqual(correctOutput);
    //     });
    // });
});
