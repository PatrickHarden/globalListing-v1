var Ajax = require('../ajax');
var getAppContext = require('../getAppContext.js');

describe('getAppContext', function () {

    describe('when activating an action stub', function () {
        var appContext = null;
        var stubData = { someData: 'something something dark side' };
        var receivedStubData = null;

        beforeEach(function () {
            appContext = getAppContext();
            spyOn(appContext.actions, 'getProperties');
            appContext.setStub('getProperties', stubData);
            spyOn(appContext.actions, 'handlePropertyResults').and.callFake(function (data) {
                receivedStubData = data;
            });
        });

        it('the stubbed function should yield side effects with the stubbed data', function () {
            appContext.actions.getProperties();
            expect(receivedStubData).toBe(stubData);

        });

        describe('and then deactivating the stub', function () {
            beforeEach(function () {
                appContext.setStub('getProperties', null);
                appContext.actions.getProperties();
            });

            it('the original function is called', function () {
                expect(appContext.actions.getProperties).toHaveBeenCalled();
            });
        });
    });
});
