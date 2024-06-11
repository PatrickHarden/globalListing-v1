import letterFromIndex from '../letterFromIndex';

describe('Letter from index', () => {
    it('should return letters from the alphabet at the given index', () => {
        expect(letterFromIndex(0)).toBe('A');
        expect(letterFromIndex(25)).toBe('Z');
    });

    it('should return lowercase if requested', () => {
        expect(letterFromIndex(0, true)).toBe('a');
        expect(letterFromIndex(25, true)).toBe('z');
    });

    it('should loop back to start for index greater than alphabet length', () => {
        expect(letterFromIndex(26)).toBe('A');
        expect(letterFromIndex(51, true)).toBe('z');
    });
});
