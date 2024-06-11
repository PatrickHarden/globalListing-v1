var PropTypes = require('prop-types');
var React = require('react'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    TrackingEventMixin = require('../../mixins/TrackingEventMixin'),
    DefaultValues = require('../../constants/DefaultValues'),
    $ = require('jQuery'),
    _ = require('lodash'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Col,
    Col = ReactBootstrap.Col,
    ButtonGroup = ReactBootstrap.ButtonGroup,
    TranslateString = require('../../utils/TranslateString'),
    writeMetaTag = require('../../utils/writeMetaTag'),
    EventButton = require('../EventButton');

var createReactClass = require('create-react-class');

import createQueryString from '../../utils/createQueryString';

// Context being JS context (this).
function getStateFromStores(context) {
    var ParamStore = context.getParamStore(),
        PropertyStore = context.getPropertyStore();

    return {
        params: ParamStore.getParams(),
        page: parseInt(ParamStore.getParam('page')) || DefaultValues.page,
        pageSize:
            parseInt(ParamStore.getParam('pagesize')) || DefaultValues.pageSize,
        totalPages: Math.ceil(
            PropertyStore.getTotalResults() /
                (parseInt(ParamStore.getParam('pagesize')) ||
                    DefaultValues.pageSize)
        ),
        total: PropertyStore.getTotalResults()
    };
}

var Pagination = createReactClass({
    displayName: 'Pagination',

    mixins: [
        StoresMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        LanguageMixin,
        TrackingEventMixin
    ],

    contextTypes: {
        router: PropTypes.object,
        location: PropTypes.object
    },

    getInitialState: function() {
        var state = getStateFromStores(this);
        state.paginationClicked = false;
        return state;
    },

    componentDidMount: function() {
        this.getPropertyStore().onChange('PROPERTIES_UPDATED', this._onChange);
        this.getParamStore().onChange('PARAMS_UPDATED', this._onChange);
    },

    componentWillUnmount: function() {
        this.getPropertyStore().off('PROPERTIES_UPDATED', this._onChange);
        this.getParamStore().off('PARAMS_UPDATED', this._onChange);
    },

    _onChange: function() {
        var state = getStateFromStores(this);

        if (this.state.paginationClicked) {
            var listComponent = $('.cbre-react-spa-container');

            if (listComponent.length) {
                $('html, body').animate({
                    scrollTop: listComponent.offset().top
                });
            }

            state.paginationClicked = false;
        }

        this.setState(state);
    },

    updateParams: function(type) {
        var state = this.state;
        var fetchAll = false;

        state.paginationClicked = true;

        if (type === 'all') {
            state.params.pagesize = 9999;
            state.params.page = 1;
            fetchAll = true;
        } else {
            state.params.page =
                type === 'prev' ? state.page - 1 : state.page + 1;
        }

        this._fireEvent('pagination' + _.capitalize(type));

        this.setState(state, function() {
            this.changePage(fetchAll);
        });
    },

    _getLink: function(type) {
        var _params = _.clone(this.context.location.query) || {};
        switch (type) {
            case 'prev':
                _params.page = this.state.page - 1;
                break;
            case 'next':
                _params.page = this.state.page + 1;
                break;
            case 'all':
                _params.page = 1;
                _params.pagesize = 9999;
                break;
        }
        return encodeURI(window.location.href.split('?')[0] + createQueryString(_params));
    },

    changePage: function(fetchAll) {
        var params = Object.assign(
            {},
            this.getParamStore().getParams(),
            this.state.params
        );
        this.getActions().updateProperties(
            params,
            fetchAll,
            this.getPropertyStore().getPropertiesMap(),
            this.context.location.pathname,
            this.context.router
        );
    },

    renderPaginationButton: function(type) {
        var prevLink, nextLink, allLink;
        switch (type) {
            case 'prev':
                if (this.state.page > 1) {
                    prevLink = this._getLink('prev');
                    // Render prev meta tag
                    writeMetaTag('prev', prevLink, 'link');
                    return (
                        <EventButton
                            className="btn--outline btn--prev"
                            href={prevLink}
                            ref="prev-btn"
                            listenFor="PROPERTIES_UPDATED"
                            store={this.getPropertyStore()}
                            onClick={this.updateParams.bind(null, 'prev')}
                        >
                            {this.context.language.PaginationPreviousButtonText}
                        </EventButton>
                    );
                }
                break;
            case 'next':
                if (this.state.page < this.state.totalPages) {
                    nextLink = this._getLink('next');
                    // Render next meta tag
                    writeMetaTag('next', nextLink, 'link');
                    return (
                        <EventButton
                            className="btn--outline btn--next"
                            href={nextLink}
                            ref="next-btn"
                            listenFor="PROPERTIES_UPDATED"
                            store={this.getPropertyStore()}
                            onClick={this.updateParams.bind(null, 'next')}
                        >
                            {this.context.language.PaginationNextButtonText}
                        </EventButton>
                    );
                }
                break;
            case 'all':
                if (this.state.pageSize < this.state.total) {
                    allLink = this._getLink('all');
                    return (
                        <EventButton
                            className="btn--outline btn--all"
                            href={allLink}
                            ref="all-btn"
                            listenFor="PROPERTIES_UPDATED"
                            store={this.getPropertyStore()}
                            onClick={this.updateParams.bind(null, 'all')}
                        >
                            {this.context.language.PaginationAllButtonText}
                        </EventButton>
                    );
                }
                break;
        }
    },

    render: function() {
        return (
            <Row className="show-grid cbre-pager row">
                <Col xs={8} className="cbre-pager__action">
                    <ButtonGroup>
                        {this.renderPaginationButton('prev')}
                        {this.renderPaginationButton('all')}
                        {this.renderPaginationButton('next')}
                    </ButtonGroup>
                </Col>

                <Col xs={4} className="cbre-pager__count">
                    <TranslateString
                        pageNo={this.state.page}
                        totalPages={this.state.totalPages}
                        string="PaginationPages"
                        component="p"
                    />
                </Col>
            </Row>
        );
    }
});

module.exports = Pagination;
