var React = require('react'),
    ReactDOM = require('react-dom'),
    TestUtils = require('react-dom/test-utils'),
    ReactRouterContext = require('../../../../../test/ReactRouterContext'),
    FeatureGrid = require('../FeatureGrid').default;

describe('the FeatureGrid component', function () {
    var renderedComponent,
        appComponent,
        featureCount = 4,
        RouteContext,
        features = ["item 1", "item 2", "item 3", "item 4"],
        props;

    beforeEach(function () {
        props = {
            features: features,
            featureCount: featureCount,
            emptyListElement: <div>There are no elements in this list</div>
        };
    });

    describe('when rendering the component', function () {
        describe('when feature count is an odd number', function () {
            beforeEach(function () {
                RouteContext = new ReactRouterContext(FeatureGrid, props);
                appComponent = TestUtils.renderIntoDocument(<RouteContext />);

                renderedComponent = TestUtils.findRenderedComponentWithType(appComponent, FeatureGrid);
            });
            it('should render a number of items equal to the feature count property', function () {
                var items = TestUtils.scryRenderedDOMComponentsWithClass(
                    renderedComponent,
                    'feature-grid__item'
                );
                expect(items.length).toBe(featureCount);
            });
        });

        describe('when feature count is an even number and moreDetails is turned on', function () {
            beforeEach(function () {

                RouteContext = new ReactRouterContext(FeatureGrid,
                Object.assign({}, props, {
                    moreDetailsLink: <div className='feature-grid__item'>more details</div>
                }));
                appComponent = TestUtils.renderIntoDocument(<RouteContext />);

                renderedComponent = TestUtils.findRenderedComponentWithType(appComponent, FeatureGrid);
            });
            it('should render all the features', function () {
                var items = TestUtils.scryRenderedDOMComponentsWithClass(
                    renderedComponent,
                    'feature-grid__item'
                );
                expect(items.length).toBe(4);
                expect(items[items.length-1].innerText).toBe("more details");
            });
        });

        describe('when feature count is an even number and moreDetails is turnedOff', function () {
            beforeEach(function () {

                RouteContext = new ReactRouterContext(FeatureGrid, props);
                appComponent = TestUtils.renderIntoDocument(<RouteContext />);

                renderedComponent = TestUtils.findRenderedComponentWithType(appComponent, FeatureGrid);
            });
            it('should render a number of items equal to the feature count property', function () {
                var items = TestUtils.scryRenderedDOMComponentsWithClass(
                    renderedComponent,
                    'feature-grid__item'
                );
                expect(items.length).toBe(4);
                expect(items[items.length-1].innerText).toBe("item 4");
            });
        });
    });

    afterEach(function (done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = "";
        setTimeout(done);
    });
});
