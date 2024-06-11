var React = require('react');
var ReactDOM = require('react-dom');
var getAppContext = require('../../utils/getAppContext');
var APIMapping = require('../../constants/APIMapping.js');
var TestUtils = require('react-dom/test-utils');
var configContainer = require('../configContainer');
var wrapper = require('../../../test/stubs/testWrapper');
var ActionTypes = require('../../constants/ActionTypes');
var DefaultValues = require('../../constants/DefaultValues');

describe('configContainer', function() {

  beforeEach(function () {
    window.cbreSiteType = 'commercial';
  });

  afterEach(function () {
    window.cbreSiteType = undefined;
  });

  describe('When updating the PropertyStore', function () {
    it('should update its state', function (done) {
      var context = getAppContext();
      var mockConfig = {
          api: '/wacky',
          siteType: 'commercial'
      };

      class MockComponent extends React.Component {
        componentDidMount() {
          expect(this.props.config).toEqual(mockConfig);
          expect(this.props.hasLoaded).toBe(true);
          done();
        }

        render() {
          return React.createElement('div');
        }
      }

      var Component = configContainer(MockComponent, { hideLoadingState: true });
      var Wrapped = wrapper(Component, context);

      var renderedOutput = TestUtils.renderIntoDocument(
        <Wrapped />
      );

      var container = TestUtils.findRenderedComponentWithType(renderedOutput, Component);

      expect(container.state.hasLoaded).toBe(false);
      expect(container.state.config).toBe(undefined);

      context.stores.ConfigStore.setConfig(mockConfig);

      container.handleBootstrapComplete();
    });

  });

});
