import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-spinner';
import { overrideDefaultSelector } from '../../../redux/selectors/map/overrides/override-defaults-selector';
import { markersLoadingSelector } from '../../../redux/selectors/map/markers/markers-loading-selector';
import MapViewR4 from '../../MapView/MapView.r4';
import { loadProperties } from '../../../redux/actions/properties/load-properties';

const Map = (props) => {

    const { context, listMapVariables, selectedItems, setSelectedItems, setMapState, error, currentMarkers, ...other } = props;

    const loading  = useSelector(markersLoadingSelector);
    const overrideDefaults = useSelector(overrideDefaultSelector);

    const dispatch = useDispatch();

    const searchHandler = (params) => {
        
        // we will change up the right sidebar, but no real need to reload the map markers since they are already loaded
        dispatch(loadProperties(context, undefined, undefined, undefined, params));
    };

    return (
            <MapContainer className="cbre_map">
                { loading && !error && <Spinner/> }
                { !loading && error &&
                    <MapView
                        {...other}
                        properties={[]}
                        searchType={listMapVariables.searchType}
                        setSelectedItems={setSelectedItems}
                        spaPath={context.spaPath}
                        paginated={true}
                    />
                }
                { !loading && !error && 
                    <MapViewR4
                        {...other}
                        searchType={listMapVariables.searchType}
                        mapState={listMapVariables.mapState}
                        selectedItems={selectedItems}
                        setMapState={(state) => setMapState(state)}
                        setSelectedItems={setSelectedItems}
                        searchHandler={searchHandler}
                        properties={currentMarkers}
                        paginated={true}
                        overrides={overrideDefaults}
                    />
                }
            </MapContainer>
            
    );
};

const MapContainer = styled.div`
`;

export default React.memo(Map, (prevState, nextState) => prevState.currentMarkers === nextState.currentMarkers);