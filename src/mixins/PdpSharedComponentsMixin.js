var PropTypes = require('prop-types');
var React = require('react'),
    PropertyCarousel = require('../components/PropertyCarousel');
import SocialWidgets from '../external-libraries/social-media-widgets/components';

module.exports = {
    propTypes: {
        searchResultsPage: PropTypes.string,
        searchType: PropTypes.string.isRequired,
        location: PropTypes.object.isRequired,
        property: PropTypes.object.isRequired,
        relatedProperties: PropTypes.array,
        relatedPropertiesTitle: PropTypes.string,
        shareImg: PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            isOpen: false,
            index: 0
        };
    },

    _renderCarousel: function() { // eslint-disable-line react/display-name
        if(this.getConfigStore().getFeatures().relatedProperties){
            var _relatedProperties = this.props.relatedProperties || [],
                _title = _relatedProperties.length ? (<h2>{this.props.relatedPropertiesTitle}</h2>) : null;

            // TODO: CBRE3-569
            // Remove hardLinkProperty prop after PDP refactor
            return (
                <div className="container cbre-spa--pdp-carousel">
                    {_title}
                    <PropertyCarousel
                        hardLinkProperty={true}
                        searchResultsPage={this.props.searchResultsPage}
                        loading={!this.props.relatedProperties}
                        properties={_relatedProperties}
                        searchType={this.props.searchType}
                        slidesToShow={4}
                        hideCounter={true} />
                </div>
            );
        }
    },

    _showDescriptionToggle: function () {
        this.setState({
            showDescription: true
        });
    },

    _openLightbox: function(index) {
        this.setState({
            isOpen: true,
            index: index
        });
    },

    handleOpenFloorplanInLightbox: function(index) {
        this.fireOpenLightboxEvent('floorplan');
        this._openLightbox(index);
    },

    handleOpenImageInLightbox: function(index) {
        this.fireOpenLightboxEvent('image');
        this._openLightbox(index);
    },


    fireOpenLightboxEvent: function(actionType) {
        this._fireEvent(actionType + 'OpenLightbox', {
            propertyId: this.props.property.PropertyId
        });
    },

    _closeLightbox: function() {
        this.setState({
            isOpen: false,
            index: 0
        });
    },

    renderSocialSharing: function(property) { // eslint-disable-line react/display-name
        if (this.getConfigStore().getFeatures().useSocialWidgets) {
            return (
                <SocialWidgets
                    {...this.state.socialSharingConfig}
                    url={window.location.href}
                    shareText={property.StrapLine}
                    media={this.props.shareImg}/>
            );
        }
    }
};