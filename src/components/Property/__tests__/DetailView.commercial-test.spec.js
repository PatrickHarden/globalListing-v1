var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var DetailView = require('../DetailView.commercial');
var Carousel = require('../PropertyComponents/Carousel').default;
var PdpCallToActions = require('../PropertyComponents/PdpCallToActions')
    .default;
import { PhotoSwipe } from 'react-photoswipe';
var defaultValues = require('../../../constants/DefaultValues');
var getAppContext = require('../../../utils/getAppContext');
var wrapper = require('../../../../test/stubs/testWrapper');
var rawPropertyStub = require('../../../../test/stubs/rawPropertyStub');
var _ = require('lodash');
var _config = require('../../../config/sample/master/root.json');
var _lang = require('../../../config/sample/master/translatables.json').i18n;
var Moment = require('moment/min/moment-with-locales.min');

import { IntlProvider } from 'react-intl';

describe('DetailView.commercial', function() {
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

    describe('_buildLeasesAndCharges', function() {
        describe('When passed a date in the past', function() {
            it('should return a preset text string', function() {
                var renderedComponent = TestUtils.findRenderedComponentWithType(
                        this.wrappedComponent,
                        DetailView
                    ),
                    returnedObject = renderedComponent._buildLeasesAndCharges({
                        AvailableFrom: '2015-08-09'
                    });
                expect(returnedObject[0]).toEqual({
                    id: 'availableFrom',
                    title: _lang.PDPAvailableFrom,
                    value: _lang.AvailableFromNow
                });
            });
        });

        describe('When passed a date in the future', function() {
            it('should return a preset text string with a formatted representation of the date', function() {
                var renderedComponent = TestUtils.findRenderedComponentWithType(
                        this.wrappedComponent,
                        DetailView
                    ),
                    returnedObject = renderedComponent._buildLeasesAndCharges({
                        AvailableFrom: '2100-01-01T00:00:00'
                    }),
                    expectedDate = new Moment('2100-01-01T00:00:00');
                expectedDate = expectedDate
                    .locale(_config.language)
                    .format(defaultValues.dateFormat);

                expect(returnedObject[0]).toEqual({
                    id: 'availableFrom',
                    title: _lang.PDPAvailableFrom,
                    value: expectedDate
                });
            });
        });
    });

    describe('when clicking on the PropertyImage, the lightbox', function() {
        it('should open and close', function(done) {
            var renderedComponent = TestUtils.findRenderedComponentWithType(
                this.wrappedComponent,
                DetailView
            );
            var renderedMarkup = ReactDOM.findDOMNode(renderedComponent);
            var slide = renderedMarkup.querySelector('.pdp-lighbox-cta');

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

            //var renderedMarkup = ReactDOM.findDOMNode(renderedActionsComponent);
            //var action = renderedMarkup.querySelector('[href="file://emea.cbre.net/Data/WebPlatform/Listing Service/PRD/Agency365Data/OfficePLUS/floorplans/cbrrps-CAR150038_FloorPlan_1_1280x960.png"]');

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

            renderedActionsComponent.handleCallToActionButtonOnClick(0);
            //TestUtils.Simulate.click(action);
        });
    });
});
