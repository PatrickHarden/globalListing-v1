var React = require('react'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ErrorView = require('../ErrorView'),
    ListItem = require('../Property').ListView,
    Pagination = require('../Pagination'),
    DispatchCustomEvent = require('../../utils/dispatchCustomEvent'),
    APIMapping = require('../../constants/APIMapping'),
    MetaTagsMixin = require('../../mixins/MetaTagsMixin'),
    SharedSearchViewMixin = require('../../mixins/SharedSearchViewMixin'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Row,
    Col = ReactBootstrap.Col;

var createReactClass = require('create-react-class');

var propertiesContainer = require('../../containers/propertiesContainer');

var ListView = createReactClass({
    displayName: 'ListView',

    mixins: [
        StoresMixin,
        LanguageMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        MetaTagsMixin,
        SharedSearchViewMixin
    ],

    getInitialState: function() {
        return {
            dispatchCustomEvent: new DispatchCustomEvent()
        };
    },

    componentDidUpdate: function() {
        this.state.dispatchCustomEvent.preRender(this.getActions());
    },

    buildMetaTags: function() {
        return this.buildSharedSearchMetaTags();
    },

    _renderProperties: function(properties) {
        return properties.map(
            function(property, index) {
                return (
                    <li key={property.PropertyId} className="list-view-item">
                        <ListItem
                            searchResultsPage={this.props.searchResultsPage}
                            property={property}
                            index={index}
                            searchType={this.props.searchType}
                        />
                    </li>
                );
            }.bind(this)
        );
    },

    render: function() {
        var properties = this.props.properties;

        if (!properties || !properties.length) {
            return (
                <ErrorView
                    title={this.context.language.NoResultsTitle}
                    className="no-results"
                >
                    <h4>{this.context.language.NoResultsSubTitle}</h4>
                    <p>{this.context.language.NoResultsText}</p>
                </ErrorView>
            );
        }

        return (
            <Row className="row show-grid">
                <Col xs={12}>
                    <ul className="list-unstyled">
                        {this._renderProperties(properties)}
                    </ul>
                    <Pagination />
                </Col>
            </Row>
        );
    }
});

module.exports = {
    _ListView: ListView,
    ListView: propertiesContainer(ListView, {
        propertiesMap: [
            APIMapping.Highlights._key,
            APIMapping.Walkthrough,
            APIMapping.ContactGroup._key
        ],
        loadOnMount: true
    })
};
