var React = require('react');
var ReactDOM = require('react-dom');
var getAppContext = require('../../utils/getAppContext');
var TestUtils = require('react-dom/test-utils');
var searchStateContainer = require('../searchStateContainer');
var wrapper = require('../../../test/stubs/testWrapper');
var ActionTypes = require('../../constants/ActionTypes');

describe('searchStateContainer', function() {

  beforeEach(function () {
    window.cbreSiteType = 'commercial';
  });

  afterEach(function () {
    window.cbreSiteType = undefined;
  });

  describe('When search state is updated', function() {
    it('should set extended search state', function(done) {
      var context = getAppContext();

      // Enable extended search.
      context.stores.ConfigStore.setItem('extendSearches', true);

      class MockComponent extends React.Component {
        componentDidUpdate(prevProps, prevState) {
          expect(this.props.extendedSearch).toBe(true);
          done();
        }

        render() {
          return React.createElement('div');
        }
      }

      var Component = searchStateContainer(MockComponent);
      var Wrapped = wrapper(Component, context);

      var renderedOutput = TestUtils.renderIntoDocument(
        <Wrapped />
      );

      var container = TestUtils.findRenderedComponentWithType(renderedOutput, Component);

      context.dispatcher.dispatch({
        type: ActionTypes.SET_SEARCH_STATE,
        item: 'extendedSearch',
        value: true
      });
    });
  });
});
