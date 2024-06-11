var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var DetailView = require('../DetailView');
var Carousel = require('../PropertyComponents/Carousel').default;
var ImageGrid = require('../PropertyComponents/ImageGrid').default;
var PdpCallToActions = require('../PropertyComponents/PdpCallToActions')
    .default;
import { PhotoSwipe } from 'react-photoswipe';
var getAppContext = require('../../../utils/getAppContext');
var wrapper = require('../../../../test/stubs/testWrapper');
var rawPropertyStub = require('../../../../test/stubs/rawPropertyStub');
var _ = require('lodash');
var _config = require('../../../config/sample/master/root.json');

import { IntlProvider } from 'react-intl';

describe('DetailView', function() {
    beforeEach(function() {
        var context = getAppContext();
        var PropertyStore = context.stores.PropertyStore;
        var ConfigStore = context.stores.ConfigStore;

        _config.features = {
            propertyNavigation: true
        };

        context.language = require('../../../config/sample/master/translatables.json').i18n;
        ConfigStore.setConfig(_config);
        PropertyStore.setProperties(rawPropertyStub);
        var hydratedProperties = PropertyStore.getProperties();
        PropertyStore.setProperty(hydratedProperties[0], false);

        window.cbreSiteType = 'residential';
        var props = {
            searchType: 'isSale',
            spaPath: {},
            location: {
                query: {
                    view: 'isSale'
                }
            },
            property: PropertyStore.getProperty()
        };

        delete props.property.Walkthrough;

        var Wrapped = wrapper(DetailView, context);
        this.wrappedComponent = TestUtils.renderIntoDocument(
            <IntlProvider locale="en-GB" messages={{}}>
                <Wrapped {...props} />
            </IntlProvider>
        );
    });

    afterEach(function() {
        this.wrappedComponent = undefined;
        window.cbreSiteType = undefined;
    });

    describe('when clicking on a carousel image, the lightbox', function() {
        it('should open and close', function(done) {
            var renderedComponent = TestUtils.findRenderedComponentWithType(
                this.wrappedComponent,
                DetailView
            );

            var renderedCarouselComponent = TestUtils.findRenderedComponentWithType(
                renderedComponent,
                Carousel
            );
            var renderedMarkup = ReactDOM.findDOMNode(
                renderedCarouselComponent
            );
            var slide = renderedMarkup.querySelector('.pdp-carousel-item');

            var i = 0;
            spyOn(renderedComponent, 'componentDidUpdate').and.callFake(
                function() {
                    var photoSwipe = TestUtils.findRenderedComponentWithType(
                        renderedComponent,
                        PhotoSwipe
                    );

                    switch (i) {
                        case 0:
                            i++;
                            expect(this.state.isOpen).toEqual(true);
                            expect(photoSwipe.state.isOpen).toEqual(true);
                            photoSwipe.handleClose();
                            break;
                        case 1:
                            expect(this.state.isOpen).toEqual(false);
                            expect(photoSwipe.state.isOpen).toEqual(false);
                            return done();
                    }
                }
            );
            TestUtils.Simulate.click(slide);
        });
    });

    describe('when clicking on an image in ImageGrid, the lightbox', function() {
        it('should open and close', function(done) {
            var renderedComponent = TestUtils.findRenderedComponentWithType(
                this.wrappedComponent,
                DetailView
            );
            var renderedCarouselComponent = TestUtils.findRenderedComponentWithType(
                renderedComponent,
                ImageGrid
            );
            var renderedMarkup = ReactDOM.findDOMNode(
                renderedCarouselComponent
            );
            var imageItem = renderedMarkup.querySelector(
                '.image-grid-item--1 > a'
            );

            var i = 0;
            spyOn(renderedComponent, 'componentDidUpdate').and.callFake(
                function() {
                    var photoSwipe = TestUtils.findRenderedComponentWithType(
                        renderedComponent,
                        PhotoSwipe
                    );

                    switch (i) {
                        case 0:
                            i++;
                            expect(this.state.isOpen).toEqual(true);
                            expect(photoSwipe.state.isOpen).toEqual(true);
                            photoSwipe.handleClose();
                            break;
                        case 1:
                            expect(this.state.isOpen).toEqual(false);
                            expect(photoSwipe.state.isOpen).toEqual(false);
                            return done();
                    }
                }
            );
            TestUtils.Simulate.click(imageItem);
        });
    });

    describe('when clicking on the floorplan link, the lightbox', function() {
        it('should open and close', function(done) {
            var renderedComponent = TestUtils.findRenderedComponentWithType(
                this.wrappedComponent,
                DetailView
            );
            var renderedActionsComponent = TestUtils.findRenderedComponentWithType(
                renderedComponent,
                PdpCallToActions
            );

            var i = 0;
            spyOn(renderedComponent, 'componentDidUpdate').and.callFake(
                function() {
                    var photoSwipe = TestUtils.findRenderedComponentWithType(
                        renderedComponent,
                        PhotoSwipe
                    );
                    switch (i) {
                        case 0:
                            i++;
                            expect(this.state.isOpen).toEqual(true);
                            expect(photoSwipe.state.isOpen).toEqual(true);
                            photoSwipe.handleClose();
                            break;
                        case 1:
                            expect(this.state.isOpen).toEqual(false);
                            expect(photoSwipe.state.isOpen).toEqual(false);
                            return done();
                    }
                }
            );

            // @TODO: Having to bypass actually simulating click, as it isn't consistant
            renderedActionsComponent.handleCallToActionButtonOnClick(0);
            //TestUtils.Simulate.click(action);
        });
    });
});
