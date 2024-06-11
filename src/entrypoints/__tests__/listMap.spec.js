import sinon from 'sinon';
import { __RewireAPI__ } from '../listMap.js';
import listMap from '../listMap.js';
import getAppContext from '../../utils/getAppContext.js';
import { createMemoryHistory } from 'react-router';

describe('ListMap', () => {
    var mockContext = null;
    beforeEach(() => {
        mockContext = sinon.mock(getAppContext());
        mockContext.object.actions.bootstrapConfig = sinon.spy();
        __RewireAPI__.__Rewire__('getAppContext', () => {
            return mockContext.object;
        });
    });

    it('registers the prerender middleware with history', () => {
        var mockHistory = { listenBefore: sinon.spy() };
        __RewireAPI__.__Rewire__('history', mockHistory);
        var prerenderHistory = sinon.spy();
        __RewireAPI__.__Rewire__('prerenderHistory', function() {
            return prerenderHistory;
        });

        listMap({}, '');
        sinon.assert.calledWithExactly(
            mockHistory.listenBefore,
            prerenderHistory
        );

        __RewireAPI__.__ResetDependency__('history');
        __RewireAPI__.__ResetDependency__('prerenderHistory');
    });

    it('registers the analytics middleware with history', () => {
        var mockHistory = { listenBefore: sinon.spy() };
        __RewireAPI__.__Rewire__('history', mockHistory);
        var analyticsEvents = sinon.spy();
        __RewireAPI__.__Rewire__('analyticsEvents', analyticsEvents);

        listMap({}, '');
        sinon.assert.calledWithExactly(
            mockHistory.listenBefore,
            analyticsEvents
        );

        __RewireAPI__.__ResetDependency__('history');
        __RewireAPI__.__ResetDependency__('analyticsEvents');
    });

    it('configuration is passed the bootstrap action', () => {
        __RewireAPI__.__Rewire__('getQueryParameters', () => {
            return {};
        });
        var configuration = { some: 'configuration' };
        listMap(configuration, '');

        sinon.assert.calledWithExactly(
            mockContext.object.actions.bootstrapConfig,
            configuration,
            {}
        );
        __RewireAPI__.__ResetDependency__('getQueryParameters');
    });

    describe('when the spa path is decomposed', () => {
        let prerenderHistory = null;
        const history = createMemoryHistory();
        const windowprops = {
            location: sinon.stub().returns({ pathname: '/root/extrastuff' })
        };

        beforeEach(() => {
            sinon.spy(history, 'listenBefore');

            __RewireAPI__.__Rewire__('windowprops', windowprops);
            __RewireAPI__.__Rewire__('history', history);

            prerenderHistory = sinon.spy();
            __RewireAPI__.__Rewire__('prerenderHistory', prerenderHistory);
        });

        it('the spaRoot is passed to the prerenderHistory', () => {
            history.push('/root/extrastuff');
            listMap({}, '/root');

            sinon.assert.calledWith(
                prerenderHistory,
                sinon.match({ path: '/root' })
            );
            sinon.assert.calledWith(
                prerenderHistory,
                sinon.match({ subPath: '/extrastuff' })
            );
        });

        afterEach(() => {
            __RewireAPI__.__ResetDependency__('history');
            __RewireAPI__.__ResetDependency__('prerenderHistory');
            __RewireAPI__.__ResetDependency__('windowprops');
        });
    });

    afterEach(() => {
        __RewireAPI__.__ResetDependency__('getAppContext');
    });
});
