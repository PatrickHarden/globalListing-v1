var React = require('react'),
    ReactDOM = require('react-dom'),
    Listings = require('../Listings'),
    TestUtils = require('react-dom/test-utils'),
    ReactRouterContext = require('../../../test/ReactRouterContext');

describe('the App', function() {
    var renderedApp,
        searchApp,
        error,
        RouteContext = new ReactRouterContext(Listings);

    beforeEach(function(done) {
        renderedApp = TestUtils.renderIntoDocument(<RouteContext />);
        searchApp = TestUtils.findRenderedComponentWithType(
            renderedApp,
            Listings
        );

        searchApp.setState(
            {
                fatalError: true,
                error: false,
                loading: false
            },
            done
        );
    });

    describe('when rendering', function() {
        describe('when config throws an error', function() {
            beforeEach(function() {
                error = TestUtils.scryRenderedDOMComponentsWithClass(
                    searchApp,
                    'config-error'
                );
            });
            it('should render the config error view', function() {
                expect(error.length).toBe(1);
            });
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });
});
