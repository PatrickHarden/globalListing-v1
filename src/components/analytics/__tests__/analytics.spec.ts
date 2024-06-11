import ReactGA from 'react-ga'
import { analyticsEvent } from '../gl-analytics'


describe('Testing react-ga initialize objec', () => {
    it("Able to initailize react-ga object", () => {
        ReactGA.initialize('UA-65432-1', { testMode: true });

        const expectedResult = [ [ 'create', 'UA-65432-1', 'auto' ]];

        expect(ReactGA.testModeAPI.calls).toEqual(expectedResult)
    });
});

describe("Testing react-ga pageview calls", () => {
    test('it fires event with correct params', () => {
        ReactGA.pageview('/testPage');

        const expectedResult = [ [ 'create', 'UA-65432-1', 'auto' ],
        [ 'send', { hitType: 'pageview', page: '/testPage' } ]];

        expect(ReactGA.testModeAPI.calls).toEqual(expectedResult)
    });
});

describe("testing analytics event script", () => {
    test('it fires event with correct params', () => {
        analyticsEvent('test', 'testing', 'testingOverload', 'beacon', true)
    
        const expectedResult = [ [ 'create', 'UA-65432-1', 'auto' ],
        [ 'send', { hitType: 'pageview', page: '/testPage' } ],
        [ 'send',
          { hitType: 'event',
            eventCategory: 'Test',
            eventAction: 'Testing',
            eventLabel: 'testingOverload',
            nonInteraction: true,
            transport: 'beacon' } ] ];
    
        expect(ReactGA.testModeAPI.calls).toEqual(expectedResult)
    });
});

describe("testing analytics event script miscall", () => {
    test('it doesnt fire an event since a boolean was passed in incorrectly', () => {
        analyticsEvent('test', true, 'testingOverload', false, true)
    
        const expectedResult = [ [ 'create', 'UA-65432-1', 'auto' ],
        [ 'send', { hitType: 'pageview', page: '/testPage' } ],
        [ 'send',
          { hitType: 'event',
            eventCategory: 'Test',
            eventAction: 'Testing',
            eventLabel: 'testingOverload',
            nonInteraction: true,
            transport: 'beacon' } ] ];
    
        expect(ReactGA.testModeAPI.calls).toEqual(expectedResult)
    });
});