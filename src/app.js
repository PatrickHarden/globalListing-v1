import 'core-js';
import deleteEmptyProps from './utils/deleteEmptyProps';
require('intersection-observer');
/*
if (!window._babelPolyfill) {
    require('babel-polyfill');
}
*/
require('./utils/console');
require('./utils/CustomEvent');
import { createHistory, useQueries } from 'history';
import listMap from './entrypoints/listMap';
import prerenderHistory from './router-middleware/prerenderHistory';
import analyticsEvents from './router-middleware/analyticsEvents';
import { IntlProvider, addLocaleData } from 'react-intl';
import localeData from 'react-intl/locale-data';
import React, { Component } from 'react';
import getAppContext from './utils/getAppContext';
import DefaultValues from './constants/DefaultValues';
import { isPrerender } from './utils/browser';
import buildStore from './redux/store/buildStore';


var Listings = require('./components/Listings'),
    Carousel = require('./components/Carousel').Carousel,
    ListingsPage = require('./components/ListingsPage'),
    PropertyDetailsPage = require('./components/PropertyDetailsPage'),
    ErrorPage = require('./components/ErrorPage'),
    wrapper = require('./utils/wrapper'),
    $ = require('jQuery'),
    ReactDOM = require('react-dom'),
    ReactRouter = require('react-router'),
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    IndexRoute = ReactRouter.IndexRoute,
    IndexRedirect = ReactRouter.IndexRedirect;

var browserHistory = useQueries(createHistory)();

import Search from './components/Search';
let boundCreateElement;

global.CBRESearch = module.exports = CBRESearch;

function CBRESearch() {
    $(function () {
        $('body').addClass('cbre-react-spa');
    });

    if (!(this instanceof CBRESearch)) {
        return new CBRESearch(arguments);
    }
}
// const pJSON = require('../../package.json');
// CBRESearch.version = pJSON.version;

const defaultOptions = {
    staticQuery: ''
};

function applyDefaultOptions(options) {
    return $.extend({}, defaultOptions, options || {});
}

function addCss(fileName) {
    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "preload";
    link.href = fileName;

    head.appendChild(link);
}

let siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

// add redesign fonts
if (siteTheme == 'commercialr3') {

    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/uge1bog.css";

    head.appendChild(link);
}

if (isPrerender) {
    $(function () {
        $('body').addClass('isPrerender');
    });
}

//new version
CBRESearch.prototype.renderListMap = function (
    elementId,
    config,
    spaPath,
    options
) {

    options = applyDefaultOptions(options);

    if (config && config.siteId) {
        $(function () {
            $('body').addClass(String(config.siteId));
            if (siteTheme) {
                $('body').addClass(String(siteTheme));
            }
        });
    }

    let renderOmissions = {};
    // Check if Array instance, and that renderOmissions exists on the first object in array.
    if (window.agency365 instanceof Array && !!window.agency365[0].renderOmissions) {
        renderOmissions = window.agency365[0].renderOmissions;
        // Check if object, and that a renderOmissions key exists.
    } else if (typeof window.agency365 === "object" && !!window.agency365.renderOmissions) {
        renderOmissions = window.agency365.renderOmissions;
    } else {
        // Default to displaying Searchbar and Filters.
        renderOmissions = {
            Search: false,
            Filters: false
        };
    }

    options.renderOmissions = renderOmissions;

    ReactDOM.render(
        listMap(config, spaPath, options),
        document.getElementById(elementId)
    );
};

//legacy
CBRESearch.prototype.renderListings = function (elementId, configUrl, spaPath) {

    $('#' + elementId).addClass('cbre-react-spa-container');
    spaPath = spaPath || {};

    spaPath.path = ('/' + (spaPath.path || '')).replace(/\/\//g, '/');
    spaPath.subPath = spaPath.subPath || '';

    browserHistory.listenBefore(prerenderHistory(spaPath));
    browserHistory.listenBefore(analyticsEvents);

    boundCreateElement = createElement.bind(this, spaPath, configUrl);

    ReactDOM.render(
        <AppRoot
            spaPath={spaPath}
            configUrl={configUrl}
            className="legacy-list-view"
        />,
        document.getElementById(elementId)
    );
};

function createElement(spaPath, configUrl, Component, props) {
    if (!('searchType' in props)) {
        // some components require search type, so we have to give them a place holder
        // it can be defined later
        props.searchType = 'notset';
    }

    return <Component {...props} configUrl={configUrl} spaPath={spaPath} />;
}

//legacy but current versions, this should be modified , should accept carousel config also as param
CBRESearch.prototype.renderCarousel = function (elementId, configUrl, spaPath, staticQuery = '') {
    $('#' + elementId).addClass('cbre-react-spa-container');
    var Wrapped = wrapper(Carousel);
    spaPath.path = '/carousel'.replace(/\/\//g, '/');

    let siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;
    $(function () {
        if (siteTheme) {
            $('body').addClass(String(siteTheme));
        }
    });

        let carouselConfig;
    
        // Check if Array instance, and that carouselConfig exists on the first object in array.
        if (window.agency365 instanceof Array && !!window.agency365[0].carouselConfig) {
            carouselConfig = window.agency365[0].carouselConfig;
            // Check if Array instance, and that carouselConfig exists on the second object in array.
        } else if (window.agency365 instanceof Array && window.agency365[1] && !!window.agency365[1].carouselConfig) {
            carouselConfig = window.agency365[1].carouselConfig;
            // Check if object, and that a carouselConfig key exists.
        }else if (typeof window.agency365 === "object" && !!window.agency365.carouselConfig) {
            carouselConfig = window.agency365.carouselConfig;
        }
        deleteEmptyProps(carouselConfig);
        
    ReactDOM.render(
        <Wrapped
            configUrl={configUrl}
            spaPath={spaPath}
            staticQuery={staticQuery}
            carouselConfig={carouselConfig}
            className="legacy-list-view"
        />,
        document.getElementById(elementId)
    );
};

//legacy but current versions
CBRESearch.prototype.renderSearch = function (elementId, configUrl) {
    $('#' + elementId).addClass('cbre-react-spa-container');

    var Wrapped = wrapper(Search);

    ReactDOM.render(
        <Wrapped configUrl={configUrl} />,
        document.getElementById(elementId)
    );
};

function buildRoutes(spaPath) {
    var routeArray = [];

    spaPath.subPath = spaPath.subPath.replace(/^\/|$/g, '');

    if (spaPath.subPath !== '') {
        routeArray.push(
            <IndexRedirect
                to={spaPath.path + '/' + spaPath.subPath}
                key="indexRoute"
            />,
            <Route path={spaPath.subPath} key="tabRoutes">
                <IndexRoute component={ListingsPage} />
                <Route path="map" component={ListingsPage} />
            </Route>
        );
    } else {
        routeArray.push(
            <IndexRoute component={ListingsPage} key="indexRoute" />,
            <Route path="map" component={ListingsPage} key="tabRoutes" />
        );
    }

    routeArray.push(
        <Route
            path={'details/:propertyId/:addressSummary'}
            component={PropertyDetailsPage}
            key="pdpRoute"
        />,
        <Route
            path={'details/:propertyId'}
            component={PropertyDetailsPage}
            key="pdpRouteNoSummary"
        />,
        <Route path="*" component={ErrorPage} key="errorRoute" />
    );

    return routeArray;
}



class AppRoot extends Component {

    constructor() {
        super();
        this.state = {
            translations: null,
            locale: null
        };
        this.childcontext = getAppContext();
    }

    componentWillMount() {
        // Handle changes.
        this.childcontext.stores.ApplicationStore.onChange(
            'BOOTSTRAP_COMPLETE',
            this.configLoaded.bind(this)
        );
        this.childcontext.actions.bootstrap(this.props.configUrl);
    }

    configLoaded() {
        if (!this.state.translations) {
            this.setState({
                translations: this.childcontext.stores.LanguageStore.getLanguage(),
                locale: this.childcontext.stores.ConfigStore.getItem('language')
            });
        }
    }

    render() {
        let children;
        if (this.state.translations) {
            const Wrapped = wrapper(Listings, this.childcontext);
            const routes = (
                <Route path={this.props.spaPath.path} component={Wrapped}>
                    {buildRoutes(this.props.spaPath)}
                </Route>
            );

            // merge...
            let languageConfig = Object.assign(
                {},
                this.state.translations,
                this.state.translations.TokenReplaceStrings
            );
            addLocaleData(localeData);
            children = (
                <IntlProvider
                    locale={this.state.locale}
                    messages={languageConfig}
                >
                    <Router
                        createElement={boundCreateElement}
                        history={browserHistory}
                    >
                        {routes}
                    </Router>
                </IntlProvider>
            );
        }

        return <div className={this.props.className}>{children}</div>;
    }
}
