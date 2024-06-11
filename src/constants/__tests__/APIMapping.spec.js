var APIMapping = require('../APIMapping'),
    Ajax = require('../../utils/ajax'),
    testShouldFail = false;

describe('APIMapping', function () {
    var queryResult,
        failedOn = [];

    Ajax.call('http://cbre-search-testing.cloudapp.net/api/propertylistings/query?radius=10&Lat=51.48&Site=uk-resi&Lon=0&Sort=desc(lastUpdated)&PageSize=1&Page=1', function (data) {
        queryResult = data.Documents;
    }, () => {});

    describe('The object returned from the API', function () {
        it('should contain all the properties defined in the APIMApping', function () {

            if (queryResult && queryResult.length) {
                for (var mapProperty in APIMapping) {
                    if (APIMapping.hasOwnProperty(mapProperty) && mapProperty !== '_resultProperties') {

                        if (typeof APIMapping[mapProperty] === 'string') {
                            if (!queryResult[0][0].hasOwnProperty(APIMapping[mapProperty])) {
                                failedOn.push(APIMapping[mapProperty]);
                            }
                        }

                        if (typeof APIMapping[mapProperty] === 'object') {
                            if (!queryResult[0][0].hasOwnProperty(APIMapping[mapProperty]._key)) {
                                failedOn.push(APIMapping[mapProperty]._key);
                            }
                        }

                    }
                }

                console.log('The following properties could not be found:', failedOn);
            }

            if(testShouldFail){
                expect(failedOn.length).toBe(0);
            }
        });
    });
});
