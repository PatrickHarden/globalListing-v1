var createPolygon = require('../createPolygon'),
    Places = require('../Places');

describe('Creating a polygon from a gmaps bounds object', function () {
    var bounds = {
            getCenter: function(){
                return {
                    lat: function(){},
                    lng: function(){}
                };
            },
            getNorthEast: function(){
                return {
                    lat: function(){
                        return 0;
                    },
                    lng: function(){
                        return 1;
                    }
                };
            },
            getSouthWest: function(){
                return {
                    lat: function(){
                        return 2;
                    },
                    lng: function(){
                        return 3;
                    }
                };
            }
        },
        LondonPoly = '"0,1","2,1","2,3","0,3"',
        polygon;

    describe('When the bounds object is passed to the polygon utility', function () {

        beforeEach(function(){
            polygon = createPolygon(bounds);
        });

        describe('The returned polygon object', function () {

            it('should contain a polygon property with a formatted polygon', function () {
                expect(polygon.polygon).toBe(LondonPoly);
            });

            it('should contain a centre property', function () {
                expect(polygon.hasOwnProperty('centre')).toBeTruthy();

            });

        });

    });
});
