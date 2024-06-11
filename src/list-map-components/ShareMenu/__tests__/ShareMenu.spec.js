import React from 'react';
import ReactDOM from 'react-dom';
import ShareMenu from '../ShareMenu';
import getAppContext from '../../../utils/getAppContext';
import ApplyAppContext from '../../../components/ApplyAppContext';
import { IntlProvider } from 'react-intl';

var TestUtils = require('react-dom/test-utils');
import { createRenderer } from 'react-test-renderer/shallow';
let shallowRenderer = createRenderer();

describe('ShareMenu', function() {
    describe('When rendering the shareMenu component', function() {
        let props = {};
        let context;

        beforeEach(function() {
            props = {
                isEnabled: true,
                config: {
                    facebookAppId: '1552675454953251',
                    socialServices: {
                        facebookShare: true,
                        googlePlus: true,
                        linkedInShare: true,
                        pintrestPinIt: true,
                        twitterTweet: true
                    }
                }
            };
            context = getAppContext();
            context.language = require('../../../config/sample/master/translatables.json').i18n;
        });

        afterEach(function() {
            props = undefined;
            context = undefined;
        });

        it('should render the parent class when isEnabled prop is true and config is set', function() {
            const parentClass = 'shareMenu';

            shallowRenderer.render(<ShareMenu {...props} />, context);
            let renderedComponent = shallowRenderer.getRenderOutput();
            let parentNodeClass = renderedComponent.props.className;
            expect(parentNodeClass).toBe(parentClass);
        });

        it('should not render when no services are enabled', function() {
            props.config.socialServices = {
                facebookShare: false,
                googlePlus: false,
                linkedInShare: false,
                pintrestPinIt: false,
                twitterTweet: false
            };

            shallowRenderer.render(<ShareMenu {...props} />);
            let renderedComponent = shallowRenderer.getRenderOutput();
            expect(renderedComponent).toBe(null);
        });

        it('should add an is_open class to child nodes when isMenuOpen state is set', function(done) {
            const isOpenClass = 'is_open';

            let renderedComponent = TestUtils.renderIntoDocument(
                <IntlProvider locale="en-GB" messages={{}}>
                    <ApplyAppContext passContext={context}>
                        <ShareMenu isEnabled={true} {...props} />
                    </ApplyAppContext>
                </IntlProvider>
            );

            let shareMenu = TestUtils.findRenderedComponentWithType(
                renderedComponent,
                ShareMenu
            );

            shareMenu.setState(
                {
                    isMenuOpen: true
                },
                function() {
                    let wrapperElement = ReactDOM.findDOMNode(
                        renderedComponent
                    );
                    let shareWidgets = wrapperElement.querySelector(
                        '.cbre_popover'
                    );
                    expect(shareWidgets.classList.value).toContain(isOpenClass);
                    done();
                }
            );
        });
    });
});
