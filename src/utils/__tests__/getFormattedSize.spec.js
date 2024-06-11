import formatSize from '../getFormattedSize';

describe('getFormattedSize', () => {
    describe('ft', () => {
        it('should display whole feet as just feet', () => {
            expect(formatSize(10, 'ft')).toEqual('10 ft')
        })

        it('should display decimal feet as feet and inches', () => {
            expect(formatSize(10.5, 'ft')).toEqual('10 ft 6 in')
        })

        it('should round inches to two DP', () => {
            // .5555 * 12 === 6.666 - three DP
            expect(formatSize(10.5555, 'ft')).toEqual('10 ft 6.67 in');
        })
    })

    describe('unknown units', () => {
        it('should return the unaltered amount and unit', () => {
            const units = 'flibbities'

            expect(formatSize(10, units)).toEqual('10 flibbities')
            expect(formatSize(11.111, units)).toEqual('11.111 flibbities')
        })
    })
})
