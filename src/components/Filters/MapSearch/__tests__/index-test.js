var React = require('react'),
    ReactDOM = require('react-dom'),
    MapSearch = require('../index'),
    ApplicationStore = require('../../../../stores/ApplicationStore'),
    TestUtils = require('react-dom/test-utils'),
    wrapper = require('../../../../../test/stubs/testWrapper');

describe('the MapSearch component', function () {
    var renderedComponent;

    beforeEach(function (done) {
        var Wrapped = wrapper(MapSearch),
            wrappedComponent;

        wrappedComponent = TestUtils.renderIntoDocument(
            <Wrapped />
        );

        renderedComponent = TestUtils.findRenderedComponentWithType(wrappedComponent, MapSearch);

        renderedComponent.setState({
            locationTypeDefinitions: [
                {
                    "name": "type 1",
                    "definitions": [
                        ["item 1"]
                    ],
                    "radius": 1
                },
                {
                    "name": "type 2",
                    "definitions": [
                        ["item 2"],
                        ["item 3", "item 4"],
                        ["item 5", "item 6", "item 7"]
                    ],
                    "radius": 2
                },
                {
                    "name": "default",
                    "definitions": [],
                    "radius": 3
                }
            ]
        }, done);
    });

    describe('when rendering the component', function() {
        it('should render an input', function() {
            var link = TestUtils.scryRenderedDOMComponentsWithTag(
                renderedComponent,
                'input'
            );
            expect(link.length).toBe(1);
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = "";
        setTimeout(done);
    });
});