import getSearchLocationDetails from '../getSearchLocationDetails';

describe('getSearchLocationDetails', function() {
    let error;
    let results;
    let queryParams;
    let config;
    let mockGmap;
    let mockPolygon;
    beforeEach(() => {
        error = false;
        results = null;
        queryParams = {
            view: 'view',
            placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI'
        };
        config = {
            searchConfig: {
                searchLocationName: 'London'
            }
        };
        mockGmap = {
            gmaps: {
                formatted_address: 'address',
                geometry: {
                    viewport: 'w00t'
                }
            },
            location: 'London, United Kingdom'
        };
        mockPolygon = { value: 'Polygon is set!' };
    });

    afterEach(() => {
        error = undefined;
        results = undefined;
        queryParams = undefined;
        config = undefined;
        mockGmap = undefined;
        mockPolygon = undefined;
    });

    describe('WHEN searchMode IS SET to bounding mode', function() {
        describe('AND queryParams.placeId IS NOT set', function() {
            it('SHOULD return polygons in the searchContext', done => {
                delete queryParams.placeId;
                config.searchMode = 'bounding';

                spyOn(getSearchLocationDetails, 'getPlacesLookup').and.callFake(
                    function(props, callback) {
                        expect(props.address).toBe(
                            config.searchConfig.searchLocationName
                        );
                        callback(mockGmap);
                    }.bind(this)
                );

                spyOn(getSearchLocationDetails, 'createPolygon').and.callFake(
                    function(gmap) {
                        expect(gmap).toBe(mockGmap.gmaps.geometry.viewport);
                        return mockPolygon;
                    }.bind(this)
                );

                getSearchLocationDetails(queryParams, config).then(
                    searchContext => {
                        expect(searchContext.polygon).toBe(mockPolygon);
                        done();
                    }
                );
            });
        });

        describe('AND queryParams.placeId IS set AND locations IS NOT undefined', function() {
            it('SHOULD return polygons in the searchContext', done => {
                config.searchMode = 'bounding';
                mockGmap.location = { lat: 1234, lng: 5678 };

                spyOn(getSearchLocationDetails, 'getPlacesLookup').and.callFake(
                    function(props, callback) {
                        callback(mockGmap);
                    }.bind(this)
                );

                spyOn(getSearchLocationDetails, 'createPolygon').and.callFake(
                    function(gmap) {
                        return mockPolygon;
                    }.bind(this)
                );

                getSearchLocationDetails(queryParams, config).then(
                    searchContext => {
                        expect(searchContext.polygon.value).toBe(
                            mockPolygon.value
                        );
                        expect(searchContext.polygon.bounds).toBe(
                            mockGmap.gmaps.geometry.viewport
                        );
                        done();
                    }
                );
            });
        });

        describe('AND queryParams.location IS set', function() {
            it('SHOULD perform lookup against the location not the placeId', done => {
                queryParams.location = 'this is a location';
                mockGmap.location = { lat: 1234, lng: 5678 };

                spyOn(getSearchLocationDetails, 'getPlacesLookup').and.callFake(
                    function(props, callback) {
                        callback(mockGmap);
                    }.bind(this)
                );

                getSearchLocationDetails(queryParams, config).then(
                    searchContext => {
                        expect(searchContext.placename).toBe(
                            'this is a location'
                        );
                        expect(
                            getSearchLocationDetails.getPlacesLookup.calls.mostRecent()
                                .args[0]
                        ).toEqual({
                            address: 'this is a location'
                        });
                        done();
                    }
                );
            });
        });
    });

    describe('When getting search context', function() {
        beforeEach(done => {
            queryParams.view = 'view';
            mockGmap.location = { lat: 1234, lng: 5678 };

            spyOn(getSearchLocationDetails, 'getPlacesLookup').and.callFake(
                function(props, callback, error) {
                    if (props.placeId === 'fake') {
                        return error();
                    }
                    callback(mockGmap);
                }.bind(this)
            );

            spyOn(getSearchLocationDetails, 'createPolygon').and.callFake(
                function(gmap) {
                    return mockPolygon;
                }.bind(this)
            );

            getSearchLocationDetails(queryParams, config).then(
                searchContext => {
                    results = searchContext;
                    done();
                }
            );
        });

        describe('If the query string object contains a view property', function() {
            it('should add that property to the returned object', function() {
                expect(results.searchtype).toBe('view');
            });
            it('should remove the view property from the original object', function() {
                expect(queryParams.hasOwnProperty('view')).toBe(false);
            });
        });

        describe('If the query string object contains a placeId property', function() {
            it('should add location information to the returned object', function() {
                expect(results.placename).toBe('London');
            });

            it('should NOT have polygon information in the returned object', function() {
                expect(typeof results.polygon).toBe('undefined');
            });

            it('should add coordinates to the original object', function() {
                expect(typeof queryParams.lat).toBe('number');
                expect(typeof queryParams.lon).toBe('number');
            });
        });

        describe('If the config contains a searchLocationName property', function() {
            it('should NOT add a polygon property to the returned object when not in bounding mode', function() {
                expect(typeof results.polygon).toBe('undefined');
            });
        });

        describe('If the place lookup fails', function() {
            beforeEach(done => {
                getSearchLocationDetails({ placeId: 'fake' }, config)
                    .then(() => {
                        done();
                    })
                    .catch(() => {
                        error = true;
                        done();
                    });
            });
            it('should reject the promise', function() {
                expect(error).toBe(true);
            });
        });
    });
});
