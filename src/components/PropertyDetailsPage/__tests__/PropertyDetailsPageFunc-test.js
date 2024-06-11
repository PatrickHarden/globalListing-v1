var ReactDOM = require('react-dom'),
    React = require('react'),
    PropertyDetailsPage = require('../index'),
    getAppContext = require('../../../utils/getAppContext'),
    TestUtils = require('react-dom/test-utils'),
    ReactRouterContext = require('../../../../test/ReactRouterContext'),
    _property = require('../../../../test/stubs/processedPropertyStub'),
    _config = require('../../../config/sample/master/root.json');

import {IntlProvider} from 'react-intl';

describe('PropertyDetailsPage component', function () {
    var _errorClass = 'api-error',
        _spinnerClass = 'react-spinner',
        _bodyClass= 'cbre-react--pdp-page cbre-react--pdp-page--type-sales';

    _config.searchConfig = {
        searchResultsPage: '/'
    };

    _config.features = {
        propertyNavigation: true
    }

    beforeEach(function () {
        this._props = {
            searchType: 'isSale',
            spaPath: {},
            location: {
                query: {
                    view: 'isSale'
                }
            },
            params: {
                propertyId: 'GB-ReapIT-cbrrps-BOW120347'
            }
        };
        this._args = {
            propertyId: '!' + _property.PropertyId,
            site: 'uk-resi',
            aspects: 'isSale',
            pagesize: 999999,
            page: 1
        };
        this.context = getAppContext();
        this.context.stores.ParamStore.setParam('Site', this._args.site);
        this.context.stores.ConfigStore.setConfig(_config);
        this.Actions = this.context.actions;
        this.PropertyStore = this.context.stores.PropertyStore;

        spyOn(this.Actions, 'getProperty');
        spyOn(this.Actions, 'getRelatedProperties');

        this.Wrapped = new ReactRouterContext(PropertyDetailsPage, this._props, this.context);
        this.container = document.createElement('div');
        this.wrappedComponent = ReactDOM.render(
            <IntlProvider locale="en-GB" messages={{}}>
                <this.Wrapped />
            </IntlProvider>,
            this.container
        );

        this.renderedComponent = TestUtils.findRenderedComponentWithType(this.wrappedComponent, PropertyDetailsPage);
    });

    describe('when rendering the component', function() {

        it('should call the getProperty action with the supplied propertyID param if no property exists in state', function() {
            expect(this.Actions.getProperty).toHaveBeenCalledWith(this._props.params.propertyId);
        });

        it('should add classes to the document body', function() {
            expect($('body').attr('class')).toContain(_bodyClass);
        });

        it('should render the spinner component', function() {
            var spinnerComponent = TestUtils.findRenderedDOMComponentWithClass(
                this.wrappedComponent,
                _spinnerClass
            );

            expect(typeof spinnerComponent).toBe('object');
        });

        describe('when an error is thrown', function() {
            beforeEach(function(done){
                this.renderedComponent.setState({
                    error: true,
                    loading:false,
                    property: _property
                }, done);
            });

            it('should render the error component', function() {
                var errorComponent = TestUtils.findRenderedDOMComponentWithClass(
                    this.wrappedComponent,
                    _errorClass
                );

                expect(typeof errorComponent).toBe('object');
            });
        });

        describe('if the carousel feature is disabled', function() {
            beforeEach(function (done) {
                this.context.stores.PropertyStore.setProperty(_property, false);
                this.Wrapped = new ReactRouterContext(PropertyDetailsPage, this._props, this.context);
                this.container = document.createElement('div');
                this.wrappedComponent = ReactDOM.render(
                    <IntlProvider locale="en-GB" messages={{}}>
                        <this.Wrapped />
                    </IntlProvider>,
                    this.container
                );

                this.renderedComponent = TestUtils.findRenderedComponentWithType(this.wrappedComponent, PropertyDetailsPage);
                this.renderedComponent.setState({
                    property: _property
                }, done);
            });

            it('should not fire a search for related properties', function() {
                this.renderedComponent._updateProperty();
                expect(this.Actions.getRelatedProperties).not.toHaveBeenCalled();
            });
        });

        describe('if the carousel feature is enabled', function() {
            beforeEach(function (done) {
                _config.features = { relatedProperties: true };
                this.context.stores.ConfigStore.setConfig(_config);
                this.context.stores.PropertyStore.setProperty(_property, false);
                this.Wrapped = new ReactRouterContext(PropertyDetailsPage, this._props, this.context);
                this.container = document.createElement('div');
                this.wrappedComponent = ReactDOM.render(
                    <IntlProvider locale="en-GB" messages={{}}>
                        <this.Wrapped />
                    </IntlProvider>,
                    this.container
                );

                this.renderedComponent = TestUtils.findRenderedComponentWithType(this.wrappedComponent, PropertyDetailsPage);
                this.renderedComponent.setState({
                    property: _property
                }, done);
            });

            it('should perform a search for related properties', function() {
                this.renderedComponent._updateProperty();
                expect(this.Actions.getRelatedProperties).toHaveBeenCalled();
            });

            describe('if the current property has a ParentPropertyId set', function() {
                it('should perform a search for properties with the same ParentPropertyId', function() {
                    this._args.parentProperty = _property.ParentPropertyId;
                    this.renderedComponent._updateProperty();
                    expect(this.Actions.getRelatedProperties).toHaveBeenCalledWith(this._args);
                });
            });

            describe('if the current property has no ParentPropertyId', function() {
                beforeEach(function (done) {
                    delete _property.ParentPropertyId;
                    this.context.stores.PropertyStore.setProperty(_property, false);
                    this.Wrapped = new ReactRouterContext(PropertyDetailsPage, this._props, this.context);
                    this.container = document.createElement('div');
                    this.wrappedComponent = ReactDOM.render(
                        <IntlProvider locale="en-GB" messages={{}}>
                            <this.Wrapped />
                        </IntlProvider>,
                        this.container
                    );

                    this.renderedComponent = TestUtils.findRenderedComponentWithType(this.wrappedComponent, PropertyDetailsPage);
                    this.renderedComponent.setState({
                        property: _property
                    }, done);
                });

                it('should perform a search for properties in a specified radius with the same property types', function() {
                    this._args.usageType = _property.UsageType;
                    this._args.radius = 1;
                    this._args.lat = _property.Coordinates.lat;
                    this._args.lon = _property.Coordinates.lon;
                    this.renderedComponent._updateProperty();

                    expect(this.Actions.getRelatedProperties).toHaveBeenCalledWith(this._args);
                });
            });
        });
    });

    afterEach(function() {
        ReactDOM.unmountComponentAtNode(this.container);
        document.body.innerHTML = '';
        this._args = undefined;
        this._props = undefined;
        this.container = undefined;
        this.context = undefined;
        this.wrappedComponent = undefined;
        this.renderedComponent = undefined;
        this.Actions = undefined;
        this.PropertyStore = undefined;
        this.Wrapped = undefined;
    });

});
