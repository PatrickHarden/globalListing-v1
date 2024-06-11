var paramMap = require('../paramMap');

describe('Param mapping', function () {
    var APIParams = {
            Lat: '0',
            Lon: '0',
            "Common.Aspects": "aspect"
        },
        SPAParams = {
            lat: '0',
            lon: '0',
            "aspects": "aspect"
        };

    describe('When mapping incoming params', function () {
        var params = paramMap.mapParams(APIParams);

        it('should replace keys of any API parameters included in the mapping with its SPA counterpart', function () {
            expect(params).toEqual(SPAParams);
        });

        it('should remove any of the original params it has replaced', function () {
            expect(params["Common.Aspects"]).toBe(undefined);
        });
    });

    describe('When mapping outgoing params', function () {
        var params = paramMap.mapParams(SPAParams, true);

        it('should replace keys of any API parameters included in the mapping with its SPA counterpart', function () {
            expect(params).toEqual(APIParams);
        });

        it('should remove any of the original params it has replaced', function () {
            expect(params.aspects).toBe(undefined);
        });
    });
});
