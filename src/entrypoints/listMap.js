import getAppContext from '../utils/getAppContext';
import React from 'react';
import {
    Router,
    IndexRedirect,
    Route
} from 'react-router';
import PropertyDetailsPage from '../list-map-components/PropertyDetailsPage/PropertyDetailsPage';
import PageNotFound from '../list-map-components/PageNotFound';
import analyticsEvents from '../router-middleware/analyticsEvents';
import ListMapPage from '../list-map-components/ListMapPage/ListMapPage';
import LandingPage from '../list-map-components/LandingPage';
import ApplyAppContext from '../components/ApplyAppContext';
import { getQueryParameters, mergeParameters } from '../utils/getQueryParameters';
import redirectContainer from '../containers/redirectContainer';
import configContainer from '../containers/configContainer';
import { IntlProvider, addLocaleData } from 'react-intl';
import localeData from 'react-intl/locale-data';
import windowprops from '../utils/window';
import { ThemeWrapper } from '../external-libraries/agency365-components/components';
import DefaultValues from '../constants/DefaultValues';
import classNames from 'classnames';
import hasTouch from 'has-touch';
import { isPrerender } from '../utils/browser';
import { createHistory, useQueries } from 'history';
import { Provider } from 'react-redux';
import buildStore from '../redux/store/buildStore';
import GLAnalytics from '../components/analytics/gl-analytics';
import styled from 'styled-components';

const toucheventsClass = hasTouch ? 'has-touchevents' : 'no-touchevents';
var browserHistory = useQueries(createHistory)();

function listMap(config, applicationRootPath, options) {
    const location = windowprops.location(); // wrapped window.location so can be mocked for tests.

    const spaPath = {
        path: applicationRootPath,
        subPath: location.pathname.replace(applicationRootPath, '')
    };

    if (!spaPath.path.startsWith('/')) {
        spaPath.path = '/' + spaPath.path;
    }

    // history.listenBefore(prerenderHistory(spaPath));
    browserHistory.listenBefore(analyticsEvents);

    config.listmap = true; // useful for differentiating between legacy SPA and new listmap SPA

    const appContext = getAppContext();

    if (options === undefined || options === null) {
        options = {};
    }

    const staticQueryParams = getQueryParameters(options.staticQuery);
    const urlParams = getQueryParameters(document.location.search);
    const mergedParameters = mergeParameters(staticQueryParams, urlParams);

    appContext.actions.bootstrapConfig(config, mergedParameters);

    appContext.language = config.i18n;
    appContext.history = browserHistory;
    appContext.spaPath = spaPath;

    function wrapComponent(Component, options) {
        return (
            // Handle errors and redirects
            redirectContainer(configContainer(Component, {}, options), spaPath)
        );
    }

    // disableResultsRedirect bool feature flag
    const disableResultsRedirect = config.features.disableResultsRedirect && config.features.disableResultsRedirect == true;

    const PropertyDetailsPageComponent = wrapComponent(PropertyDetailsPage);
    const ListMapPageComponent = wrapComponent(ListMapPage, options);

    const LandingPageComponent = wrapComponent(LandingPage);
    const PageNotFoundComponent = wrapComponent(PageNotFound, spaPath);

    function wrapPdfComponent(Component) {
        return (
            // Configure app via bootstrap action
            configContainer(Component, null, { isPdf: true })
        );
    }
    const PdfPageComponent = wrapPdfComponent(PropertyDetailsPage);


    function createElement(Component, props) {
        return (
            <ListMapWrapper className="cbre-react-spa-container">
                <ApplyAppContext
                    passContext={appContext}
                    {...props}
                    className={classNames('list-map-view', toucheventsClass)}
                >
                    <Component {...props} />
                </ApplyAppContext>
            </ListMapWrapper>
        );
    }

    // flatten...
    let languageConfig = Object.assign(
        {},
        config.i18n || {},
        config.i18n && config.i18n.TokenReplaceStrings
    );
    addLocaleData(localeData);

    const siteTheme = window.cbreSiteTheme || DefaultValues.cbreSiteTheme;

    var mountingPath = config.features.supportFlexibleSpaPath
        ? window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf(spaPath.path.toLowerCase()) + spaPath.path.length)
        : spaPath.path;


    // const pathShouldBe = shouldRedirect ? `${mountingPath.replace(/\/+$/, '')}/results` : `${mountingPath}`;
    const pathShouldBe = !disableResultsRedirect ? `${mountingPath.replace(/\/+$/, '')}/results` : `${mountingPath}`;

    // console.log(`disableResultsRedirect: ${disableResultsRedirect}`);
    // console.log(pathShouldBe);


    return (
        <Provider store={buildStore(browserHistory)}>
            <ThemeWrapper theme={siteTheme}>
                <IntlProvider locale={config.language} messages={languageConfig}>
                    <GLAnalytics config={config}>
                        <Router history={browserHistory} createElement={createElement}>
                            <Route exact path={pathShouldBe} component={ListMapPageComponent}>
                            </Route>
                            <Route path={mountingPath}>
                                {!disableResultsRedirect &&
                                    <IndexRedirect to="results" />
                                }
                                <Route
                                    path="details/:propertyId/:addressSummary"
                                    component={PropertyDetailsPageComponent}
                                />
                                <Route
                                    path="/:language/properties/:propertyType/details/:propertyId/:addressSummary"
                                    component={PropertyDetailsPageComponent}
                                />
                                <Route
                                    path="/:language/:properties/:propertyType/details/:propertyId/:addressSummary"
                                    component={PropertyDetailsPageComponent}
                                />
                                <Route
                                    path="details/:propertyId"
                                    component={PropertyDetailsPageComponent}
                                />
                                <Route path="results" component={ListMapPageComponent} >
                                    if(disableResultsRedirect) {
                                        (isPrerender ? <div></div> : <IndexRedirect to={window.location.pathname.replace("\/results", "")} />)
                                    }
                                </Route>
                                <Route
                                    path="landing/:usageType/:location"
                                    component={LandingPageComponent}
                                />
                                <Route
                                    path="generate-pdf"
                                    component={PdfPageComponent}
                                />
                                <Route
                                    path="*"
                                    component={PageNotFoundComponent}
                                    key="errorRoute"
                                    errorType="PageNotFound"
                                />
                            </Route>
                        </Router>
                    </GLAnalytics>
                </IntlProvider>
            </ThemeWrapper>
        </Provider>
    );
}

const ListMapWrapper = styled.div`
    ${window.cbreSiteTheme === 'commercialr4' &&
    `      
        overflow: hidden;

        @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
            overflow-y: scroll;
        }
    `
    }
`;

export default listMap;
