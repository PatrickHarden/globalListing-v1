import trackingEvent from '../trackingEvent';
import getAppContext from'../getAppContext';

describe('trackingEvent util', function () {
    describe('when calling trackEvent util', function () {
        let appContext = null;
        let stubData = null;

        beforeEach(function () {
            appContext = getAppContext();
            spyOn(appContext.actions, 'publishCustomEvent');
        });

        it('it should fire the publishCustomEvent action', function () {
            const propertyId = 'PropertyIdZYX';
            const eventData = {
                event: "Viewed property details",
                eventType: "analytics",
                path: window.location.href,
                placeName: null,
                propertyId: propertyId,
                searchType: 'isSale',
                spaType: 'residential',
                widgetName: null
            }

            trackingEvent('viewPropertyDetails', {
                propertyId: propertyId
            }, appContext.stores, appContext.actions);

            expect(appContext.actions.publishCustomEvent).toHaveBeenCalledWith(eventData);
        });

        afterEach(function () {
            appContext = null;
            stubData = null;
        });
    });
});
