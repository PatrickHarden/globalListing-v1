var React = require('react'),
    ReactDOM = require('react-dom'),
    EventButton = require('../index'),
    TestUtils = require('react-dom/test-utils'),
    wrapper = require('../../../../test/stubs/testWrapper'),
    getAppContext = require('../../../utils/getAppContext');

describe('the Event button component', function () {
    var renderedComponent,
        button,
        context,
        buttonText = 'button text',
        falseEvent = 'CURRENT_PROPERTY_INDEX_UPDATED',
        dummyFunction = function(){};

    beforeEach(function (done) {
        context = getAppContext();

        var Wrapped = wrapper(EventButton, context);

        renderedComponent = TestUtils.renderIntoDocument(
            <Wrapped onClick={dummyFunction} listenFor={falseEvent}>{buttonText}</Wrapped>
        );

        button = TestUtils.findRenderedDOMComponentWithTag(
            renderedComponent,
            'a'
        );

        renderedComponent.setState({
            loading: false,
            clickEvent: dummyFunction
        }, done);
    });

    describe('when rendering the component', function() {
        it('should render a button with inherited text', function() {
            expect(button.textContent).toBe(buttonText);
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = "";
        setTimeout(done);
    });
});
