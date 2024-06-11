var React = require('react');
var ReactDOM = require('react-dom');
var getAppContext = require('../../../utils/getAppContext');
var TestUtils = require('react-dom/test-utils');
var wrapper = require('../../../../test/stubs/testWrapper');
var ExtendedSearch = require('../index');

describe('extendedSearch', function() {
  beforeEach(function () {
    window.cbreSiteType = 'commercial';
  });

  afterEach(function () {
    window.cbreSiteType = undefined;
  });

  describe('When in extendedSearch mode and result count is greater than 0', function() {
    it('should render its child components', function(done) {
      var context = getAppContext();

      class ChildComponent extends React.Component {
        componentDidMount() {
          done();
        }

        render() {
          return (<div className='childComponent'></div>);
        }
      }

      var Context = wrapper(ChildComponent, context);
      var renderedOutput = TestUtils.renderIntoDocument(
        <Context>
          <ExtendedSearch totalResults={1} extendedSearch={true}>
            <ChildComponent />
          </ExtendedSearch>
        </Context>
      );

      var container = TestUtils.findRenderedComponentWithType(renderedOutput, ChildComponent);
      var element = ReactDOM.findDOMNode(container);
      expect(element.getAttribute('class')).toContain('childComponent');
    });
  });
});
