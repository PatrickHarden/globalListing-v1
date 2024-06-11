var ActionTypes = require('../../constants/ActionTypes'),
    getAppContext = require('../../utils/getAppContext'),
    defaultValues = require('../../constants/DefaultValues');

describe('Api Actions', function () {
    var context = null;
    var router = {
        push: function(){}
    };

    beforeEach(function () {
        context = getAppContext();
    });

    describe('bootstrap', function () {
        it('should call the config endpoint', function () {
            spyOn($, 'ajax');

            context.actions.bootstrap('someurl');

            expect($.ajax).toHaveBeenCalled();
        });
    });

    describe('bootstrapConfig', function () {
        const queryParams = { location: 'London, UK' };

        beforeEach(function() {
            spyOn(context.dispatcher, 'dispatch');
            spyOn(google.maps, 'Geocoder');
        })

        describe('geo modes', function() {
            const config = { searchMode: 'pin' };

            it('should geocode the location', function (done) {
                context.actions.bootstrapConfig(config, queryParams);

                const interval = setInterval(() => {
                    if (context.dispatcher.dispatch.calls.count()) {
                        clearInterval(interval);
                        expect(google.maps.Geocoder).toHaveBeenCalled();
                        done();
                    }
                }, 100);
            });
        });

        describe('nonGeo mode', function() {
            const config = { searchMode: 'nonGeo' };

            it('should not geocode the location in nonGeo mode', function (done) {
                context.actions.bootstrapConfig(config, queryParams);

                const interval = setInterval(() => {
                    if (context.dispatcher.dispatch.calls.count()) {
                        clearInterval(interval);
                        expect(google.maps.Geocoder).not.toHaveBeenCalled();
                        done();
                    }
                }, 100);
            });
        });
    });

    describe('getProperties', function () {
        it('should call the api', function () {
            spyOn($, 'ajax');

            context.actions.getProperties(false, null, {}, '/', router);

            expect($.ajax).toHaveBeenCalled();
        });
    });

    describe('getProperty', function () {
        it('should call the api using the getProperty method', function () {
            spyOn($, 'ajax');

            context.actions.getProperty();

            expect($.ajax).toHaveBeenCalled();
        });
    });

    describe('Dispatcher', function () {
        it('should fire an event which is picked up by a store', function () {
            var testConfig = { filters: [], i18n: {}, params: {} };

            context.dispatcher.dispatch({
                type: ActionTypes.BOOTSTRAP,
                data: testConfig
            });

            expect(context.stores.ConfigStore.getConfig()).toEqual(testConfig);
        });
    });

    describe('in pin/radius mode', function () {
        beforeEach(function () {
            context.stores.ParamStore.setParam('searchMode', 'pin');
            context.stores.ConfigStore.setItem('listmap', true);
        });

        describe('when properties are retrieved', function () {
            var properties = { Documents: ['jack'] };

            beforeEach(function () {
                spyOn(context.dispatcher, 'dispatch');
                context.actions.handlePropertyResults(properties, false, null, { radius: 10 }, { radius: 10 }, '/', router);
            });

            it('should dispatch the properties that were received', function () {
                expect(context.dispatcher.dispatch).toHaveBeenCalledWith({
                    type: ActionTypes.GET_PROPERTIES,
                    data: properties,
                    truncateAmount: defaultValues.limitListMapResults
                });
            });
        });

        describe('when extended search is enabled', function () {

            beforeEach(function () {
                context.stores.ConfigStore.setItem('extendSearches', true);
            });

            describe('and no properties are retrieved', function () {
                var getPropertiesArguments = null;

                it('extended search mode should be activated', function () {
                    spyOn(context.actions, 'getProperties').and.callFake(function () {
                        getPropertiesArguments = arguments;
                    });
                    context.actions.handlePropertyResults({ Documents: [] }, false, null, { radius: 10 }, { radius: 10 }, '/', router);
                    expect(context.stores.SearchStateStore.getItem('extendedSearch')).toBe(true);
                    expect(context.stores.SearchStateStore.getItem('originalSearchRadius')).toBe(10);
                });
            });

            describe('and active the getProperties function', function () {
                var ajaxArguments = null;
                beforeEach(function () {
                    spyOn($, 'ajax').and.callFake(function () {
                        ajaxArguments = arguments[0];
                    });
                    context.stores.SearchStateStore.setItem('extendedSearch', true);
                    context.actions.getProperties(false, null, { radius: 10 }, '/', router);
                });

                it('should not restrict by radius', function () {
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxArguments['url'].indexOf('radius')).toBe(-1);
                });

                it('should sort by closest first', function () {
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxArguments['url'].indexOf('Sort=asc(_distance)') > -1).toBe(true);
                });

            });
        });
    });

    describe('when extended search is already active', function () {

        beforeEach(function () {
            context.stores.ConfigStore.setItem('extendSearches', true);
            context.stores.SearchStateStore.setItem('extendedSearch', true);
            context.stores.ConfigStore.setItem('listmap', true);
        });

        describe('and no properties are retrieved', function () {

            var properties = { Documents: [] };

            beforeEach(function () {
                spyOn(context.dispatcher, 'dispatch');
                context.actions.handlePropertyResults(properties, false, null, { radius: 10 }, { radius: 10 }, '/', router);
            });

            it('an empty set of properties should be dispatched', function () {
                expect(context.dispatcher.dispatch).toHaveBeenCalledWith({
                    type: ActionTypes.GET_PROPERTIES,
                    data: properties,
                    truncateAmount: defaultValues.limitListMapResults
                });
            });
        });
    });


    describe('in boundingbox mode mode', function () {
        beforeEach(function () {
            context.stores.ParamStore.setParam('searchMode', 'bounding');
            context.stores.ConfigStore.setItem('listmap', true);
        });

        describe('when properties are retrieved', function () {
            var properties = { Documents: ['jack'] };

            beforeEach(function () {
                spyOn(context.dispatcher, 'dispatch');
                context.actions.handlePropertyResults(properties, false, null, { radius: 10 }, { radius: 10 }, '/', router);
            });

            it('should dispatch the properties that were received', function () {
                expect(context.dispatcher.dispatch).toHaveBeenCalledWith({
                    type: ActionTypes.GET_PROPERTIES,
                    data: properties,
                    truncateAmount: defaultValues.limitListMapResults
                });
            });
        });

        describe('when extended search is enabled', function () {
            beforeEach(function () {
                context.stores.ConfigStore.setItem('extendSearches', true);
            });

            describe('and no properties are retrieved', function () {
                var getPropertiesArguments = null;

                it('extended search mode should be activated', function () {
                    spyOn(context.actions, 'getProperties').and.callFake(function () {
                        getPropertiesArguments = arguments;
                    });

                    context.actions.handlePropertyResults({ Documents: [] }, false, null, { radius: 10 }, { radius: 10 }, '/', router);
                    expect(context.stores.SearchStateStore.getItem('extendedSearch')).toBe(true);
                    expect(context.stores.SearchStateStore.getItem('originalSearchRadius')).toBe(10);

                });
            });

            describe('the getProperties function', function () {
                var ajaxArguments = null;
                beforeEach(function () {
                    spyOn($, 'ajax').and.callFake(function () {
                        ajaxArguments = arguments[0];
                    });

                    context.stores.SearchStateStore.setItem('extendedSearch', true);
                    context.actions.getProperties(false, null, { radius: 10, polygons: 'jonnie5'}, '/', router);
                });

                it('should not restrict by radius', function () {
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxArguments['url'].indexOf('radius')).toBe(-1);
                });

                it('should not restrict to a polygon', function () {
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxArguments['url'].indexOf('PolygonFilters')).toBe(-1);
                    expect(ajaxArguments['url'].indexOf('PolygonFilter')).toBe(-1);
                });

                it('should sort by closest first', function () {
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxArguments['url'].indexOf('Sort=asc(_distance)') > -1).toBe(true);
                });

            });
        });
    });
});
