var React = require('react'),
    ReactDOM = require('react-dom'),
    Walkthrough = require('../Walkthrough').default,
    ReactRouterContext = require('../../../../../test/ReactRouterContext'),
    TestUtils = require('react-dom/test-utils'),
    PropertyStore = require('../../../../stores/PropertyStore'),
    getAppContext = require('../../../../utils/getAppContext');
import { createRenderer } from 'react-test-renderer/shallow';

describe('Component', function() {
    describe('<Walkthrough />', function() {
        const renderer = createRenderer();
        const context = getAppContext();
        let props;

        beforeEach(function() {
            props = {
                url: 'http://someiframeurl.com'
            };
        });

        afterEach(function() {
            props = undefined;
        });

        describe('#render()', function() {
            it('should render an iframe when url prop is passed', function() {
                renderer.render(<Walkthrough url={props.url} />, context);

                const output = renderer.getRenderOutput();
                const elementType = output.props.children.type;
                const wrapperDivClass = output.props.className;

                expect(elementType).toBe('iframe');
                expect(wrapperDivClass).toBe('walkthrough-details');
            });

            it('should render override the parent div class if wrapperClass prop is passed', function() {
                renderer.render(
                    <Walkthrough
                        url={props.url}
                        wrapperClass="someWrapperClass"
                    />,
                    context
                );

                const output = renderer.getRenderOutput();
                const wrapperDivClass = output.props.className;
                expect(wrapperDivClass).toBe('someWrapperClass');
            });

            it('should render as a badge when displayAsBadge prop is passed', function() {
                renderer.render(
                    <Walkthrough
                        url={props.url}
                        displayAsBadge={true}
                        badgeText={'walkthoughBadgeText'}
                    />,
                    context
                );

                const output = renderer.getRenderOutput();
                const wrapperDivClass = output.props.className;
                const badgeText = output.props.children.props.children;

                expect(wrapperDivClass).toBe('walkthrough-badge');
                expect(badgeText).toBe('walkthoughBadgeText');
            });
        });
    });
});
