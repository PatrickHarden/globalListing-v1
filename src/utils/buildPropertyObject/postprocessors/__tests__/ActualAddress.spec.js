var getActualAddress = require('../ActualAddress');

describe('ActualAddress preprocessor', () => {
    let address;
    let postalAddresses;
    let russianAddress;
    let englishAddress;
    let chineseAddress;
    let frenchAddress;
    let spanishAddress;
    let comparitors;
    let slug;

    beforeEach(() => {
        address = {
            line1: 'default line1',
            line2: 'default line2',
            country: 'GB',
            postcode: 'default postcode'
        };
        russianAddress = {
            language: 'ru',
            line1: "russian line1",
            line2: "russian line2",
            locality: "russian locality"
        };
        englishAddress = {
            language: 'en',
            line1: "english line1",
            line2: "english line2",
            locality: "english locality"
        };
        chineseAddress = {
            language: 'zh',
            line1: "chinese line1",
            line2: "chinese line2",
            locality: "chinese locality"
        };
        frenchAddress = {
            language: 'fr',
            line1: "french line1",
            line2: "french line1",
            locality: "french locality"
        };
        spanishAddress = {
            language: 'fr',
            line1: "french line1",
            line2: "french line1",
            locality: "french locality",
            region:"Madrid"
        };
        comparitors = {
            culture: 'zh-CN'
        };
        slug = '%(line1)s-%(line2)s';
    });

    afterEach(() => {
        address = undefined;
        postalAddresses = undefined;
        russianAddress = undefined;
        englishAddress = undefined;
        chineseAddress = undefined;
        frenchAddress = undefined;
        spanishAddress = undefined;
        comparitors = undefined;
        slug = undefined;
    });

    describe('Retrieve usable address object from API response', () => {

        it('should return the correct value structure', () => {
            const output = getActualAddress(address, comparitors, slug)[0];
            expect(typeof output).toBe('object');
            expect(output.prop).toBe('ActualAddress');
            expect(typeof output.val).toBe('object');
        });

        describe('If there are no postal addresses defined', () => {

            it('should perform logic based on the root address', () => {
                const output = getActualAddress(address, comparitors, slug)[0];
                expect(output.val).toEqual({
                    line1: 'default line1',
                    line2: 'default line2',
                    country: 'GB',
                    postcode: 'default postcode',
                    region:undefined, 
                    urlAddress: 'default-line1-default-line2',
                    addressSummaryFormat: 'AddressSummary',
                });
            });

        });

        describe('If there are postal addresses defined', () => {

            describe('If there is a matching language address', () => {

                it('should pick the matching address', () => {
                    address.postalAddresses = [
                        russianAddress,
                        englishAddress,
                        chineseAddress,
                        frenchAddress
                    ];
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val).toEqual({
                        line1: 'chinese line1',
                        line2: 'chinese line2',
                        locality: "chinese locality",
                        country: 'GB',
                        postcode: 'default postcode',
                        region:undefined, 
                        urlAddress: 'english-line1-english-line2',
                        addressSummaryFormat: 'AddressSummary',
                        language: 'zh'
                    });
                });
            });

            describe('If there is no matching language address but there is an `en` address', () => {

                it('should pick the english address', () => {
                    address.postalAddresses = [
                        russianAddress,
                        englishAddress,
                        frenchAddress
                    ];
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val).toEqual({
                        line1: 'english line1',
                        line2: 'english line2',
                        locality: "english locality",
                        country: 'GB',
                        postcode: 'default postcode',
                        region:undefined, 
                        urlAddress: 'english-line1-english-line2',
                        addressSummaryFormat: 'AddressSummary',
                        language: 'en'
                    });
                });
            });

            describe('If there is no matching language address and no `en` address', () => {

                it('should pick the first address in the array', () => {
                    address.postalAddresses = [
                        russianAddress,
                        frenchAddress
                    ];
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val).toEqual({
                        line1: 'russian line1',
                        line2: 'russian line2',
                        locality: "russian locality",
                        country: 'GB',
                        postcode: 'default postcode',
                        region:undefined, 
                        urlAddress: 'russian-line1-russian-line2',
                        addressSummaryFormat: 'AddressSummary',
                        language: 'ru'
                    });
                });
            });

        });

        describe('Generating the url slug', () => {

            describe('If all tokens are available', () => {

                it('should use the defined format', () => {
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val.urlAddress).toEqual('default-line1-default-line2');
                });

            });

            describe('If some tokens are available', () => {

                it('should use the defined format', () => {
                    delete address.line1;
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val.urlAddress).toEqual('default-line2');
                });

            });

            describe('If no tokens are available', () => {

                it('should use the default format', () => {
                    delete address.line1;
                    delete address.line2;
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val.urlAddress).toEqual('gb-default-postcode');
                });

            });

        });

        describe('Selecting the address format', () => {

            describe('If line1 and line2 are available', () => {

                it('should use standard format', () => {
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val.addressSummaryFormat).toEqual('AddressSummary');
                });

            });

            describe('If line1 is available but line2 is not', () => {

                it('should use the short format', () => {
                    delete address.line2;
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val.addressSummaryFormat).toEqual('AddressSummaryShort');
                });

            });

            describe('If line1 and line2 are both unavailable', () => {

                it('should use the area format', () => {
                    delete address.line1;
                    delete address.line2;
                    const output = getActualAddress(address, comparitors, slug)[0];
                    expect(output.val.addressSummaryFormat).toEqual('AddressSummaryArea');
                });

            });

        });

    });

});
