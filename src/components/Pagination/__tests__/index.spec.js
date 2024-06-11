var React = require('react'),
    ReactDOM = require('react-dom'),
    Pagination = require('../index'),
    TestUtils = require('react-dom/test-utils'),
    ReactRouterContext = require('../../../../test/ReactRouterContext');

describe('the Pagination component', function () {
    var renderedComponent,
        appComponent,
        RouteContext = new ReactRouterContext(Pagination);

    beforeEach(function (done) {
        appComponent = TestUtils.renderIntoDocument(
            <RouteContext />
        );
        renderedComponent = TestUtils.findRenderedComponentWithType(appComponent, Pagination);

        renderedComponent.setState({
            page: 2,
            pageSize: 10,
            totalPages: 5,
            total: 12
        }, done);
    });

    describe('when rendering the component', function() {

        it('should render a page number and page count', function () {
            var string = TestUtils.scryRenderedDOMComponentsWithTag(
                renderedComponent,
                'p'
            );
            expect(string.length).toBe(1);
        });

        describe('the previous button', function() {
            describe('when there are previous pages', function() {
                it('should render', function () {
                    var item = renderedComponent.refs['prev-btn'];
                    expect(typeof item).toBe('object');
                });
            });

            describe('when there are no previous pages', function() {
                beforeEach(function (done) {
                    renderedComponent.setState({
                        page: 1
                    }, done);
                });

                it('should not render', function () {
                    var item = renderedComponent.refs['prev-btn'];
                    expect(item).toBe(undefined);
                });
            });
        });

        describe('the next button', function() {
            describe('when there are further pages', function() {
                it('should render', function () {
                    var item = renderedComponent.refs['next-btn'];
                    expect(typeof item).toBe('object');
                });
            });

            describe('when there are no further pages', function() {
                beforeEach(function (done) {
                    renderedComponent.setState({
                        page: 5
                    }, done);
                });

                it('should not render', function () {
                    var item = renderedComponent.refs['next-btn'];
                    expect(item).toBe(undefined);
                });
            });
        });

        describe('the all button', function() {
            describe('when all results are not being shown', function() {
                it('should render', function () {
                    var item = renderedComponent.refs['all-btn'];
                    expect(typeof item).toBe('object');
                });
            });

            describe('when all results are being shown', function() {
                beforeEach(function (done) {
                    renderedComponent.setState({
                        pageSize: 13
                    }, done);
                });

                it('should not render', function () {
                    var item = renderedComponent.refs['all-btn'];
                    expect(item).toBe(undefined);
                });
            });
        });

    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = "";
        setTimeout(done);
    });
});