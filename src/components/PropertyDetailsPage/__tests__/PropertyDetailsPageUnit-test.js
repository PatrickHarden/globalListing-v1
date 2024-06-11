var PropertyDetailsPage = require('../index');

describe('PropertyDetailsPage component units', function () {
  beforeEach(function () {
    this.proto = Object.assign({}, PropertyDetailsPage.prototype);
  });

  describe('#getBedrooms(siteType, count, stringTemplate)', function () {
    it('should return an empty string if siteType is commercial', function () {
      var result = this.proto.getBedrooms('commercial');
      expect(result).toBe('');
    });

    it('should return a default string if count is 0', function () {
      this.proto.context = {
        language: {
          Studio: 'Studio'
        }
      };
      var result;

      result = this.proto.getBedrooms('residential');
      expect(result).toBe('Studio');

      result = this.proto.getBedrooms('residential', 0);
      expect(result).toBe('Studio');
    });

    it('should return the number of bedrooms if count is greater than 0', function () {
      var string = '%(bedroomCount)s bedroom';
      var result;
      result = this.proto.getBedrooms('residential', 1, string);
      expect(result).toBe('1 bedroom');

      result = this.proto.getBedrooms('residential', 5, string);
      expect(result).toBe('5 bedroom');
    });
  });

  describe('#buildMetaTags(property)', function () {

    describe('returned object property: title', function () {

      beforeEach(function () {
        window.cbreSiteType = 'residential';

        this.proto.context = {
          language: {
            PDPPropertyTypeApartment: 'Apartment',
            PDPPropertyTypeOffice: 'Office',
            ToRent: 'to Rent',
            ForSale: 'for Sale',
            Residential: 'Residential',
            Commercial: 'Commercial',
            Property: 'Property',
            TokenReplaceStrings: {
              "AddressSummaryLong": "%(Line1)s, %(Line2)s, %(PostCode)s",
              "NumberOfBedroomsSingular": "%(bedroomCount)s bedroom",
              "PDPMetaTitle": "%(bedrooms)s %(propertyType)s %(searchType)s, %(addressSummary)s - CBRE %(siteType)s",
            }
          }
        };

        this.proto.props = {
          searchType: 'isLetting',
          spaPath: {
            path: ''
          }
        };

        this.property = {
          NumberOfBedrooms: 1,
          PropertySubType: 'Apartment',
          UsageType: 'Residential',
          ActualAddress: {
            line1: 'Magic Land',
            line2: '123 London Road',
            postcode: 'CB23 3RE'
          },
          Photos: []
        };

      });

      it('should return a formatted strings', function () {
        var result;
        result = this.proto.buildMetaTags(this.property);
        expect(result[0].value).toBe('1 bedroom Apartment to Rent, Magic Land, 123 London Road, CB23 3RE - CBRE Residential');

      });
      
      it('should return the number of bedrooms', function() {
        this.proto.props.searchType = 'isSale';
        this.property.NumberOfBedrooms = 3;

        var result = this.proto.buildMetaTags(this.property);
        expect(result[0].value).toBe('3 bedroom Apartment for Sale, Magic Land, 123 London Road, CB23 3RE - CBRE Residential');
      });
      
      it('should mention the property type', function() {
        this.proto.props.searchType = 'isSale';
        this.property.UsageType = 'Office';
        this.property.PropertySubType = 'Unknown';
        window.cbreSiteType = 'commercial';

        var result = this.proto.buildMetaTags(this.property);
        expect(result[0].value).toBe('Office for Sale, Magic Land, 123 London Road, CB23 3RE - CBRE Commercial');
      });

      it('should default to Property if PropertySubType doesn\'t exist', function () {
        var result;

        window.cbreSiteType = 'commercial';
        this.property.PropertySubType = 'DoesNotExist';

        result = this.proto.buildMetaTags(this.property);
        expect(result[0].value).toBe('Property to Rent, Magic Land, 123 London Road, CB23 3RE - CBRE Commercial');
      });

      afterEach(function () {
        this.property = undefined;
        window.cbreSiteType = undefined;
      });

    });
  });

  afterEach(function () {
    this.proto = undefined;
  });
});