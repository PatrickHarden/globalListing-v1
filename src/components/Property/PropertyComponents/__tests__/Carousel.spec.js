var React = require('react'),
    ReactDOM = require('react-dom'),
    CBRECarousel = require('../Carousel').default,
    TestUtils = require('react-dom/test-utils'),
    getAppContext = require('../../../../utils/getAppContext'),
    wrapper = require('../../../../../test/stubs/testWrapper');

describe('the Carousel component', function () {
    var renderedComponent,
        items,
        ItemArray = [
            {
                caption: "Picture No. 26",
                resources: [
                    {
                        height: "960",
                        width: "1280",
                        uri: "logo.png",
                        breakpoint: "small"
                    },
                    {
                        height: "960",
                        width: "1280",
                        uri: "logo.png",
                        breakpoint: "medium"
                    },
                    {
                        height: "960",
                        width: "1280",
                        uri: "logo.png",
                        breakpoint: "large"
                    }
                ]
            },
            {
                caption: "Picture No. 27",
                resources: [
                    {
                        height: "960",
                        width: "1280",
                        uri: "logo.png",
                        breakpoint: "small"
                    },
                    {
                        height: "960",
                        width: "1280",
                        uri: "logo.png",
                        breakpoint: "medium"
                    },
                    {
                        height: "960",
                        width: "1280",
                        uri: "logo.png",
                        breakpoint: "large"
                    }
                ]
            }
        ];

    describe('When rendering the component', function() {
        beforeEach(function () {
            var context = getAppContext();

            context.stores.ConfigStore.setConfig({
                "cdnUrl": "http://localhost:3000/images",
                "breakpoints": {
                    "xsmall": "300",
                    "small": "768",
                    "medium": "992",
                    "large": "1200"
                }
            });

            var Wrapped = wrapper(CBRECarousel, context),
                wrappedComponent;

            wrappedComponent = TestUtils.renderIntoDocument(
                <Wrapped items={ItemArray} />
            );

            renderedComponent = TestUtils.findRenderedComponentWithType(wrappedComponent, CBRECarousel);

            items = TestUtils.scryRenderedDOMComponentsWithClass(
                renderedComponent,
                'pdp-carousel-item'
            );
        });


        it('should create 2 divs with class names of pdp-carousel-item', function() {
            expect(items.length).toBe(2);
        });


        afterEach(function(done) {
            ReactDOM.unmountComponentAtNode(document.body);
            document.body.innerHTML = "";
            setTimeout(done);
        });
    });

    describe('When rendering the component with images that dont match the set aspect ratio', function() {
        it('should create 1 image', function() {
            var _items = [
                {
                    caption: "Picture No. 26",
                    resources: [
                        {
                            width: "900",
                            height: "1600",
                            uri: "logo.png",
                            breakpoint: "small"
                        },
                        {
                            width: "1600",
                            height: "1600",
                            uri: "logo.png",
                            breakpoint: "medium"
                        },
                        {
                            width: "1600",
                            height: "900",
                            uri: "logo.png",
                            breakpoint: "large"
                        }
                    ]
                },
                {
                    caption: "Picture No. 27",
                    resources: [
                        {
                            width: "1280",
                            height: "960",
                            uri: "logo.png",
                            breakpoint: "small"
                        },
                        {
                            width: "1280",
                            height: "960",
                            uri: "logo.png",
                            breakpoint: "medium"
                        },
                        {
                            width: "1280",
                            height: "960",
                            uri: "logo.png",
                            breakpoint: "large"
                        }
                    ]
                }
            ];

            var context = getAppContext();

            context.stores.ConfigStore.setConfig({
                "cdnUrl": "http://localhost:3000/images",
                "breakpoints": {
                    "xsmall": "300",
                    "small": "768",
                    "medium": "992",
                    "large": "1200"
                },
                "carouselAspectRatio": "16:9",
                "features": {
                    "useCarouselAspectRatioFilter": true
                }
            });

            spyOn(context.stores.ConfigStore, 'getCurrentBreakpoint').and.callFake(function () {
                return 'large';
            });

            var Wrapped = wrapper(CBRECarousel, context),
              wrappedComponent;

            wrappedComponent = TestUtils.renderIntoDocument(
              <Wrapped items={_items} />
            );

            renderedComponent = TestUtils.findRenderedComponentWithType(wrappedComponent, CBRECarousel);

            items = TestUtils.scryRenderedDOMComponentsWithClass(
              renderedComponent,
              'pdp-carousel-item'
            );

            expect(items.length).toBe(1);
        });


        afterEach(function(done) {
            ReactDOM.unmountComponentAtNode(document.body);
            document.body.innerHTML = "";
            setTimeout(done);
        });
    });
});
