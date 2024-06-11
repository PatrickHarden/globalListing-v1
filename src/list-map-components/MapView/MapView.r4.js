import PropTypes from 'prop-types';
import React from 'react';
import GmapR4 from '../../components/Gmaps/index.r4';

function MapViewR4(props) {
    
    return (
        <div className={props.paginated ? 'cbre_map paginated_map' : 'cbre_map'}>
            <div id="googleMap">
                <GmapR4 {...props} mapViewType={'mapListView'} />
            </div>
        </div>
    );
}

MapViewR4.propTypes = {
    searchType: PropTypes.string,
    properties: PropTypes.array,
    mapMarkers: PropTypes.array,
    mapState: PropTypes.object,
    setMapState: PropTypes.func,
    searchResultsPage: PropTypes.string,
    selectedItems: PropTypes.object,
    setSelectedItems: PropTypes.func,
    spaPath: PropTypes.object,
    paginated: PropTypes.any,
    overrides: PropTypes.object
};

export default React.memo(MapViewR4,(prevState, nextState) => prevState.properties === nextState.properties);