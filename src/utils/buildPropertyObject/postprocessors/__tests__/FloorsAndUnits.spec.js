import postprocessor from '../FloorsAndUnits';
import property from '../../../../../test/stubs/processedPropertyStub';
import getAppContext from '../../../../utils/getAppContext';

const floors = property.FloorsAndUnits.map(floor => {
    floor.subdivisionName = {
        'cultureCode': 'en-GB',
        'content': 'Test Floor'
    };

    return floor;
});

const comparators = {
    culture: 'en-GB',
    units: 'sqm',
    currency: 'GBP'
}

const i18n = require('../../../../config/sample/master/translatables.json').i18n;
const context = getAppContext();
context.stores.ConfigStore.setConfig({ language: 'en-GB' });
context.stores.ConfigStore.setItem('i18n', i18n);
context.language = i18n;
context.stores.LanguageStore.setLanguage();

describe('FloorsAndUnits postprocessor', () => {
    let output;
    beforeEach(() => {
        output = postprocessor(floors, comparators,undefined,undefined,context.stores.ConfigStore)[0].val;
    });

    it('should run unitCharges through the Charges processor', () => {
        const { unitCharges } = output[0];
        expect(unitCharges.length).toBe(2); // we gave it two currencies and 2 different types
        expect(unitCharges[0].hasOwnProperty('translated')).toBe(true);
    });

    it('should extract the subdivisionName from weird structure', () => {
        const { subdivisionName } = output[0];
        expect(typeof subdivisionName).toBe('string');
        expect(subdivisionName).toBe('Test Floor');
    });

    it('should return all fields when no config set', () => {
        output = postprocessor(floors, comparators,undefined,undefined,context.stores.ConfigStore)[0].val;
        expect(output[0].subdivisionName).toBeTruthy();
        expect(output[0].unitSize).toBeTruthy();
        expect(output[0].use).toBeTruthy();
        expect(output[0].unitCharges).toBeTruthy();
        expect(output[0].status).toBeTruthy();
    });

    it('should return all fields when config set but blank', () => {
        context.stores.ConfigStore.setConfig({
            floorsAndUnits: {
                showOnlyFloorFields: ''
            }
        });
        output = postprocessor(floors, comparators,undefined,undefined,context.stores.ConfigStore)[0].val;
        expect(output[0].subdivisionName).toBeTruthy();
        expect(output[0].unitSize).toBeTruthy();
        expect(output[0].use).toBeTruthy();
        expect(output[0].unitCharges).toBeTruthy();
        expect(output[0].status).toBeTruthy();
    });

    it('should return all fields when config set', () => {
        context.stores.ConfigStore.setConfig({
            floorsAndUnits: {
                showOnlyFloorFields: 'use,status'
            }
        });
        output = postprocessor(floors, comparators,undefined,undefined,context.stores.ConfigStore)[0].val;
        expect(output[0].subdivisionName).toBeTruthy();
        expect(output[0].unitSize).toBeFalsy();
        expect(output[0].use).toBeTruthy();
        expect(output[0].unitCharges).toBeFalsy();
        expect(output[0].status).toBeTruthy();
    });

    it('should return all fields when config set with 1 charge type', () => {
        context.stores.ConfigStore.setConfig({
            floorsAndUnits: {
                showOnlyFloorFields: 'use,status, SalePrice'
            }
        });
        output = postprocessor(floors, comparators,undefined,undefined,context.stores.ConfigStore)[0].val;
        expect(output[0].subdivisionName).toBeTruthy();
        expect(output[0].unitSize).toBeFalsy();
        expect(output[0].use).toBeTruthy();
        expect(output[0].unitCharges).toBeTruthy();
        expect(output[0].unitCharges.length).toBe(1);
        expect(output[0].status).toBeTruthy();
    });

    it('should return all fields when config set with multile charge types', () => {
        context.stores.ConfigStore.setConfig({
            floorsAndUnits: {
                showOnlyFloorFields: 'use,status, SalePrice,Rent'
            }
        });
        output = postprocessor(floors, comparators,undefined,undefined,context.stores.ConfigStore)[0].val;
        expect(output[0].subdivisionName).toBeTruthy();
        expect(output[0].unitSize).toBeFalsy();
        expect(output[0].use).toBeTruthy();
        expect(output[0].unitCharges).toBeTruthy();
        expect(output[0].unitCharges.length).toBe(2);
        expect(output[0].status).toBeTruthy();
    });
});
