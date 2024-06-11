var React = require('react'),
    PropTypes = require('prop-types'),
    ReactDOM = require('react-dom'),
    ImageGrid = require('../ImageGrid').default,
    wrapper = require('../../../../../test/stubs/testWrapper'),
    getAppContext = require('../../../../utils/getAppContext'),
    TestUtils = require('react-dom/test-utils');

describe('the ImageGrid component', function() {
    var renderedComponent,
        items,
        ItemArray = [
            {
                caption: 'Picture No. 26',
                resources: [
                    {
                        height: '960',
                        width: '1280',
                        uri: 'logo.png',
                        breakpoint: 'small'
                    },
                    {
                        height: '960',
                        width: '1280',
                        uri: 'logo.png',
                        breakpoint: 'medium'
                    },
                    {
                        height: '960',
                        width: '1280',
                        uri: 'logo.png',
                        breakpoint: 'large'
                    }
                ]
            },
            {
                caption: 'Picture No. 27',
                resources: [
                    {
                        height: '960',
                        width: '1280',
                        uri: 'logo.png',
                        breakpoint: 'small'
                    },
                    {
                        height: '960',
                        width: '1280',
                        uri: 'logo.png',
                        breakpoint: 'medium'
                    },
                    {
                        height: '960',
                        width: '1280',
                        uri: 'logo.png',
                        breakpoint: 'large'
                    }
                ]
            }
        ];

    beforeEach(function() {
        var context = getAppContext();

        context.stores.ConfigStore.setConfig({
            cdnUrl: 'http://localhost:3000/images',
            breakpoints: {
                xsmall: '300',
                small: '768',
                medium: '992',
                large: '1200'
            }
        });

        var Wrapped = wrapper(ImageGrid, context),
            wrappedComponent;

        wrappedComponent = TestUtils.renderIntoDocument(
            <Wrapped items={ItemArray} />
        );

        renderedComponent = TestUtils.findRenderedComponentWithType(
            wrappedComponent,
            ImageGrid
        );

        items = TestUtils.scryRenderedDOMComponentsWithTag(
            renderedComponent,
            'img'
        );
    });

    describe('When rendering the component', function() {
        it('should create a number of images elements representing the resultant components', function() {
            expect(items.length).toBe(2);
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(document.body);
        document.body.innerHTML = '';
        setTimeout(done);
    });
});
