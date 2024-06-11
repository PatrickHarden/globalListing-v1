import PropTypes from 'prop-types';
import React from 'react';
import Gmap from '../../components/Gmaps/index';

function MapView(props) {
    
    return (
        <div className={props.paginated ? 'cbre_map paginated_map' : 'cbre_map'}>
            <div id="googleMap">
                <Gmap {...props} mapViewType={'mapListView'} />
            </div>
        </div>
    );
}

MapView.propTypes = {
    searchType: PropTypes.string,
    properties: PropTypes.array,
    mapMarkers: PropTypes.array,
    mapState: PropTypes.object,
    setMapState: PropTypes.func,
    searchResultsPage: PropTypes.string,
    selectedItems: PropTypes.object,
    setSelectedItems: PropTypes.func,
    spaPath: PropTypes.object,
    paginated: PropTypes.boolean,
    overrides: PropTypes.object
};

export default React.memo(MapView,(prevState, nextState) => prevState.properties === nextState.properties);