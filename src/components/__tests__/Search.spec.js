var ReactDOM = require('react-dom'),
    React = require('react'),
    PropTypes = require('prop-types'),
    //Search = require('../Search'),
    Spinner = require('react-spinner'),
    getAppContext = require('../../utils/getAppContext'),
    TestUtils = require('react-dom/test-utils'),
    ReactRouterContext = require('../../../test/ReactRouterContext');
import Search from '../Search';
describe('Search component', function() {
    var _bodyClass = 'cbre-react-search',
        formComponent,
        headerComponent,
        container;
    let context;
    let renderedComponent;
    let Wrapped;
    let Actions;
    let wrappedComponent;

    beforeEach(function() {
        context = getAppContext();
        context.stores.ConfigStore.setConfig({
            filters: [],
            features: { searchOnEnter: true }
        });
        Actions = context.actions;
        Wrapped = new ReactRouterContext(Search, {}, context);

        container = document.createElement('div');
        wrappedComponent = ReactDOM.render(<Wrapped />, container);

        renderedComponent = TestUtils.findRenderedComponentWithType(
            wrappedComponent,
            Search
        );

        spyOn(context.stores.ParamStore, 'getParamsState').and.returnValue(
            true
        );
        spyOn(renderedComponent, '_handleKeyPress').and.callThrough();
        spyOn(renderedComponent, '_submitSearch');
    });

    describe('when rendering the component', function() {
        it('should add a class to the document body', function() {
            expect(document.body.className).toContain(_bodyClass);
        });

        describe('when the loading state is true', function() {
            it('should render a spinner', function() {
                var spinner = TestUtils.findRenderedComponentWithType(
                    renderedComponent,
                    Spinner
                );
                expect(typeof spinner).toBe('object');
            });
        });

        describe('when the search component has rendered', function() {
            beforeEach(function(done) {
                renderedComponent.setState(
                    {
                        language: require('../../config/sample/master/translatables.json')
                            .i18n,
                        loadingState: false,
                        loading: false
                    },
                    function() {
                        formComponent = TestUtils.findRenderedDOMComponentWithTag(
                            renderedComponent,
                            'form'
                        );
                        done();
                    }.bind(this)
                );
            });

            describe('the search header', function() {
                describe('when the site type is commercial', function() {
                    let context;
                    let WrappedComponent;
                    let renderedComponent;
                    let component;
                    let header;
                    let container;
                    let searchHeader;
                    let language;

                    describe('when the config is complete', function() {
                        beforeEach(done => {
                            language = require('../../config/sample/master/translatables.json')
                                .i18n;
                            searchHeader = require('../../config/sample/master/search.json')
                                .searchConfig.searchHeader;
                            context = getAppContext();

                            spyOn(
                                context.stores.ConfigStore,
                                'getItem'
                            ).and.returnValue('commercial');
                            spyOn(
                                context.stores.SearchStateStore,
                                'getItem'
                            ).and.returnValue(searchHeader);

                            WrappedComponent = new ReactRouterContext(
                                Search,
                                {},
                                context
                            );
                            container = document.createElement('div');
                            renderedComponent = ReactDOM.render(
                                <WrappedComponent />,
                                container
                            );
                            component = TestUtils.findRenderedComponentWithType(
                                renderedComponent,
                                Search
                            );

                            component.setState(
                                {
                                    language: language,
                                    loadingState: false,
                                    loading: false
                                },
                                () => {
                                    header = TestUtils.findRenderedDOMComponentWithClass(
                                        component,
                                        'cbre-spa--search-header'
                                    );
                                    done();
                                }
                            );
                        });

                        it('should render a widget header', () => {
                            expect(typeof header).toBe('object');
                        });

                        it('should render a title from config', () => {
                            expect(
                                header.children[0].innerHTML.includes(
                                    searchHeader.searchHeaderTitleText
                                )
                            ).toBeTruthy();
                        });

                        it('should render a link', () => {
                            expect(
                                header.children[1].innerHTML.includes(
                                    searchHeader.searchHeaderLinkText
                                )
                            ).toBeTruthy();
                            expect(
                                header.children[1].getAttribute('href')
                            ).toBe(searchHeader.searchHeaderLinkUrl);
                        });
                    });

                    describe('when the config is incomplete', function() {
                        beforeEach(done => {
                            language = require('../../config/sample/master/translatables.json')
                                .i18n;
                            searchHeader = {};
                            context = getAppContext();

                            spyOn(
                                context.stores.ConfigStore,
                                'getItem'
                            ).and.returnValue('commercial');
                            spyOn(
                                context.stores.SearchStateStore,
                                'getItem'
                            ).and.returnValue(searchHeader);

                            WrappedComponent = new ReactRouterContext(
                                Search,
                                {},
                                context
                            );
                            container = document.createElement('div');
                            renderedComponent = ReactDOM.render(
                                <WrappedComponent />,
                                container
                            );
                            component = TestUtils.findRenderedComponentWithType(
                                renderedComponent,
                                Search
                            );

                            component.setState(
                                {
                                    language: language,
                                    loadingState: false,
                                    loading: false
                                },
                                () => {
                                    header = TestUtils.findRenderedDOMComponentWithClass(
                                        component,
                                        'cbre-spa--search-header'
                                    );
                                    done();
                                }
                            );
                        });

                        it('should render a widget header', () => {
                            expect(typeof header).toBe('object');
                        });

                        it('should render a title from language default', () => {
                            expect(
                                header.children[0].innerHTML.includes(
                                    language.SearchHeaderTitle
                                )
                            ).toBeTruthy();
                        });

                        it('should not render a link', () => {
                            expect(header.children.length).toBe(1);
                        });
                    });

                    afterEach(() => {
                        container = undefined;
                        context = undefined;
                        WrappedComponent = undefined;
                        renderedComponent = undefined;
                        component = undefined;
                        header = undefined;
                        searchHeader = undefined;
                        language = undefined;
                    });
                });
            });

            it('should render a form', function() {
                expect(typeof formComponent).toBe('object');
            });

            describe('when pressing enter on an active form', function() {
                describe('when the feature is disabled', function() {
                    beforeEach(function() {
                        context.stores.ConfigStore.setConfig({
                            filters: [],
                            features: { searchOnEnter: false }
                        });
                        TestUtils.Simulate.keyPress(formComponent, {
                            key: 'Enter'
                        });
                    });
                    it('should not fire the _submitSearch method', function() {
                        expect(
                            renderedComponent._submitSearch
                        ).not.toHaveBeenCalled();
                    });
                });

                describe('when the feature is enabled', function() {
                    beforeEach(function() {
                        TestUtils.Simulate.keyPress(formComponent, {
                            key: 'Enter'
                        });
                    });

                    it('should fire the _handleKeyPress method', function() {
                        expect(
                            renderedComponent._handleKeyPress
                        ).toHaveBeenCalled();
                    });

                    it('should fire the _submitSearch method', function() {
                        expect(
                            renderedComponent._submitSearch
                        ).toHaveBeenCalled();
                    });

                    describe('when the site type is commercial', function() {
                        beforeEach(function() {
                            window.cbreSiteType = 'commercial';
                            TestUtils.Simulate.keyPress(formComponent, {
                                key: 'Enter'
                            });
                        });
                        it('should fire the _submitSearch method with the arg set to isLetting', function() {
                            expect(
                                renderedComponent._submitSearch
                            ).toHaveBeenCalledWith('isLetting');
                        });
                    });

                    describe('when the site type is residential and only a let button is rendered', function() {
                        beforeEach(function() {
                            window.cbreSiteType = 'residential';
                            context.stores.SearchStateStore.setItem(
                                'hideSearchToBuy',
                                true
                            );
                            context.stores.SearchStateStore.setItem(
                                'hideSearchToLet',
                                false
                            );
                            TestUtils.Simulate.keyPress(formComponent, {
                                key: 'Enter'
                            });
                        });
                        it('should fire the _submitSearch method with the arg set to isLetting', function() {
                            expect(
                                renderedComponent._submitSearch
                            ).toHaveBeenCalledWith('isLetting');
                        });
                    });

                    describe('when the site type is residential and a buy button is rendered', function() {
                        beforeEach(function() {
                            window.cbreSiteType = 'residential';
                            context.stores.SearchStateStore.setItem(
                                'hideSearchToBuy',
                                false
                            );
                            TestUtils.Simulate.keyPress(formComponent, {
                                key: 'Enter'
                            });
                        });
                        it('should fire the _submitSearch method with the arg set to isSale', function() {
                            expect(
                                renderedComponent._submitSearch
                            ).toHaveBeenCalledWith('isSale');
                        });
                    });
                });
            });
        });
    });

    describe('when unmounting the component', function() {
        beforeEach(function() {
            ReactDOM.unmountComponentAtNode(container);
        });

        it('should remove the class from the document body', function() {
            expect(document.body.className).not.toContain(_bodyClass);
        });
    });

    afterEach(function(done) {
        ReactDOM.unmountComponentAtNode(container);
        document.body.innerHTML = '';
        formComponent = undefined;
        headerComponent = undefined;
        container = undefined;
        context = undefined;
        wrappedComponent = undefined;
        renderedComponent = undefined;
        Actions = undefined;
        Wrapped = undefined;
        setTimeout(done);
    });
});
