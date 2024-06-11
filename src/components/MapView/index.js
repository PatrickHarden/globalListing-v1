var PropTypes = require('prop-types');
var React = require('react'),
    StoresMixin = require('../../mixins/StoresMixin'),
    ComponentPathMixin = require('../../mixins/ComponentPathMixin')(__dirname),
    ApplicationActionsMixin = require('../../mixins/ApplicationActionsMixin'),
    LanguageMixin = require('../../mixins/LanguageMixin'),
    ErrorView = require('../ErrorView'),
    Gmap = require('../Gmaps'),
    ReactBootstrap = require('react-bootstrap'),
    Row = ReactBootstrap.Row,
    DispatchCustomEvent = require('../../utils/dispatchCustomEvent'),
    APIMapping = require('../../constants/APIMapping'),
    MetaTagsMixin = require('../../mixins/MetaTagsMixin'),
    SharedSearchViewMixin = require('../../mixins/SharedSearchViewMixin'),
    _ = require('lodash'),
    propertiesContainer = require('../../containers/propertiesContainer');

var createReactClass = require('create-react-class');

var MapView = createReactClass({
    displayName: 'MapView',

    mixins: [
        StoresMixin,
        LanguageMixin,
        ApplicationActionsMixin,
        ComponentPathMixin,
        MetaTagsMixin,
        SharedSearchViewMixin
    ],

    propTypes: {
        searchResultsPage: PropTypes.string.isRequired,
        searchType: PropTypes.string.isRequired
    },

    contextTypes: {
        location: PropTypes.object
    },

    getInitialState: function() {
        return {
            dispatchCustomEvent: new DispatchCustomEvent()
        };
    },

    componentDidUpdate: function() {
        this.state.dispatchCustomEvent.preRender(this.getActions());
    },

    render: function() {
        var properties = this.props.properties;

        if (!properties || (properties && !properties.length)) {
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
                <div className="cbre-spa--map-container">
                    <Gmap
                        searchResultsPage={this.props.searchResultsPage}
                        properties={properties}
                        searchType={this.props.searchType}
                        mapViewType={'mapView'}
                    />
                </div>
            </Row>
        );
    },

    buildMetaTags: function() {
        var tags = this.buildSharedSearchMetaTags();
        return this.buildCanonicalMetaTag(tags);
    },

    buildCanonicalMetaTag: function(tags) {
        var key;

        var tag = _.find(tags, function(tag, index) {
            if (tag.property === 'canonical') {
                key = index;
                return true;
            }
            return false;
        });

        tag.value = tag.value.replace('/map', '');
        tags[key] = tag;
        return tags;
    }
});

module.exports = {
    _MapView: MapView,
    MapView: propertiesContainer(MapView, {
        propertiesMap: [APIMapping.MinimumSize._key, APIMapping.TotalSize._key],
        loadOnMount: true,
        fetchAllProperties: true
    })
};
