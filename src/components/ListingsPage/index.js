const PropTypes = require('prop-types');
var React = require('react'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    StoresMixin = require('../../mixins/StoresMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    SharedSearchViewMixin = require('../../mixins/SharedSearchViewMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
    DispatchCustomEvent = require('../../utils/dispatchCustomEvent'),
    MapView = require('../MapView').MapView,
    ListView = require('../ListView').ListView,
    Filters = require('../Filters'),
    ReactBootstrap = require('react-bootstrap'),
    Button = ReactBootstrap.Button,
    Grid = ReactBootstrap.Grid,
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col,
    Link = require('react-router').Link,
    ErrorView = require('../ErrorView'),
    TranslateString = require('../../utils/TranslateString'),
    PropertiesCount = require('../PropertiesCount').PropertiesCount;
var createReactClass = require('create-react-class');
var matchTypeStrings = require('../../utils/matchTypeStrings');
// var SocialWidgets = require('../../external-libraries/social-media-widgets/components');
import SocialWidgets from '../../external-libraries/social-media-widgets/components';
var ExtendedSearch = require('../ExtendedSearch');
var $ = require('jQuery');
import CaptureError from '../../utils/captureError';
import redirect from '../../utils/301redirect';
import Places from '../../utils/Places';

var ListingsPage = createReactClass({
    displayName: 'ListingsPage',

    mixins: [
        StoresMixin,
        ApplicationActionsMixin,
        LanguageMixin,
        ComponentPathMixin,
        TrackingEventMixin,
        SharedSearchViewMixin
    ],

    contextTypes: {
        spaPath: PropTypes.object,
        location: PropTypes.object,
        router: PropTypes.object
    },

    propTypes: {
        searchType: PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            error: false,
            activeFilterTab: null,
            socialSharingConfig: this.getConfigStore().getItem('socialSharing')
        };
    },

    componentWillMount: function() {
        const { location } = this.props;

        const { router } = this.context;

        const query = Object.assign({}, location.query);

        // If the url contains a placeID but no location param...
        if (
            query.hasOwnProperty('placeId') &&
            !query.hasOwnProperty('location')
        ) {
            Places.lookup(
                { placeId: query.placeId },
                function(result) {
                    if (typeof result.location !== 'undefined') {
                        query.location = encodeURIComponent(
                            result.gmaps.formatted_address
                        )
                            .replace(/\'/g, '')
                            .replace(/%20/g, '+');
                        redirect(router, location.pathname, query);
                    }
                },
                /*eslint-disable */
                function() {
                    console.warn(
                        `Could not find a match for placeID: ${query.placeId}`
                    );
                }
                /*eslint-enable */
            );
        }
    },

    componentDidMount: function() {
        // Error handling
        this.getApplicationStore().onChange('API_ERROR', this._throwError);

        // Add body class
        $('body').addClass('cbre-react-listings');

        // Emit custom event.
        var eventToDispatch = new DispatchCustomEvent();
        eventToDispatch.listingsPage(this.getActions());
    },

    componentWillUnmount: function() {
        // Error handling
        this.getApplicationStore().off('API_ERROR', this._throwError);
        // Remove body class
        $('body').removeClass('cbre-react-listings');
    },

    _fireTrackingEvent: function(type) {
        this._fireEvent(type);
    },

    _throwError: function() {
        this.setState({
            error: true
        });
    },

    _getSearchTypeAndResultCount: function() {
        var searchTypeString =
            this.props.searchType === 'isLetting'
                ? 'letSearchType'
                : 'saleSearchType';
        var propertyTypePlural = matchTypeStrings(
            this.context.language,
            this.getParamStore().getParams().propertySubType,
            this.getParamStore().getParams().usageType
        );

        return (
            <PropertiesCount
                string={'PropertiesFound'}
                searchType={this.context.language[searchTypeString]}
                component={'p'}
                propertyTypePlural={propertyTypePlural}
            />
        );
    },

    renderSocialSharing: function() {
        if (this.getConfigStore().getFeatures().useSocialWidgets) {
            var shareImg = '';
            var shareText = this.getSharedMetaDescription();

            if (document.querySelector('meta[property="og:image"]')) {
                shareImg = document.querySelector('meta[property="og:image"]')
                    .content;
            }

            return (
                <SocialWidgets
                    {...this.state.socialSharingConfig}
                    url={window.location.href}
                    shareText={shareText}
                    media={shareImg}
                />
            );
        }
    },

    renderExtendedSearchContainer: function() {
        var originalSearchRadius = this.getSearchStateStore().getItem(
            'originalSearchRadius'
        );
        var searchMode = this.getParamStore().getParam('searchMode');
        var string =
            searchMode === 'bounding' && !originalSearchRadius
                ? 'ExtendedSearchBoundingText'
                : 'ExtendedSearchText';

        return (
            <ExtendedSearch>
                <ErrorView
                    title={this.context.language.ExtendedSearchTitle}
                    className="extend-results"
                >
                    <TranslateString
                        radius={originalSearchRadius}
                        radiusType={this.getParamStore().getParam('RadiusType')}
                        location={this.getSearchStateStore().getItem(
                            'searchLocationName'
                        )}
                        string={string}
                        component="h4"
                    />
                </ErrorView>
            </ExtendedSearch>
        );
    },

    _renderPageContent: function() {
        const config = this.getConfigStore().getConfig();
        if (this.state.error) {
            CaptureError(
                'Component Error',
                {
                    component: 'ListingsPage',
                    errorType: 'API_ERROR',
                    config: config
                },
                { site: config.siteId }
            );
            return (
                <ErrorView
                    title={this.context.language.SearchErrorTitle}
                    className="api-error container"
                >
                    <h4>{this.context.language.SearchErrorSubTitle}</h4>
                    <p>{this.context.language.SearchErrorText}</p>
                </ErrorView>
            );
        }

        var spaPath = this.context.spaPath,
            searchResultsPage = this.getConfigStore().getItem('searchConfig')
                .searchResultsPage,
            path =
                spaPath.path +
                (spaPath.path !== '/' && spaPath.subPath !== '' ? '/' : '') +
                spaPath.subPath,
            active = this.context.router.isActive(path + '/map')
                ? 'map'
                : 'list',
            view =
                active === 'map' ? (
                    <MapView
                        searchResultsPage={searchResultsPage}
                        searchType={this.props.searchType}
                    />
                ) : (
                    <ListView
                        searchResultsPage={searchResultsPage}
                        searchType={this.props.searchType}
                    />
                ),
            socialSharing = this.renderSocialSharing(),
            extendedSearch = this.renderExtendedSearchContainer();

        return (
            <div>
                <ul role="tablist" className="nav nav-tabs">
                    <li
                        role="presentation"
                        className={active === 'map' ? 'active' : ''}
                    >
                        <Link
                            to={{
                                pathname: path + '/map',
                                query: this.props.location.query || null
                            }}
                            onClick={this._fireTrackingEvent.bind(
                                null,
                                'mapView'
                            )}
                        >
                            {this.context.language.MapViewTabText}
                        </Link>
                    </li>
                    <li
                        role="presentation"
                        className={active !== 'map' ? 'active' : ''}
                    >
                        <Link
                            to={{
                                pathname: path,
                                query: this.props.location.query || null
                            }}
                            onClick={this._fireTrackingEvent.bind(
                                null,
                                'listingsView'
                            )}
                        >
                            {this.context.language.ListViewTabText}
                        </Link>
                    </li>
                </ul>
                {extendedSearch}
                {view}
                {socialSharing}
            </div>
        );
    },

    _renderFilterTabButton: function(buttonText, buttonIcon, tabName) {
        return (
            <Button
                key={tabName}
                className={
                    'btn--icon-tab' +
                    (this.state.activeFilterTab === tabName ? ' active' : '')
                }
                onClick={this._setCurrentFilterTab.bind(this, tabName)}
            >
                <span className={'text'}>{buttonText}</span>
                <span className={'cbre-icon ' + buttonIcon} />
            </Button>
        );
    },

    _setCurrentFilterTab: function(tab, e) {
        e.preventDefault();

        this.setState({
            activeFilterTab: tab
        });
    },

    _renderFilterClose: function() {
        if (this.state.activeFilterTab !== null) {
            return (
                <div className={'filter-tabs-close'}>
                    <Button
                        className={'btn--close'}
                        onClick={this._closeTabContent}
                    >
                        <span className={'text'}>
                            {this.context.language.CloseTabButtonText}
                        </span>
                        <span className={'icon'}>×</span>
                    </Button>
                </div>
            );
        }
    },

    _closeTabContent: function() {
        this.setState({
            activeFilterTab: null
        });
    },

    render: function() {
        return (
            <section>
                <header className="header">
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <h1 className="listings-page-title">
                                    {' '}
                                    {this._getSearchTypeAndResultCount()}
                                </h1>
                            </Col>
                        </Row>
                    </Grid>
                </header>

                <div className="cbre-spa--listings-body">
                    <Grid>
                        <Row>
                            <Col xs={12} md={3}>
                                <aside className="col--padding-top">
                                    <div
                                        className={
                                            'filter-tabs hide-on-desktop'
                                        }
                                    >
                                        {this._renderFilterTabButton(
                                            this.context.language
                                                .SortTabButtonText,
                                            'cbre-up-down',
                                            'sort'
                                        )}
                                        {this._renderFilterTabButton(
                                            this.context.language
                                                .SearchTabButtonText,
                                            'cbre-magnifying-glass',
                                            'search'
                                        )}
                                        {this._renderFilterTabButton(
                                            this.context.language
                                                .FilterTabButtonText,
                                            'cbre-filter',
                                            'filter'
                                        )}
                                    </div>

                                    <div
                                        className={
                                            'filter-tabs-content' +
                                            (this.state.activeFilterTab ===
                                            'sort'
                                                ? ' filter-tabs-content--active'
                                                : '')
                                        }
                                    >
                                        <div className={'filters-secondary'}>
                                            <Filters
                                                type="auto"
                                                placement="secondary"
                                            />
                                        </div>
                                    </div>

                                    <hr className="show-on-desktop" />

                                    <h2 className="show-on-desktop">
                                        {
                                            this.context.language
                                                .RefineSearchTitle
                                        }
                                    </h2>

                                    <div
                                        className={
                                            'filter-tabs-content' +
                                            (this.state.activeFilterTab ===
                                            'search'
                                                ? ' filter-tabs-content--active'
                                                : '')
                                        }
                                    >
                                        <Filters
                                            placement="primary"
                                            renderSearch={true}
                                            submitBtn={true}
                                        />
                                    </div>

                                    <div
                                        className={
                                            'filter-tabs-content' +
                                            (this.state.activeFilterTab ===
                                            'filter'
                                                ? ' filter-tabs-content--active'
                                                : '')
                                        }
                                    >
                                        <h2 className={'show-on-desktop'}>
                                            {
                                                this.context.language
                                                    .FilterSearchTitle
                                            }
                                        </h2>
                                        <Filters
                                            type="auto"
                                            placement="tertiary"
                                        />
                                    </div>

                                    {this._renderFilterClose()}
                                </aside>
                            </Col>

                            <Col
                                xs={12}
                                md={9}
                                className="col--padding-top col--main"
                            >
                                {this._renderPageContent()}
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </section>
        );
    }
});

module.exports = ListingsPage;
